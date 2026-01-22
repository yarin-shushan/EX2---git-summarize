# Design Document: AI News Aggregator

## Overview

The AI News Aggregator is a Next.js web application that discovers trending AI/ML repositories from GitHub and provides AI-powered summarization capabilities. The system follows a client-server architecture with API routes handling external service integration and a React-based frontend providing an intuitive user interface.

The application emphasizes clean, educational code suitable for classroom review, with comprehensive commenting and adherence to specified technology constraints.

## Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph "Client (Browser)"
        UI[React Components]
        LS[localStorage]
        CSS[CSS Modules]
    end
    
    subgraph "Next.js Application"
        subgraph "Frontend"
            Pages[App Router Pages]
            Components[React Components]
        end
        
        subgraph "Backend (API Routes)"
            TrendsAPI[/api/trends]
            SummarizeAPI[/api/summarize]
            Cache[Response Caching]
        end
    end
    
    subgraph "External Services"
        GitHub[GitHub API]
        OpenAI[OpenAI API]
        Groq[Groq API]
    end
    
    UI --> Pages
    Pages --> Components
    Components --> TrendsAPI
    Components --> SummarizeAPI
    TrendsAPI --> GitHub
    SummarizeAPI --> OpenAI
    SummarizeAPI --> Groq
    Components --> LS
    Components --> CSS
    TrendsAPI --> Cache
```

### Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript for type safety and better developer experience
- **Styling**: Vanilla CSS with CSS Modules for component-scoped styling
- **State Management**: React hooks (useState, useEffect) for local state
- **Storage**: Browser localStorage for API key persistence
- **Deployment**: Vercel-optimized build configuration

## Components and Interfaces

### Frontend Components

#### 1. Main Page Component (`app/page.tsx`)
- Fetches and displays trending repositories
- Manages loading and error states
- Coordinates between NewsCard components and settings

#### 2. NewsCard Component (`components/NewsCard.tsx`)
```typescript
interface NewsCardProps {
  repository: Repository;
  onSummarize: (repo: Repository) => void;
  isLoading?: boolean;
}

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  html_url: string;
  topics: string[];
  updated_at: string;
}
```

#### 3. Settings Modal Component (`components/SettingsModal.tsx`)
```typescript
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string, provider: LLMProvider) => void;
  currentApiKey?: string;
  currentProvider?: LLMProvider;
}

type LLMProvider = 'openai' | 'groq';
```

#### 4. Summary Display Component (`components/SummaryDisplay.tsx`)
```typescript
interface SummaryDisplayProps {
  summary: string;
  repository: Repository;
  onClose: () => void;
}
```

### Backend API Interfaces

#### 1. Trends API (`app/api/trends/route.ts`)
```typescript
// GET /api/trends
interface TrendsResponse {
  repositories: Repository[];
  cached_at: string;
  total_count: number;
}

interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: Repository[];
}
```

#### 2. Summarize API (`app/api/summarize/route.ts`)
```typescript
// POST /api/summarize
interface SummarizeRequest {
  text: string;
  apiKey: string;
  provider: LLMProvider;
}

interface SummarizeResponse {
  summary: string;
  provider: LLMProvider;
  timestamp: string;
}

interface LLMServiceConfig {
  openai: {
    endpoint: string;
    model: string;
    maxTokens: number;
  };
  groq: {
    endpoint: string;
    model: string;
    maxTokens: number;
  };
}
```

## Data Models

### Repository Data Model
```typescript
interface Repository {
  id: number;                    // GitHub repository ID
  name: string;                  // Repository name
  full_name: string;             // Owner/repository format
  description: string | null;    // Repository description
  stargazers_count: number;      // Number of stars
  html_url: string;              // GitHub URL
  topics: string[];              // Repository topics/tags
  updated_at: string;            // Last update timestamp
  language: string | null;       // Primary programming language
  created_at: string;            // Creation timestamp
}
```

### User Settings Data Model
```typescript
interface UserSettings {
  apiKey: string;                // Encrypted/encoded API key
  provider: LLMProvider;         // Selected LLM provider
  lastUpdated: string;           // Settings update timestamp
}
```

### Cache Data Model
```typescript
interface CacheEntry {
  data: Repository[];
  timestamp: number;
  expiresAt: number;
}
```

## Implementation Details

### GitHub API Integration
- **Endpoint**: `https://api.github.com/search/repositories`
- **Query Parameters**:
  - `q`: `topic:ai OR topic:machine-learning OR topic:llm created:>YYYY-MM-DD`
  - `sort`: `stars`
  - `order`: `desc`
  - `per_page`: `30`
- **Rate Limiting**: 60 requests/hour for unauthenticated requests
- **Caching Strategy**: 15-minute cache using Next.js `revalidate` or custom cache headers

### LLM API Integration

#### OpenAI Integration
- **Endpoint**: `https://api.openai.com/v1/chat/completions`
- **Model**: `gpt-3.5-turbo`
- **System Prompt**: "Summarize this GitHub repository in exactly 3 sentences. Focus on what it does, its key features, and its target use case."

#### Groq Integration
- **Endpoint**: `https://api.groq.com/openai/v1/chat/completions`
- **Model**: `mixtral-8x7b-32768`
- **Same prompt structure as OpenAI**

### Styling Architecture

#### CSS Modules Structure
```
styles/
├── globals.css              # Global styles and CSS variables
├── Home.module.css          # Main page styles
├── NewsCard.module.css      # Repository card styles
├── SettingsModal.module.css # Settings modal styles
└── SummaryDisplay.module.css # Summary display styles
```

#### Design System Variables
```css
:root {
  --background-primary: #F5F5F7;
  --background-secondary: #FFFFFF;
  --text-primary: #1D1D1F;
  --text-secondary: #86868B;
  --accent-blue: #007AFF;
  --border-radius: 12px;
  --shadow-light: 0 2px 10px rgba(0, 0, 0, 0.1);
  --spacing-xs: 8px;
  --spacing-sm: 16px;
  --spacing-md: 24px;
  --spacing-lg: 32px;
}
```

### Error Handling Strategy

#### Frontend Error Handling
- Network errors: Display user-friendly messages with retry options
- API key validation: Client-side validation before API calls
- Loading states: Skeleton components during data fetching
- Fallback UI: Graceful degradation when services are unavailable

#### Backend Error Handling
- GitHub API errors: Proper HTTP status codes and error messages
- LLM API errors: Validation of API keys and service availability
- Rate limiting: Appropriate caching and user feedback
- Input validation: Sanitization and validation of all inputs

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

After analyzing the acceptance criteria, I've identified several redundant properties that can be consolidated:
- Properties about API endpoint structure (6.1, 6.2) can be combined with their validation properties (6.4, 6.5)
- Properties about localStorage operations (4.1, 4.4) can be combined into a single round-trip property
- Properties about component rendering (3.1, 3.2) can be combined into comprehensive UI validation

### Property 1: GitHub API Query Date Range
*For any* date when the system fetches repositories, the GitHub API query should include a date filter for repositories created or updated within the last 7 days from that date.
**Validates: Requirements 1.1**

### Property 2: Repository Topic Filtering
*For any* collection of repositories with various topics, the filtering function should return only repositories that contain "AI", "Machine Learning", or "LLM" in their topics array.
**Validates: Requirements 1.2**

### Property 3: Repository Sorting by Stars
*For any* collection of repositories, the sorting function should arrange them in descending order by stargazers_count.
**Validates: Requirements 1.3**

### Property 4: Repository Data Completeness
*For any* repository object returned by the system, it should contain non-null values for name, description, and stargazers_count fields.
**Validates: Requirements 1.4**

### Property 5: Cache Header Implementation
*For any* response from the trends API, the HTTP headers should include appropriate Cache-Control directives to prevent rate limiting.
**Validates: Requirements 1.5**

### Property 6: Summarize API Parameter Validation
*For any* request to the summarize endpoint, it should accept requests containing text, apiKey, and provider fields, and reject requests missing any of these required parameters.
**Validates: Requirements 2.1, 6.4**

### Property 7: LLM Provider Routing
*For any* summarization request with a specified provider, the system should send the request to the correct LLM API endpoint (OpenAI or Groq) based on the provider value.
**Validates: Requirements 2.2**

### Property 8: Summary Sentence Count
*For any* summary generated by the system, the output should contain exactly 3 sentences as determined by sentence-ending punctuation marks.
**Validates: Requirements 2.3**

### Property 9: API Key Server Storage Prevention
*For any* API key submitted to the system, it should not be persisted in server-side storage, logs, or database records.
**Validates: Requirements 2.4**

### Property 10: Error Message Descriptiveness
*For any* failed API request, the system should return an error response containing a human-readable description of what went wrong.
**Validates: Requirements 2.5, 6.5**

### Property 11: NewsCard Component Structure
*For any* repository data rendered as a NewsCard, the component should display the repository name, description, star count, and include a "Summarize" button element.
**Validates: Requirements 3.1, 3.2**

### Property 12: CSS Property Validation
*For any* styled component, the computed CSS should include sans-serif font-family and 12px border-radius where applicable.
**Validates: Requirements 3.4**

### Property 13: LocalStorage Round Trip
*For any* API key and provider combination stored by the user, saving to localStorage and then retrieving should return the same values.
**Validates: Requirements 4.1, 4.4**

### Property 14: Settings Update Persistence
*For any* changes made to API key or provider settings, the updates should be reflected in both the UI state and localStorage after saving.
**Validates: Requirements 4.5**

### Property 15: Trends Endpoint Caching Behavior
*For any* sequence of requests to the trends endpoint within the cache period, subsequent requests should return the same data without making new GitHub API calls.
**Validates: Requirements 6.3**

### Property 16: Code Style Consistency
*For any* TypeScript file in the project, the code should follow consistent naming conventions (camelCase for variables, PascalCase for components) and formatting rules.
**Validates: Requirements 7.4**

## Error Handling

### Frontend Error Handling
- **Network Failures**: Display user-friendly error messages with retry buttons
- **API Key Validation**: Client-side validation before making summarization requests
- **Loading States**: Show skeleton loaders during data fetching operations
- **Fallback Content**: Display placeholder content when external services are unavailable

### Backend Error Handling
- **GitHub API Errors**: Return appropriate HTTP status codes (429 for rate limiting, 503 for service unavailable)
- **LLM API Errors**: Validate API keys and handle authentication failures gracefully
- **Input Validation**: Sanitize and validate all incoming request parameters
- **Rate Limiting**: Implement exponential backoff for external API calls

### Error Response Format
```typescript
interface ErrorResponse {
  error: string;           // Human-readable error message
  code: string;           // Machine-readable error code
  timestamp: string;      // ISO timestamp of error
  details?: any;          // Additional error context
}
```

## Testing Strategy

### Dual Testing Approach
The system will use both unit tests and property-based tests for comprehensive coverage:

**Unit Tests**: Focus on specific examples, edge cases, and integration points
- Component rendering with specific repository data
- API endpoint responses with known inputs
- Error handling with simulated failures
- CSS module class name generation

**Property Tests**: Verify universal properties across all inputs
- Repository filtering and sorting with randomized data
- API parameter validation with generated inputs
- LocalStorage operations with various key/value combinations
- Component rendering with randomized repository objects

### Property-Based Testing Configuration
- **Library**: `fast-check` for TypeScript property-based testing
- **Iterations**: Minimum 100 iterations per property test
- **Test Tags**: Each property test references its design document property
- **Tag Format**: `Feature: ai-news-aggregator, Property {number}: {property_text}`

### Testing Framework Setup
- **Unit Testing**: Jest with React Testing Library for component tests
- **API Testing**: Supertest for API endpoint testing
- **Property Testing**: fast-check for property-based test generation
- **Mocking**: MSW (Mock Service Worker) for external API mocking

### Test Coverage Requirements
- Minimum 80% code coverage for all TypeScript files
- 100% coverage for critical paths (API endpoints, data processing)
- All correctness properties must have corresponding property tests
- Edge cases and error conditions must have unit tests

The testing strategy ensures that both specific behaviors (unit tests) and general correctness properties (property tests) are validated, providing confidence in the system's reliability across all possible inputs and scenarios.