/*
 * NewsCard Component Tests
 * Unit tests for the NewsCard component functionality
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import NewsCard from '../NewsCard'

// Mock repository data for testing
/** @type {import('../../types/index.js').Repository} */
const mockRepository = {
  id: 123456,
  name: 'awesome-ai-project',
  full_name: 'openai/awesome-ai-project',
  description: 'An amazing AI project that does incredible things with machine learning and natural language processing.',
  stargazers_count: 15420,
  html_url: 'https://github.com/openai/awesome-ai-project',
  topics: ['ai', 'machine-learning', 'nlp', 'python', 'tensorflow'],
  updated_at: '2024-01-15T10:30:00Z',
  language: 'Python',
  created_at: '2023-06-01T08:00:00Z'
}

// Mock callback function
const mockOnSummarize = jest.fn()

describe('NewsCard Component', () => {
  beforeEach(() => {
    mockOnSummarize.mockClear()
  })

  test('renders repository information correctly', () => {
    render(
      <NewsCard 
        repository={mockRepository} 
        onSummarize={mockOnSummarize} 
      />
    )

    // Check if repository name is displayed
    expect(screen.getByText('awesome-ai-project')).toBeInTheDocument()
    
    // Check if description is displayed
    expect(screen.getByText(/An amazing AI project that does incredible things/)).toBeInTheDocument()
    
    // Check if star count is displayed (formatted)
    expect(screen.getByText('15.4k')).toBeInTheDocument()
    
    // Check if language is displayed
    expect(screen.getByText('Python')).toBeInTheDocument()
  })

  test('displays topics correctly', () => {
    render(
      <NewsCard 
        repository={mockRepository} 
        onSummarize={mockOnSummarize} 
      />
    )

    // Check if topics are displayed (first 5)
    expect(screen.getByText('ai')).toBeInTheDocument()
    expect(screen.getByText('machine-learning')).toBeInTheDocument()
    expect(screen.getByText('nlp')).toBeInTheDocument()
    expect(screen.getByText('python')).toBeInTheDocument()
    expect(screen.getByText('tensorflow')).toBeInTheDocument()
  })

  test('handles repository with null description', () => {
    const repoWithoutDescription = {
      ...mockRepository,
      description: null
    }

    render(
      <NewsCard 
        repository={repoWithoutDescription} 
        onSummarize={mockOnSummarize} 
      />
    )

    expect(screen.getByText('No description available')).toBeInTheDocument()
  })

  test('handles repository with null language', () => {
    const repoWithoutLanguage = {
      ...mockRepository,
      language: null
    }

    render(
      <NewsCard 
        repository={repoWithoutLanguage} 
        onSummarize={mockOnSummarize} 
      />
    )

    // Language should not be displayed
    expect(screen.queryByText('Python')).not.toBeInTheDocument()
  })

  test('calls onSummarize when summarize button is clicked', () => {
    render(
      <NewsCard 
        repository={mockRepository} 
        onSummarize={mockOnSummarize} 
      />
    )

    const summarizeButton = screen.getByRole('button', { name: /Generate AI summary/i })
    fireEvent.click(summarizeButton)

    expect(mockOnSummarize).toHaveBeenCalledTimes(1)
    expect(mockOnSummarize).toHaveBeenCalledWith(mockRepository)
  })

  test('shows loading state correctly', () => {
    render(
      <NewsCard 
        repository={mockRepository} 
        onSummarize={mockOnSummarize} 
        isLoading={true}
      />
    )

    // Check if loading text is displayed
    expect(screen.getByText('Summarizing...')).toBeInTheDocument()
    
    // Check if button is disabled
    const summarizeButton = screen.getByRole('button', { name: /Generating summary/i })
    expect(summarizeButton).toBeDisabled()
    
    // Check if loading spinner is present
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  test('does not call onSummarize when loading', () => {
    render(
      <NewsCard 
        repository={mockRepository} 
        onSummarize={mockOnSummarize} 
        isLoading={true}
      />
    )

    const summarizeButton = screen.getByRole('button', { name: /Generating summary/i })
    fireEvent.click(summarizeButton)

    // Should not call the callback when loading
    expect(mockOnSummarize).not.toHaveBeenCalled()
  })

  test('formats star count correctly', () => {
    const testCases = [
      { count: 42, expected: '42' },
      { count: 999, expected: '999' },
      { count: 1000, expected: '1.0k' },
      { count: 1500, expected: '1.5k' },
      { count: 15420, expected: '15.4k' }
    ]

    testCases.forEach(({ count, expected }) => {
      const repo = { ...mockRepository, stargazers_count: count }
      const { rerender } = render(
        <NewsCard 
          repository={repo} 
          onSummarize={mockOnSummarize} 
        />
      )

      expect(screen.getByText(expected)).toBeInTheDocument()
      
      // Clean up for next iteration
      rerender(<div />)
    })
  })

  test('has proper accessibility attributes', () => {
    render(
      <NewsCard 
        repository={mockRepository} 
        onSummarize={mockOnSummarize} 
      />
    )

    // Check for proper ARIA labels and roles
    expect(screen.getByRole('article')).toBeInTheDocument()
    expect(screen.getByLabelText(/15420 stars/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Primary language: Python/)).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Repository topics' })).toBeInTheDocument()
    
    // Check repository link accessibility
    const repoLink = screen.getByLabelText(/Open openai\/awesome-ai-project repository on GitHub/)
    expect(repoLink).toHaveAttribute('target', '_blank')
    expect(repoLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  test('handles more than 5 topics correctly', () => {
    const repoWithManyTopics = {
      ...mockRepository,
      topics: ['ai', 'ml', 'nlp', 'python', 'tensorflow', 'pytorch', 'deep-learning', 'neural-networks']
    }

    render(
      <NewsCard 
        repository={repoWithManyTopics} 
        onSummarize={mockOnSummarize} 
      />
    )

    // Should show first 5 topics
    expect(screen.getByText('ai')).toBeInTheDocument()
    expect(screen.getByText('ml')).toBeInTheDocument()
    expect(screen.getByText('nlp')).toBeInTheDocument()
    expect(screen.getByText('python')).toBeInTheDocument()
    expect(screen.getByText('tensorflow')).toBeInTheDocument()
    
    // Should show "+3" for remaining topics
    expect(screen.getByText('+3')).toBeInTheDocument()
    
    // Should not show the extra topics
    expect(screen.queryByText('pytorch')).not.toBeInTheDocument()
    expect(screen.queryByText('deep-learning')).not.toBeInTheDocument()
  })

  test('formats updated date correctly', () => {
    // Test with different dates
    const today = new Date()
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)
    const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000)

    const testCases = [
      { date: today.toISOString(), expectedPattern: /Today/ },
      { date: yesterday.toISOString(), expectedPattern: /Yesterday/ },
      { date: threeDaysAgo.toISOString(), expectedPattern: /3 days ago/ },
      { date: twoWeeksAgo.toISOString(), expectedPattern: /\d{1,2}\/\d{1,2}\/\d{4}/ } // Date format
    ]

    testCases.forEach(({ date, expectedPattern }, index) => {
      const repo = { ...mockRepository, updated_at: date }
      const { rerender } = render(
        <NewsCard 
          key={index}
          repository={repo} 
          onSummarize={mockOnSummarize} 
        />
      )

      expect(screen.getByText(expectedPattern)).toBeInTheDocument()
      
      // Clean up for next iteration
      rerender(<div />)
    })
  })
})