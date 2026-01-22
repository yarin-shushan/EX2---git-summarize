# AI News Aggregator
by: yarin shushan(318175411)
    yuval garzone (206534976)
    lior davidi (211898515) 
רשמתי נכון
A clean, Apple-inspired web application that aggregates trending AI/ML repositories from GitHub and provides AI-powered summaries using OpenAI or Groq APIs.

## Features

- 🔍 **Repository Discovery**: Fetches trending AI/ML repositories from GitHub
- 🤖 **AI Summaries**: Generate 3-sentence summaries using OpenAI or Groq
- 🎨 **Apple-Inspired Design**: Clean, minimalist UI with CSS Modules
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile
- ⚡ **Fast**: Optimized with caching and efficient API calls
- 🔒 **Secure**: API keys stored locally, never on the server

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Vanilla CSS with CSS Modules
- **APIs**: GitHub API, OpenAI API, Groq API
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- (Optional) GitHub Personal Access Token for higher API rate limits

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-news-aggregator
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local and add your GitHub token
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Setting Up API Keys

1. Click the "Settings" button in the top-right corner
2. Enter your OpenAI or Groq API key
3. Select your preferred provider
4. Click "Save" - your key is stored locally in your browser

### Getting API Keys

- **OpenAI**: Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
- **Groq**: Visit [Groq Console](https://console.groq.com/keys)

### Using the App

1. Browse trending AI/ML repositories on the main page
2. Click "Summarize" on any repository card
3. View the AI-generated 3-sentence summary
4. Click repository names to visit them on GitHub

## Project Structure

```
ai-news-aggregator/
├── app/
│   ├── api/
│   │   ├── trends/route.ts      # GitHub API integration
│   │   └── summarize/route.ts   # AI summarization
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main page component
├── styles/
│   ├── globals.css              # Global styles & variables
│   ├── Home.module.css          # Main page styles
│   ├── NewsCard.module.css      # Repository card styles
│   ├── SettingsModal.module.css # Settings modal styles
│   └── SummaryDisplay.module.css # Summary modal styles
└── components/                  # React components (to be added)
```

## Design System

The app follows an Apple-inspired design system with:

- **Colors**: Clean whites and light grays (#F5F5F7)
- **Typography**: System font stack with careful hierarchy
- **Spacing**: Consistent 8px grid system
- **Shadows**: Subtle depth with hover effects
- **Animations**: Smooth transitions with Apple's easing curves

## API Endpoints

### GET /api/trends
Returns trending AI/ML repositories from GitHub.

**Response:**
```json
{
  "repositories": [...],
  "cached_at": "2024-01-01T00:00:00Z",
  "total_count": 30
}
```

### POST /api/summarize
Generates AI summaries of repository content.

**Request:**
```json
{
  "text": "Repository description and README content",
  "apiKey": "your-api-key",
  "provider": "openai" | "groq"
}
```

**Response:**
```json
{
  "summary": "Three sentence summary...",
  "provider": "openai",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Deployment

This app is optimized for Vercel deployment:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

## Contributing

This is an educational project. Feel free to:

- Report bugs
- Suggest improvements
- Submit pull requests

## License

MIT License - see LICENSE file for details.
