import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import { LLMModelConfig } from '@/lib/models'
import { Settings2 } from 'lucide-react'

export function ChatSettings({
  languageModel,
  onLanguageModelChange,
}: {
  languageModel: LLMModelConfig
  onLanguageModelChange: (model: LLMModelConfig) => void
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Model Settings</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="apiKey" className="text-sm font-medium">
            OpenRouter API Key *
          </Label>
          <Input
            id="apiKey"
            name="apiKey"
            type="password"
            placeholder="sk-or-v1-..."
            value={languageModel.apiKey || ''}
            onChange={(e) =>
              onLanguageModelChange({
                apiKey: e.target.value || undefined,
              })
            }
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Get your API key from{' '}
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              OpenRouter
            </a>
          </p>
        </div>

        <div>
          <Label htmlFor="modelId" className="text-sm font-medium">
            Model ID *
          </Label>
          <Input
            id="modelId"
            name="modelId"
            type="text"
            placeholder="e.g., openai/gpt-4o, anthropic/claude-3.5-sonnet"
            value={languageModel.model || ''}
            onChange={(e) =>
              onLanguageModelChange({
                model: e.target.value || undefined,
              })
            }
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Find model IDs at{' '}
            <a
              href="https://openrouter.ai/models"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              OpenRouter Models
            </a>
          </p>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3">Advanced Parameters</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="temperature" className="text-xs">
                Temperature
              </Label>
              <Input
                id="temperature"
                type="number"
                min={0}
                max={2}
                step={0.1}
                value={languageModel.temperature || ''}
                onChange={(e) =>
                  onLanguageModelChange({
                    temperature: parseFloat(e.target.value) || undefined,
                  })
                }
                placeholder="0.7"
                className="text-xs"
              />
            </div>
            
            <div>
              <Label htmlFor="maxTokens" className="text-xs">
                Max Tokens
              </Label>
              <Input
                id="maxTokens"
                type="number"
                min={1}
                max={10000}
                value={languageModel.maxTokens || ''}
                onChange={(e) =>
                  onLanguageModelChange({
                    maxTokens: parseInt(e.target.value) || undefined,
                  })
                }
                placeholder="2048"
                className="text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}