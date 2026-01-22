/*
 * SettingsModal Component
 * Modal for configuring API keys and LLM provider settings
 */

'use client'

import React, { useState, useEffect } from 'react'
import styles from '../styles/SettingsModal.module.css'

/**
 * SettingsModal Component
 * 
 * Provides a modal interface for users to:
 * - Enter their API key for LLM services
 * - Select their preferred LLM provider (OpenAI or Groq)
 * - Save settings to localStorage
 * - Load existing settings from localStorage
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Callback to close the modal
 * @param {function} [props.onSave] - Optional callback when settings are saved
 */
export default function SettingsModal({ isOpen, onClose, onSave }) {
  const [apiKey, setApiKey] = useState('')
  const [provider, setProvider] = useState('openai')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success' or 'error'

  // Load existing settings when modal opens
  useEffect(() => {
    if (isOpen) {
      loadSettings()
    }
  }, [isOpen])

  /**
   * Loads settings from localStorage
   */
  const loadSettings = () => {
    try {
      const savedApiKey = localStorage.getItem('ai-news-api-key')
      const savedProvider = localStorage.getItem('ai-news-provider')
      
      if (savedApiKey) {
        setApiKey(savedApiKey)
      }
      if (savedProvider && ['openai', 'groq'].includes(savedProvider)) {
        setProvider(savedProvider)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      showMessage('Error loading saved settings', 'error')
    }
  }

  /**
   * Saves settings to localStorage
   */
  const handleSave = async () => {
    if (!apiKey.trim()) {
      showMessage('Please enter an API key', 'error')
      return
    }

    // Basic API key validation
    if (provider === 'openai' && !apiKey.startsWith('sk-')) {
      showMessage('OpenAI API keys should start with "sk-"', 'error')
      return
    }

    setIsLoading(true)
    
    try {
      // Save to localStorage
      localStorage.setItem('ai-news-api-key', apiKey.trim())
      localStorage.setItem('ai-news-provider', provider)
      
      showMessage('Settings saved successfully! 🎉', 'success')
      
      // Call onSave callback if provided
      if (onSave) {
        onSave(apiKey.trim(), provider)
      }
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose()
      }, 1500)
      
    } catch (error) {
      console.error('Error saving settings:', error)
      showMessage('Error saving settings. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Shows a temporary message to the user
   * @param {string} text - Message text
   * @param {string} type - Message type ('success' or 'error')
   */
  const showMessage = (text, type) => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => {
      setMessage('')
      setMessageType('')
    }, 3000)
  }

  /**
   * Handles modal close
   */
  const handleClose = () => {
    setMessage('')
    setMessageType('')
    onClose()
  }

  /**
   * Handles backdrop click to close modal
   */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  /**
   * Handles escape key to close modal
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose()
    }
  }

  // Don't render if modal is not open
  if (!isOpen) {
    return null
  }

  return (
    <div 
      className={styles.overlay}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div className={styles.modal}>
        {/* Modal Header */}
        <header className={styles.header}>
          <h2 id="settings-modal-title" className={styles.title}>
            ⚙️ Settings
          </h2>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close settings modal"
          >
            ✕
          </button>
        </header>

        {/* Modal Body */}
        <div className={styles.content}>
          <p className={styles.description}>
            Configure your AI provider settings to enable repository summarization.
          </p>

          <div className={styles.form}>
            {/* Provider Selection */}
            <div className={styles.formGroup}>
              <label htmlFor="provider-select" className={styles.label}>
                🤖 AI Provider
              </label>
              <div className={styles.providerGroup}>
                <button
                  type="button"
                  className={`${styles.providerOption} ${provider === 'openai' ? styles.selected : ''}`}
                  onClick={() => setProvider('openai')}
                  disabled={isLoading}
                >
                  OpenAI (GPT-3.5)
                </button>
                <button
                  type="button"
                  className={`${styles.providerOption} ${provider === 'groq' ? styles.selected : ''}`}
                  onClick={() => setProvider('groq')}
                  disabled={isLoading}
                >
                  Groq (Mixtral)
                </button>
              </div>
            </div>

            {/* API Key Input */}
            <div className={styles.formGroup}>
              <label htmlFor="api-key-input" className={styles.label}>
                🔑 API Key
              </label>
              <input
                id="api-key-input"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={
                  provider === 'openai' 
                    ? 'sk-...' 
                    : 'Enter your Groq API key'
                }
                className={styles.input}
                disabled={isLoading}
              />
              <p className={styles.helpText}>
                {provider === 'openai' 
                  ? 'Get your API key from OpenAI Platform (platform.openai.com)'
                  : 'Get your API key from Groq Console (console.groq.com)'
                }
              </p>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`${styles.statusMessage} ${styles[messageType]}`}>
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <footer className={styles.footer}>
          <button
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className={`${styles.button} ${styles.saveButton}`}
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? '💾 Saving...' : '💾 Save Settings'}
          </button>
        </footer>
      </div>
    </div>
  )
}