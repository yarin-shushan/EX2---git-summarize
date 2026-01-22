/*
 * Main Home Page Component
 * Displays trending AI/ML repositories in an Apple-inspired grid layout
 */

'use client'

import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import NewsCard from '../components/NewsCard'
import AIConfigModal from '../components/AIConfigModal'

/**
 * Home Page Component
 * 
 * Main application page that:
 * - Fetches trending AI/ML repositories from GitHub API
 * - Displays repositories in a responsive grid layout
 * - Handles loading, error, and empty states
 * - Provides AI configuration and refresh functionality
 * 
 * @returns {JSX.Element} The home page component
 */
export default function Home() {
  // State management for repositories and UI states
  /** @type {[import('../types/index.js').Repository[], function]} */
  const [repositories, setRepositories] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  /** @type {[string|null, function]} */
  const [error, setError] = useState(null)
  const [showAIConfig, setShowAIConfig] = useState(false)
  /** @type {[string|null, function]} */
  const [summarizingRepo, setSummarizingRepo] = useState(null)

  // Fetch trending repositories on component mount
  useEffect(() => {
    fetchTrendingRepositories()
  }, [])

  /**
   * Fetches trending AI/ML repositories from our API
   * Implements error handling and loading states
   * @param {boolean} isRefresh - Whether this is a manual refresh
   */
  const fetchTrendingRepositories = async (isRefresh = false) => {
    try {
      console.log('fetchTrendingRepositories called with isRefresh:', isRefresh)
      
      if (isRefresh) {
        setRefreshing(true)
        console.log('Setting refreshing state to true')
      } else {
        setLoading(true)
      }
      setError(null)
      
      // Add cache-busting parameter for refresh
      const url = isRefresh ? `/api/trends?t=${Date.now()}` : '/api/trends'
      console.log('Fetching from URL:', url)
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch repositories: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Received data:', data.repositories?.length, 'repositories')
      setRepositories(data.repositories || [])
    } catch (err) {
      console.error('Error fetching repositories:', err)
      setError(err instanceof Error ? err.message : 'Failed to load repositories')
    } finally {
      setLoading(false)
      setRefreshing(false)
      console.log('Fetch completed, refreshing set to false')
    }
  }

  /**
   * Handles manual refresh of repositories
   */
  const handleRefresh = () => {
    console.log('Refresh button clicked')
    fetchTrendingRepositories(true)
  }

  /**
   * Handles repository summarization
   * @param {import('../types/index.js').Repository} repository - Repository to summarize
   */
  const handleSummarize = async (repository) => {
    // Check if API key is configured
    const apiKey = localStorage.getItem('ai_api_key')
    const provider = localStorage.getItem('ai_provider') || 'openai'
    
    if (!apiKey) {
      alert('🔑 Please configure your AI API key first!')
      setShowAIConfig(true)
      return
    }

    setSummarizingRepo(repository.id.toString())
    
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: `${repository.name}: ${repository.description || 'No description'}`,
          apiKey: apiKey,
          provider: provider
        })
      })

      if (!response.ok) {
        throw new Error(`Summarization failed: ${response.status}`)
      }

      const data = await response.json()
      
      // Show summary in alert for now (can be enhanced with a modal later)
      alert(`✨ AI Summary:\n\n${data.summary}`)
      
    } catch (error) {
      console.error('Error summarizing repository:', error)
      alert(`❌ Failed to generate summary: ${error.message}`)
    } finally {
      setSummarizingRepo(null)
    }
  }

  /**
   * Renders loading skeleton cards
   * @returns {JSX.Element} Loading state component
   */
  const renderLoadingState = () => (
    <div className={styles.loadingGrid}>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className={styles.loadingSkeleton}>
          <div className={styles.skeletonTitle}></div>
          <div className={styles.skeletonDescription}></div>
          <div className={styles.skeletonDescription}></div>
          <div className={styles.skeletonDescription}></div>
        </div>
      ))}
    </div>
  )

  /**
   * Renders error state with retry option
   * @returns {JSX.Element} Error state component
   */
  const renderErrorState = () => (
    <div className={styles.errorContainer}>
      <h2 className={styles.errorTitle}>❌ Unable to Load Repositories</h2>
      <p className={styles.errorMessage}>
        {error || 'Something went wrong while fetching the latest AI repositories.'}
      </p>
      <button 
        className={styles.retryButton}
        onClick={() => fetchTrendingRepositories()}
      >
        🔄 Try Again
      </button>
    </div>
  )

  /**
   * Renders empty state when no repositories found
   * @returns {JSX.Element} Empty state component
   */
  const renderEmptyState = () => (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateIcon}>🔍</div>
      <h2 className={styles.emptyStateTitle}>📭 No Repositories Found</h2>
      <p className={styles.emptyStateMessage}>
        We couldn't find any NEW AI/ML repositories created in the last 7 days. 
        Try refreshing or check back later for newly created projects.
      </p>
    </div>
  )

  return (
    <main className={styles.main}>
      {/* Header Section */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>🤖 AI News Aggregator</h1>
          <p className={styles.subtitle}>
            🚀 Discover NEW AI & Machine Learning repositories (Created in Last 7 Days)
          </p>
        </div>
        
        {/* Header Actions */}
        <div className={styles.headerActions}>
          <button 
            className={styles.refreshButton}
            onClick={handleRefresh}
            disabled={refreshing}
            aria-label="Refresh repositories"
          >
            <span className={`${styles.refreshIcon} ${refreshing ? styles.spinning : ''}`}>
              🔄
            </span>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          
          <button 
            className={styles.configButton}
            onClick={() => setShowAIConfig(true)}
            aria-label="AI Configuration"
          >
            🔑
          </button>
        </div>
      </header>

      {/* Main Content */}
      {loading && renderLoadingState()}
      {error && !loading && renderErrorState()}
      {!loading && !error && repositories.length === 0 && renderEmptyState()}
      
      {!loading && !error && repositories.length > 0 && (
        <div className={styles.repositoryGrid}>
          {repositories.map((repository) => (
            <NewsCard
              key={repository.id}
              repository={repository}
              onSummarize={handleSummarize}
              isLoading={summarizingRepo === repository.id.toString()}
            />
          ))}
        </div>
      )}

      {/* AI Configuration Modal */}
      <AIConfigModal 
        isOpen={showAIConfig}
        onClose={() => setShowAIConfig(false)}
      />
    </main>
  )
}