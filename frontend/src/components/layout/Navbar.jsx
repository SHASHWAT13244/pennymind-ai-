// components/layout/Navbar.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { 
  TrendingUp, LogOut, Menu, X, User, Settings, 
  Bell, Moon, Sun, Sparkles, CreditCard, Github,
  Target, BarChart3, Activity, Award
} from 'lucide-react'
import toast from 'react-hot-toast'

const Navbar = ({ 
  theme, 
  onThemeToggle,
  onOpenAIAssistant,
  onOpenBudget,
  onOpenNotifications,
  onOpenAnalytics,
  onOpenAchievements,
  notificationCount = 0
}) => {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showNotificationPanel, setShowNotificationPanel] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    toast.success(
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Sparkles size={18} />
        <span>See you soon, {user?.name?.split(' ')[0]}! 👋</span>
      </div>
    )
  }

  const handleNotificationClick = () => {
    setShowNotificationPanel(!showNotificationPanel)
    if (onOpenNotifications) {
      onOpenNotifications()
    }
  }

  const handleAIClick = () => {
    if (onOpenAIAssistant) {
      onOpenAIAssistant()
    } else {
      // Fallback: Try to find and click the AI Assistant button
      const aiButton = document.querySelector('[aria-label="Open AI Assistant"]')
      if (aiButton) {
        aiButton.click()
        toast.success('AI Assistant opened!', { icon: '🤖' })
      } else {
        toast.error('AI Assistant not available')
      }
    }
  }

  const handleBudgetClick = () => {
    if (onOpenBudget) {
      onOpenBudget()
    } else {
      toast.success('Budget planner opening...')
    }
  }

  const handleAnalyticsClick = () => {
    if (onOpenAnalytics) {
      onOpenAnalytics()
    } else {
      toast.success('Analytics opening...')
    }
  }

  const handleAchievementsClick = () => {
    if (onOpenAchievements) {
      onOpenAchievements()
    } else {
      toast.success('Achievements opening...')
    }
  }

  return (
    <nav style={{
      ...styles.nav,
      ...(scrolled && styles.navScrolled),
      background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logo}>
  <div style={styles.logoIcon}>
    <TrendingUp size={24} color="#6366f1" />
  </div>
  <div>
    <span style={{
      ...styles.logoText,
      color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
    }}>pennymind<span style={{ color: '#6366f1' }}>-ai</span></span>
    <span style={styles.logoBadge}>v2026.1</span>
  </div>
</div>

        {/* Right Section */}
        <div style={styles.right}>
          {/* Quick Actions */}
          <div style={styles.quickActions}>
            {/* AI Assistant Button */}
            <button 
              onClick={handleAIClick}
              style={styles.iconBtn} 
              title="AI Assistant"
              aria-label="Open AI Assistant"
            >
              <Sparkles size={18} />
            </button>

            {/* Budget Button */}
            <button 
              onClick={handleBudgetClick}
              style={styles.iconBtn} 
              title="Budget Planner"
              aria-label="Open Budget Planner"
            >
              <Target size={18} />
            </button>

            {/* Analytics Button */}
            <button 
              onClick={handleAnalyticsClick}
              style={styles.iconBtn} 
              title="Analytics"
              aria-label="Open Analytics"
            >
              <BarChart3 size={18} />
            </button>

            {/* Achievements Button */}
            <button 
              onClick={handleAchievementsClick}
              style={styles.iconBtn} 
              title="Achievements"
              aria-label="Open Achievements"
            >
              <Award size={18} />
            </button>

            {/* Notifications Button */}
            <button 
              onClick={handleNotificationClick}
              style={styles.iconBtn} 
              title="Notifications"
              aria-label="Open Notifications"
            >
              <Bell size={18} />
              {notificationCount > 0 && (
                <span style={styles.notificationBadge}>
                  {notificationCount}
                </span>
              )}
            </button>

            {/* GitHub Link */}
            <a 
              href="https://github.com/SHASHWAT13244/pennymind-ai-.git" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.iconBtn}
              title="GitHub"
              aria-label="GitHub Repository"
            >
              <Github size={18} />
            </a>

            {/* Theme Toggle */}
            <button 
              onClick={onThemeToggle}
              style={styles.iconBtn}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* User Profile */}
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div style={styles.userDetails}>
              <span style={{
                ...styles.userName,
                color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
              }}>{user?.name || 'User'}</span>
              <span style={styles.userEmail}>{user?.email || 'user@example.com'}</span>
            </div>
          </div>

          {/* Logout Button */}
          <button onClick={handleLogout} style={styles.logoutBtn} title="Logout">
            <LogOut size={16} />
            <span>Logout</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={styles.menuBtn}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <div style={styles.mobileUser}>
            <div style={styles.mobileAvatar}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div style={styles.mobileUserName}>{user?.name || 'User'}</div>
              <div style={styles.mobileUserEmail}>{user?.email || 'user@example.com'}</div>
            </div>
          </div>
          
          <div style={styles.mobileActions}>
            <button onClick={handleAIClick} style={styles.mobileAction}>
              <Sparkles size={16} />
              <span>AI Assistant</span>
            </button>
            <button onClick={handleBudgetClick} style={styles.mobileAction}>
              <Target size={16} />
              <span>Budget Planner</span>
            </button>
            <button onClick={handleAnalyticsClick} style={styles.mobileAction}>
              <BarChart3 size={16} />
              <span>Analytics</span>
            </button>
            <button onClick={handleAchievementsClick} style={styles.mobileAction}>
              <Award size={16} />
              <span>Achievements</span>
            </button>
            <button onClick={handleNotificationClick} style={styles.mobileAction}>
              <Bell size={16} />
              <span>Notifications</span>
              {notificationCount > 0 && (
                <span style={styles.mobileBadge}>{notificationCount}</span>
              )}
            </button>
            <button onClick={onThemeToggle} style={styles.mobileAction}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button onClick={handleLogout} style={styles.mobileLogout}>
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Notification Panel (if you want it in Navbar) */}
      {showNotificationPanel && onOpenNotifications && (
        <div style={styles.notificationPanel}>
          <div style={styles.notificationHeader}>
            <span style={styles.notificationTitle}>Notifications</span>
            <button onClick={() => setShowNotificationPanel(false)} style={styles.closePanelBtn}>
              <X size={14} />
            </button>
          </div>
          <div style={styles.notificationContent}>
            <p style={styles.noNotifications}>No new notifications</p>
          </div>
        </div>
      )}
    </nav>
  )
}

const styles = {
  nav: {
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    transition: 'all 0.3s ease',
  },
  navScrolled: {
    backdropFilter: 'blur(20px)',
    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px',
    height: '72px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 20px -5px rgba(99,102,241,0.3)',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },
  logoBadge: {
    fontSize: '10px',
    background: 'rgba(99,102,241,0.2)',
    padding: '2px 6px',
    borderRadius: '20px',
    color: '#94a3b8',
    marginLeft: '8px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  quickActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingRight: '20px',
    borderRight: '1px solid rgba(255,255,255,0.1)',
  },
  iconBtn: {
    position: 'relative',
    width: '40px',
    height: '40px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '12px',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(255,255,255,0.06)',
      color: '#f1f5f9',
      borderColor: 'rgba(99,102,241,0.3)',
      transform: 'translateY(-2px)',
    },
  },
  notificationBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    background: '#ef4444',
    color: 'white',
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '10px',
    minWidth: '18px',
    textAlign: 'center',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '6px 12px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '40px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  avatar: {
    width: '36px',
    height: '36px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    borderRadius: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
  },
  userEmail: {
    fontSize: '11px',
    color: '#64748b',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '30px',
    color: '#ef4444',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(239,68,68,0.15)',
      borderColor: 'rgba(239,68,68,0.3)',
      transform: 'translateY(-2px)',
    },
  },
  menuBtn: {
    display: 'none',
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
    padding: '8px',
    cursor: 'pointer',
    borderRadius: '8px',
    ':hover': {
      background: 'rgba(255,255,255,0.03)',
    },
  },
  mobileMenu: {
    display: 'none',
    padding: '20px 24px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(15,23,42,0.95)',
    backdropFilter: 'blur(12px)',
  },
  mobileUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    padding: '12px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '16px',
  },
  mobileAvatar: {
    width: '44px',
    height: '44px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    borderRadius: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
  },
  mobileUserName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#f1f5f9',
  },
  mobileUserEmail: {
    fontSize: '12px',
    color: '#64748b',
  },
  mobileActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  mobileAction: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '14px',
    color: '#94a3b8',
    fontSize: '14px',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.2s ease',
    position: 'relative',
    ':hover': {
      background: 'rgba(255,255,255,0.04)',
      borderColor: 'rgba(99,102,241,0.3)',
    },
  },
  mobileBadge: {
    position: 'absolute',
    right: '14px',
    background: '#ef4444',
    color: 'white',
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '10px',
  },
  mobileLogout: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '14px',
    color: '#ef4444',
    fontSize: '14px',
    cursor: 'pointer',
    width: '100%',
    marginTop: '8px',
    ':hover': {
      background: 'rgba(239,68,68,0.15)',
    },
  },
  notificationPanel: {
    position: 'absolute',
    top: '80px',
    right: '24px',
    width: '320px',
    background: 'rgba(18, 18, 24, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
    zIndex: 100,
    overflow: 'hidden',
  },
  notificationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  notificationTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#f1f5f9',
  },
  closePanelBtn: {
    width: '28px',
    height: '28px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '8px',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    ':hover': {
      background: 'rgba(255,255,255,0.06)',
      color: '#ef4444',
    },
  },
  notificationContent: {
    padding: '20px',
    textAlign: 'center',
  },
  noNotifications: {
    color: '#64748b',
    fontSize: '13px',
  },

  '@media (max-width: 768px)': {
    userInfo: {
      display: 'none',
    },
    logoutBtn: {
      display: 'none',
    },
    menuBtn: {
      display: 'block',
    },
    mobileMenu: {
      display: 'block',
    },
    quickActions: {
      display: 'none',
    },
  },
}

export default Navbar
