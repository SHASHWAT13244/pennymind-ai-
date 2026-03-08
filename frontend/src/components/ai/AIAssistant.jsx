// components/ai/AIAssistant.jsx
import { useState, useEffect, useRef } from 'react'
import { Bot, X, Send, Sparkles, TrendingUp, AlertCircle, Lightbulb, ChevronRight } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const AIAssistant = ({ expenses, summary, trend }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI financial assistant. How can I help you today?',
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const messagesEndRef = useRef(null)

  // Expose a method to open the assistant from outside
  useEffect(() => {
    // Make the component available globally for the navbar to access
    window.openAIAssistant = () => setIsOpen(true)
    
    return () => {
      delete window.openAIAssistant
    }
  }, [])

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Generate AI suggestions based on data
  useEffect(() => {
    if (expenses?.length > 0) {
      const newSuggestions = []
      
      // Top spending category
      const categories = Object.entries(summary?.byCategory || {})
      if (categories.length > 0) {
        const [topCat, topAmount] = categories.sort((a, b) => b[1] - a[1])[0]
        newSuggestions.push({
          icon: <TrendingUp size={14} />,
          text: `Your highest spending is in ${topCat} (৳${topAmount.toFixed(2)})`,
          action: 'Analyze'
        })
      }

      // Trend analysis
      if (trend && trend.length >= 2) {
        const lastMonth = trend[trend.length - 1]?.total || 0
        const prevMonth = trend[trend.length - 2]?.total || 0
        if (prevMonth > 0) {
          const change = ((lastMonth - prevMonth) / prevMonth * 100).toFixed(1)
          
          if (change > 0) {
            newSuggestions.push({
              icon: <AlertCircle size={14} color="#ef4444" />,
              text: `Spending increased by ${change}% from last month`,
              action: 'Review'
            })
          } else if (change < 0) {
            newSuggestions.push({
              icon: <Lightbulb size={14} color="#22c55e" />,
              text: `Great! You saved ${Math.abs(change)}% compared to last month`,
              action: 'Celebrate'
            })
          }
        }
      }

      setSuggestions(newSuggestions)
    }
  }, [expenses, summary, trend])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Simulate AI response
      setTimeout(() => {
        const botMessage = {
          id: messages.length + 2,
          type: 'bot',
          content: generateAIResponse(input, expenses, summary),
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, botMessage])
        setLoading(false)
      }, 1000)
    } catch (error) {
      toast.error('Failed to get AI response')
      setLoading(false)
    }
  }

  const generateAIResponse = (query, expenses, summary) => {
    const q = query.toLowerCase()
    
    if (q.includes('total') || q.includes('spent')) {
      return `Your total spending is ৳${summary?.total?.toFixed(2) || '0'} across ${summary?.count || 0} expenses.`
    }
    
    if (q.includes('category') || q.includes('categories')) {
      const categories = Object.entries(summary?.byCategory || {})
      if (categories.length === 0) return "You haven't added any expenses yet."
      
      const topCat = categories.sort((a, b) => b[1] - a[1])[0]
      return `Your top category is ${topCat[0]} with ৳${topCat[1].toFixed(2)}. Would you like to set a budget for this category?`
    }
    
    if (q.includes('budget') || q.includes('save')) {
      return "Based on your spending patterns, I recommend setting a monthly budget of ৳5,000 for discretionary spending. Would you like me to help you set this up?"
    }
    
    if (q.includes('tip') || q.includes('advice')) {
      return "Here's a tip: Try the 50/30/20 rule - 50% for needs, 30% for wants, and 20% for savings. Your current ratio is 60/30/10. Want to optimize?"
    }
    
    return "I understand you're asking about your finances. Could you be more specific? You can ask about totals, categories, budgets, or get saving tips."
  }

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion.text)
  }

  const handleOpenAIAssistant = () => {
    setIsOpen(true)
  }

  const handleCloseAIAssistant = () => {
    setIsOpen(false)
  }

  if (!expenses) return null

  return (
    <>
      {/* AI Assistant Button */}
      <button
        onClick={handleOpenAIAssistant}
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '24px',
          width: '56px',
          height: '56px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: 'none',
          borderRadius: '50%',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 10px 30px -5px rgba(99,102,241,0.5)',
          zIndex: 999,
          transition: 'all 0.3s ease',
        }}
        className="animate-float"
        aria-label="Open AI Assistant"
        id="ai-assistant-button"
      >
        <Bot size={24} />
        {suggestions.length > 0 && (
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            background: '#ef4444',
            color: 'white',
            fontSize: '11px',
            fontWeight: '700',
            padding: '2px 6px',
            borderRadius: '10px',
            minWidth: '18px',
            textAlign: 'center',
          }}>
            {suggestions.length}
          </span>
        )}
      </button>

      {/* AI Assistant Panel */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          right: '24px',
          width: '360px',
          height: '500px',
          background: 'rgba(18, 18, 24, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 30px 60px -10px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'rgba(99,102,241,0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Sparkles size={16} color="#6366f1" />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f1f5f9', marginBottom: '2px' }}>
                    pennymind-ai Assistant
                </h3>
                <p style={{ fontSize: '11px', color: '#64748b' }}>Powered by Groq</p>
              </div>
            </div>
            <button 
              onClick={handleCloseAIAssistant} 
              style={{
                width: '32px',
                height: '32px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '10px',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              aria-label="Close AI Assistant"
            >
              <X size={18} />
            </button>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div style={{
              padding: '16px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    color: '#94a3b8',
                    fontSize: '12px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(99,102,241,0.1)'
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                  }}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span>{suggestion.icon}</span>
                  <span style={{ flex: 1 }}>{suggestion.text}</span>
                  <ChevronRight size={14} color="#64748b" />
                </button>
              ))}
            </div>
          )}

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  gap: '8px',
                  maxWidth: '80%',
                  alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start',
                  flexDirection: message.type === 'user' ? 'row-reverse' : 'row',
                }}
              >
                {message.type === 'bot' && (
                  <div style={{
                    width: '24px',
                    height: '24px',
                    background: 'rgba(99,102,241,0.1)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Bot size={12} color="#6366f1" />
                  </div>
                )}
                <div style={{
                  background: message.type === 'user' ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
                  borderRadius: '14px',
                  padding: '10px 12px',
                }}>
                  <p style={{ fontSize: '13px', color: '#f1f5f9', marginBottom: '4px', lineHeight: '1.5' }}>
                    {message.content}
                  </p>
                  <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div style={{
                display: 'flex',
                gap: '4px',
                padding: '12px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '20px',
                width: 'fit-content',
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: '#6366f1',
                  borderRadius: '50%',
                  animation: 'pulse 1.5s infinite',
                }}></div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: '#6366f1',
                  borderRadius: '50%',
                  animation: 'pulse 1.5s infinite',
                  animationDelay: '0.2s',
                }}></div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: '#6366f1',
                  borderRadius: '50%',
                  animation: 'pulse 1.5s infinite',
                  animationDelay: '0.4s',
                }}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '16px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            gap: '8px',
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything..."
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '30px',
                color: '#f1f5f9',
                fontSize: '13px',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#6366f1'
                e.target.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.2)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.05)'
                e.target.style.boxShadow = 'none'
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              style={{
                width: '42px',
                height: '42px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none',
                borderRadius: '30px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !input.trim() ? 0.5 : 1,
                transition: 'all 0.2s ease',
              }}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </>
  )
}

export default AIAssistant