# Requirements Document

## Introduction

The AI News Aggregator is a web application that helps users discover and understand trending AI/ML repositories from GitHub. The system fetches trending repositories, displays them in a clean interface, and allows users to generate AI-powered summaries using their own API keys. This is designed as a "Lean MVP" for educational purposes with emphasis on clean, readable code.

## Glossary

- **System**: The AI News Aggregator web application
- **Repository**: A GitHub code repository containing AI/ML projects
- **Trending_Repository**: A repository that has been created or updated in the last 7 days with AI/ML topics
- **Summary**: A 3-sentence AI-generated description of a repository's purpose and functionality
- **API_Key**: User's personal authentication key for LLM services (OpenAI or Groq)
- **NewsCard**: A UI component displaying repository information
- **LLM_Provider**: The AI service used for summarization (OpenAI or Groq)

## Requirements

### Requirement 1: Repository Discovery

**User Story:** As a developer, I want to discover trending AI/ML repositories, so that I can stay updated with the latest developments in the field.

#### Acceptance Criteria

1. WHEN the system fetches trending repositories, THE System SHALL query GitHub API for repositories created or updated in the last 7 days
2. WHEN filtering repositories, THE System SHALL include only repositories with topics containing "AI", "Machine Learning", or "LLM"
3. WHEN displaying repositories, THE System SHALL sort them by star count in descending order
4. WHEN a repository is retrieved, THE System SHALL include repository name, description, and star count
5. THE System SHALL implement caching with Cache-Control headers to prevent GitHub API rate limits

### Requirement 2: Repository Summarization

**User Story:** As a user, I want to generate AI-powered summaries of repositories, so that I can quickly understand their purpose without reading extensive documentation.

#### Acceptance Criteria

1. WHEN a user requests a summary, THE System SHALL accept the repository text, API key, and LLM provider
2. WHEN generating a summary, THE System SHALL send the text to the specified LLM API (OpenAI or Groq)
3. WHEN a summary is generated, THE System SHALL return exactly 3 sentences describing the repository
4. THE System SHALL NOT store API keys on the server
5. WHEN an API request fails, THE System SHALL return a descriptive error message

### Requirement 3: User Interface Display

**User Story:** As a user, I want to view repositories in a clean, organized interface, so that I can easily browse and interact with the content.

#### Acceptance Criteria

1. WHEN displaying repositories, THE System SHALL show them in a grid or list layout using NewsCard components
2. WHEN rendering a NewsCard, THE System SHALL display repository name, description, star count, and a "Summarize" button
3. THE System SHALL use Apple-inspired minimalist design with clean white/light-gray background (#F5F5F7)
4. WHEN styling components, THE System SHALL use sans-serif typography and cards with 12px border-radius
5. THE System SHALL apply soft box-shadows and plenty of whitespace for visual clarity

### Requirement 4: API Key Management

**User Story:** As a user, I want to securely store my API key locally, so that I can use summarization features without exposing my credentials.

#### Acceptance Criteria

1. WHEN a user enters an API key, THE System SHALL store it in browser localStorage
2. WHEN displaying the settings interface, THE System SHALL provide input fields for API key and provider selection
3. THE System SHALL support both OpenAI and Groq as LLM providers
4. WHEN retrieving stored credentials, THE System SHALL read from localStorage on the client side
5. THE System SHALL allow users to update their stored API key and provider preference

### Requirement 5: Technical Architecture

**User Story:** As a developer, I want the application built with specific technologies, so that it meets educational requirements and deployment constraints.

#### Acceptance Criteria

1. THE System SHALL be built using Next.js with App Router architecture
2. THE System SHALL use TypeScript for type safety and code clarity
3. WHEN styling components, THE System SHALL use vanilla CSS with CSS Modules (*.module.css files)
4. THE System SHALL be compatible with Vercel deployment platform
5. THE System SHALL NOT use external UI libraries like Tailwind CSS or Bootstrap

### Requirement 6: API Endpoint Implementation

**User Story:** As a system architect, I want well-defined API endpoints, so that the frontend can reliably communicate with backend services.

#### Acceptance Criteria

1. THE System SHALL provide a GET /api/trends endpoint that returns trending repositories
2. THE System SHALL provide a POST /api/summarize endpoint that accepts text, API key, and provider
3. WHEN the trends endpoint is called, THE System SHALL implement appropriate caching mechanisms
4. WHEN the summarize endpoint is called, THE System SHALL validate input parameters
5. THE System SHALL return appropriate HTTP status codes and error messages for all endpoints

### Requirement 7: Code Quality and Documentation

**User Story:** As an instructor, I want clean, well-documented code, so that students can understand and explain the implementation.

#### Acceptance Criteria

1. THE System SHALL include detailed comments explaining complex functionality
2. WHEN implementing API fetching logic, THE System SHALL include comments explaining the "Why" and "How"
3. WHEN using CSS Modules, THE System SHALL include comments explaining styling decisions
4. THE System SHALL maintain consistent code formatting and naming conventions
5. THE System SHALL be suitable for classroom review and student explanation