# Code Canvas

An AI-powered code generation and execution platform that allows you to create, run, and deploy applications through natural language conversations.

## Features

- **AI-Powered Development**: Generate complete applications using natural language descriptions
- **Multiple Templates**: Support for Python, Next.js, Vue.js, Streamlit, and Gradio applications
- **Real-time Execution**: See your code run instantly in secure sandboxed environments
- **OpenRouter Integration**: Access to multiple AI models through a single API
- **Paper Theme**: Clean, document-inspired design for a focused development experience
- **Deployment**: One-click deployment of your applications

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

## Get Started

### Prerequisites

- Node.js 18+ and npm
- [OpenRouter API Key](https://openrouter.ai/)

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

Edit `.env.local` and add your OpenRouter API key:
```
OPENROUTER_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Describe your app**: Type a natural language description of what you want to build
2. **Choose a template**: Select from Python, Next.js, Vue.js, Streamlit, or Gradio
3. **Watch it generate**: The AI will create your application code
4. **See it run**: View your app running in real-time
5. **Deploy**: Share your creation with a public URL

## Configuration

### Adding Custom Templates

1. Create a new sandbox template using the E2B CLI
2. Add the template configuration to `lib/templates.json`
3. Update the template selection UI

### Environment Variables

- `OPENROUTER_API_KEY` - Your OpenRouter API key (required)
- `NEXT_PUBLIC_SITE_URL` - Your site's URL for deployment links
- `SUPABASE_URL` & `SUPABASE_ANON_KEY` - For user authentication
- `KV_REST_API_URL` & `KV_REST_API_TOKEN` - For rate limiting and short URLs

## Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

## License

Apache License 2.0 - see [LICENSE](LICENSE) for details.