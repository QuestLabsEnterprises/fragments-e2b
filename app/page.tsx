'use client'

import { ViewType } from '@/components/auth'
import { AuthDialog } from '@/components/auth-dialog'
import { Chat } from '@/components/chat'
import { ChatInput } from '@/components/chat-input'
import { ChatPicker } from '@/components/chat-picker'
import { ChatSettings } from '@/components/chat-settings'
import { NavBar } from '@/components/navbar'
import { Preview } from '@/components/preview'
import { useAuth } from '@/lib/auth'
import { Message, toAISDKMessages, toMessageImage } from '@/lib/messages'
import { LLMModelConfig } from '@/lib/models'
import modelsList from '@/lib/models.json'
import { FragmentSchema, fragmentSchema as schema } from '@/lib/schema'
import { supabase } from '@/lib/supabase'
import templates, { TemplateId } from '@/lib/templates'
import { ExecutionResult } from '@/lib/types'
import { DeepPartial } from 'ai'
import { experimental_useObject as useObject } from 'ai/react'
import { usePostHog } from 'posthog-js/react'
import { SetStateAction, useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { ArrowUp, Settings2 } from 'lucide-react'

export default function Home() {
  const [chatInput, setChatInput] = useLocalStorage('chat', '')
  const [files, setFiles] = useState<File[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<'auto' | TemplateId>(
    'auto',
  )
  const [languageModel, setLanguageModel] = useLocalStorage<LLMModelConfig>(
    'languageModel',
    {
      model: '',
      apiKey: '',
    },
  )

  const posthog = usePostHog()

  const [result, setResult] = useState<ExecutionResult>()
  const [messages, setMessages] = useState<Message[]>([])
  const [fragment, setFragment] = useState<DeepPartial<FragmentSchema>>()
  const [currentTab, setCurrentTab] = useState<'code' | 'fragment'>('code')
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [isAuthDialogOpen, setAuthDialog] = useState(false)
  const [authView, setAuthView] = useState<ViewType>('sign_in')
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showChat, setShowChat] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const { session, userTeam } = useAuth(setAuthDialog, setAuthView)

  const filteredModels = modelsList.models

  const currentModel = filteredModels.find(
    (model) => model.id === languageModel.model,
  )
  const currentTemplate =
    selectedTemplate === 'auto'
      ? templates
      : { [selectedTemplate]: templates[selectedTemplate] }
  const lastMessage = messages[messages.length - 1]

  const { object, submit, isLoading, stop, error } = useObject({
    api: '/api/chat',
    schema,
    onError: (error) => {
      console.error('Error submitting request:', error)
      if (error.message.includes('limit')) {
        setIsRateLimited(true)
      }

      setErrorMessage(error.message)
    },
    onFinish: async ({ object: fragment, error }) => {
      if (!error) {
        console.log('fragment', fragment)
        setIsPreviewLoading(true)
        posthog.capture('fragment_generated', {
          template: fragment?.template,
        })

        const response = await fetch('/api/sandbox', {
          method: 'POST',
          body: JSON.stringify({
            fragment,
            userID: session?.user?.id,
            teamID: userTeam?.id,
            accessToken: session?.access_token,
          }),
        })

        const result = await response.json()
        console.log('result', result)
        posthog.capture('sandbox_created', { url: result.url })

        setResult(result)
        setCurrentPreview({ fragment, result })
        setMessage({ result })
        setCurrentTab('fragment')
        setIsPreviewLoading(false)
      }
    },
  })

  useEffect(() => {
    if (object) {
      setFragment(object)
      const content: Message['content'] = [
        { type: 'text', text: object.commentary || '' },
        { type: 'code', text: object.code || '' },
      ]

      if (!lastMessage || lastMessage.role !== 'assistant') {
        addMessage({
          role: 'assistant',
          content,
          object,
        })
      }

      if (lastMessage && lastMessage.role === 'assistant') {
        setMessage({
          content,
          object,
        })
      }
    }
  }, [object])

  useEffect(() => {
    if (error) stop()
  }, [error])

  function setMessage(message: Partial<Message>, index?: number) {
    setMessages((previousMessages) => {
      const updatedMessages = [...previousMessages]
      updatedMessages[index ?? previousMessages.length - 1] = {
        ...previousMessages[index ?? previousMessages.length - 1],
        ...message,
      }

      return updatedMessages
    })
  }

  async function handleSubmitAuth(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Check if API key and model are provided
    if (!languageModel.apiKey) {
      setErrorMessage('Please provide your OpenRouter API key in the settings.')
      return
    }

    if (!languageModel.model) {
      setErrorMessage('Please specify a model ID from OpenRouter.')
      return
    }

    if (!chatInput.trim()) {
      setErrorMessage('Please enter a description of what you want to build.')
      return
    }

    if (isLoading) {
      stop()
    }

    setShowChat(true)

    const content: Message['content'] = [{ type: 'text', text: chatInput }]
    const images = await toMessageImage(files)

    if (images.length > 0) {
      images.forEach((image) => {
        content.push({ type: 'image', image })
      })
    }

    const updatedMessages = addMessage({
      role: 'user',
      content,
    })

    submit({
      userID: session?.user?.id,
      teamID: userTeam?.id,
      messages: toAISDKMessages(updatedMessages),
      template: currentTemplate,
      config: languageModel,
    })

    setChatInput('')
    setFiles([])
    setCurrentTab('code')

    posthog.capture('chat_submit', {
      template: selectedTemplate,
      model: languageModel.model,
    })
  }

  function retry() {
    if (!languageModel.apiKey) {
      setErrorMessage('Please provide your OpenRouter API key in the settings.')
      return
    }

    if (!languageModel.model) {
      setErrorMessage('Please specify a model ID from OpenRouter.')
      return
    }

    submit({
      userID: session?.user?.id,
      teamID: userTeam?.id,
      messages: toAISDKMessages(messages),
      template: currentTemplate,
      config: languageModel,
    })
  }

  function addMessage(message: Message) {
    setMessages((previousMessages) => [...previousMessages, message])
    return [...messages, message]
  }

  function handleSaveInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setChatInput(e.target.value)
  }

  function handleFileChange(change: SetStateAction<File[]>) {
    setFiles(change)
  }

  function logout() {
    supabase
      ? supabase.auth.signOut()
      : console.warn('Supabase is not initialized')
  }

  function handleLanguageModelChange(e: LLMModelConfig) {
    setLanguageModel({ ...languageModel, ...e })
  }

  function handleSocialClick(target: 'github' | 'x' | 'discord') {
    if (target === 'github') {
      window.open('https://github.com/your-org/codequest-ai', '_blank')
    } else if (target === 'x') {
      window.open('https://x.com/your_handle', '_blank')
    } else if (target === 'discord') {
      window.open('https://discord.gg/your-invite', '_blank')
    }

    posthog.capture(`${target}_click`)
  }

  function handleClearChat() {
    stop()
    setChatInput('')
    setFiles([])
    setMessages([])
    setFragment(undefined)
    setResult(undefined)
    setCurrentTab('code')
    setIsPreviewLoading(false)
    setErrorMessage('')
    setIsRateLimited(false)
    setShowChat(false)
  }

  function setCurrentPreview(preview: {
    fragment: DeepPartial<FragmentSchema> | undefined
    result: ExecutionResult | undefined
  }) {
    setFragment(preview.fragment)
    setResult(preview.result)
  }

  function handleUndo() {
    setMessages((previousMessages) => [...previousMessages.slice(0, -2)])
    setCurrentPreview({ fragment: undefined, result: undefined })
  }

  if (!showChat) {
    return (
      <main className="main-container">
        {supabase && (
          <AuthDialog
            open={isAuthDialogOpen}
            setOpen={setAuthDialog}
            view={authView}
            supabase={supabase}
          />
        )}
        
        <div className="hero-section">
          <h1 className="hero-title">CodeQuest AI</h1>
          <p className="hero-subtitle">
            What would you like to
            <span className="vibe-code-highlight">Vibe-Code</span>
          </p>
          
          <form onSubmit={handleSubmitAuth} className="input-section">
            <textarea
              value={chatInput}
              onChange={handleSaveInputChange}
              placeholder="Describe your app idea..."
              className="main-input"
              rows={3}
              required
            />
            
            <div className="controls-section" style={{ marginTop: '1.5rem' }}>
              <input
                type="text"
                value={languageModel.model || ''}
                onChange={(e) => handleLanguageModelChange({ model: e.target.value })}
                placeholder="Enter OpenRouter model ID (e.g., openai/gpt-4o)"
                className="model-selector"
                required
              />
              
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="settings-button"
              >
                <Settings2 className="h-5 w-5" />
              </button>
              
              <button
                type="submit"
                disabled={isLoading || !languageModel.apiKey || !languageModel.model}
                className="submit-button"
              >
                {isLoading ? (
                  <div className="loading-spinner" />
                ) : (
                  <ArrowUp className="h-5 w-5" />
                )}
                Generate
              </button>
            </div>
          </form>

          {showSettings && (
            <div style={{ marginTop: '2rem', maxWidth: '400px', width: '100%' }}>
              <ChatSettings
                languageModel={languageModel}
                onLanguageModelChange={handleLanguageModelChange}
              />
            </div>
          )}

          {errorMessage && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              background: '#fef2f2', 
              border: '1px solid #fecaca', 
              borderRadius: '0.5rem',
              color: '#dc2626',
              maxWidth: '600px'
            }}>
              {errorMessage}
            </div>
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen max-h-screen bg-background">
      {supabase && (
        <AuthDialog
          open={isAuthDialogOpen}
          setOpen={setAuthDialog}
          view={authView}
          supabase={supabase}
        />
      )}
      <div className="grid w-full md:grid-cols-2">
        <div
          className={`flex flex-col w-full max-h-full max-w-[800px] mx-auto px-4 overflow-auto ${fragment ? 'col-span-1' : 'col-span-2'}`}
        >
          <NavBar
            session={session}
            showLogin={() => setAuthDialog(true)}
            signOut={logout}
            onSocialClick={handleSocialClick}
            onClear={handleClearChat}
            canClear={messages.length > 0}
            canUndo={messages.length > 1 && !isLoading}
            onUndo={handleUndo}
          />
          <Chat
            messages={messages}
            isLoading={isLoading}
            setCurrentPreview={setCurrentPreview}
          />
          <ChatInput
            retry={retry}
            isErrored={error !== undefined}
            errorMessage={errorMessage}
            isLoading={isLoading}
            isRateLimited={isRateLimited}
            stop={stop}
            input={chatInput}
            handleInputChange={handleSaveInputChange}
            handleSubmit={handleSubmitAuth}
            isMultiModal={currentModel?.multiModal || false}
            files={files}
            handleFileChange={handleFileChange}
          >
            <ChatPicker
              templates={templates}
              selectedTemplate={selectedTemplate}
              onSelectedTemplateChange={setSelectedTemplate}
              models={filteredModels}
              languageModel={languageModel}
              onLanguageModelChange={handleLanguageModelChange}
            />
            <ChatSettings
              languageModel={languageModel}
              onLanguageModelChange={handleLanguageModelChange}
            />
          </ChatInput>
        </div>
        <Preview
          teamID={userTeam?.id}
          accessToken={session?.access_token}
          selectedTab={currentTab}
          onSelectedTabChange={setCurrentTab}
          isChatLoading={isLoading}
          isPreviewLoading={isPreviewLoading}
          fragment={fragment}
          result={result as ExecutionResult}
          onClose={() => setFragment(undefined)}
        />
      </div>
    </main>
  )
}