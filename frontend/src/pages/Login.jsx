import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Mail, Lock, TrendingUp, Sparkles, Eye, EyeOff, Fingerprint, Shield } from 'lucide-react'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  // Glassmorphism particle effect (2025-2026 trend)
  useEffect(() => {
    const handleMouseMove = (e) => {
      const cards = document.querySelectorAll('.glass-card')
      cards.forEach(card => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        card.style.setProperty('--mouse-x', `${x}px`)
        card.style.setProperty('--mouse-y', `${y}px`)
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      login(data)
      toast.success(
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} />
          <span>Welcome back, {data.name}! 👋</span>
        </div>
      )
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed', {
        icon: '🔐',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBiometricLogin = () => {
    toast('Biometric login coming soon!', {
      icon: '📱',
      style: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
      }
    })
  }

  return (
    <div style={styles.container}>
      {/* Animated background with 2026 neubrutalism + glassmorphism blend */}
      <div style={styles.background}>
        <div style={styles.gradientOrb1}></div>
        <div style={styles.gradientOrb2}></div>
        <div style={styles.gradientOrb3}></div>
        <div style={styles.gridPattern}></div>
      </div>

      <div style={styles.cardWrapper}>
        {/* Floating badge - 2026 trend */}
        <div style={styles.floatingBadge}>
          <Shield size={14} />
          <span>Secure Login • 2026</span>
        </div>

        <div className="glass-card" style={styles.card}>
          {/* Animated logo section */}
          <div style={styles.logoSection}>
            <div style={styles.logoContainer}>
              <div style={styles.logoGlow}></div>
              <TrendingUp size={40} color="#ffffff" style={styles.logoIcon} />
            </div>
            <h1 style={styles.logoText}>
              pennymind<span style={{ color: '#6366f1' }}>-ai</span>
            </h1>
            <div style={styles.versionTag}>v2026.1</div>
          </div>

          <div style={styles.header}>
            <h2 style={styles.title}>Welcome back</h2>
            <p style={styles.subtitle}>
              <Sparkles size={14} style={{ marginRight: '4px' }} />
              New AI-powered insights waiting for you
            </p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label 
                style={{
                  ...styles.label,
                  ...(focusedField === 'email' && styles.labelFocused)
                }}
              >
                Email Address
              </label>
              <div style={{
                ...styles.inputWrapper,
                ...(focusedField === 'email' && styles.inputWrapperFocused)
              }}>
                <Mail size={18} style={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  placeholder="hello@example.com"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                  style={styles.input}
                />
                {form.email && (
                  <span style={styles.inputCheck}>✓</span>
                )}
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label 
                style={{
                  ...styles.label,
                  ...(focusedField === 'password' && styles.labelFocused)
                }}
              >
                Password
              </label>
              <div style={{
                ...styles.inputWrapper,
                ...(focusedField === 'password' && styles.inputWrapperFocused)
              }}>
                <Lock size={18} style={styles.inputIcon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  style={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={styles.options}>
              <label style={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={styles.checkboxInput}
                />
                <span style={styles.checkboxText}>Remember me</span>
              </label>
              <Link to="/forgot-password" style={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              style={{
                ...styles.button,
                ...(loading && styles.buttonLoading)
              }}
            >
              {loading ? (
                <>
                  <div style={styles.loader}></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <Sparkles size={16} style={{ marginLeft: '8px' }} />
                </>
              )}
            </button>
          </form>

          {/* Biometric login - 2026 trend */}
          <div style={styles.biometricSection}>
            <div style={styles.divider}>
              <span style={styles.dividerText}>or continue with</span>
            </div>
            
            <button
              onClick={handleBiometricLogin}
              style={styles.biometricButton}
            >
              <Fingerprint size={20} />
              <span>Biometric Login</span>
            </button>
          </div>

          <p style={styles.footer}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.link}>
              Create account
              <span style={styles.linkArrow}>→</span>
            </Link>
          </p>

          {/* Trust badges - 2026 trend */}
          <div style={styles.trustBadges}>
            <div style={styles.trustBadge}>
              <Shield size={12} />
              <span>256-bit encryption</span>
            </div>
            <div style={styles.trustBadge}>
              <Shield size={12} />
              <span>GDPR compliant</span>
            </div>
            <div style={styles.trustBadge}>
              <Shield size={12} />
              <span>ISO 27001</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Inter', sans-serif",
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: '#0a0a0f',
    zIndex: 0,
  },
  gradientOrb1: {
    position: 'absolute',
    top: '-10%',
    left: '-10%',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(99,102,241,0) 70%)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    animation: 'float 20s ease-in-out infinite',
  },
  gradientOrb2: {
    position: 'absolute',
    bottom: '-10%',
    right: '-10%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, rgba(34,211,238,0) 70%)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    animation: 'float 25s ease-in-out infinite reverse',
  },
  gradientOrb3: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, rgba(168,85,247,0) 70%)',
    borderRadius: '50%',
    filter: 'blur(60px)',
  },
  gridPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(99,102,241,0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.1) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px',
    zIndex: 1,
  },
  cardWrapper: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '440px',
    width: '100%',
  },
  floatingBadge: {
    position: 'absolute',
    top: '-12px',
    right: '20px',
    background: 'rgba(99,102,241,0.9)',
    backdropFilter: 'blur(10px)',
    padding: '6px 14px',
    borderRadius: '30px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '500',
    border: '1px solid rgba(255,255,255,0.2)',
    boxShadow: '0 10px 30px rgba(99,102,241,0.3)',
    zIndex: 3,
  },
  card: {
    background: 'rgba(18, 18, 24, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '32px',
    padding: '40px',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.02) inset',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.3s ease',
    ':hover': {
      transform: 'translateY(-2px)',
    },
  },
  logoSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '32px',
    position: 'relative',
  },
  logoContainer: {
    position: 'relative',
    marginBottom: '16px',
  },
  logoGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80px',
    height: '80px',
    background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(99,102,241,0) 70%)',
    borderRadius: '50%',
    filter: 'blur(15px)',
  },
  logoIcon: {
    position: 'relative',
    filter: 'drop-shadow(0 0 20px rgba(99,102,241,0.5))',
  },
  logoText: {
    fontSize: '32px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
    letterSpacing: '-1px',
  },
  versionTag: {
    fontSize: '11px',
    padding: '3px 10px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '20px',
    color: '#94a3b8',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '8px',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#94a3b8',
    transition: 'color 0.2s ease',
    paddingLeft: '4px',
  },
  labelFocused: {
    color: '#6366f1',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    transition: 'all 0.2s ease',
  },
  inputWrapperFocused: {
    borderColor: '#6366f1',
    boxShadow: '0 0 0 4px rgba(99,102,241,0.15)',
    background: 'rgba(255,255,255,0.05)',
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    color: '#64748b',
  },
  input: {
    width: '100%',
    padding: '16px 16px 16px 48px',
    background: 'transparent',
    border: 'none',
    color: '#ffffff',
    fontSize: '15px',
    outline: 'none',
    '::placeholder': {
      color: '#475569',
    },
  },
  eyeButton: {
    position: 'absolute',
    right: '16px',
    background: 'transparent',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputCheck: {
    position: 'absolute',
    right: '48px',
    color: '#22c55e',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  options: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '4px',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  checkboxInput: {
    width: '18px',
    height: '18px',
    accentColor: '#6366f1',
    borderRadius: '6px',
  },
  checkboxText: {
    color: '#94a3b8',
    fontSize: '14px',
  },
  forgotLink: {
    color: '#6366f1',
    fontSize: '14px',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
    ':hover': {
      color: '#818cf8',
    },
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden',
    marginTop: '8px',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 20px 30px -10px rgba(99,102,241,0.5)',
    },
    ':active': {
      transform: 'translateY(0)',
    },
  },
  buttonLoading: {
    opacity: 0.8,
    cursor: 'not-allowed',
  },
  loader: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
    borderTopColor: 'white',
    animation: 'spin 1s linear infinite',
    marginRight: '8px',
  },
  biometricSection: {
    marginTop: '24px',
  },
  divider: {
    position: 'relative',
    textAlign: 'center',
    marginBottom: '16px',
    '::before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      height: '1px',
      background: 'rgba(255,255,255,0.08)',
    },
  },
  dividerText: {
    position: 'relative',
    background: '#121218',
    padding: '0 12px',
    color: '#64748b',
    fontSize: '13px',
  },
  biometricButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(255,255,255,0.06)',
      borderColor: 'rgba(99,102,241,0.3)',
    },
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    color: '#94a3b8',
    fontSize: '14px',
  },
  link: {
    color: '#6366f1',
    textDecoration: 'none',
    fontWeight: '500',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'gap 0.2s ease',
    ':hover': {
      gap: '8px',
    },
  },
  linkArrow: {
    transition: 'transform 0.2s ease',
  },
  trustBadges: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginTop: '28px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  trustBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#64748b',
    fontSize: '11px',
  },

  // Global animations
  '@global': {
    '@keyframes float': {
      '0%, 100%': {
        transform: 'translate(0, 0) scale(1)',
      },
      '33%': {
        transform: 'translate(30px, -30px) scale(1.1)',
      },
      '66%': {
        transform: 'translate(-20px, 20px) scale(0.9)',
      },
    },
    '@keyframes spin': {
      to: {
        transform: 'rotate(360deg)',
      },
    },
  },
}

export default Login