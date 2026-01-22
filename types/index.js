/*
 * Type Definitions for AI News Aggregator (JavaScript version)
 * Centralized JSDoc type definitions to ensure consistency across the application
 */

/**
 * Repository interface matching GitHub API response structure
 * This interface ensures type safety when working with repository data from GitHub API
 * 
 * @typedef {Object} Repository
 * @property {number} id - GitHub repository ID (unique identifier)
 * @property {string} name - Repository name (e.g., "react")
 * @property {string} full_name - Owner/repository format (e.g., "facebook/react")
 * @property {string|null} description - Repository description (can be null if not provided)
 * @property {number} stargazers_count - Number of stars (GitHub popularity metric)
 * @property {string} html_url - GitHub repository URL for browser access
 * @property {string[]} topics - Repository topics/tags (e.g., ["javascript", "react"])
 * @property {string} updated_at - Last update timestamp (ISO 8601 format)
 * @property {string|null} language - Primary programming language (can be null)
 * @property {string} [created_at] - Creation timestamp (optional, ISO 8601 format)
 */

/**
 * Props interface for NewsCard component
 * Defines the contract for the NewsCard component's props
 * 
 * @typedef {Object} NewsCardProps
 * @property {Repository} repository - Repository data to display
 * @property {function(Repository): void} onSummarize - Callback when summarize button is clicked
 * @property {boolean} [isLoading] - Optional loading state for summarization
 */

/**
 * LLM Provider type definition
 * Supported AI providers for repository summarization
 * 
 * @typedef {'openai'|'groq'} LLMProvider
 */

/**
 * User Settings interface for localStorage persistence
 * Stores user preferences for API configuration
 * 
 * @typedef {Object} UserSettings
 * @property {string} apiKey - User's API key for LLM services
 * @property {LLMProvider} provider - Selected LLM provider
 * @property {string} lastUpdated - Settings update timestamp
 */

/**
 * API Response interfaces for backend endpoints
 */

/**
 * Response from /api/trends endpoint
 * 
 * @typedef {Object} TrendsResponse
 * @property {Repository[]} repositories - Array of trending repositories
 * @property {string} cached_at - Cache timestamp
 * @property {number} total_count - Total number of repositories found
 */

/**
 * Request body for /api/summarize endpoint
 * 
 * @typedef {Object} SummarizeRequest
 * @property {string} text - Repository content to summarize
 * @property {string} apiKey - User's API key
 * @property {LLMProvider} provider - Selected LLM provider
 */

/**
 * Response from /api/summarize endpoint
 * 
 * @typedef {Object} SummarizeResponse
 * @property {string} summary - Generated 3-sentence summary
 * @property {LLMProvider} provider - Provider used for summarization
 * @property {string} timestamp - Generation timestamp
 */

/**
 * Error response interface for API endpoints
 * Standardized error format across all API responses
 * 
 * @typedef {Object} ErrorResponse
 * @property {string} error - Human-readable error message
 * @property {string} code - Machine-readable error code
 * @property {string} timestamp - ISO timestamp of error occurrence
 * @property {*} [details] - Additional error context (optional)
 */

/**
 * GitHub API specific interfaces
 * These match the structure returned by GitHub's REST API
 */

/**
 * GitHub search API response structure
 * 
 * @typedef {Object} GitHubSearchResponse
 * @property {number} total_count - Total repositories matching search
 * @property {boolean} incomplete_results - Whether results are complete
 * @property {Repository[]} items - Array of repository objects
 */

/**
 * Component state interfaces
 * For managing component-level state
 */

/**
 * Loading states for different operations
 * 
 * @typedef {Object} LoadingStates
 * @property {boolean} repositories - Loading trending repositories
 * @property {boolean} summarization - Loading AI summary
 * @property {boolean} settings - Loading/saving settings
 */

/**
 * Modal states for UI management
 * 
 * @typedef {Object} ModalStates
 * @property {boolean} settings - Settings modal visibility
 * @property {boolean} summary - Summary modal visibility
 */

/**
 * Cache-related interfaces
 * For managing client-side and server-side caching
 * 
 * @template T
 * @typedef {Object} CacheEntry
 * @property {T} data - Cached data
 * @property {number} timestamp - Cache creation time
 * @property {number} expiresAt - Cache expiration time
 */

/**
 * Specific cache entry for repositories
 * @typedef {CacheEntry<Repository[]>} RepositoryCacheEntry
 */

/**
 * Utility types for enhanced type safety
 */

/**
 * Partial repository for loading states
 * @typedef {Partial<Repository> & Pick<Repository, 'id'|'name'>} PartialRepository
 */

/**
 * Repository with required description (for summarization)
 * @typedef {Repository & {description: string}} RepositoryWithDescription
 */

/**
 * Event handler types for component props
 * @typedef {function(Repository): void} RepositoryEventHandler
 * @typedef {function(string, LLMProvider): void} SettingsEventHandler
 * @typedef {function(string): void} ErrorEventHandler
 */

// Export types for JSDoc usage (not actual exports in JS)
// These are just for documentation purposes
export {};