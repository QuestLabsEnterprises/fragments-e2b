import { Duration } from '@/lib/duration'
import { getModelClient } from '@/lib/models'
import { LLMModelConfig } from '@/lib/models'
import { toPrompt } from '@/lib/prompt'
import ratelimit from '@/lib/ratelimit'
import { fragmentSchema as schema } from '@/lib/schema'
import { Templates } from '@/lib/templates'
import { streamObject, LanguageModel, CoreMessage } from 'ai'

export const maxDuration = 60

const rateLimitMaxRequests = process.env.RATE_LIMIT_MAX_REQUESTS
  ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS)
  : 10
const ratelimitWindow = process.env.RATE_LIMIT_WINDOW
  ? (process.env.RATE_LIMIT_WINDOW as Duration)
  : '1d'

export async function POST(req: Request) {
  const {
    messages,
    userID,
    teamID,
    template,
    config,
  }: {
    messages: CoreMessage[]
    userID: string | undefined
    teamID: string | undefined
    template: Templates
    config: LLMModelConfig
  } = await req.json()

  // Always require API key for OpenRouter
  if (!config.apiKey) {
    return new Response('OpenRouter API key is required. Please provide your API key in the settings.', {
      status: 400,
    })
  }

  // Ensure model is provided
  if (!config.model) {
    return new Response('Model ID is required. Please specify a model from OpenRouter.', {
      status: 400,
    })
  }

  const limit = await ratelimit(
    req.headers.get('x-forwarded-for'),
    rateLimitMaxRequests,
    ratelimitWindow,
  )

  if (limit) {
    return new Response('You have reached your request limit for the day.', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.amount.toString(),
        'X-RateLimit-Remaining': limit.remaining.toString(),
        'X-RateLimit-Reset': limit.reset.toString(),
      },
    })
  }

  console.log('userID', userID)
  console.log('teamID', teamID)
  console.log('model', config.model)

  const { model: modelNameString, apiKey: modelApiKey, ...modelParams } = config

  try {
    const modelClient = getModelClient(config.model, config)

    const stream = await streamObject({
      model: modelClient as LanguageModel,
      schema,
      system: toPrompt(template),
      messages,
      maxRetries: 0, // do not retry on errors
      ...modelParams,
    })

    return stream.toTextStreamResponse()
  } catch (error: any) {
    const isRateLimitError =
      error && (error.statusCode === 429 || error.message.includes('limit'))
    const isOverloadedError =
      error && (error.statusCode === 529 || error.statusCode === 503)
    const isAccessDeniedError =
      error && (error.statusCode === 403 || error.statusCode === 401)

    if (isRateLimitError) {
      return new Response(
        'The provider is currently unavailable due to request limit. Please check your API key and try again.',
        {
          status: 429,
        },
      )
    }

    if (isOverloadedError) {
      return new Response(
        'The provider is currently unavailable. Please try again later.',
        {
          status: 529,
        },
      )
    }

    if (isAccessDeniedError) {
      return new Response(
        'Access denied. Please make sure your OpenRouter API key is valid.',
        {
          status: 403,
        },
      )
    }

    console.error('Error:', error)

    return new Response(
      'An unexpected error has occurred. Please check your API key and try again.',
      {
        status: 500,
      },
    )
  }
}