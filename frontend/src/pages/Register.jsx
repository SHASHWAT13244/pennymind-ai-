import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Mail, Lock, User, TrendingUp, Sparkles, Eye, EyeOff, Shield, CheckCircle, ArrowRight, Globe, Zap } from 'lucide-react'

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  // Password strength checker
  useEffect(() => {
    let strength = 0
    if (form.password.length >= 6) strength += 1
    if (form.password.match(/[a-z]/) && form.password.match(/[A-Z]/)) strength += 1
    if (form.password.match(/[0-9]/)) strength += 1
    if (form.password.match(/[^a-zA-Z0-9]/)) strength += 1
    setPasswordStrength(strength)
  }, [form.password])

  // Glassmorphism particle effect
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
    if (!acceptedTerms) {
      toast.error('Please accept the terms and conditions')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', form)
      login(data)
      toast.success(
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} />
          <span>Welcome to SpendSmart, {data.name}! 🚀</span>
        </div>
      )
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed', {
        icon: '⚠️',
      })
    } finally {
      setLoading(false)
    }
  }

  const getStrengthLabel = () => {
    const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Excellent']
    return labels[passwordStrength]
  }

  const getStrengthColor = () => {
    const colors = ['#ef4444', '#f59e0b', '#fbbf24', '#22c55e', '#10b981']
    return colors[passwordStrength]
  }

  return (
    <div style={styles.container}>
      {/* Animated background */}
      <div style={styles.background}>
        <div style={styles.gradientOrb1}></div>
        <div style={styles.gradientOrb2}></div>
        <div style={styles.gradientOrb3}></div>
        <div style={styles.gridPattern}></div>
        <div style={styles.particles}></div>
      </div>

      <div style={styles.cardWrapper}>
        {/* Floating feature badge */}
        <div style={styles.floatingBadge}>
          <Zap size={14} />
          <span>AI-Powered • Join 10k+ users</span>
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
            <div style={styles.featureTags}>
              <span style={styles.featureTag}>
                <Sparkles size={12} /> AI Categories
              </span>
              <span style={styles.featureTag}>
                <Globe size={12} /> Real-time
              </span>
            </div>
          </div>

          <div style={styles.header}>
            <h2 style={styles.title}>Create account</h2>
            <p style={styles.subtitle}>
              Start your AI-powered expense tracking journey
            </p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label 
                style={{
                  ...styles.label,
                  ...(focusedField === 'name' && styles.labelFocused)
                }}
              >
                Full Name
              </label>
              <div style={{
                ...styles.inputWrapper,
                ...(focusedField === 'name' && styles.inputWrapperFocused)
              }}>
                <User size={18} style={styles.inputIcon} />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  required
                  style={styles.input}
                />
                {form.name && (
                  <CheckCircle size={16} color="#22c55e" style={styles.inputCheck} />
                )}
              </div>
            </div>

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
                {form.email && form.email.includes('@') && (
                  <CheckCircle size={16} color="#22c55e" style={styles.inputCheck} />
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
                  minLength={6}
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
              
              {/* Password strength meter */}
              {form.password && (
                <div style={styles.strengthMeter}>
                  <div style={styles.strengthBars}>
                    {[0,1,2,3,4].map((index) => (
                      <div
                        key={index}
                        style={{
                          ...styles.strengthBar,
                          background: index < passwordStrength 
                            ? getStrengthColor() 
                            : 'rgba(255,255,255,0.1)',
                          width: '20%',
                        }}
                      />
                    ))}
                  </div>
                  <span style={{...styles.strengthLabel, color: getStrengthColor()}}>
                    {getStrengthLabel()} password
                  </span>
                </div>
              )}
            </div>

            {/* Terms and conditions */}
            <label style={styles.termsContainer}>
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                style={styles.termsCheckbox}
              />
              <span style={styles.termsText}>
                I agree to the{' '}
                <Link to="/terms" style={styles.termsLink}>Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" style={styles.termsLink}>Privacy Policy</Link>
              </span>
            </label>

            <button 
              type="submit" 
              disabled={loading || !acceptedTerms} 
              style={{
                ...styles.button,
                ...((loading || !acceptedTerms) && styles.buttonDisabled)
              }}
            >
              {loading ? (
                <>
                  <div style={styles.loader}></div>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Get Started</span>
                  <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                </>
              )}
            </button>
          </form>

          {/* Social proof - 2026 trend */}
          <div style={styles.socialProof}>
            <div style={styles.avatarGroup}>
              <div style={styles.avatar}>JD</div>
              <div style={styles.avatar}>SM</div>
              <div style={styles.avatar}>AK</div>
              <div style={styles.avatar}>+2k</div>
            </div>
            <span style={styles.socialProofText}>
              Join 10,000+ smart spenders
            </span>
          </div>

          <p style={styles.footer}>
            Already have an account?{' '}
            <Link to="/login" style={styles.link}>
              Sign in
              <span style={styles.linkArrow}>→</span>
            </Link>
          </p>

          {/* Trust badges */}
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
              <span>Zero data sharing</span>
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
    background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2f 100%)',
    zIndex: 0,
  },
  gradientOrb1: {
    position: 'absolute',
    top: '-20%',
    right: '-10%',
    width: '700px',
    height: '700px',
    background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(99,102,241,0) 70%)',
    borderRadius: '50%',
    filter: 'blur(80px)',
    animation: 'float 25s ease-in-out infinite',
  },
  gradientOrb2: {
    position: 'absolute',
    bottom: '-20%',
    left: '-10%',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, rgba(34,211,238,0) 70%)',
    borderRadius: '50%',
    filter: 'blur(80px)',
    animation: 'float 30s ease-in-out infinite reverse',
  },
  gradientOrb3: {
    position: 'absolute',
    top: '40%',
    left: '30%',
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
      linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    zIndex: 1,
  },
  particles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05) 0%, transparent 10%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.05) 0%, transparent 10%)',
    zIndex: 1,
  },
  cardWrapper: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '460px',
    width: '100%',
  },
  floatingBadge: {
    position: 'absolute',
    top: '-12px',
    left: '20px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    backdropFilter: 'blur(10px)',
    padding: '6px 16px',
    borderRadius: '30px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '500',
    border: '1px solid rgba(255,255,255,0.2)',
    boxShadow: '0 10px 30px rgba(99,102,241,0.4)',
    zIndex: 3,
  },
  card: {
    background: 'rgba(20, 20, 30, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '36px',
    padding: '40px',
    border: '1px solid rgba(255,255,255,0.06)',
    boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02) inset',
    position: 'relative',
    overflow: 'hidden',
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
    width: '100px',
    height: '100px',
    background: 'radial-gradient(circle, rgba(99,102,241,0.5) 0%, rgba(99,102,241,0) 70%)',
    borderRadius: '50%',
    filter: 'blur(20px)',
  },
  logoIcon: {
    position: 'relative',
    filter: 'drop-shadow(0 0 30px rgba(99,102,241,0.6))',
  },
  logoText: {
    fontSize: '34px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ffffff 0%, #c7d2fe 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '12px',
    letterSpacing: '-1px',
  },
  featureTags: {
    display: 'flex',
    gap: '8px',
  },
  featureTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '20px',
    color: '#94a3b8',
    fontSize: '11px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '30px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '8px',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '14px',
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
    borderRadius: '18px',
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
  },
  strengthMeter: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '4px',
    paddingLeft: '4px',
  },
  strengthBars: {
    display: 'flex',
    gap: '4px',
    flex: 1,
  },
  strengthBar: {
    height: '4px',
    borderRadius: '2px',
    transition: 'background 0.3s ease',
  },
  strengthLabel: {
    fontSize: '11px',
    fontWeight: '500',
    minWidth: '60px',
  },
  termsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '4px',
    cursor: 'pointer',
  },
  termsCheckbox: {
    width: '18px',
    height: '18px',
    accentColor: '#6366f1',
    borderRadius: '6px',
  },
  termsText: {
    color: '#94a3b8',
    fontSize: '13px',
  },
  termsLink: {
    color: '#6366f1',
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline',
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
    borderRadius: '18px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '12px',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 20px 30px -10px rgba(99,102,241,0.5)',
    },
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    ':hover': {
      transform: 'none',
      boxShadow: 'none',
    },
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
  socialProof: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '24px',
    padding: '12px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '40px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  avatarGroup: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    border: '2px solid rgba(255,255,255,0.1)',
    marginLeft: '-4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: '600',
    color: 'white',
    ':first-child': {
      marginLeft: 0,
    },
  },
  socialProofText: {
    color: '#94a3b8',
    fontSize: '12px',
    fontWeight: '500',
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

  '@global': {
    '@keyframes float': {
      '0%, 100%': {
        transform: 'translate(0, 0) scale(1)',
      },
      '33%': {
        transform: 'translate(40px, -40px) scale(1.1)',
      },
      '66%': {
        transform: 'translate(-30px, 30px) scale(0.9)',
      },
    },
    '@keyframes spin': {
      to: {
        transform: 'rotate(360deg)',
      },
    },
  },
}

export default Register