# Code Canvas

An AI-powered code generation and execution platform that allows you to create, run, and deploy applications through natural language conversations.

## Features

- **AI-Powered Development**: Generate complete applications using natural language descriptions
- **Multiple Templates**: Support for Python, Next.js, Vue.js, Streamlit, and Gradio applications
- **Real-time Execution**: See your code run instantly in secure sandboxed environments
- **OpenRouter Integration**: Access to multiple AI models through OpenRouter
- **Paper Theme**: Clean, document-inspired design for a focused development experience
- **Deployment**: One-click sharing of your applications

## Supported Stacks

- 🐍 **Python Interpreter** - Data analysis and visualization
- ⚛️ **Next.js** - Full-stack React applications
- 🟢 **Vue.js** - Modern Vue applications with Nuxt
- 📊 **Streamlit** - Data apps and dashboards
- 🎛️ **Gradio** - Machine learning interfaces

## Supported AI Models

Through OpenRouter integration:
- OpenAI GPT-4o and GPT-4o Mini
- Anthropic Claude 3.5 Sonnet and Haiku
- Google Gemini 2.0 Flash
- Meta Llama 3.1 (405B and 70B)
- Mistral Large
- DeepSeek Chat
- xAI Grok Beta

## Get Started

### Prerequisites

- Node.js 18+ and npm
- [OpenRouter API Key](https://openrouter.ai/keys)
- [E2B API Key](https://e2b.dev) (for code execution)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/code-canvas.git
cd code-canvas
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.template .env.local
```

Edit `.env.local` and add your API keys:
```
E2B_API_KEY=your_e2b_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Get your OpenRouter API key**: Visit [OpenRouter](https://openrouter.ai/keys) to get your API key
2. **Configure your model**: Click the settings icon and enter your OpenRouter API key
3. **Choose a model**: Select from available models like GPT-4o, Claude 3.5 Sonnet, etc.
4. **Describe your app**: Type a natural language description of what you want to build
5. **Choose a template**: Select from Python, Next.js, Vue.js, Streamlit, or Gradio
6. **Watch it generate**: The AI will create your application code
7. **See it run**: View your app running in real-time
8. **Share**: Share your creation with a public URL

## Configuration

### Required API Keys

- **E2B API Key**: Required for code execution in sandboxed environments
- **OpenRouter API Key**: Required for AI model access (user-provided)

### Optional Configuration

- **Supabase**: For user authentication
- **Upstash KV**: For rate limiting and short URLs
- **PostHog**: For analytics

### Environment Variables

- `E2B_API_KEY` - Your E2B API key (required for code execution)
- `NEXT_PUBLIC_SITE_URL` - Your site's URL for sharing links
- `SUPABASE_URL` & `SUPABASE_ANON_KEY` - For user authentication
- `KV_REST_API_URL` & `KV_REST_API_TOKEN` - For rate limiting and short URLs
- `NEXT_PUBLIC_POSTHOG_KEY` & `NEXT_PUBLIC_POSTHOG_HOST` - For analytics

## Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

## License

Apache License 2.0 - see [LICENSE](LICENSE) for details.