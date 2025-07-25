"use client"

import React, { useState, useEffect, createContext, useContext, useRef } from "react"
import "./App.css"

// Theme Context
const ThemeContext = createContext()

const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("sentimentx-theme")
    return savedTheme || "dark"
  })

  useEffect(() => {
    localStorage.setItem("sentimentx-theme", theme)
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

// Accessibility Context for managing focus and announcements
const AccessibilityContext = createContext()

const useAccessibility = () => {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}

const AccessibilityProvider = ({ children }) => {
  const [announcements, setAnnouncements] = useState([])
  const announcementTimeoutRef = useRef()

  const announce = (message, priority = "polite") => {
    const id = Date.now()
    setAnnouncements((prev) => [...prev, { id, message, priority }])

    // Clear announcement after it's been read
    clearTimeout(announcementTimeoutRef.current)
    announcementTimeoutRef.current = setTimeout(() => {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id))
    }, 1000)
  }

  return (
    <AccessibilityContext.Provider value={{ announce }}>
      {children}
      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcements
          .filter((a) => a.priority === "polite")
          .map((a) => (
            <div key={a.id}>{a.message}</div>
          ))}
      </div>
      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        {announcements
          .filter((a) => a.priority === "assertive")
          .map((a) => (
            <div key={a.id}>{a.message}</div>
          ))}
      </div>
    </AccessibilityContext.Provider>
  )
}

// Skip to content link
const SkipLink = () => (
  <a href="#main-content" className="skip-link">
    Skip to main content
  </a>
)

// Mock data for demonstration
const sampleTweets = [
  {
    id: "1",
    user: "techguru_dev",
    text: "Just discovered this amazing new framework! The developer experience is incredible 🚀 #webdev #react",
    sentiment: "positive",
    likes: 142,
    retweets: 32,
    replies: 18,
    timestamp: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    user: "frustrated_coder",
    text: "Spent 6 hours debugging this issue only to find out it was a missing semicolon... 😤 #debugging #programming",
    sentiment: "negative",
    likes: 89,
    retweets: 15,
    replies: 23,
    timestamp: "2024-01-15T11:15:00Z",
  },
  {
    id: "3",
    user: "neutral_observer",
    text: "The new update includes several performance improvements and bug fixes. Release notes are available on GitHub.",
    sentiment: "neutral",
    likes: 45,
    retweets: 8,
    replies: 5,
    timestamp: "2024-01-15T12:00:00Z",
  },
  {
    id: "4",
    user: "happy_developer",
    text: "Finally shipped the feature I've been working on for weeks! The team collaboration was fantastic 💪 #teamwork",
    sentiment: "positive",
    likes: 203,
    retweets: 67,
    replies: 34,
    timestamp: "2024-01-15T13:45:00Z",
  },
  {
    id: "5",
    user: "concerned_user",
    text: "The latest security vulnerability is quite concerning. Hope they patch it soon. #security #cybersecurity",
    sentiment: "negative",
    likes: 76,
    retweets: 28,
    replies: 12,
    timestamp: "2024-01-15T14:20:00Z",
  },
]

const LoadingSpinner = ({ ariaLabel = "Loading" }) => (
  <div className="loading-spinner" role="status" aria-label={ariaLabel}>
    <div className="spinner-ring"></div>
    <span className="sr-only">{ariaLabel}</span>
  </div>
)

const SentimentBadge = ({ sentiment }) => {
  const sentimentConfig = {
    positive: {
      icon: "😊",
      color: "#10B981",
      bg: "rgba(16, 185, 129, 0.1)",
      label: "Positive sentiment",
    },
    negative: {
      icon: "😞",
      color: "#EF4444",
      bg: "rgba(239, 68, 68, 0.1)",
      label: "Negative sentiment",
    },
    neutral: {
      icon: "😐",
      color: "#6B7280",
      bg: "rgba(107, 114, 128, 0.1)",
      label: "Neutral sentiment",
    },
  }

  const config = sentimentConfig[sentiment] || sentimentConfig.neutral

  return (
    <span
      className="sentiment-badge"
      style={{
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.color}30`,
      }}
      aria-label={config.label}
      role="img"
    >
      <span className="sentiment-icon" aria-hidden="true">
        {config.icon}
      </span>
      <span className="sentiment-text">{sentiment}</span>
    </span>
  )
}

const TweetCard = ({ tweet, index }) => {
  const cardRef = useRef()

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      // Could expand tweet or show more details
      console.log("Tweet selected:", tweet.id)
    }
  }

  return (
    <article
      className="tweet-card"
      style={{ animationDelay: `${index * 0.1}s` }}
      ref={cardRef}
      tabIndex="0"
      role="article"
      aria-labelledby={`tweet-${tweet.id}-user`}
      aria-describedby={`tweet-${tweet.id}-content tweet-${tweet.id}-sentiment tweet-${tweet.id}-stats`}
      onKeyDown={handleKeyDown}
    >
      <header className="tweet-header">
        <div className="tweet-user">
          <div className="user-avatar" aria-hidden="true" role="img" aria-label={`${tweet.user} avatar`}>
            {tweet.user.charAt(0).toUpperCase()}
          </div>
          <span className="username" id={`tweet-${tweet.id}-user`}>
            @{tweet.user}
          </span>
        </div>
        <time
          className="tweet-time"
          dateTime={tweet.timestamp}
          aria-label={`Posted on ${new Date(tweet.timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`}
        >
          {new Date(tweet.timestamp).toLocaleDateString()}
        </time>
      </header>

      <div className="tweet-content" id={`tweet-${tweet.id}-content`}>
        {tweet.text}
      </div>

      <footer className="tweet-footer">
        <div id={`tweet-${tweet.id}-sentiment`}>
          <SentimentBadge sentiment={tweet.sentiment} />
        </div>
        <div className="tweet-stats" id={`tweet-${tweet.id}-stats`}>
          <span className="stat" aria-label={`${tweet.likes} likes`}>
            <span className="stat-icon" aria-hidden="true">
              ❤️
            </span>
            <span className="stat-value">{tweet.likes}</span>
          </span>
          <span className="stat" aria-label={`${tweet.retweets} retweets`}>
            <span className="stat-icon" aria-hidden="true">
              🔄
            </span>
            <span className="stat-value">{tweet.retweets}</span>
          </span>
          <span className="stat" aria-label={`${tweet.replies} replies`}>
            <span className="stat-icon" aria-hidden="true">
              💬
            </span>
            <span className="stat-value">{tweet.replies}</span>
          </span>
        </div>
      </footer>
    </article>
  )
}

const ProgressBar = ({ label, value, max, color = "#FF6B35" }) => {
  const percentage = (value / max) * 100
  const progressId = `progress-${label.toLowerCase().replace(/\s+/g, "-")}`

  return (
    <div className="progress-container" role="group" aria-labelledby={`${progressId}-label`}>
      <div className="progress-header">
        <span className="progress-label" id={`${progressId}-label`}>
          {label}
        </span>
        <span className="progress-value" aria-label={`${value} out of ${max}`}>
          {value}/{max}
        </span>
      </div>
      <div
        className="progress-bar"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin="0"
        aria-valuemax={max}
        aria-labelledby={`${progressId}-label`}
        aria-describedby={`${progressId}-percentage`}
      >
        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}40`,
          }}
        ></div>
      </div>
      <div className="progress-percentage" id={`${progressId}-percentage`}>
        {Math.round(percentage)}% complete
      </div>
    </div>
  )
}

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  const { announce } = useAccessibility()

  const handleToggle = () => {
    toggleTheme()
    announce(`Switched to ${theme === "dark" ? "light" : "dark"} theme`)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleToggle()
    }
  }

  return (
    <button
      className="theme-toggle"
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode. Currently using ${theme} mode.`}
      aria-pressed={theme === "light"}
      role="switch"
    >
      <div className="toggle-track" aria-hidden="true">
        <div className="toggle-thumb">
          <span className="toggle-icon">{theme === "dark" ? "🌙" : "☀️"}</span>
        </div>
      </div>
      <span className="sr-only">
        Theme toggle. Current theme: {theme}. Press to switch to {theme === "dark" ? "light" : "dark"} mode.
      </span>
    </button>
  )
}

// Move the main app content to a separate component
const AppContent = () => {
  const [query, setQuery] = useState("")
  const [count, setCount] = useState(10)
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [analysisStarted, setAnalysisStarted] = useState(false)

  const searchInputRef = useRef()
  const countInputRef = useRef()
  const analyzeButtonRef = useRef()
  const { announce } = useAccessibility()

  // Calculate sentiment statistics
  const sentimentStats = React.useMemo(() => {
    const positive = tweets.filter((t) => t.sentiment === "positive").length
    const negative = tweets.filter((t) => t.sentiment === "negative").length
    const neutral = tweets.filter((t) => t.sentiment === "neutral").length
    const total = tweets.length

    return {
      positive,
      negative,
      neutral,
      total,
      positivePercentage: total > 0 ? (positive / total) * 100 : 0,
      negativePercentage: total > 0 ? (negative / total) * 100 : 0,
      neutralPercentage: total > 0 ? (neutral / total) * 100 : 0,
    }
  }, [tweets])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!query.trim()) {
      setError("Please enter a search term")
      announce("Error: Please enter a search term", "assertive")
      searchInputRef.current?.focus()
      return
    }

    setLoading(true)
    setError("")
    setAnalysisStarted(true)
    announce("Starting tweet analysis", "polite")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setTweets(sampleTweets)
      announce(
        `Analysis complete! Found ${sampleTweets.length} tweets. ${sentimentStats.positive} positive, ${sentimentStats.negative} negative, ${sentimentStats.neutral} neutral.`,
        "polite",
      )
    } catch (err) {
      const errorMessage = "Failed to analyze tweets. Please try again."
      setError(errorMessage)
      announce(`Error: ${errorMessage}`, "assertive")
    } finally {
      setLoading(false)
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + S to focus search input
      if (e.altKey && e.key === "s") {
        e.preventDefault()
        searchInputRef.current?.focus()
        announce("Search input focused", "polite")
      }

      // Alt + A to focus analyze button
      if (e.altKey && e.key === "a") {
        e.preventDefault()
        analyzeButtonRef.current?.focus()
        announce("Analyze button focused", "polite")
      }

      // Alt + T to toggle theme
      if (e.altKey && e.key === "t") {
        e.preventDefault()
        document.querySelector(".theme-toggle")?.click()
      }

      // Escape to clear error
      if (e.key === "Escape" && error) {
        setError("")
        announce("Error message cleared", "polite")
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [error, announce])

  return (
    <div className="app">
      <SkipLink />

      {/* Header */}
      <header className="header" role="banner">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon" aria-hidden="true">
              🐦
            </span>
            <span className="logo-text">SentimentX</span>
          </div>
          <nav className="nav" role="navigation" aria-label="Main navigation">
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#how-to-use" className="nav-link">
              How to Use
            </a>
            <a href="#analytics" className="nav-link">
              Analytics
            </a>
          </nav>
          <div className="user-section">
            <ThemeToggle />
            <div className="user-avatar" aria-hidden="true">
              <span>U</span>
            </div>
            <div className="user-info">
              <span className="user-name">User</span>
              <span className="user-email">user@example.com</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content" id="main-content" role="main">
        {/* Left Panel - Hero Section */}
        <section className="left-panel" aria-labelledby="hero-title">
          <div className="hero-content">
            <div className="hero-badge" role="img" aria-label="Powered by AI badge">
              <span className="badge-icon" aria-hidden="true">
                ⚡
              </span>
              Powered by AI
            </div>

            <h1 className="hero-title" id="hero-title">
              Analyze Better.
              <br />
              <span className="hero-accent">Track. Understand.</span>
              <br />
              Dominate
            </h1>

            <p className="hero-description">
              Track Twitter sentiment in real-time and understand public opinion like never before. Get insights that
              help you make better decisions.
            </p>

            <form onSubmit={handleSubmit} className="search-form" role="search" aria-label="Tweet analysis search">
              <fieldset className="input-group">
                <legend className="sr-only">Search Parameters</legend>
                <label htmlFor="search-input" className="sr-only">
                  Search term or hashtag (Alt+S to focus)
                </label>
                <input
                  id="search-input"
                  ref={searchInputRef}
                  type="text"
                  placeholder="Enter search term or hashtag..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="search-input"
                  disabled={loading}
                  aria-describedby={error ? "search-error" : "search-help"}
                  aria-invalid={!!error}
                  required
                />
                <div id="search-help" className="sr-only">
                  Enter a search term, hashtag, or username to analyze tweets
                </div>

                <label htmlFor="count-input" className="sr-only">
                  Number of tweets to analyze (1-100)
                </label>
                <input
                  id="count-input"
                  ref={countInputRef}
                  type="number"
                  placeholder="Count"
                  value={count}
                  onChange={(e) => setCount(Number.parseInt(e.target.value) || 10)}
                  min="1"
                  max="100"
                  className="count-input"
                  disabled={loading}
                  aria-describedby="count-help"
                />
                <div id="count-help" className="sr-only">
                  Number of tweets to analyze, between 1 and 100
                </div>
              </fieldset>

              <button
                type="submit"
                className="analyze-btn"
                disabled={loading}
                ref={analyzeButtonRef}
                aria-describedby="analyze-help"
              >
                {loading ? <LoadingSpinner ariaLabel="Analyzing tweets" /> : "Analyze Tweets"}
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </button>
              <div id="analyze-help" className="sr-only">
                Press Alt+A to focus this button. Analyzes tweets for the entered search term.
              </div>
            </form>

            {error && (
              <div className="error-message" role="alert" id="search-error" aria-live="assertive">
                <span className="error-icon" aria-hidden="true">
                  ⚠️
                </span>
                {error}
                <span className="sr-only">Press Escape to dismiss this error.</span>
              </div>
            )}

            <div className="hero-stats" aria-label="User statistics">
              <div className="stat-item">
                <div className="stat-avatars" role="img" aria-label="User avatars">
                  <div className="avatar" aria-hidden="true">
                    T
                  </div>
                  <div className="avatar" aria-hidden="true">
                    W
                  </div>
                  <div className="avatar" aria-hidden="true">
                    S
                  </div>
                  <div className="avatar" aria-hidden="true">
                    A
                  </div>
                </div>
                <span className="stat-text">Trusted by 1500+ developers</span>
              </div>
            </div>

            {/* Keyboard shortcuts help */}
            <div className="keyboard-shortcuts sr-only" role="region" aria-label="Keyboard shortcuts">
              <h3>Keyboard Shortcuts:</h3>
              <ul>
                <li>Alt + S: Focus search input</li>
                <li>Alt + A: Focus analyze button</li>
                <li>Alt + T: Toggle theme</li>
                <li>Escape: Clear error messages</li>
                <li>Tab: Navigate between elements</li>
                <li>Enter/Space: Activate buttons and links</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Right Panel - Dashboard */}
        <section className="right-panel" aria-labelledby="dashboard-title">
          <div className="dashboard-window">
            <header className="window-header">
              <div className="window-controls" aria-hidden="true">
                <span className="control red"></span>
                <span className="control yellow"></span>
                <span className="control green"></span>
              </div>
              <div className="window-title" id="dashboard-title">
                <span className="title-icon" aria-hidden="true">
                  📊
                </span>
                SentimentX Analytics
              </div>
              <div className="goals-indicator" aria-label="Analysis progress">
                <span className="goals-text">Today's Analysis</span>
                <span className="goals-count">
                  {tweets.length}/{count} <span className="goals-status">completed</span>
                </span>
              </div>
            </header>

            <div className="dashboard-content" role="region" aria-labelledby="dashboard-title">
              {!analysisStarted ? (
                <div className="dashboard-placeholder" role="status">
                  <div className="placeholder-icon" aria-hidden="true">
                    📈
                  </div>
                  <h3>Ready to Analyze</h3>
                  <p>Enter a search term to start analyzing Twitter sentiment</p>
                </div>
              ) : (
                <>
                  <header className="stats-header">
                    <h2 className="stats-title">Your Analysis Results</h2>
                    <time className="stats-date" dateTime={new Date().toISOString()}>
                      {new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  </header>

                  <div className="stats-grid" role="region" aria-label="Analysis statistics">
                    <div className="stat-card" role="group" aria-labelledby="total-tweets-label">
                      <div className="stat-header">
                        <span className="stat-label" id="total-tweets-label">
                          Total Tweets
                        </span>
                        <span className="stat-trend positive" aria-label={`Increase of ${tweets.length} tweets`}>
                          +{tweets.length}
                        </span>
                      </div>
                      <div className="stat-value" aria-describedby="total-tweets-label">
                        {tweets.length}
                      </div>
                      <div className="stat-subtitle">analyzed</div>
                    </div>

                    <div className="stat-card" role="group" aria-labelledby="sentiment-score-label">
                      <div className="stat-header">
                        <span className="stat-label" id="sentiment-score-label">
                          Sentiment Score
                        </span>
                        <span
                          className="stat-trend positive"
                          aria-label={`${sentimentStats.positivePercentage > 50 ? "Trending up" : "Trending down"} ${Math.round(sentimentStats.positivePercentage)}%`}
                        >
                          {sentimentStats.positivePercentage > 50 ? "↗" : "↘"}
                          {Math.round(sentimentStats.positivePercentage)}%
                        </span>
                      </div>
                      <div className="stat-value" aria-describedby="sentiment-score-label">
                        {sentimentStats.positivePercentage > 50
                          ? "Positive"
                          : sentimentStats.negativePercentage > 50
                            ? "Negative"
                            : "Neutral"}
                      </div>
                      <div className="stat-subtitle">overall sentiment</div>
                    </div>
                  </div>

                  <section className="progress-section" aria-labelledby="sentiment-breakdown-title">
                    <h3 className="section-title" id="sentiment-breakdown-title">
                      <span className="title-icon" aria-hidden="true">
                        ⏱️
                      </span>
                      Sentiment Breakdown
                    </h3>

                    <ProgressBar
                      label="Positive"
                      value={sentimentStats.positive}
                      max={sentimentStats.total}
                      color="#10B981"
                    />
                    <ProgressBar
                      label="Negative"
                      value={sentimentStats.negative}
                      max={sentimentStats.total}
                      color="#EF4444"
                    />
                    <ProgressBar
                      label="Neutral"
                      value={sentimentStats.neutral}
                      max={sentimentStats.total}
                      color="#6B7280"
                    />
                  </section>

                  <section className="rank-section" aria-labelledby="rank-title">
                    <div className="rank-card" role="group" aria-labelledby="rank-title">
                      <div className="rank-header">
                        <span className="rank-icon" aria-hidden="true">
                          🏆
                        </span>
                        <span className="rank-label" id="rank-title">
                          Analysis Rank
                        </span>
                      </div>
                      <div className="rank-value" aria-describedby="rank-title">
                        #1
                      </div>
                      <div className="rank-change" aria-label="Rank increased by 3 positions from yesterday">
                        <span className="rank-arrow" aria-hidden="true">
                          ↗
                        </span>
                        <span className="rank-text">+3 from yesterday</span>
                      </div>
                    </div>
                  </section>

                  {tweets.length > 0 && (
                    <section className="tweets-section" aria-labelledby="tweets-title">
                      <h3 className="section-title" id="tweets-title">
                        <span className="title-icon" aria-hidden="true">
                          🐦
                        </span>
                        Recent Tweets
                      </h3>
                      <div
                        className="tweets-container"
                        role="feed"
                        aria-label="Recent analyzed tweets"
                        aria-describedby="tweets-help"
                      >
                        <div id="tweets-help" className="sr-only">
                          Use Tab to navigate through tweets. Press Enter or Space to interact with a tweet.
                        </div>
                        {tweets.slice(0, 3).map((tweet, index) => (
                          <TweetCard key={tweet.id} tweet={tweet} index={index} />
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

// Main App component with providers
export default function App() {
  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <AppContent />
      </AccessibilityProvider>
    </ThemeProvider>
  )
}
