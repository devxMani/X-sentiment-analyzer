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

// Accessibility Context
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

    clearTimeout(announcementTimeoutRef.current)
    announcementTimeoutRef.current = setTimeout(() => {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id))
    }, 1000)
  }

  return (
    <AccessibilityContext.Provider value={{ announce }}>
      {children}
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

// Mock data
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
    verified: true,
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
    verified: false,
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
    verified: true,
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
    verified: false,
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
    verified: true,
  },
]

// Enhanced Loading Spinner
const LoadingSpinner = ({ ariaLabel = "Loading" }) => (
  <div className="loading-spinner" role="status" aria-label={ariaLabel}>
    <div className="spinner-container">
      <div className="spinner-ring"></div>
      <div className="spinner-ring spinner-ring-2"></div>
      <div className="spinner-ring spinner-ring-3"></div>
    </div>
    <span className="sr-only">{ariaLabel}</span>
  </div>
)

// Enhanced Sentiment Badge
const SentimentBadge = ({ sentiment }) => {
  const sentimentConfig = {
    positive: {
      icon: "✨",
      color: "#10B981",
      bg: "rgba(16, 185, 129, 0.15)",
      label: "Positive sentiment",
      glow: "0 0 20px rgba(16, 185, 129, 0.3)",
    },
    negative: {
      icon: "⚠️",
      color: "#EF4444",
      bg: "rgba(239, 68, 68, 0.15)",
      label: "Negative sentiment",
      glow: "0 0 20px rgba(239, 68, 68, 0.3)",
    },
    neutral: {
      icon: "⚖️",
      color: "#6B7280",
      bg: "rgba(107, 114, 128, 0.15)",
      label: "Neutral sentiment",
      glow: "0 0 20px rgba(107, 114, 128, 0.3)",
    },
  }

  const config = sentimentConfig[sentiment] || sentimentConfig.neutral

  return (
    <span
      className="sentiment-badge"
      style={{
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.color}40`,
        boxShadow: config.glow,
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

// Enhanced Tweet Card
const TweetCard = ({ tweet, index }) => {
  const cardRef = useRef()
  const [isHovered, setIsHovered] = useState(false)

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      console.log("Tweet selected:", tweet.id)
    }
  }

  return (
    <article
      className={`tweet-card ${isHovered ? "hovered" : ""}`}
      style={{ animationDelay: `${index * 0.1}s` }}
      ref={cardRef}
      tabIndex="0"
      role="article"
      aria-labelledby={`tweet-${tweet.id}-user`}
      aria-describedby={`tweet-${tweet.id}-content tweet-${tweet.id}-sentiment tweet-${tweet.id}-stats`}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="tweet-glow"></div>
      <header className="tweet-header">
        <div className="tweet-user">
          <div className="user-avatar-container">
            <div className="user-avatar" aria-hidden="true" role="img" aria-label={`${tweet.user} avatar`}>
              {tweet.user.charAt(0).toUpperCase()}
            </div>
            {tweet.verified && (
              <div className="verified-badge" aria-label="Verified account">
                ✓
              </div>
            )}
          </div>
          <div className="user-info">
            <span className="username" id={`tweet-${tweet.id}-user`}>
              @{tweet.user}
            </span>
            <span className="user-handle">
              {tweet.user.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </span>
          </div>
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
              💖
            </span>
            <span className="stat-value">{tweet.likes.toLocaleString()}</span>
          </span>
          <span className="stat" aria-label={`${tweet.retweets} retweets`}>
            <span className="stat-icon" aria-hidden="true">
              🔄
            </span>
            <span className="stat-value">{tweet.retweets.toLocaleString()}</span>
          </span>
          <span className="stat" aria-label={`${tweet.replies} replies`}>
            <span className="stat-icon" aria-hidden="true">
              💬
            </span>
            <span className="stat-value">{tweet.replies.toLocaleString()}</span>
          </span>
        </div>
      </footer>
    </article>
  )
}

// Enhanced Progress Bar
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
        <div className="progress-track"></div>
        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            boxShadow: `0 0 20px ${color}60, inset 0 1px 0 rgba(255,255,255,0.2)`,
          }}
        ></div>
        <div className="progress-shine"></div>
      </div>
      <div className="progress-percentage" id={`${progressId}-percentage`}>
        {Math.round(percentage)}% complete
      </div>
    </div>
  )
}

// Enhanced Theme Toggle
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
        <div className="toggle-stars">
          <span className="star star-1">✦</span>
          <span className="star star-2">✧</span>
          <span className="star star-3">✦</span>
        </div>
      </div>
      <span className="sr-only">
        Theme toggle. Current theme: {theme}. Press to switch to {theme === "dark" ? "light" : "dark"} mode.
      </span>
    </button>
  )
}

// Floating Particles Background
const FloatingParticles = () => {
  return (
    <div className="floating-particles">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  )
}

// Chart Export Utilities
const exportChart = async (chartRef, filename, format = "png", options = {}) => {
  if (!chartRef.current) return

  const { width = 800, height = 600, backgroundColor = "transparent", quality = 1, includeWatermark = true } = options

  try {
    const svgElement = chartRef.current.querySelector("svg")
    if (!svgElement) throw new Error("No SVG found in chart")

    // Clone the SVG to avoid modifying the original
    const clonedSvg = svgElement.cloneNode(true)

    // Set dimensions
    clonedSvg.setAttribute("width", width)
    clonedSvg.setAttribute("height", height)

    // Add premium styling
    const defs = clonedSvg.querySelector("defs") || document.createElementNS("http://www.w3.org/2000/svg", "defs")
    if (!clonedSvg.querySelector("defs")) {
      clonedSvg.insertBefore(defs, clonedSvg.firstChild)
    }

    // Add premium background gradient
    const bgGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient")
    bgGradient.setAttribute("id", "export-bg-gradient")
    bgGradient.setAttribute("x1", "0%")
    bgGradient.setAttribute("y1", "0%")
    bgGradient.setAttribute("x2", "100%")
    bgGradient.setAttribute("y2", "100%")

    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop")
    stop1.setAttribute("offset", "0%")
    stop1.setAttribute("stop-color", "#0a0a0a")

    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop")
    stop2.setAttribute("offset", "100%")
    stop2.setAttribute("stop-color", "#1a1a1a")

    bgGradient.appendChild(stop1)
    bgGradient.appendChild(stop2)
    defs.appendChild(bgGradient)

    // Add background rectangle
    const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    bgRect.setAttribute("width", "100%")
    bgRect.setAttribute("height", "100%")
    bgRect.setAttribute("fill", backgroundColor === "transparent" ? "url(#export-bg-gradient)" : backgroundColor)
    bgRect.setAttribute("rx", "20")
    clonedSvg.insertBefore(bgRect, clonedSvg.firstChild.nextSibling)

    // Add watermark if enabled
    if (includeWatermark) {
      const watermark = document.createElementNS("http://www.w3.org/2000/svg", "text")
      watermark.setAttribute("x", width - 10)
      watermark.setAttribute("y", height - 10)
      watermark.setAttribute("text-anchor", "end")
      watermark.setAttribute("font-family", "Inter, sans-serif")
      watermark.setAttribute("font-size", "12")
      watermark.setAttribute("font-weight", "500")
      watermark.setAttribute("fill", "#888888")
      watermark.setAttribute("opacity", "0.7")
      watermark.textContent = "SentimentX Analytics"
      clonedSvg.appendChild(watermark)
    }

    if (format === "svg") {
      // Export as SVG
      const serializer = new XMLSerializer()
      const svgString = serializer.serializeToString(clonedSvg)
      const blob = new Blob([svgString], { type: "image/svg+xml" })
      downloadBlob(blob, `${filename}.svg`)
    } else {
      // Export as PNG
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      canvas.width = width
      canvas.height = height

      const img = new Image()
      img.crossOrigin = "anonymous"

      return new Promise((resolve, reject) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height)
          canvas.toBlob(
            (blob) => {
              if (blob) {
                downloadBlob(blob, `${filename}.png`)
                resolve()
              } else {
                reject(new Error("Failed to create blob"))
              }
            },
            "image/png",
            quality,
          )
        }

        img.onerror = reject

        const serializer = new XMLSerializer()
        const svgString = serializer.serializeToString(clonedSvg)
        const svgBlob = new Blob([svgString], { type: "image/svg+xml" })
        const url = URL.createObjectURL(svgBlob)
        img.src = url
      })
    }
  } catch (error) {
    console.error("Export failed:", error)
    throw error
  }
}

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Export Modal Component
const ExportModal = ({ isOpen, onClose, onExport, chartTitle }) => {
  const [exportOptions, setExportOptions] = useState({
    format: "png",
    width: 800,
    height: 600,
    quality: 0.9,
    includeWatermark: true,
    backgroundColor: "transparent",
  })

  const handleExport = async () => {
    try {
      await onExport(exportOptions)
      onClose()
    } catch (error) {
      console.error("Export failed:", error)
      alert("❌ Export failed. Please check console for details.")
    }
  }

  if (!isOpen) return null

  return (
    <div className="export-modal-overlay" onClick={onClose}>
      <div className="export-modal" onClick={(e) => e.stopPropagation()}>
        <div className="export-modal-header">
          <h3 className="export-modal-title">
            <span className="export-icon">📤</span>
            Export Chart: {chartTitle}
          </h3>
          <button className="export-modal-close" onClick={onClose} aria-label="Close export modal">
            ✕
          </button>
        </div>

        <div className="export-modal-content">
          <div className="export-options">
            <h4 className="export-options-title">Export Options</h4>

            <div className="export-option-group">
              <label className="export-label">Format</label>
              <div className="format-selector">
                <button
                  className={`format-btn ${exportOptions.format === "png" ? "active" : ""}`}
                  onClick={() => setExportOptions((prev) => ({ ...prev, format: "png" }))}
                >
                  PNG
                </button>
                <button
                  className={`format-btn ${exportOptions.format === "svg" ? "active" : ""}`}
                  onClick={() => setExportOptions((prev) => ({ ...prev, format: "svg" }))}
                >
                  SVG
                </button>
              </div>
            </div>

            <div className="export-option-group">
              <label className="export-label">Background Color</label>
              <div className="color-selector">
                <button
                  className={`color-btn ${exportOptions.backgroundColor === "transparent" ? "active" : ""}`}
                  onClick={() => setExportOptions((prev) => ({ ...prev, backgroundColor: "transparent" }))}
                >
                  Transparent
                </button>
                <button
                  className={`color-btn ${exportOptions.backgroundColor === "#ffffff" ? "active" : ""}`}
                  onClick={() => setExportOptions((prev) => ({ ...prev, backgroundColor: "#ffffff" }))}
                  style={{ backgroundColor: "#ffffff", color: "#333" }}
                >
                  White
                </button>
                <button
                  className={`color-btn ${exportOptions.backgroundColor === "#000000" ? "active" : ""}`}
                  onClick={() => setExportOptions((prev) => ({ ...prev, backgroundColor: "#000000" }))}
                  style={{ backgroundColor: "#000000", color: "#fff" }}
                >
                  Black
                </button>
              </div>
            </div>

            <div className="export-option-group">
              <label className="export-checkbox-container">
                <input
                  type="checkbox"
                  checked={exportOptions.includeWatermark}
                  onChange={(e) => setExportOptions((prev) => ({ ...prev, includeWatermark: e.target.checked }))}
                  className="export-checkbox"
                />
                <span className="export-checkbox-label">Include SentimentX watermark</span>
              </label>
            </div>
          </div>
        </div>

        <div className="export-modal-footer">
          <button className="export-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="export-btn-export" onClick={handleExport}>
            <span className="export-btn-icon">📤</span>
            Export Chart
          </button>
        </div>
      </div>
    </div>
  )
}

// Export Button Component
const ExportButton = ({ onExport, chartTitle, className = "" }) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="export-button-container">
      <button
        className={`export-button ${className}`}
        onClick={onExport}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label={`Export ${chartTitle} chart`}
      >
        <span className="export-button-icon">📤</span>
      </button>
      {showTooltip && <div className="export-tooltip">Export Chart</div>}
    </div>
  )
}

// Social Media and Cloud Sharing Utilities
const shareToSocialMedia = async (chartRef, chartTitle, platform, options = {}) => {
  if (!chartRef.current) return

  try {
    // Generate image for sharing
    const canvas = await chartToCanvas(chartRef, {
      width: 1200,
      height: 630, // Optimal for social media
      backgroundColor: "gradient",
      includeWatermark: true,
      ...options,
    })

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png", 0.9))

    switch (platform) {
      case "twitter":
        await shareToTwitter(chartTitle, blob, options.message)
        break
      case "linkedin":
        await shareToLinkedIn(chartTitle, blob, options.message)
        break
      case "facebook":
        await shareToFacebook(chartTitle, blob, options.message)
        break
      case "instagram":
        await shareToInstagram(chartTitle, blob, options.message)
        break
      case "reddit":
        await shareToReddit(chartTitle, blob, options.message)
        break
      default:
        throw new Error(`Unsupported platform: ${platform}`)
    }
  } catch (error) {
    console.error(`Failed to share to ${platform}:`, error)
    throw error
  }
}

const shareToCloud = async (chartRef, filename, service, options = {}) => {
  if (!chartRef.current) return

  try {
    const format = options.format || "png"
    let blob

    if (format === "svg") {
      const svgElement = chartRef.current.querySelector("svg")
      const serializer = new XMLSerializer()
      const svgString = serializer.serializeToString(svgElement)
      blob = new Blob([svgString], { type: "image/svg+xml" })
    } else {
      const canvas = await chartToCanvas(chartRef, options)
      blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png", options.quality || 0.9))
    }

    switch (service) {
      case "googledrive":
        await shareToGoogleDrive(filename, blob, format)
        break
      case "dropbox":
        await shareToDropbox(filename, blob, format)
        break
      case "onedrive":
        await shareToOneDrive(filename, blob, format)
        break
      case "icloud":
        await shareToiCloud(filename, blob, format)
        break
      default:
        throw new Error(`Unsupported service: ${service}`)
    }
  } catch (error) {
    console.error(`Failed to share to ${service}:`, error)
    throw error
  }
}

// Helper function to convert chart to canvas
const chartToCanvas = async (chartRef, options = {}) => {
  const { width = 1200, height = 630, backgroundColor = "gradient", includeWatermark = true, quality = 0.9 } = options

  const svgElement = chartRef.current.querySelector("svg")
  if (!svgElement) throw new Error("No SVG found in chart")

  const clonedSvg = svgElement.cloneNode(true)
  clonedSvg.setAttribute("width", width)
  clonedSvg.setAttribute("height", height)

  // Add premium styling for sharing
  const defs = clonedSvg.querySelector("defs") || document.createElementNS("http://www.w3.org/2000/svg", "defs")
  if (!clonedSvg.querySelector("defs")) {
    clonedSvg.insertBefore(defs, clonedSvg.firstChild)
  }

  // Add background
  const bgGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient")
  bgGradient.setAttribute("id", "share-bg-gradient")
  bgGradient.setAttribute("x1", "0%")
  bgGradient.setAttribute("y1", "0%")
  bgGradient.setAttribute("x2", "100%")
  bgGradient.setAttribute("y2", "100%")

  const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop")
  stop1.setAttribute("offset", "0%")
  stop1.setAttribute("stop-color", "#0a0a0a")

  const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop")
  stop2.setAttribute("offset", "100%")
  stop2.setAttribute("stop-color", "#1a1a1a")

  bgGradient.appendChild(stop1)
  bgGradient.appendChild(stop2)
  defs.appendChild(bgGradient)

  const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
  bgRect.setAttribute("width", "100%")
  bgRect.setAttribute("height", "100%")
  bgRect.setAttribute("fill", backgroundColor === "gradient" ? "url(#share-bg-gradient)" : backgroundColor)
  bgRect.setAttribute("rx", "20")
  clonedSvg.insertBefore(bgRect, clonedSvg.firstChild.nextSibling)

  // Add watermark
  if (includeWatermark) {
    const watermark = document.createElementNS("http://www.w3.org/2000/svg", "text")
    watermark.setAttribute("x", width - 20)
    watermark.setAttribute("y", height - 20)
    watermark.setAttribute("text-anchor", "end")
    watermark.setAttribute("font-family", "Inter, sans-serif")
    watermark.setAttribute("font-size", "16")
    watermark.setAttribute("font-weight", "600")
    watermark.setAttribute("fill", "#FF6B35")
    watermark.setAttribute("opacity", "0.8")
    watermark.textContent = "SentimentX Analytics"
    clonedSvg.appendChild(watermark)
  }

  // Convert to canvas
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  canvas.width = width
  canvas.height = height

  const img = new Image()
  img.crossOrigin = "anonymous"

  return new Promise((resolve, reject) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas)
    }
    img.onerror = reject

    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(clonedSvg)
    const svgBlob = new Blob([svgString], { type: "image/svg+xml" })
    const url = URL.createObjectURL(svgBlob)
    img.src = url
  })
}

// Social Media Platform Implementations
const shareToTwitter = async (title, blob, message) => {
  const text =
    message || `📊 Check out this ${title} from SentimentX Analytics! #DataVisualization #Analytics #SentimentX`

  if (navigator.share) {
    await navigator.share({
      title: `SentimentX - ${title}`,
      text: text,
      files: [new File([blob], `${title.toLowerCase().replace(/\s+/g, "-")}.png`, { type: "image/png" })],
    })
  } else {
    // Fallback to Twitter Web Intent
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, "_blank", "width=550,height=420")
  }
}

const shareToLinkedIn = async (title, blob, message) => {
  const text =
    message ||
    `📊 Insights from SentimentX Analytics: ${title}. Leveraging AI-powered sentiment analysis for data-driven decisions. #Analytics #DataScience #BusinessIntelligence`

  if (navigator.share) {
    await navigator.share({
      title: `SentimentX Analytics - ${title}`,
      text: text,
      files: [new File([blob], `${title.toLowerCase().replace(/\s+/g, "-")}.png`, { type: "image/png" })],
    })
  } else {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
    window.open(url, "_blank", "width=550,height=420")
  }
}

const shareToFacebook = async (title, blob, message) => {
  const text = message || `📊 Check out this ${title} analysis from SentimentX!`

  if (navigator.share) {
    await navigator.share({
      title: `SentimentX Analytics - ${title}`,
      text: text,
      files: [new File([blob], `${title.toLowerCase().replace(/\s+/g, "-")}.png`, { type: "image/png" })],
    })
  } else {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
    window.open(url, "_blank", "width=550,height=420")
  }
}

const shareToInstagram = async (title, blob, message) => {
  // Instagram doesn't support direct web sharing, so we'll download the image
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${title.toLowerCase().replace(/\s+/g, "-")}-instagram.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  // Show instructions
  alert("📸 Image downloaded! Open Instagram and upload the image to share your analytics.")
}

const shareToReddit = async (title, blob, message) => {
  const text = message || `📊 ${title} - SentimentX Analytics Dashboard`

  if (navigator.share) {
    await navigator.share({
      title: text,
      files: [new File([blob], `${title.toLowerCase().replace(/\s+/g, "-")}.png`, { type: "image/png" })],
    })
  } else {
    const url = `https://www.reddit.com/submit?title=${encodeURIComponent(text)}`
    window.open(url, "_blank", "width=550,height=420")
  }
}

// Cloud Service Implementations
const shareToGoogleDrive = async (filename, blob, format) => {
  // This would typically use Google Drive API
  // For demo purposes, we'll download the file
  downloadBlob(blob, `${filename}.${format}`)
  alert("🔗 File ready for Google Drive! Upload the downloaded file to your Google Drive.")
}

const shareToDropbox = async (filename, blob, format) => {
  // This would typically use Dropbox API
  downloadBlob(blob, `${filename}.${format}`)
  alert("📦 File ready for Dropbox! Upload the downloaded file to your Dropbox.")
}

const shareToOneDrive = async (filename, blob, format) => {
  // This would typically use OneDrive API
  downloadBlob(blob, `${filename}.${format}`)
  alert("☁️ File ready for OneDrive! Upload the downloaded file to your OneDrive.")
}

const shareToiCloud = async (filename, blob, format) => {
  // iCloud doesn't have a web API, so we'll use the native share if available
  if (navigator.share) {
    await navigator.share({
      title: filename,
      files: [new File([blob], `${filename}.${format}`, { type: format === "svg" ? "image/svg+xml" : "image/png" })],
    })
  } else {
    downloadBlob(blob, `${filename}.${format}`)
    alert("☁️ File downloaded! Use AirDrop or iCloud Drive to save to iCloud.")
  }
}

// Preset Sharing Messages and Formats
const SHARING_PRESETS = {
  audiences: {
    business: {
      name: "Business & Professional",
      icon: "💼",
      color: "#0077B5",
      description: "Professional insights for business audiences",
    },
    technical: {
      name: "Technical & Developers",
      icon: "⚡",
      color: "#FF6B35",
      description: "Technical analysis for developer communities",
    },
    marketing: {
      name: "Marketing & Growth",
      icon: "📈",
      color: "#10B981",
      description: "Marketing insights and growth metrics",
    },
    academic: {
      name: "Academic & Research",
      icon: "🎓",
      color: "#8B5CF6",
      description: "Research-focused content for academic audiences",
    },
    general: {
      name: "General Public",
      icon: "🌟",
      color: "#F59E0B",
      description: "Accessible insights for general audiences",
    },
    executive: {
      name: "Executive & Leadership",
      icon: "👔",
      color: "#EF4444",
      description: "Strategic insights for leadership teams",
    },
  },

  templates: {
    business: {
      twitter: {
        short:
          "📊 Latest {chartType} analysis shows {keyInsight}. Data-driven decisions lead to better outcomes. #BusinessIntelligence #Analytics #SentimentX",
        medium:
          "📊 Our {chartType} analysis reveals {keyInsight}. Key takeaway: {mainTrend}. This data helps inform strategic business decisions. #DataDriven #BusinessAnalytics #SentimentX",
        long: "📊 Deep dive into our {chartType} analysis:\n\n✅ {keyInsight}\n📈 {mainTrend}\n💡 {actionableInsight}\n\nData-driven insights for smarter business decisions. #BusinessIntelligence #Analytics #DataScience #SentimentX",
      },
      linkedin: {
        short:
          "Sharing insights from our latest {chartType} analysis. {keyInsight} - this data highlights the importance of continuous monitoring in business strategy. #BusinessIntelligence #DataAnalytics",
        medium:
          "📊 Key findings from our {chartType} analysis:\n\n{keyInsight}\n\nThis reinforces the value of {mainTrend} in driving business outcomes. Data-driven decision making continues to be crucial for competitive advantage.\n\n#BusinessStrategy #DataDriven #Analytics #Leadership",
        long: "📊 Strategic Insights: {chartType} Analysis\n\n🔍 Key Finding: {keyInsight}\n📈 Trend Analysis: {mainTrend}\n💼 Business Impact: {actionableInsight}\n\nIn today's competitive landscape, leveraging data analytics for strategic decision-making isn't just advantageous—it's essential. This analysis demonstrates how continuous monitoring and data-driven insights can inform better business outcomes.\n\nWhat trends are you seeing in your industry? I'd love to hear your thoughts.\n\n#BusinessIntelligence #DataAnalytics #Strategy #Leadership #Innovation",
      },
      facebook: {
        short: "📊 Check out these insights from our {chartType} analysis! {keyInsight} 💡",
        medium:
          "📊 Exciting findings from our latest {chartType} analysis!\n\n{keyInsight}\n\nThis data shows {mainTrend}, which is crucial for understanding market dynamics. Love seeing data tell a story! 📈",
        long: "📊 Data Story Time! 📈\n\nJust completed a fascinating {chartType} analysis and wanted to share some key insights:\n\n✨ {keyInsight}\n📊 {mainTrend}\n💡 {actionableInsight}\n\nIt's amazing how data can reveal patterns and guide better decisions. What insights have surprised you lately?\n\n#DataAnalytics #BusinessInsights #DataScience",
      },
    },

    technical: {
      twitter: {
        short:
          "⚡ {chartType} implementation showing {keyInsight}. Built with advanced analytics pipeline. #DataEngineering #Analytics #TechStack",
        medium:
          "⚡ Technical deep-dive: {chartType} analysis reveals {keyInsight}. Architecture: {mainTrend}. Performance optimized for real-time processing. #DataEngineering #Analytics #TechStack #SentimentX",
        long: "⚡ Technical Analysis: {chartType}\n\n🔧 Implementation: {keyInsight}\n📊 Performance: {mainTrend}\n⚙️ Optimization: {actionableInsight}\n\nBuilt with scalable architecture for real-time analytics. #DataEngineering #TechStack #Analytics #Performance",
      },
      linkedin: {
        short:
          "⚡ Technical implementation of {chartType} analysis yielding {keyInsight}. Interesting challenges in data processing and visualization optimization. #DataEngineering #TechLeadership",
        medium:
          "⚡ Technical Deep Dive: {chartType} Analysis\n\n🔧 Implementation: {keyInsight}\n📊 Architecture: {mainTrend}\n\nKey technical challenges included optimizing for real-time processing while maintaining data accuracy. The solution demonstrates scalable analytics architecture.\n\n#DataEngineering #TechArchitecture #Analytics #Performance",
        long: "⚡ Technical Case Study: {chartType} Analytics Implementation\n\n🏗️ Architecture Overview:\n• {keyInsight}\n• {mainTrend}\n• {actionableInsight}\n\n🔧 Technical Challenges:\n• Real-time data processing optimization\n• Scalable visualization rendering\n• Performance monitoring and alerting\n\n📊 Results:\nAchieved sub-second query response times with 99.9% uptime. The implementation showcases modern data engineering practices and scalable analytics architecture.\n\nInterested in the technical details? Happy to discuss the implementation approach.\n\n#DataEngineering #TechArchitecture #Analytics #ScalableDesign #Performance",
      },
    },

    marketing: {
      twitter: {
        short:
          "📈 {chartType} shows {keyInsight}! This trend is reshaping how we approach audience engagement. #MarketingAnalytics #GrowthHacking #DataDriven",
        medium:
          "📈 Marketing Insight: {chartType} analysis reveals {keyInsight}. Key trend: {mainTrend}. This data is game-changing for campaign optimization! #MarketingAnalytics #GrowthStrategy #DataDriven #SentimentX",
        long: "📈 Marketing Intelligence Update:\n\n🎯 Analysis: {chartType}\n📊 Key Finding: {keyInsight}\n🚀 Growth Opportunity: {mainTrend}\n💡 Action Item: {actionableInsight}\n\n#MarketingAnalytics #GrowthHacking #DataDriven #CampaignOptimization",
      },
      linkedin: {
        short:
          "📈 Marketing insights from {chartType} analysis: {keyInsight}. This data is reshaping our approach to audience engagement and campaign optimization. #MarketingStrategy #DataDriven",
        medium:
          "📈 Marketing Intelligence: {chartType} Analysis\n\n🎯 Key Insight: {keyInsight}\n📊 Trend Analysis: {mainTrend}\n\nThis data is transforming how we approach audience segmentation and campaign optimization. The implications for marketing strategy are significant.\n\n#MarketingStrategy #DataDriven #AudienceInsights #CampaignOptimization",
        long: "📈 Marketing Strategy Insights: {chartType} Deep Dive\n\n🎯 Executive Summary:\n• {keyInsight}\n• {mainTrend}\n• {actionableInsight}\n\n📊 Strategic Implications:\nThis analysis reveals critical patterns in audience behavior that directly impact campaign performance and ROI. The data suggests a shift in engagement patterns that marketers need to address.\n\n🚀 Next Steps:\n• Optimize targeting based on these insights\n• Adjust campaign messaging and timing\n• Implement data-driven attribution modeling\n\nHow are you leveraging analytics to drive marketing performance? Would love to hear your strategies.\n\n#MarketingStrategy #DataDriven #AudienceInsights #CampaignOptimization #MarketingAnalytics",
      },
    },

    academic: {
      twitter: {
        short:
          "🎓 Research findings: {chartType} analysis demonstrates {keyInsight}. Methodology and data available for peer review. #AcademicResearch #DataScience #Research",
        medium:
          "🎓 Academic Insight: {chartType} analysis reveals {keyInsight}. Methodology: {mainTrend}. Peer review and collaboration welcome. #AcademicResearch #DataScience #Research #SentimentX",
        long: "🎓 Research Publication: {chartType} Study\n\n📋 Findings: {keyInsight}\n🔬 Methodology: {mainTrend}\n📊 Implications: {actionableInsight}\n\nOpen to peer review and academic collaboration. #AcademicResearch #DataScience #Research",
      },
      linkedin: {
        short:
          "🎓 Academic research: {chartType} analysis yields {keyInsight}. Methodology follows rigorous statistical standards. Open to peer collaboration. #AcademicResearch #DataScience",
        medium:
          "🎓 Research Findings: {chartType} Analysis\n\n📊 Key Result: {keyInsight}\n🔬 Methodology: {mainTrend}\n\nThis study follows rigorous academic standards and is open for peer review. The implications for the field are significant.\n\n#AcademicResearch #DataScience #PeerReview #Research",
        long: "🎓 Academic Publication: {chartType} Analysis Study\n\n📋 Abstract:\nThis research presents {keyInsight} through comprehensive {chartType} analysis. The study employs {mainTrend} methodology with statistical significance testing.\n\n🔬 Key Findings:\n• {keyInsight}\n• {mainTrend}\n• {actionableInsight}\n\n📊 Methodology:\nRigorous statistical analysis with peer-reviewed protocols. Data collection and analysis methods available for replication.\n\n🤝 Collaboration:\nSeeking peer review and academic collaboration. Open to sharing datasets and methodology for further research.\n\n#AcademicResearch #DataScience #PeerReview #Research #Statistics #Academia",
      },
    },

    general: {
      twitter: {
        short:
          "🌟 Interesting data insight: {keyInsight}! Sometimes the numbers tell fascinating stories. 📊 #DataStory #Insights #Analytics",
        medium:
          "🌟 Cool data discovery! Our {chartType} shows {keyInsight}. It's amazing what patterns emerge when you look at the data. {mainTrend} 📊 #DataStory #Insights #Analytics #SentimentX",
        long: "🌟 Data Story Time! 📊\n\n🔍 What we found: {keyInsight}\n📈 The pattern: {mainTrend}\n💡 Why it matters: {actionableInsight}\n\nLove how data can reveal surprising insights! #DataStory #Insights #Analytics",
      },
      facebook: {
        short: "🌟 Found something interesting in the data! {keyInsight} 📊 Love when numbers tell a story!",
        medium:
          "🌟 Data discovery time! 📊\n\nJust analyzed some {chartType} data and found {keyInsight}. The trend shows {mainTrend}, which is pretty fascinating!\n\nIt's amazing what stories data can tell when you know how to look. What interesting patterns have you noticed lately?",
        long: "🌟 Fascinating Data Discovery! 📊✨\n\nSpent some time diving into {chartType} analysis and uncovered some really interesting patterns:\n\n🔍 Key Finding: {keyInsight}\n📈 The Trend: {mainTrend}\n💡 What This Means: {actionableInsight}\n\nI love how data can reveal unexpected insights and help us understand the world better. It's like being a detective, but with numbers! 🕵️‍♀️\n\nHave you come across any surprising data insights lately? Would love to hear what you've discovered!\n\n#DataStory #Insights #Analytics #CuriousMinds",
      },
    },

    executive: {
      linkedin: {
        short:
          "👔 Strategic insight from {chartType} analysis: {keyInsight}. This data informs our leadership decisions and strategic direction. #ExecutiveInsights #Leadership",
        medium:
          "👔 Executive Brief: {chartType} Analysis\n\n📊 Strategic Finding: {keyInsight}\n🎯 Business Impact: {mainTrend}\n\nThis analysis directly informs our strategic planning and resource allocation decisions. Data-driven leadership continues to be our competitive advantage.\n\n#ExecutiveInsights #Leadership #Strategy #DataDriven",
        long: "👔 Executive Strategic Brief: {chartType} Analysis\n\n📊 Executive Summary:\n• Strategic Finding: {keyInsight}\n• Market Implication: {mainTrend}\n• Recommended Action: {actionableInsight}\n\n🎯 Leadership Perspective:\nThis analysis provides critical insights for strategic decision-making and resource allocation. The data supports our thesis on market positioning and validates our investment strategy.\n\n📈 Business Impact:\nThe findings directly influence our quarterly planning and long-term strategic initiatives. This reinforces the importance of data-driven leadership in today's competitive landscape.\n\n🤝 Stakeholder Value:\nSharing these insights with our leadership team and board to ensure alignment on strategic priorities and market opportunities.\n\nHow are you leveraging data analytics in your strategic planning process?\n\n#ExecutiveInsights #Leadership #Strategy #DataDriven #BoardGovernance #StrategicPlanning",
      },
    },
  },

  variables: {
    chartType: {
      "Weekly Positive Sentiment": "sentiment trend",
      "Sentiment Distribution": "sentiment breakdown",
      "Engagement Trend": "engagement pattern",
      "Real-time Activity": "activity monitoring",
      "Sentiment Trends": "temporal analysis",
    },
    keyInsight: {
      positive: [
        "positive sentiment increased by 23%",
        "engagement rates are trending upward",
        "user satisfaction shows significant improvement",
        "brand perception has strengthened considerably",
        "audience response exceeded expectations",
      ],
      negative: [
        "sentiment shows concerning downward trend",
        "engagement rates require immediate attention",
        "user feedback indicates areas for improvement",
        "market response suggests strategy adjustment needed",
        "performance metrics highlight optimization opportunities",
      ],
      neutral: [
        "sentiment remains stable across all metrics",
        "engagement patterns show consistent performance",
        "user behavior demonstrates predictable trends",
        "market conditions remain steady",
        "performance indicators maintain baseline levels",
      ],
    },
    mainTrend: {
      business: [
        "customer satisfaction directly correlates with retention",
        "market positioning strategy is yielding results",
        "operational efficiency improvements are measurable",
        "competitive advantage is becoming more apparent",
        "ROI optimization strategies are proving effective",
      ],
      technical: [
        "system performance optimization yielding 40% improvement",
        "real-time processing architecture scaling effectively",
        "data pipeline efficiency increased significantly",
        "API response times improved by 60%",
        "infrastructure costs reduced while maintaining performance",
      ],
      marketing: [
        "audience engagement peaks during specific time windows",
        "content personalization drives 35% higher conversion",
        "multi-channel attribution reveals hidden opportunities",
        "campaign optimization reduces CAC by 28%",
        "audience segmentation improves targeting precision",
      ],
    },
    actionableInsight: {
      business: [
        "recommend increasing investment in high-performing segments",
        "suggest implementing customer feedback loop improvements",
        "propose expanding successful strategies to new markets",
        "advise optimizing resource allocation based on data",
        "recommend strategic partnership opportunities",
      ],
      technical: [
        "implement automated scaling for peak traffic periods",
        "optimize database queries for improved performance",
        "deploy caching strategies for frequently accessed data",
        "enhance monitoring and alerting systems",
        "upgrade infrastructure to support growth projections",
      ],
      marketing: [
        "optimize campaign timing based on engagement patterns",
        "increase budget allocation to high-converting channels",
        "implement dynamic content personalization",
        "expand successful creative formats across campaigns",
        "develop retention strategies for high-value segments",
      ],
    },
  },
}

// Smart message generation function
const generateSmartMessage = (platform, audience, length, chartTitle, sentimentData) => {
  const template = SHARING_PRESETS.templates[audience]?.[platform]?.[length]
  if (!template) return null

  // Determine sentiment context
  const sentimentContext =
    sentimentData?.positivePercentage > 50
      ? "positive"
      : sentimentData?.negativePercentage > 50
        ? "negative"
        : "neutral"

  // Get chart type mapping
  const chartType = SHARING_PRESETS.variables.chartType[chartTitle] || "data analysis"

  // Get random insights based on context
  const keyInsights = SHARING_PRESETS.variables.keyInsight[sentimentContext]
  const mainTrends = SHARING_PRESETS.variables.mainTrend[audience] || SHARING_PRESETS.variables.mainTrend.business
  const actionableInsights =
    SHARING_PRESETS.variables.actionableInsight[audience] || SHARING_PRESETS.variables.actionableInsight.business

  const keyInsight = keyInsights[Math.floor(Math.random() * keyInsights.length)]
  const mainTrend = mainTrends[Math.floor(Math.random() * mainTrends.length)]
  const actionableInsight = actionableInsights[Math.floor(Math.random() * actionableInsights.length)]

  // Replace template variables
  return template
    .replace(/\{chartType\}/g, chartType)
    .replace(/\{keyInsight\}/g, keyInsight)
    .replace(/\{mainTrend\}/g, mainTrend)
    .replace(/\{actionableInsight\}/g, actionableInsight)
}

// Enhanced Share Modal Component with Presets
const ShareModal = ({ isOpen, onClose, onShare, chartTitle }) => {
  const [shareType, setShareType] = useState("social")
  const [selectedPlatform, setSelectedPlatform] = useState("")
  const [selectedAudience, setSelectedAudience] = useState("business")
  const [messageLength, setMessageLength] = useState("medium")
  const [customMessage, setCustomMessage] = useState("")
  const [usePreset, setUsePreset] = useState(true)
  const [isSharing, setIsSharing] = useState(false)
  const [shareOptions, setShareOptions] = useState({
    includeWatermark: true,
    format: "png",
    quality: 0.9,
  })

  // Get sentiment data for smart message generation
  const sentimentData = React.useMemo(() => {
    // This would come from your actual sentiment analysis
    return {
      positivePercentage: 65,
      negativePercentage: 20,
      neutralPercentage: 15,
    }
  }, [])

  // Generate smart message when preset options change
  const generatedMessage = React.useMemo(() => {
    if (!usePreset || !selectedPlatform || !selectedAudience) return ""
    return generateSmartMessage(selectedPlatform, selectedAudience, messageLength, chartTitle, sentimentData)
  }, [usePreset, selectedPlatform, selectedAudience, messageLength, chartTitle, sentimentData])

  // Update custom message when generated message changes
  React.useEffect(() => {
    if (usePreset && generatedMessage) {
      setCustomMessage(generatedMessage)
    }
  }, [usePreset, generatedMessage])

  const socialPlatforms = [
    {
      id: "twitter",
      name: "Twitter",
      icon: "🐦",
      color: "#1DA1F2",
      description: "Share to Twitter feed",
      maxLength: 280,
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: "💼",
      color: "#0077B5",
      description: "Share to LinkedIn network",
      maxLength: 3000,
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: "📘",
      color: "#1877F2",
      description: "Share to Facebook timeline",
      maxLength: 63206,
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: "📸",
      color: "#E4405F",
      description: "Download for Instagram",
      maxLength: 2200,
    },
    {
      id: "reddit",
      name: "Reddit",
      icon: "🤖",
      color: "#FF4500",
      description: "Share to Reddit community",
      maxLength: 40000,
    },
  ]

  const cloudServices = [
    { id: "googledrive", name: "Google Drive", icon: "📁", color: "#4285F4", description: "Save to Google Drive" },
    { id: "dropbox", name: "Dropbox", icon: "📦", color: "#0061FF", description: "Save to Dropbox" },
    { id: "onedrive", name: "OneDrive", icon: "☁️", color: "#0078D4", description: "Save to OneDrive" },
    { id: "icloud", name: "iCloud", icon: "☁️", color: "#007AFF", description: "Save to iCloud Drive" },
  ]

  const handleShare = async () => {
    if (!selectedPlatform) return

    setIsSharing(true)
    try {
      const shareOptionsWithMessage = {
        ...shareOptions,
        message: customMessage,
        audience: selectedAudience,
        messageLength: messageLength,
      }

      if (shareType === "social") {
        await onShare("social", selectedPlatform, shareOptionsWithMessage)
      } else {
        await onShare("cloud", selectedPlatform, shareOptionsWithMessage)
      }
      onClose()
    } catch (error) {
      console.error("Share failed:", error)
      alert("❌ Sharing failed. Please try again.")
    } finally {
      setIsSharing(false)
    }
  }

  const selectedPlatformData =
    shareType === "social"
      ? socialPlatforms.find((p) => p.id === selectedPlatform)
      : cloudServices.find((p) => p.id === selectedPlatform)

  const currentAudience = SHARING_PRESETS.audiences[selectedAudience]

  if (!isOpen) return null

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal enhanced-share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <h3 className="share-modal-title">
            <span className="share-icon">🚀</span>
            Share Chart: {chartTitle}
          </h3>
          <button className="share-modal-close" onClick={onClose} aria-label="Close share modal">
            ✕
          </button>
        </div>

        <div className="share-modal-content">
          {/* Share Type Selector */}
          <div className="share-type-selector">
            <button
              className={`share-type-btn ${shareType === "social" ? "active" : ""}`}
              onClick={() => setShareType("social")}
            >
              <span className="share-type-icon">📱</span>
              Social Media
            </button>
            <button
              className={`share-type-btn ${shareType === "cloud" ? "active" : ""}`}
              onClick={() => setShareType("cloud")}
            >
              <span className="share-type-icon">☁️</span>
              Cloud Storage
            </button>
          </div>

          {/* Platform Selection */}
          <div className="share-platforms">
            {(shareType === "social" ? socialPlatforms : cloudServices).map((platform) => (
              <button
                key={platform.id}
                className={`share-platform ${selectedPlatform === platform.id ? "selected" : ""}`}
                onClick={() => setSelectedPlatform(platform.id)}
                style={{ "--platform-color": platform.color }}
              >
                <div className="platform-header">
                  <span className="platform-icon">{platform.icon}</span>
                  <span className="platform-name">{platform.name}</span>
                </div>
                <span className="platform-description">{platform.description}</span>
                {platform.maxLength && <span className="platform-limit">Max: {platform.maxLength} chars</span>}
              </button>
            ))}
          </div>

          {/* Message Presets (only for social media) */}
          {shareType === "social" && selectedPlatform && (
            <div className="message-presets-section">
              <div className="presets-header">
                <h4 className="presets-title">
                  <span className="presets-icon">✨</span>
                  Smart Message Templates
                </h4>
                <div className="preset-toggle">
                  <label className="toggle-container">
                    <input
                      type="checkbox"
                      checked={usePreset}
                      onChange={(e) => setUsePreset(e.target.checked)}
                      className="preset-checkbox"
                    />
                    <span className="toggle-slider"></span>
                    <span className="toggle-label">Use Smart Templates</span>
                  </label>
                </div>
              </div>

              {usePreset && (
                <>
                  {/* Audience Selection */}
                  <div className="audience-selector">
                    <label className="selector-label">Target Audience</label>
                    <div className="audience-grid">
                      {Object.entries(SHARING_PRESETS.audiences).map(([key, audience]) => (
                        <button
                          key={key}
                          className={`audience-option ${selectedAudience === key ? "selected" : ""}`}
                          onClick={() => setSelectedAudience(key)}
                          style={{ "--audience-color": audience.color }}
                        >
                          <span className="audience-icon">{audience.icon}</span>
                          <span className="audience-name">{audience.name}</span>
                          <span className="audience-description">{audience.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message Length Selection */}
                  <div className="message-length-selector">
                    <label className="selector-label">Message Style</label>
                    <div className="length-options">
                      <button
                        className={`length-option ${messageLength === "short" ? "active" : ""}`}
                        onClick={() => setMessageLength("short")}
                      >
                        <span className="length-icon">⚡</span>
                        <span className="length-name">Concise</span>
                        <span className="length-description">Brief and impactful</span>
                      </button>
                      <button
                        className={`length-option ${messageLength === "medium" ? "active" : ""}`}
                        onClick={() => setMessageLength("medium")}
                      >
                        <span className="length-icon">📝</span>
                        <span className="length-name">Balanced</span>
                        <span className="length-description">Detailed with context</span>
                      </button>
                      <button
                        className={`length-option ${messageLength === "long" ? "active" : ""}`}
                        onClick={() => setMessageLength("long")}
                      >
                        <span className="length-icon">📚</span>
                        <span className="length-name">Comprehensive</span>
                        <span className="length-description">Full story with insights</span>
                      </button>
                    </div>
                  </div>

                  {/* Audience Preview */}
                  {currentAudience && (
                    <div className="audience-preview">
                      <div className="preview-header">
                        <span className="preview-icon">{currentAudience.icon}</span>
                        <span className="preview-title">Optimized for {currentAudience.name}</span>
                      </div>
                      <p className="preview-description">{currentAudience.description}</p>
                    </div>
                  )}
                </>
              )}

              {/* Message Editor */}
              <div className="message-editor">
                <div className="editor-header">
                  <label className="editor-label">
                    {usePreset ? "Generated Message (Editable)" : "Custom Message"}
                  </label>
                  {selectedPlatformData?.maxLength && (
                    <span
                      className={`character-count ${customMessage.length > selectedPlatformData.maxLength ? "over-limit" : ""}`}
                    >
                      {customMessage.length}/{selectedPlatformData.maxLength}
                    </span>
                  )}
                </div>
                <textarea
                  className="message-textarea"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder={usePreset ? "Smart message will appear here..." : "Write your custom message..."}
                  rows={6}
                  maxLength={selectedPlatformData?.maxLength}
                />
                {usePreset && (
                  <button
                    className="regenerate-btn"
                    onClick={() => {
                      const newMessage = generateSmartMessage(
                        selectedPlatform,
                        selectedAudience,
                        messageLength,
                        chartTitle,
                        sentimentData,
                      )
                      if (newMessage) setCustomMessage(newMessage)
                    }}
                  >
                    <span className="regenerate-icon">🔄</span>
                    Generate New Message
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Share Options */}
          <div className="share-options">
            <h4 className="share-options-title">Share Options</h4>

            <div className="share-option-group">
              <label className="share-checkbox-container">
                <input
                  type="checkbox"
                  checked={shareOptions.includeWatermark}
                  onChange={(e) => setShareOptions((prev) => ({ ...prev, includeWatermark: e.target.checked }))}
                  className="share-checkbox"
                />
                <span className="share-checkbox-label">Include SentimentX watermark</span>
              </label>
            </div>

            {shareType === "cloud" && (
              <div className="share-option-group">
                <label className="share-label">Format</label>
                <div className="format-selector">
                  <button
                    className={`format-btn ${shareOptions.format === "png" ? "active" : ""}`}
                    onClick={() => setShareOptions((prev) => ({ ...prev, format: "png" }))}
                  >
                    PNG
                  </button>
                  <button
                    className={`format-btn ${shareOptions.format === "svg" ? "active" : ""}`}
                    onClick={() => setShareOptions((prev) => ({ ...prev, format: "svg" }))}
                  >
                    SVG
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="share-modal-footer">
          <button className="share-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="share-btn-share"
            onClick={handleShare}
            disabled={!selectedPlatform || isSharing || (shareType === "social" && !customMessage.trim())}
          >
            {isSharing ? (
              <>
                <LoadingSpinner ariaLabel="Sharing" />
                Sharing...
              </>
            ) : (
              <>
                <span className="share-btn-icon">🚀</span>
                Share to{" "}
                {selectedPlatform
                  ? (shareType === "social" ? socialPlatforms : cloudServices).find((p) => p.id === selectedPlatform)
                      ?.name
                  : "Platform"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Share Button Component
const ShareButton = ({ onShare, chartTitle, className = "" }) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="share-button-container">
      <button
        className={`share-button ${className}`}
        onClick={onShare}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label={`Share ${chartTitle} chart`}
      >
        <span className="share-button-icon">🚀</span>
      </button>
      {showTooltip && <div className="share-tooltip">Share Chart</div>}
    </div>
  )
}

// Interactive Chart Components
const AnimatedChart = ({ data, type, title, color = "#FF6B35" }) => {
  const [animationProgress, setAnimationProgress] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [showExportModal, setShowExportModal] = useState(false)
  const chartRef = useRef()
  const [showShareModal, setShowShareModal] = useState(false)

  const handleShare = async (type, platform, options) => {
    const filename = `${title.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}`

    if (type === "social") {
      await shareToSocialMedia(chartRef, title, platform, options)
    } else {
      await shareToCloud(chartRef, filename, platform, options)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleExport = async (options) => {
    const filename = `${title.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}`
    await exportChart(chartRef, filename, options.format, options)
  }

  const maxValue = Math.max(...data.map((d) => d.value))

  if (type === "line") {
    return (
      <div className="chart-container" ref={chartRef}>
        <div className="chart-header-with-actions">
          <h4 className="chart-title">{title}</h4>
          <div className="chart-actions">
            <ShareButton onShare={() => setShowShareModal(true)} chartTitle={title} />
            <ExportButton onExport={() => setShowExportModal(true)} chartTitle={title} />
          </div>
        </div>
        <div className="line-chart">
          <svg width="100%" height="200" viewBox="0 0 400 200">
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="40"
                y1={40 + i * 32}
                x2="360"
                y2={40 + i * 32}
                stroke="var(--border-primary)"
                strokeWidth="1"
                opacity="0.3"
              />
            ))}

            {/* Animated area */}
            <path
              d={`M 40 ${200 - (data[0].value / maxValue) * 120 - 40} ${data
                .map((d, i) => `L ${40 + i * (320 / (data.length - 1))} ${200 - (d.value / maxValue) * 120 - 40}`)
                .join(" ")} L 360 160 L 40 160 Z`}
              fill={`url(#gradient-${title})`}
              style={{
                clipPath: `inset(0 ${100 - animationProgress * 100}% 0 0)`,
              }}
            />

            {/* Animated line */}
            <path
              d={`M 40 ${200 - (data[0].value / maxValue) * 120 - 40} ${data
                .map((d, i) => `L ${40 + i * (320 / (data.length - 1))} ${200 - (d.value / maxValue) * 120 - 40}`)
                .join(" ")}`}
              fill="none"
              stroke={color}
              strokeWidth="3"
              filter="url(#glow)"
              style={{
                strokeDasharray: "1000",
                strokeDashoffset: `${1000 - animationProgress * 1000}`,
                transition: "stroke-dashoffset 2s ease-out",
              }}
            />

            {/* Data points */}
            {data.map((d, i) => (
              <circle
                key={i}
                cx={40 + i * (320 / (data.length - 1))}
                cy={200 - (d.value / maxValue) * 120 - 40}
                r={hoveredIndex === i ? "6" : "4"}
                fill={color}
                stroke="white"
                strokeWidth="2"
                style={{
                  opacity: animationProgress,
                  transform: hoveredIndex === i ? "scale(1.2)" : "scale(1)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}

            {/* Tooltip */}
            {hoveredIndex !== null && (
              <g>
                <rect
                  x={40 + hoveredIndex * (320 / (data.length - 1)) - 25}
                  y={200 - (data[hoveredIndex].value / maxValue) * 120 - 70}
                  width="50"
                  height="25"
                  fill="var(--bg-card)"
                  stroke="var(--border-primary)"
                  rx="4"
                  style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }}
                />
                <text
                  x={40 + hoveredIndex * (320 / (data.length - 1))}
                  y={200 - (data[hoveredIndex].value / maxValue) * 120 - 52}
                  textAnchor="middle"
                  fill="var(--text-primary)"
                  fontSize="12"
                  fontWeight="600"
                >
                  {data[hoveredIndex].value}
                </text>
              </g>
            )}
          </svg>
        </div>
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
          chartTitle={title}
        />
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          onShare={handleShare}
          chartTitle={title}
        />
      </div>
    )
  }

  if (type === "bar") {
    return (
      <div className="chart-container" ref={chartRef}>
        <div className="chart-header-with-actions">
          <h4 className="chart-title">{title}</h4>
          <div className="chart-actions">
            <ShareButton onShare={() => setShowShareModal(true)} chartTitle={title} />
            <ExportButton onExport={() => setShowExportModal(true)} chartTitle={title} />
          </div>
        </div>
        <div className="bar-chart">
          <svg width="100%" height="200" viewBox="0 0 400 200">
            <defs>
              <linearGradient id={`bar-gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} />
                <stop offset="100%" stopColor={color} stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {data.map((d, i) => {
              const barHeight = (d.value / maxValue) * 120 * animationProgress
              const barWidth = 300 / data.length - 10
              const x = 50 + i * (300 / data.length)
              const y = 160 - barHeight

              return (
                <g key={i}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={`url(#bar-gradient-${title})`}
                    rx="4"
                    style={{
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      filter: hoveredIndex === i ? "brightness(1.2)" : "brightness(1)",
                    }}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                  <text
                    x={x + barWidth / 2}
                    y={175}
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    fontSize="10"
                    fontWeight="500"
                  >
                    {d.label}
                  </text>
                  {hoveredIndex === i && (
                    <text
                      x={x + barWidth / 2}
                      y={y - 5}
                      textAnchor="middle"
                      fill="var(--text-primary)"
                      fontSize="12"
                      fontWeight="600"
                    >
                      {d.value}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
          chartTitle={title}
        />
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          onShare={handleShare}
          chartTitle={title}
        />
      </div>
    )
  }

  if (type === "donut") {
    const total = data.reduce((sum, d) => sum + d.value, 0)
    let cumulativePercentage = 0

    return (
      <div className="chart-container donut-container" ref={chartRef}>
        <div className="chart-header-with-actions">
          <h4 className="chart-title">{title}</h4>
          <div className="chart-actions">
            <ShareButton onShare={() => setShowShareModal(true)} chartTitle={title} />
            <ExportButton onExport={() => setShowExportModal(true)} chartTitle={title} />
          </div>
        </div>
        <div className="donut-chart">
          <svg width="200" height="200" viewBox="0 0 200 200">
            <defs>
              {data.map((d, i) => (
                <linearGradient key={i} id={`donut-gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={d.color} />
                  <stop offset="100%" stopColor={d.color} stopOpacity="0.7" />
                </linearGradient>
              ))}
            </defs>

            {data.map((d, i) => {
              const percentage = (d.value / total) * 100
              const startAngle = (cumulativePercentage / 100) * 360 - 90
              const endAngle = ((cumulativePercentage + percentage) / 100) * 360 - 90

              const startAngleRad = (startAngle * Math.PI) / 180
              const endAngleRad = (endAngle * Math.PI) / 180

              const largeArcFlag = percentage > 50 ? 1 : 0

              const x1 = 100 + 60 * Math.cos(startAngleRad)
              const y1 = 100 + 60 * Math.sin(startAngleRad)
              const x2 = 100 + 60 * Math.cos(endAngleRad)
              const y2 = 100 + 60 * Math.sin(endAngleRad)

              const x3 = 100 + 35 * Math.cos(endAngleRad)
              const y3 = 100 + 35 * Math.sin(endAngleRad)
              const x4 = 100 + 35 * Math.cos(startAngleRad)
              const y4 = 100 + 35 * Math.sin(startAngleRad)

              const pathData = [
                `M ${x1} ${y1}`,
                `A 60 60 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `L ${x3} ${y3}`,
                `A 35 35 0 ${largeArcFlag} 0 ${x4} ${y4}`,
                "Z",
              ].join(" ")

              cumulativePercentage += percentage

              return (
                <path
                  key={i}
                  d={pathData}
                  fill={`url(#donut-gradient-${i})`}
                  style={{
                    opacity: animationProgress,
                    transform: hoveredIndex === i ? "scale(1.05)" : "scale(1)",
                    transformOrigin: "100px 100px",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    filter: hoveredIndex === i ? "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" : "none",
                  }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              )
            })}

            {/* Center text */}
            <text x="100" y="95" textAnchor="middle" fill="var(--text-muted)" fontSize="12" fontWeight="500">
              Total
            </text>
            <text x="100" y="110" textAnchor="middle" fill="var(--text-primary)" fontSize="18" fontWeight="700">
              {total}
            </text>
          </svg>

          <div className="donut-legend">
            {data.map((d, i) => (
              <div
                key={i}
                className={`legend-item ${hoveredIndex === i ? "highlighted" : ""}`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="legend-color" style={{ backgroundColor: d.color }}></div>
                <span className="legend-label">{d.label}</span>
                <span className="legend-value">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
          chartTitle={title}
        />
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          onShare={handleShare}
          chartTitle={title}
        />
      </div>
    )
  }
}

// Real-time Activity Chart
const ActivityChart = () => {
  const [data, setData] = useState([
    { time: "00:00", tweets: 45, sentiment: 0.6 },
    { time: "04:00", tweets: 23, sentiment: 0.4 },
    { time: "08:00", tweets: 89, sentiment: 0.8 },
    { time: "12:00", tweets: 156, sentiment: 0.7 },
    { time: "16:00", tweets: 134, sentiment: 0.5 },
    { time: "20:00", tweets: 98, sentiment: 0.9 },
  ])
  const [showExportModal, setShowExportModal] = useState(false)
  const chartRef = useRef()
  const [showShareModal, setShowShareModal] = useState(false)

  const handleShare = async (type, platform, options) => {
    const filename = `real-time-activity-${new Date().toISOString().split("T")[0]}`

    if (type === "social") {
      await shareToSocialMedia(chartRef, "Real-time Activity", platform, options)
    } else {
      await shareToCloud(chartRef, filename, platform, options)
    }
  }

  const handleExport = async (options) => {
    const filename = `real-time-activity-${new Date().toISOString().split("T")[0]}`
    await exportChart(chartRef, filename, options.format, options)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData]
        const randomIndex = Math.floor(Math.random() * newData.length)
        newData[randomIndex] = {
          ...newData[randomIndex],
          tweets: Math.max(10, newData[randomIndex].tweets + Math.floor(Math.random() * 20 - 10)),
          sentiment: Math.max(0.1, Math.min(1, newData[randomIndex].sentiment + (Math.random() * 0.2 - 0.1))),
        }
        return newData
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="activity-chart-container" ref={chartRef}>
      <div className="chart-header">
        <div className="chart-title-section">
          <h3 className="chart-title">
            <span className="title-icon">📊</span>
            Real-time Activity
          </h3>
          <div className="chart-actions">
            <ShareButton onShare={() => setShowShareModal(true)} chartTitle="Real-time Activity" />
            <ExportButton onExport={() => setShowExportModal(true)} chartTitle="Real-time Activity" />
          </div>
        </div>
        <div className="chart-indicators">
          <div className="indicator">
            <div className="indicator-dot tweets"></div>
            <span>Tweet Volume</span>
          </div>
          <div className="indicator">
            <div className="indicator-dot sentiment"></div>
            <span>Sentiment Score</span>
          </div>
        </div>
      </div>

      <div className="dual-axis-chart">
        <svg width="100%" height="250" viewBox="0 0 500 250">
          <defs>
            <linearGradient id="tweets-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="sentiment-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="50"
              y1={50 + i * 40}
              x2="450"
              y2={50 + i * 40}
              stroke="var(--border-primary)"
              strokeWidth="1"
              opacity="0.2"
            />
          ))}

          {/* Tweet volume area */}
          <path
            d={`M 50 ${210 - (data[0].tweets / 200) * 160} ${data
              .map((d, i) => `L ${50 + i * 80} ${210 - (d.tweets / 200) * 160}`)
              .join(" ")} L 450 210 L 50 210 Z`}
            fill="url(#tweets-gradient)"
          />

          {/* Tweet volume line */}
          <path
            d={`M 50 ${210 - (data[0].tweets / 200) * 160} ${data
              .map((d, i) => `L ${50 + i * 80} ${210 - (d.tweets / 200) * 160}`)
              .join(" ")}`}
            fill="none"
            stroke="#FF6B35"
            strokeWidth="3"
            style={{ filter: "drop-shadow(0 2px 4px rgba(255, 107, 53, 0.3))" }}
          />

          {/* Sentiment line */}
          <path
            d={`M 50 ${210 - data[0].sentiment * 160} ${data
              .map((d, i) => `L ${50 + i * 80} ${210 - d.sentiment * 160}`)
              .join(" ")}`}
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeDasharray="5,5"
            style={{ filter: "drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))" }}
          />

          {/* Data points */}
          {data.map((d, i) => (
            <g key={i}>
              <circle
                cx={50 + i * 80}
                cy={210 - (d.tweets / 200) * 160}
                r="4"
                fill="#FF6B35"
                stroke="white"
                strokeWidth="2"
              />
              <circle
                cx={50 + i * 80}
                cy={210 - d.sentiment * 160}
                r="4"
                fill="#10B981"
                stroke="white"
                strokeWidth="2"
              />
              <text x={50 + i * 80} y={235} textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontWeight="500">
                {d.time}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        chartTitle="Real-time Activity"
      />
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onShare={handleShare}
        chartTitle="Real-time Activity"
      />
    </div>
  )
}

// Sentiment Trend Chart
const SentimentTrendChart = ({ tweets }) => {
  const [showExportModal, setShowExportModal] = useState(false)
  const chartRef = useRef()
  const [showShareModal, setShowShareModal] = useState(false)

  const handleShare = async (type, platform, options) => {
    const filename = `sentiment-trends-${new Date().toISOString().split("T")[0]}`

    if (type === "social") {
      await shareToSocialMedia(chartRef, "Sentiment Trends", platform, options)
    } else {
      await shareToCloud(chartRef, filename, platform, options)
    }
  }

  const handleExport = async (options) => {
    const filename = `sentiment-trends-${new Date().toISOString().split("T")[0]}`
    await exportChart(chartRef, filename, options.format, options)
  }

  const sentimentData = React.useMemo(() => {
    const hourlyData = {}

    tweets.forEach((tweet) => {
      const hour = new Date(tweet.timestamp).getHours()
      if (!hourlyData[hour]) {
        hourlyData[hour] = { positive: 0, negative: 0, neutral: 0, total: 0 }
      }
      hourlyData[hour][tweet.sentiment]++
      hourlyData[hour].total++
    })

    return Object.entries(hourlyData)
      .map(([hour, data]) => ({
        hour: `${hour}:00`,
        positive: (data.positive / data.total) * 100,
        negative: (data.negative / data.total) * 100,
        neutral: (data.neutral / data.total) * 100,
        total: data.total,
      }))
      .sort((a, b) => Number.parseInt(a.hour) - Number.parseInt(b.hour))
  }, [tweets])

  return (
    <div className="sentiment-trend-container" ref={chartRef}>
      <div className="chart-header-with-actions">
        <h3 className="chart-title">
          <span className="title-icon">📈</span>
          Sentiment Trends
        </h3>
        <div className="chart-actions">
          <ShareButton onShare={() => setShowShareModal(true)} chartTitle="Sentiment Trends" />
          <ExportButton onExport={() => setShowExportModal(true)} chartTitle="Sentiment Trends" />
        </div>
      </div>

      <div className="stacked-area-chart">
        <svg width="100%" height="200" viewBox="0 0 400 200">
          <defs>
            <linearGradient id="positive-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="negative-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="neutral-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6B7280" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6B7280" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {sentimentData.length > 0 && (
            <>
              {/* Positive area */}
              <path
                d={`M 40 160 ${sentimentData
                  .map((d, i) => `L ${40 + i * (320 / (sentimentData.length - 1))} ${160 - (d.positive / 100) * 120}`)
                  .join(" ")} L 360 160 Z`}
                fill="url(#positive-gradient)"
              />

              {/* Negative area */}
              <path
                d={`M 40 160 ${sentimentData
                  .map(
                    (d, i) =>
                      `L ${40 + i * (320 / (sentimentData.length - 1))} ${160 - ((d.positive + d.negative) / 100) * 120}`,
                  )
                  .join(" ")} L 360 160 Z`}
                fill="url(#negative-gradient)"
              />

              {/* Neutral area */}
              <path
                d={`M 40 160 ${sentimentData
                  .map((d, i) => `L ${40 + i * (320 / (sentimentData.length - 1))} ${40}`)
                  .join(" ")} L 360 160 Z`}
                fill="url(#neutral-gradient)"
              />

              {/* Time labels */}
              {sentimentData.map((d, i) => (
                <text
                  key={i}
                  x={40 + i * (320 / (sentimentData.length - 1))}
                  y={180}
                  textAnchor="middle"
                  fill="var(--text-muted)"
                  fontSize="10"
                  fontWeight="500"
                >
                  {d.hour}
                </text>
              ))}
            </>
          )}
        </svg>
      </div>

      <div className="sentiment-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: "#10B981" }}></div>
          <span>Positive</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: "#EF4444" }}></div>
          <span>Negative</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: "#6B7280" }}></div>
          <span>Neutral</span>
        </div>
      </div>

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        chartTitle="Sentiment Trends"
      />
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onShare={handleShare}
        chartTitle="Sentiment Trends"
      />
    </div>
  )
}

// Main App Content
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
      await new Promise((resolve) => setTimeout(resolve, 3000))
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
      if (e.altKey && e.key === "s") {
        e.preventDefault()
        searchInputRef.current?.focus()
        announce("Search input focused", "polite")
      }

      if (e.altKey && e.key === "a") {
        e.preventDefault()
        analyzeButtonRef.current?.focus()
        announce("Analyze button focused", "polite")
      }

      if (e.altKey && e.key === "t") {
        e.preventDefault()
        document.querySelector(".theme-toggle")?.click()
      }

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
      <FloatingParticles />

      {/* Enhanced Header */}
      <header className="header" role="banner">
        <div className="header-content">
          <div className="logo">
            <div className="logo-container">
              <span className="logo-icon" aria-hidden="true">
                🐦
              </span>
              <div className="logo-glow"></div>
            </div>
            <div className="logo-text-container">
              <span className="logo-text">SentimentX</span>
              <span className="logo-tagline">AI-Powered Analytics</span>
            </div>
          </div>

          <nav className="nav" role="navigation" aria-label="Main navigation">
            <a href="#features" className="nav-link">
              <span className="nav-icon">✨</span>
              Features
            </a>
            <a href="#how-to-use" className="nav-link">
              <span className="nav-icon">📚</span>
              How to Use
            </a>
            <a href="#analytics" className="nav-link">
              <span className="nav-icon">📊</span>
              Analytics
            </a>
            <a href="#pricing" className="nav-link">
              <span className="nav-icon">💎</span>
              Pricing
            </a>
          </nav>

          <div className="user-section">
            <ThemeToggle />
            <div className="user-profile">
              <div className="user-avatar" aria-hidden="true">
                <span>U</span>
                <div className="avatar-status"></div>
              </div>
              <div className="user-info">
                <span className="user-name">John Doe</span>
                <span className="user-email">john@example.com</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Main Content */}
      <main className="main-content" id="main-content" role="main">
        {/* Left Panel - Enhanced Hero Section */}
        <section className="left-panel" aria-labelledby="hero-title">
          <div className="hero-background">
            <div className="hero-gradient"></div>
            <div className="hero-mesh"></div>
          </div>

          <div className="hero-content">
            <div className="hero-badge" role="img" aria-label="Powered by AI badge">
              <span className="badge-icon" aria-hidden="true">
                ⚡
              </span>
              <span className="badge-text">Powered by Advanced AI</span>
              <div className="badge-glow"></div>
            </div>

            <h1 className="hero-title" id="hero-title">
              <span className="title-line">Analyze Better.</span>
              <span className="title-line">
                <span className="hero-accent">Track. Understand.</span>
              </span>
              <span className="title-line">Dominate</span>
            </h1>

            <p className="hero-description">
              Harness the power of AI to track Twitter sentiment in real-time. Get deep insights into public opinion and
              make data-driven decisions that give you the competitive edge.
            </p>

            <form onSubmit={handleSubmit} className="search-form" role="search" aria-label="Tweet analysis search">
              <div className="form-container">
                <fieldset className="input-group">
                  <legend className="sr-only">Search Parameters</legend>

                  <div className="input-wrapper">
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
                    <div className="input-glow"></div>
                  </div>

                  <div className="count-wrapper">
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
                    <div className="input-glow"></div>
                  </div>
                </fieldset>

                <button
                  type="submit"
                  className="analyze-btn"
                  disabled={loading}
                  ref={analyzeButtonRef}
                  aria-describedby="analyze-help"
                >
                  <div className="btn-content">
                    {loading ? <LoadingSpinner ariaLabel="Analyzing tweets" /> : "Analyze Tweets"}
                    <span className="btn-arrow" aria-hidden="true">
                      →
                    </span>
                  </div>
                  <div className="btn-glow"></div>
                  <div className="btn-shine"></div>
                </button>
              </div>
            </form>

            {error && (
              <div className="error-message" role="alert" id="search-error" aria-live="assertive">
                <div className="error-content">
                  <span className="error-icon" aria-hidden="true">
                    ⚠️
                  </span>
                  <span className="error-text">{error}</span>
                </div>
                <span className="sr-only">Press Escape to dismiss this error.</span>
              </div>
            )}

            <div className="hero-stats" aria-label="User statistics">
              <div className="stats-container">
                <div className="stat-item">
                  <div className="stat-avatars" role="img" aria-label="User avatars">
                    {["T", "W", "S", "A", "M"].map((letter, i) => (
                      <div key={i} className="avatar" aria-hidden="true" style={{ animationDelay: `${i * 0.1}s` }}>
                        {letter}
                      </div>
                    ))}
                  </div>
                  <div className="stat-text-container">
                    <span className="stat-number">2,500+</span>
                    <span className="stat-text">Trusted by developers worldwide</span>
                  </div>
                </div>

                <div className="trust-badges">
                  <div className="trust-badge">
                    <span className="trust-icon">🔒</span>
                    <span className="trust-text">Enterprise Security</span>
                  </div>
                  <div className="trust-badge">
                    <span className="trust-icon">⚡</span>
                    <span className="trust-text">Real-time Analysis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Panel - Enhanced Dashboard */}
        <section className="right-panel" aria-labelledby="dashboard-title">
          <div className="dashboard-container">
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
                  <span className="title-text">SentimentX Analytics Dashboard</span>
                </div>
                <div className="goals-indicator" aria-label="Analysis progress">
                  <span className="goals-text">Today's Analysis</span>
                  <span className="goals-count">
                    <span className="count-number">{tweets.length}</span>
                    <span className="count-separator">/</span>
                    <span className="count-total">{count}</span>
                    <span className="goals-status">completed</span>
                  </span>
                </div>
              </header>

              <div className="dashboard-content" role="region" aria-labelledby="dashboard-title">
                {!analysisStarted ? (
                  <div className="dashboard-placeholder" role="status">
                    <div className="placeholder-animation">
                      <div className="placeholder-icon" aria-hidden="true">
                        📈
                      </div>
                      <div className="placeholder-rings">
                        <div className="ring ring-1"></div>
                        <div className="ring ring-2"></div>
                        <div className="ring ring-3"></div>
                      </div>
                    </div>
                    <h3 className="placeholder-title">Ready to Analyze</h3>
                    <p className="placeholder-description">
                      Enter a search term to start analyzing Twitter sentiment with our advanced AI engine
                    </p>
                  </div>
                ) : (
                  <>
                    <header className="stats-header">
                      <h2 className="stats-title">Analysis Results</h2>
                      <time className="stats-date" dateTime={new Date().toISOString()}>
                        {new Date().toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    </header>

                    <div className="stats-grid" role="region" aria-label="Analysis statistics">
                      <div className="stat-card premium-card" role="group" aria-labelledby="total-tweets-label">
                        <div className="card-glow"></div>
                        <div className="stat-header">
                          <span className="stat-label" id="total-tweets-label">
                            Total Tweets
                          </span>
                          <span className="stat-trend positive" aria-label={`Increase of ${tweets.length} tweets`}>
                            <span className="trend-icon">↗</span>
                            <span className="trend-value">+{tweets.length}</span>
                          </span>
                        </div>
                        <div className="stat-value" aria-describedby="total-tweets-label">
                          {tweets.length.toLocaleString()}
                        </div>
                        <div className="stat-subtitle">analyzed successfully</div>
                      </div>

                      <div className="stat-card premium-card" role="group" aria-labelledby="sentiment-score-label">
                        <div className="card-glow"></div>
                        <div className="stat-header">
                          <span className="stat-label" id="sentiment-score-label">
                            Sentiment Score
                          </span>
                          <span
                            className="stat-trend positive"
                            aria-label={`${sentimentStats.positivePercentage > 50 ? "Trending up" : "Trending down"} ${Math.round(sentimentStats.positivePercentage)}%`}
                          >
                            <span className="trend-icon">{sentimentStats.positivePercentage > 50 ? "↗" : "↘"}</span>
                            <span className="trend-value">{Math.round(sentimentStats.positivePercentage)}%</span>
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
                        <span className="title-text">Sentiment Breakdown</span>
                      </h3>

                      <div className="progress-list">
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
                      </div>
                    </section>

                    <section className="rank-section" aria-labelledby="rank-title">
                      <div className="rank-card premium-rank" role="group" aria-labelledby="rank-title">
                        <div className="rank-glow"></div>
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
                      <section className="charts-section" aria-labelledby="charts-title">
                        <h3 className="section-title" id="charts-title">
                          <span className="title-icon" aria-hidden="true">
                            📊
                          </span>
                          <span className="title-text">Data Visualization</span>
                        </h3>

                        <div className="charts-grid">
                          <div className="chart-row">
                            <AnimatedChart
                              data={[
                                { label: "Mon", value: sentimentStats.positive },
                                { label: "Tue", value: Math.floor(sentimentStats.positive * 1.2) },
                                { label: "Wed", value: Math.floor(sentimentStats.positive * 0.8) },
                                { label: "Thu", value: Math.floor(sentimentStats.positive * 1.5) },
                                { label: "Fri", value: Math.floor(sentimentStats.positive * 1.1) },
                                { label: "Sat", value: Math.floor(sentimentStats.positive * 0.9) },
                                { label: "Sun", value: Math.floor(sentimentStats.positive * 1.3) },
                              ]}
                              type="bar"
                              title="Weekly Positive Sentiment"
                              color="#10B981"
                            />

                            <AnimatedChart
                              data={[
                                { label: "Positive", value: sentimentStats.positive, color: "#10B981" },
                                { label: "Negative", value: sentimentStats.negative, color: "#EF4444" },
                                { label: "Neutral", value: sentimentStats.neutral, color: "#6B7280" },
                              ]}
                              type="donut"
                              title="Sentiment Distribution"
                            />
                          </div>

                          <div className="chart-row">
                            <AnimatedChart
                              data={[
                                { value: 45 },
                                { value: 52 },
                                { value: 48 },
                                { value: 61 },
                                { value: 55 },
                                { value: 67 },
                                { value: 59 },
                                { value: 72 },
                                { value: 68 },
                                { value: 75 },
                                { value: 71 },
                                { value: 78 },
                              ]}
                              type="line"
                              title="Engagement Trend"
                              color="#FF6B35"
                            />

                            <ActivityChart />
                          </div>

                          <div className="chart-row full-width">
                            <SentimentTrendChart tweets={tweets} />
                          </div>
                        </div>
                      </section>
                    )}

                    {tweets.length > 0 && (
                      <section className="tweets-section" aria-labelledby="tweets-title">
                        <h3 className="section-title" id="tweets-title">
                          <span className="title-icon" aria-hidden="true">
                            🐦
                          </span>
                          <span className="title-text">Recent Tweets</span>
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
