/*
 * NewsCard Component Property-Based Tests
 * Tests universal properties that should hold across all valid inputs
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import fc from 'fast-check'
import NewsCard from '../NewsCard'

// Property-based test generators
const repositoryArbitrary = fc.record({
  id: fc.integer({ min: 1, max: 999999999 }),
  name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
  full_name: fc.string({ minLength: 3, maxLength: 150 }).filter(s => s.includes('/')),
  description: fc.oneof(
    fc.constant(null),
    fc.string({ minLength: 0, maxLength: 500 })
  ),
  stargazers_count: fc.integer({ min: 0, max: 999999 }),
  html_url: fc.webUrl(),
  topics: fc.array(
    fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
    { minLength: 0, maxLength: 20 }
  ),
  updated_at: fc.date({ min: new Date('2020-01-01'), max: new Date() }).map(d => d.toISOString()),
  language: fc.oneof(
    fc.constant(null),
    fc.constantFrom('JavaScript', 'Python', 'TypeScript', 'Java', 'Go', 'Rust', 'C++')
  ),
  created_at: fc.date({ min: new Date('2020-01-01'), max: new Date() }).map(d => d.toISOString())
})

describe('NewsCard Property-Based Tests', () => {
  /**
   * Property 11: NewsCard Component Structure
   * For any repository data rendered as a NewsCard, the component should display 
   * the repository name, description, star count, and include a "Summarize" button element.
   * **Validates: Requirements 3.1, 3.2**
   */
  test('Property 11: NewsCard displays required elements for any valid repository', () => {
    fc.assert(
      fc.property(repositoryArbitrary, (repository) => {
        const mockOnSummarize = jest.fn()
        
        render(
          <NewsCard 
            repository={repository} 
            onSummarize={mockOnSummarize} 
          />
        )

        // Repository name should be displayed
        expect(screen.getByText(repository.name)).toBeInTheDocument()
        
        // Description should be displayed (or fallback text)
        if (repository.description) {
          expect(screen.getByText(repository.description)).toBeInTheDocument()
        } else {
          expect(screen.getByText('No description available')).toBeInTheDocument()
        }
        
        // Star count should be displayed (formatted appropriately)
        const starCountElement = screen.getByLabelText(new RegExp(`${repository.stargazers_count} stars?`))
        expect(starCountElement).toBeInTheDocument()
        
        // Summarize button should be present
        const summarizeButton = screen.getByRole('button', { name: /summarize/i })
        expect(summarizeButton).toBeInTheDocument()
        
        // Clean up
        screen.getByRole('article').remove()
      })
    )
  })

  /**
   * Property: Star Count Formatting Consistency
   * For any star count, the formatting should be consistent and readable
   */
  test('Property: Star count formatting is consistent for any valid count', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 999999 }), (starCount) => {
        /** @type {import('../../types/index.js').Repository} */
        const repository = {
          id: 1,
          name: 'test-repo',
          full_name: 'user/test-repo',
          description: 'Test repository',
          stargazers_count: starCount,
          html_url: 'https://github.com/user/test-repo',
          topics: [],
          updated_at: new Date().toISOString(),
          language: 'JavaScript'
        }
        
        const mockOnSummarize = jest.fn()
        
        render(
          <NewsCard 
            repository={repository} 
            onSummarize={mockOnSummarize} 
          />
        )

        // Star count should be displayed with proper formatting
        const starElement = screen.getByLabelText(new RegExp(`${starCount} stars?`))
        expect(starElement).toBeInTheDocument()
        
        // Verify formatting logic
        const displayedText = starElement.textContent
        if (starCount >= 1000) {
          expect(displayedText).toMatch(/\d+\.\d+k/)
        } else {
          expect(displayedText).toBe(`⭐${starCount}`)
        }
        
        // Clean up
        screen.getByRole('article').remove()
      })
    )
  })

  /**
   * Property: Topics Display Limitation
   * For any array of topics, only the first 5 should be displayed with overflow indication
   */
  test('Property: Topics display is limited to 5 items with overflow indication', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
          { minLength: 0, maxLength: 15 }
        ),
        (topics) => {
          /** @type {import('../../types/index.js').Repository} */
          const repository = {
            id: 1,
            name: 'test-repo',
            full_name: 'user/test-repo',
            description: 'Test repository',
            stargazers_count: 100,
            html_url: 'https://github.com/user/test-repo',
            topics: topics,
            updated_at: new Date().toISOString(),
            language: 'JavaScript'
          }
          
          const mockOnSummarize = jest.fn()
          
          render(
            <NewsCard 
              repository={repository} 
              onSummarize={mockOnSummarize} 
            />
          )

          if (topics.length === 0) {
            // No topics section should be present
            expect(screen.queryByRole('list', { name: 'Repository topics' })).not.toBeInTheDocument()
          } else if (topics.length <= 5) {
            // All topics should be displayed
            topics.forEach(topic => {
              expect(screen.getByText(topic)).toBeInTheDocument()
            })
            // No overflow indicator
            expect(screen.queryByText(/^\+\d+$/)).not.toBeInTheDocument()
          } else {
            // First 5 topics should be displayed
            topics.slice(0, 5).forEach(topic => {
              expect(screen.getByText(topic)).toBeInTheDocument()
            })
            // Overflow indicator should be present
            const overflowCount = topics.length - 5
            expect(screen.getByText(`+${overflowCount}`)).toBeInTheDocument()
            // Topics beyond 5 should not be displayed
            topics.slice(5).forEach(topic => {
              expect(screen.queryByText(topic)).not.toBeInTheDocument()
            })
          }
          
          // Clean up
          screen.getByRole('article').remove()
        }
      )
    )
  })

  /**
   * Property: Accessibility Attributes Presence
   * For any repository, the component should have proper accessibility attributes
   */
  test('Property: Component has proper accessibility attributes for any repository', () => {
    fc.assert(
      fc.property(repositoryArbitrary, (repository) => {
        const mockOnSummarize = jest.fn()
        
        render(
          <NewsCard 
            repository={repository} 
            onSummarize={mockOnSummarize} 
          />
        )

        // Should have article role
        expect(screen.getByRole('article')).toBeInTheDocument()
        
        // Should have proper button with accessible name
        const button = screen.getByRole('button')
        expect(button).toHaveAttribute('aria-label')
        
        // Should have proper link with accessible attributes
        const link = screen.getByRole('link')
        expect(link).toHaveAttribute('aria-label')
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
        
        // Clean up
        screen.getByRole('article').remove()
      })
    )
  })

  /**
   * Property: Loading State Behavior
   * For any repository and loading state, the component should behave consistently
   */
  test('Property: Loading state affects button behavior consistently', () => {
    fc.assert(
      fc.property(
        repositoryArbitrary,
        fc.boolean(),
        (repository, isLoading) => {
          const mockOnSummarize = jest.fn()
          
          render(
            <NewsCard 
              repository={repository} 
              onSummarize={mockOnSummarize} 
              isLoading={isLoading}
            />
          )

          const button = screen.getByRole('button')
          
          if (isLoading) {
            // Button should be disabled when loading
            expect(button).toBeDisabled()
            expect(button.textContent).toContain('Summarizing')
            // Should have loading spinner
            expect(screen.getByRole('status')).toBeInTheDocument()
          } else {
            // Button should be enabled when not loading
            expect(button).not.toBeDisabled()
            expect(button.textContent).toContain('Summarize')
            // Should not have loading spinner
            expect(screen.queryByRole('status')).not.toBeInTheDocument()
          }
          
          // Clean up
          screen.getByRole('article').remove()
        }
      )
    )
  })
})

/*
 * Test Configuration
 * Feature: ai-news-aggregator, Property 11: NewsCard Component Structure
 * 
 * These property-based tests validate that the NewsCard component maintains
 * consistent behavior across all possible valid repository inputs, ensuring
 * robustness and reliability of the UI component.
 */