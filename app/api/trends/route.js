/*
 * GitHub Trends API Route
 * Fetches trending AI/ML repositories with in-memory caching to prevent rate limits
 */

import { NextResponse } from 'next/server'

/**
 * @typedef {Object} GitHubRepository
 * @property {number} id
 * @property {string} name
 * @property {string} full_name
 * @property {string|null} description
 * @property {number} stargazers_count
 * @property {string} html_url
 * @property {string[]} topics
 * @property {string} updated_at
 * @property {string|null} language
 * @property {string} created_at
 */

/**
 * @typedef {Object} GitHubSearchResponse
 * @property {number} total_count
 * @property {boolean} incomplete_results
 * @property {GitHubRepository[]} items
 */

// Global in-memory cache to persist across requests
let cache = {
  data: null,
  lastFetch: 0
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

/**
 * GET /api/trends
 * Returns trending AI/ML repositories from GitHub with in-memory caching
 * @param {Request} request - The incoming request
 * @returns {Promise<Response>} JSON response with repositories
 */
export async function GET(request) {
  try {
    // Check for cache-busting parameter (for refresh functionality)
    let forceRefresh = false
    try {
      const url = new URL(request.url)
      forceRefresh = url.searchParams.has('t') // Cache-busting parameter
    } catch (e) {
      // During build time, request.url might not be available
      forceRefresh = false
    }

    const now = Date.now()
    const cacheAge = now - cache.lastFetch
    const isCacheValid = cache.data && cacheAge < CACHE_DURATION

    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && isCacheValid) {
      console.log(`Returning cached data (age: ${Math.round(cacheAge / 1000)}s)`)
      return NextResponse.json({
        repositories: cache.data,
        cached_at: new Date(cache.lastFetch).toISOString(),
        total_count: cache.data.length,
        cache_age_seconds: Math.round(cacheAge / 1000)
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' // 5min cache, 10min stale
        }
      })
    }

    console.log(forceRefresh ? 'Force refresh requested' : 'Cache expired, fetching fresh data')

    // Calculate date for search query
    const date = new Date()
    date.setDate(date.getDate() - 7)
    const dateString = date.toISOString().split('T')[0] // YYYY-MM-DD format
    
    console.log('=== GitHub API Request ===')
    console.log('Current time:', new Date().toISOString())
    console.log('7 days ago date:', dateString)
    console.log('Cache last fetch:', new Date(cache.lastFetch).toISOString())
    console.log('Cache age:', Math.round(cacheAge / 1000), 'seconds')

    // STRICT QUERY: Only projects created in the last week
    // Remove star filter since new repos rarely have many stars
    const query = `topic:ai created:>${dateString}`
    
    console.log('Search query:', query)

    // Construct GitHub API URL with proper encoding
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=30`
    
    console.log('Full GitHub API URL:', url)

    // Make request to GitHub API
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'AI-News-Aggregator/1.0'
      }
    })

    console.log('GitHub API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('=== GitHub API Error ===')
      console.error('Status:', response.status)
      console.error('Status Text:', response.statusText)
      console.error('Error Body:', errorText)
      console.error('Request URL:', url)
      
      // If we have cached data, return it even if stale
      if (cache.data) {
        console.log('Returning stale cached data due to API error')
        return NextResponse.json({
          repositories: cache.data,
          cached_at: new Date(cache.lastFetch).toISOString(),
          total_count: cache.data.length,
          warning: 'Using stale cached data due to GitHub API error',
          cache_age_seconds: Math.round(cacheAge / 1000)
        })
      }
      
      // Handle specific error cases
      if (response.status === 403) {
        throw new Error('GitHub API rate limit exceeded. Please try again later.')
      }
      
      throw new Error(`GitHub API error: ${response.status}`)
    }

    /** @type {GitHubSearchResponse} */
    const data = await response.json()
    
    console.log(`Strict 7-day query returned ${data.items.length} repositories`)
    
    // Use the results from the strict 7-day filter only
    const repositories = data.items
    
    // Filter repositories to ensure they have AI/ML relevance
    // Be more lenient with star count since new repos (< 7 days) rarely have many stars
    const filteredRepositories = repositories.filter(repo => {
      const topics = repo.topics || []
      const aiTopics = ['ai', 'machine-learning', 'llm', 'artificial-intelligence', 'deep-learning', 'neural-network', 'tensorflow', 'pytorch', 'opencv']
      const hasAITopic = topics.some(topic => 
        aiTopics.some(aiTopic => topic.toLowerCase().includes(aiTopic.toLowerCase()))
      )
      // Also check if repo name or description contains AI-related terms
      const nameOrDescHasAI = (repo.name + ' ' + (repo.description || '')).toLowerCase().match(/(ai|artificial|intelligence|machine|learning|neural|deep|ml|nlp|computer.vision|data.science)/i)
      
      // For new repos, accept any star count (stars:>0) since they're newly created
      return (hasAITopic || nameOrDescHasAI) && repo.stargazers_count >= 0
    })

    // Update cache with fresh data
    cache.data = filteredRepositories
    cache.lastFetch = now

    console.log(`Successfully fetched and cached ${filteredRepositories.length} repositories`)

    // Return the filtered repositories
    return NextResponse.json({
      repositories: filteredRepositories,
      cached_at: new Date(now).toISOString(),
      total_count: filteredRepositories.length,
      cache_age_seconds: 0
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' // 5min cache, 10min stale
      }
    })

  } catch (error) {
    console.error('Error in trends API:', error)
    
    // Return cached data if available, even if stale
    if (cache.data) {
      const cacheAge = Date.now() - cache.lastFetch
      console.log('Returning stale cached data due to error')
      return NextResponse.json({
        repositories: cache.data,
        cached_at: new Date(cache.lastFetch).toISOString(),
        total_count: cache.data.length,
        warning: 'Using stale cached data due to API error',
        cache_age_seconds: Math.round(cacheAge / 1000)
      })
    }

    // Return error response
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch repositories',
        repositories: [],
        total_count: 0
      },
      { status: 500 }
    )
  }
}

/**
 * OPTIONS /api/trends
 * Returns API information and caching details
 * @returns {Promise<Response>} JSON response with API info
 */
export async function OPTIONS() {
  const cacheAge = cache.lastFetch ? Date.now() - cache.lastFetch : 0
  
  return NextResponse.json({
    message: 'GitHub Trends API with In-Memory Caching',
    cache_duration_minutes: CACHE_DURATION / (60 * 1000),
    cache_status: {
      has_data: !!cache.data,
      last_fetch: cache.lastFetch ? new Date(cache.lastFetch).toISOString() : null,
      age_seconds: cache.lastFetch ? Math.round(cacheAge / 1000) : 0,
      is_valid: cache.data && cacheAge < CACHE_DURATION
    },
    endpoints: {
      'GET /api/trends': 'Returns trending AI/ML repositories',
      'GET /api/trends?t=timestamp': 'Forces cache refresh'
    }
  })
}