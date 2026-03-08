// components/common/QuickActions.jsx
import { useState } from 'react'
import {
  Plus, Target, Award, Download, Share2,
  Settings, HelpCircle, Moon, Sun, LogOut,
  Sparkles, CreditCard, TrendingUp, Calendar,
  X, Zap, BarChart3, PieChart, Github, Twitter,
  Mail, Globe, Gift, Star, Bell, Clock,
  Activity, FileText, Image, Video, Code, Copy,
  Printer, Save, Maximize2, Eye, EyeOff, Filter,
  AlertCircle, CheckCircle, Info, AlertTriangle
} from 'lucide-react'
import toast from 'react-hot-toast'

const QuickActions = ({ 
  onAddExpense, 
  onOpenBudget, 
  onOpenAchievements, 
  onOpenAnalytics,
  onOpenInsights,
  onOpenVisualization,
  onExport, 
  onThemeToggle, 
  onLogout,
  theme 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [hoveredAction, setHoveredAction] = useState(null)

  const mainActions = [
    {
      id: 1,
      name: 'Add Expense',
      icon: <Plus size={18} />,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      description: 'Quickly add a new expense',
      shortcut: '⌘N',
      action: () => {
        onAddExpense()
        setIsOpen(false)
        toast.success('Ready to add expense!', { 
          icon: '💰',
          duration: 2000 
        })
      },
    },
    {
      id: 2,
      name: 'Budget Planner',
      icon: <Target size={18} />,
      color: '#22c55e',
      gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
      description: 'Set and manage budgets',
      shortcut: '⌘B',
      action: () => {
        onOpenBudget()
        setIsOpen(false)
      },
    },
    {
      id: 3,
      name: 'Achievements',
      icon: <Award size={18} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      description: 'View your earned badges',
      shortcut: '⌘A',
      action: () => {
        onOpenAchievements()
        setIsOpen(false)
      },
    },
    {
      id: 4,
      name: 'Analytics',
      icon: <BarChart3 size={18} />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      description: 'Deep dive into data',
      shortcut: '⌘Y',
      action: () => {
        onOpenAnalytics()
        setIsOpen(false)
      },
    },
  ]

  const moreActions = [
    {
      id: 5,
      name: 'Export Data',
      icon: <Download size={18} />,
      color: '#22d3ee',
      gradient: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
      description: 'Download as CSV/PDF',
      shortcut: '⌘E',
      action: () => {
        onExport()
        setIsOpen(false)
        toast.success('Preparing export...', { 
          icon: '📊',
          duration: 2000 
        })
      },
    },
    {
      id: 6,
      name: 'Share Report',
      icon: <Share2 size={18} />,
      color: '#a855f7',
      gradient: 'linear-gradient(135deg, #a855f7, #9333ea)',
      description: 'Share with others',
      shortcut: '⌘S',
      action: () => {
        navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard!', {
          icon: '🔗',
          duration: 2000
        })
        setIsOpen(false)
      },
    },
    {
      id: 7,
      name: 'Insights',
      icon: <TrendingUp size={18} />,
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
      description: 'AI-powered insights',
      shortcut: '⌘I',
      action: () => {
        onOpenInsights()
        setIsOpen(false)
      },
    },
    {
      id: 8,
      name: 'Data Visualization',
      icon: <Activity size={18} />,
      color: '#14b8a6',
      gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)',
      description: 'Interactive charts',
      shortcut: '⌘V',
      action: () => {
        onOpenVisualization()
        setIsOpen(false)
      },
    },
    {
      id: 9,
      name: 'Calendar View',
      icon: <Calendar size={18} />,
      color: '#f97316',
      gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
      description: 'View by date',
      shortcut: '⌘K',
      action: () => {
        toast.success('Calendar view coming soon!', { 
          icon: '📅',
          duration: 2000
        })
        setIsOpen(false)
      },
    },
    {
      id: 10,
      name: 'Theme',
      icon: theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />,
      color: '#94a3b8',
      gradient: 'linear-gradient(135deg, #94a3b8, #64748b)',
      description: 'Switch appearance',
      shortcut: '⌘T',
      action: () => {
        onThemeToggle()
        setIsOpen(false)
      },
    },
    {
      id: 11,
      name: 'Help & Support',
      icon: <HelpCircle size={18} />,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      description: 'Get help',
      shortcut: '⌘H',
      action: () => {
        window.open('https://docs.spendsmart.com', '_blank')
        setIsOpen(false)
      },
    },
    {
      id: 12,
      name: 'Feedback',
      icon: <Gift size={18} />,
      color: '#f43f5e',
      gradient: 'linear-gradient(135deg, #f43f5e, #e11d48)',
      description: 'Send feedback',
      shortcut: '⌘F',
      action: () => {
        toast.success('Thanks for your feedback! ⭐', {
          duration: 3000
        })
        setIsOpen(false)
      },
    },
    {
      id: 13,
      name: 'Settings',
      icon: <Settings size={18} />,
      color: '#64748b',
      gradient: 'linear-gradient(135deg, #64748b, #475569)',
      description: 'App preferences',
      shortcut: '⌘,',
      action: () => {
        toast.info('Settings coming soon!', {
          icon: '⚙️',
          duration: 2000
        })
        setIsOpen(false)
      },
    },
    {
      id: 14,
      name: 'Logout',
      icon: <LogOut size={18} />,
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
      description: 'Sign out',
      shortcut: '⌘L',
      action: () => {
        onLogout()
        setIsOpen(false)
        toast.success('Logged out successfully', { 
          icon: '👋',
          duration: 2000
        })
      },
    },
  ]

  const socialActions = [
    {
      id: 'github',
      icon: <Github size={16} />,
      url: 'https://github.com/spendsmart',
      color: '#333',
      label: 'GitHub',
    },
    {
      id: 'twitter',
      icon: <Twitter size={16} />,
      url: 'https://twitter.com/spendsmart',
      color: '#1DA1F2',
      label: 'Twitter',
    },
    {
      id: 'email',
      icon: <Mail size={16} />,
      url: 'mailto:support@spendsmart.com',
      color: '#EA4335',
      label: 'Email',
    },
    {
      id: 'website',
      icon: <Globe size={16} />,
      url: 'https://spendsmart.com',
      color: '#6366f1',
      label: 'Website',
    },
  ]

  const quickStats = [
    { label: 'New', value: '3', icon: <Bell size={12} color="#6366f1" /> },
    { label: 'Streak', value: '7d', icon: <Star size={12} color="#f59e0b" /> },
    { label: 'Updated', value: 'now', icon: <Clock size={12} color="#22c55e" /> },
  ]

  return (
    <div style={styles.container}>
      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...styles.fab,
          ...(isOpen && styles.fabOpen),
        }}
        aria-label="Quick actions"
        title="Quick actions (⌘K)"
      >
        {isOpen ? <X size={24} /> : <Zap size={24} />}
      </button>

      {/* Action Menu */}
      {isOpen && (
        <div style={styles.menu}>
          {/* Header */}
          <div style={styles.menuHeader}>
            <div style={styles.menuHeaderLeft}>
              <Zap size={16} color="#6366f1" />
              <span style={styles.menuTitle}>Quick Actions</span>
            </div>
            <button 
              onClick={() => setShowMore(!showMore)}
              style={styles.moreBtn}
              aria-label={showMore ? 'Show less' : 'Show more'}
            >
              {showMore ? 'Show Less' : 'Show More'}
            </button>
          </div>

          {/* Main Actions */}
          <div style={styles.actionGroup}>
            {mainActions.map((action, index) => (
              <button
                key={action.id}
                onClick={action.action}
                onMouseEnter={() => setHoveredAction(action.id)}
                onMouseLeave={() => setHoveredAction(null)}
                style={{
                  ...styles.actionBtn,
                  animation: `slideIn 0.3s ease ${index * 0.03}s both`,
                  ...(hoveredAction === action.id && styles.actionBtnHovered),
                }}
                title={`${action.name} (${action.shortcut})`}
              >
                <div style={{
                  ...styles.actionIcon,
                  background: action.gradient,
                }}>
                  {action.icon}
                </div>
                <div style={styles.actionContent}>
                  <span style={styles.actionName}>{action.name}</span>
                  <span style={styles.actionDesc}>{action.description}</span>
                </div>
                <span style={styles.actionShortcut}>{action.shortcut}</span>
              </button>
            ))}
          </div>

          {/* More Actions */}
          {showMore && (
            <>
              <div style={styles.divider} />
              <div style={styles.actionGroup}>
                {moreActions.map((action, index) => (
                  <button
                    key={action.id}
                    onClick={action.action}
                    onMouseEnter={() => setHoveredAction(action.id)}
                    onMouseLeave={() => setHoveredAction(null)}
                    style={{
                      ...styles.actionBtn,
                      animation: `slideIn 0.3s ease ${index * 0.02}s both`,
                      ...(hoveredAction === action.id && styles.actionBtnHovered),
                    }}
                    title={`${action.name} (${action.shortcut})`}
                  >
                    <div style={{
                      ...styles.actionIcon,
                      background: action.gradient,
                    }}>
                      {action.icon}
                    </div>
                    <div style={styles.actionContent}>
                      <span style={styles.actionName}>{action.name}</span>
                      <span style={styles.actionDesc}>{action.description}</span>
                    </div>
                    <span style={styles.actionShortcut}>{action.shortcut}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Quick Stats */}
          <div style={styles.statsPreview}>
            {quickStats.map((stat, index) => (
              <div key={index} style={styles.statItem}>
                {stat.icon}
                <span style={styles.statLabel}>{stat.label}</span>
                <span style={styles.statValue}>{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div style={styles.socialLinks}>
            {socialActions.map(social => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.socialLink}
                title={social.label}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = social.color
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#64748b'
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Version Info */}
          <div style={styles.versionInfo}>
            <span style={styles.versionText}>pennymind-ai v2026.1</span>
            <span style={styles.versionBadge}>Pro</span>
            <span style={styles.versionBuild}>build 42</span>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div style={styles.shortcutsHint}>
            <span style={styles.shortcutsText}>⌘K to open menu</span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}

const styles = {
  container: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 1000,
  },
  fab: {
    width: '60px',
    height: '60px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none',
    borderRadius: '30px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 10px 30px -5px rgba(99,102,241,0.5)',
    transition: 'all 0.3s ease',
    position: 'relative',
    zIndex: 2,
    ':hover': {
      transform: 'scale(1.1) rotate(90deg)',
      boxShadow: '0 15px 35px -5px rgba(99,102,241,0.7)',
    },
  },
  fabOpen: {
    transform: 'rotate(45deg)',
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    ':hover': {
      transform: 'rotate(45deg) scale(1.1)',
    },
  },
  menu: {
    position: 'absolute',
    bottom: '80px',
    right: '0',
    width: '320px',
    maxHeight: '70vh',
    overflowY: 'auto',
    background: 'rgba(30, 41, 59, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    animation: 'slideIn 0.3s ease',
  },
  menuHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
    padding: '0 4px',
  },
  menuHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  menuTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#f1f5f9',
  },
  moreBtn: {
    background: 'rgba(99,102,241,0.1)',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: '20px',
    color: '#6366f1',
    fontSize: '11px',
    fontWeight: '500',
    padding: '4px 10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(99,102,241,0.2)',
    },
  },
  actionGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  divider: {
    height: '1px',
    background: 'rgba(255,255,255,0.1)',
    margin: '8px 0',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '14px',
    color: '#f1f5f9',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden',
  },
  actionBtnHovered: {
    background: 'rgba(255,255,255,0.05)',
    transform: 'translateX(-4px)',
    borderColor: 'rgba(99,102,241,0.3)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  actionIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    flexShrink: 0,
  },
  actionContent: {
    flex: 1,
    textAlign: 'left',
    minWidth: 0,
  },
  actionName: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: '2px',
  },
  actionDesc: {
    display: 'block',
    fontSize: '10px',
    color: '#64748b',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  actionShortcut: {
    fontSize: '10px',
    color: '#475569',
    background: 'rgba(255,255,255,0.05)',
    padding: '2px 6px',
    borderRadius: '4px',
    fontFamily: 'monospace',
  },
  statsPreview: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '12px',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '16px',
    marginTop: '4px',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  statLabel: {
    fontSize: '10px',
    color: '#64748b',
    marginLeft: '2px',
  },
  statValue: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#f1f5f9',
  },
  socialLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    padding: '12px 0 8px',
  },
  socialLink: {
    color: '#64748b',
    transition: 'color 0.2s ease',
    cursor: 'pointer',
    ':hover': {
      color: '#6366f1',
    },
  },
  versionInfo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 0 4px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  versionText: {
    fontSize: '9px',
    color: '#475569',
  },
  versionBadge: {
    fontSize: '8px',
    padding: '2px 6px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    borderRadius: '20px',
    color: 'white',
    fontWeight: '600',
  },
  versionBuild: {
    fontSize: '8px',
    color: '#334155',
  },
  shortcutsHint: {
    textAlign: 'center',
    fontSize: '8px',
    color: '#334155',
    paddingTop: '4px',
  },
}

export default QuickActions