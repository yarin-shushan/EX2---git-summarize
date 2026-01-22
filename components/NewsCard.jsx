/*
 * NewsCard Component
 * Displays individual repository information in an Apple-inspired card design
 * Supports summarization with loading states and proper accessibility
 */

'use client'

import React from 'react'
import styles from '../styles/NewsCard.module.css'

/**
 * NewsCard Component
 * 
 * Renders a single repository card with:
 * - Repository name and star count
 * - Description with text truncation
 * - Topics/tags display
 * - Language and last updated metadata
 * - Summarize button with loading states
 * - Proper accessibility features
 * 
 * @param {Object} props - Component props
 * @param {import('../types/index.js').Repository} props.repository - Repository data to display
 * @param {function(import('../types/index.js').Repository): void} props.onSummarize - Callback function when summarize button is clicked
 * @param {boolean} [props.isLoading=false] - Optional loading state for the summarize button
 */
export default function NewsCard({ 
  repository, 
  onSummarize, 
  isLoading = false 
}) {
  
  /**
   * Formats the star count for display
   * Converts large numbers to readable format (e.g., 1.2k, 15.3k)
   * @param {number} count - Star count to format
   * @returns {string} Formatted star count
   */
  const formatStarCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  /**
   * Formats the last updated date for display
   * Shows relative time (e.g., "2 days ago") or absolute date for older repos
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  const formatUpdatedDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) {
      return 'Today'
    } else if (diffInDays === 1) {
      return 'Yesterday'
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  /**
   * Handles the summarize button click
   * Prevents action when loading and calls the provided callback
   */
  const handleSummarizeClick = () => {
    if (!isLoading) {
      onSummarize(repository)
    }
  }

  /**
   * Handles keyboard navigation for the repository link
   * Ensures accessibility compliance
   * @param {React.KeyboardEvent} event - Keyboard event
   */
  const handleRepositoryLinkKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      window.open(repository.html_url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <article className={styles.card} role="article" aria-labelledby={`repo-${repository.id}-name`}>
      {/* Card Header: Repository name and star count */}
      <header className={styles.cardHeader}>
        <h3 
          id={`repo-${repository.id}-name`}
          className={styles.repositoryName}
        >
          🤖 <a 
            href={repository.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.repositoryLink}
            aria-label={`Open ${repository.full_name} repository on GitHub`}
            onKeyDown={handleRepositoryLinkKeyDown}
          >
            {repository.name}
          </a>
        </h3>
        
        <div className={styles.starCount} aria-label={`${repository.stargazers_count} stars`}>
          <span className={styles.starIcon} aria-hidden="true">⭐</span>
          {formatStarCount(repository.stargazers_count)}
        </div>
      </header>

      {/* Repository Description */}
      <p className={styles.description} aria-describedby={`repo-${repository.id}-name`}>
        💡 {repository.description || 'No description available'}
      </p>

      {/* Topics/Tags Display - Always show AI and ML tags */}
      <div className={styles.topics} role="list" aria-label="Repository topics">
        {/* Always show AI and ML tags first */}
        <span className={styles.topic} role="listitem" aria-label="Topic: AI">
          🧠 AI
        </span>
        <span className={styles.topic} role="listitem" aria-label="Topic: Machine Learning">
          🤖 Machine Learning
        </span>
        
        {/* Show additional topics if available */}
        {repository.topics && repository.topics.length > 0 && (
          <>
            {repository.topics
              .filter(topic => !['ai', 'machine-learning'].includes(topic.toLowerCase()))
              .slice(0, 3)
              .map((topic) => (
                <span 
                  key={topic} 
                  className={styles.topic}
                  role="listitem"
                  aria-label={`Topic: ${topic}`}
                >
                  🏷️ {topic}
                </span>
              ))}
            {repository.topics.filter(topic => !['ai', 'machine-learning'].includes(topic.toLowerCase())).length > 3 && (
              <span className={styles.topic} aria-label={`${repository.topics.length - 5} more topics`}>
                ➕ +{repository.topics.filter(topic => !['ai', 'machine-learning'].includes(topic.toLowerCase())).length - 3}
              </span>
            )}
          </>
        )}
      </div>

      {/* Card Footer: Metadata and Actions */}
      <footer className={styles.cardFooter}>
        <div className={styles.metadata} role="group" aria-label="Repository metadata">
          {repository.language && (
            <div className={styles.language} aria-label={`Primary language: ${repository.language}`}>
              <div 
                className={styles.languageColor} 
                aria-hidden="true"
              />
              💻 <span>{repository.language}</span>
            </div>
          )}
          
          <time 
            className={styles.updatedDate}
            dateTime={repository.updated_at}
            aria-label={`Last updated: ${formatUpdatedDate(repository.updated_at)}`}
          >
            🕒 {formatUpdatedDate(repository.updated_at)}
          </time>
        </div>

        {/* Summarize Button */}
        <button
          className={styles.summarizeButton}
          onClick={handleSummarizeClick}
          disabled={isLoading}
          aria-label={
            isLoading 
              ? `Generating summary for ${repository.name}...` 
              : `Generate AI summary for ${repository.name}`
          }
          aria-describedby={`repo-${repository.id}-name`}
        >
          {isLoading && (
            <span 
              className={styles.loadingSpinner} 
              aria-hidden="true"
              role="status"
            />
          )}
          {isLoading ? '⏳ Summarizing...' : '✨ Summarize'}
        </button>
      </footer>
    </article>
  )
}