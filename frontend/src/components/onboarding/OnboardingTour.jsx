// components/onboarding/OnboardingTour.jsx
import { useState, useEffect } from 'react'
import { X, ChevronRight, ChevronLeft, Sparkles, Target, TrendingUp, FileDown } from 'lucide-react'

const OnboardingTour = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('onboarding-completed')
    if (hasSeenTour) {
      setDismissed(true)
    }
  }, [])

  const steps = [
    {
      title: 'Welcome to pennymind-ai! 🎉',
      description: 'Your AI-powered expense tracker that helps you save money and reach your financial goals.',
      icon: <Sparkles size={24} />,
      color: '#6366f1',
    },
    {
      title: 'Track Expenses Easily',
      description: 'Add your expenses with AI-powered category suggestions. Just type the title and let AI do the rest!',
      icon: <TrendingUp size={24} />,
      color: '#22c55e',
    },
    {
      title: 'Set Budgets & Goals',
      description: 'Create monthly budgets for each category and get alerts when you\'re close to reaching your limits.',
      icon: <Target size={24} />,
      color: '#f59e0b',
    },
    {
      title: 'Export & Share Reports',
      description: 'Generate beautiful PDF reports with charts and share them with your financial advisor or family.',
      icon: <FileDown size={24} />,
      color: '#22d3ee',
    },
  ]

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      localStorage.setItem('onboarding-completed', 'true')
      setDismissed(true)
      onComplete?.()
    }
  }

  const handleSkip = () => {
    localStorage.setItem('onboarding-completed', 'true')
    setDismissed(true)
    onComplete?.()
  }

  if (dismissed) return null

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <button onClick={handleSkip} style={styles.closeBtn}>
          <X size={18} />
        </button>

        <div style={styles.content}>
          <div style={{
            ...styles.iconContainer,
            background: `linear-gradient(135deg, ${steps[step].color}20, ${steps[step].color}05)`,
            color: steps[step].color,
          }}>
            {steps[step].icon}
          </div>

          <h3 style={styles.title}>{steps[step].title}</h3>
          <p style={styles.description}>{steps[step].description}</p>

          <div style={styles.progress}>
            {steps.map((_, index) => (
              <div
                key={index}
                style={{
                  ...styles.progressDot,
                  background: index === step ? steps[step].color : 'rgba(255,255,255,0.1)',
                  width: index === step ? '24px' : '8px',
                }}
              />
            ))}
          </div>

          <div style={styles.actions}>
            <button onClick={handleSkip} style={styles.skipBtn}>
              Skip tour
            </button>
            <button onClick={handleNext} style={styles.nextBtn}>
              <span>{step === steps.length - 1 ? 'Get Started' : 'Next'}</span>
              {step < steps.length - 1 && <ChevronRight size={16} />}
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div style={styles.decor1}></div>
        <div style={styles.decor2}></div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  container: {
    position: 'relative',
    maxWidth: '400px',
    width: '90%',
    background: 'rgba(30, 41, 59, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '32px',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 40px 80px -20px rgba(0,0,0,0.8)',
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '36px',
    height: '36px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '12px',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 2,
    ':hover': {
      background: 'rgba(255,255,255,0.06)',
      color: '#ef4444',
    },
  },
  content: {
    padding: '48px 32px 32px',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
  },
  iconContainer: {
    width: '80px',
    height: '80px',
    borderRadius: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: '12px',
  },
  description: {
    fontSize: '15px',
    color: '#94a3b8',
    lineHeight: '1.6',
    marginBottom: '32px',
  },
  progress: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '32px',
  },
  progressDot: {
    height: '8px',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  },
  skipBtn: {
    padding: '12px 24px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '40px',
    color: '#94a3b8',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(255,255,255,0.03)',
    },
  },
  nextBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 32px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none',
    borderRadius: '40px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      transform: 'translateX(4px)',
      boxShadow: '0 10px 20px -5px rgba(99,102,241,0.3)',
    },
  },
  decor1: {
    position: 'absolute',
    top: '-20%',
    right: '-20%',
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0) 70%)',
    borderRadius: '50%',
    zIndex: 0,
  },
  decor2: {
    position: 'absolute',
    bottom: '-20%',
    left: '-20%',
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle, rgba(34,211,238,0.15) 0%, rgba(34,211,238,0) 70%)',
    borderRadius: '50%',
    zIndex: 0,
  },
}

export default OnboardingTour