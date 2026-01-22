/*
 * AI Configuration Modal
 * Allows users to set their API key and provider for AI summarization
 */

'use client'

import React, { useState, useEffect } from 'react'
import styles from '../styles/AIConfigModal.module.css'

/**
 * AI Configuration Modal Component
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Callback to close the modal
 */
export default function AIConfigModal({ isOpen, onClose }) {
  const [provider, setProvider] = useState('openai')
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Load saved settings on mount
  useEffect(() => {
    if (isOpen) {
      const savedProvider = localStorage.getItem('ai_provider') || 'openai'
      const savedApiKey = localStorage.getItem('ai_api_key') || ''
      setProvider(savedProvider)
      setApiKey(savedApiKey)
    }
  }, [isOpen])

  /**
   * Handles saving the configuration
   */
  const handleSave = async () => {
    if (!apiKey.trim()) {
      alert('Please enter an API key')
      return
    }

    setIsSaving(true)
    
    try {
      // Save to localStorage immediately
      localStorage.setItem('ai_provider', provider)
      localStorage.setItem('ai_api_key', apiKey.trim())
      
      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 500))
      
      onClose()
    } catch (error) {
      console.error('Error saving configuration:', error)
      alert('Failed to save configuration')
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * Handles closing the modal
   */
  const handleClose = () => {
    if (!isSaving) {
      onClose()
    }
  }

  /**
   * Handles backdrop click
   */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal} role="dialog" aria-labelledby="config-title">
        <header className={styles.header}>
          <h2 id="config-title" className={styles.title}>
            🤖 AI Configuration
          </h2>
          <button 
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close configuration"
            disabled={isSaving}
          >
            ✕
          </button>
        </header>

        <div className={styles.content}>
          {/* Provider Selection */}
          <div className={styles.field}>
            <label htmlFor="provider-select" className={styles.label}>
              🔧 AI Provider
            </label>
            <select
              id="provider-select"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className={styles.select}
              disabled={isSaving}
            >
              <option value="openai">OpenAI (GPT)</option>
              <option value="anthropic">Anthropic (Claude)</option>
              <option value="groq">Groq</option>
            </select>
          </div>

          {/* API Key Input */}
          <div className={styles.field}>
            <label htmlFor="api-key-input" className={styles.label}>
              🔑 API Key
            </label>
            <div className={styles.keyInputContainer}>
              <input
                id="api-key-input"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`Enter your ${provider.charAt(0).toUpperCase() + provider.slice(1)} API key`}
                className={styles.keyInput}
                disabled={isSaving}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className={styles.toggleButton}
                aria-label={showKey ? 'Hide API key' : 'Show API key'}
                disabled={isSaving}
              >
                {showKey ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Provider Info */}
          <div className={styles.info}>
            <p className={styles.infoText}>
              {provider === 'openai' && '💡 Get your API key from platform.openai.com'}
              {provider === 'anthropic' && '💡 Get your API key from console.anthropic.com'}
              {provider === 'groq' && '💡 Get your API key from console.groq.com'}
            </p>
          </div>
        </div>

        <footer className={styles.footer}>
          <button
            onClick={handleClose}
            className={styles.cancelButton}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={styles.saveButton}
            disabled={isSaving}
          >
            {isSaving ? '💾 Saving...' : '💾 Save Configuration'}
          </button>
        </footer>
      </div>
    </div>
  )
}