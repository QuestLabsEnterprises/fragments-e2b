import { createOpenAI } from '@ai-sdk/openai'

export type LLMModel = {
  id: string
  name: string
  provider: string
  providerId: string
}

export type LLMModelConfig = {
  model?: string
  apiKey?: string
  baseURL?: string
  temperature?: number
  topP?: number
  topK?: number
  frequencyPenalty?: number
  presencePenalty?: number
  maxTokens?: number
}

export function getModelClient(modelId: string, config: LLMModelConfig) {
  const { apiKey } = config

  if (!apiKey) {
    throw new Error('OpenRouter API key is required. Please provide your API key in the settings.')
  }

  return createOpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
  })(modelId)
}