// components/achievements/AchievementBadges.jsx
import { useState, useEffect } from 'react'
import { Award, Trophy, Star, Zap, Target, TrendingUp, DollarSign, Calendar, X } from 'lucide-react'

const AchievementBadges = ({ expenses, summary, onClose }) => {
  const [achievements, setAchievements] = useState([])

  useEffect(() => {
    // Calculate achievements based on user data
    const newAchievements = []

    // First expense
    if (expenses.length > 0) {
      newAchievements.push({
        id: 1,
        name: 'First Step',
        description: 'Added your first expense',
        icon: <Star size={20} />,
        unlocked: true,
        date: new Date(expenses[0].date),
        color: '#6366f1',
      })
    }

    // Expense milestone
    if (expenses.length >= 10) {
      newAchievements.push({
        id: 2,
        name: 'Getting Started',
        description: 'Added 10 expenses',
        icon: <Zap size={20} />,
        unlocked: true,
        color: '#22c55e',
      })
    }

    if (expenses.length >= 50) {
      newAchievements.push({
        id: 3,
        name: 'Power User',
        description: 'Added 50 expenses',
        icon: <Trophy size={20} />,
        unlocked: true,
        color: '#f59e0b',
      })
    }

    // Savings milestone
    if (summary.total > 10000) {
      newAchievements.push({
        id: 4,
        name: 'Big Spender',
        description: 'Total expenses over ৳10,000',
        icon: <DollarSign size={20} />,
        unlocked: true,
        color: '#22d3ee',
      })
    }

    // Streak achievement
    const dates = [...new Set(expenses.map(e => new Date(e.date).toDateString()))].sort()
    let streak = 0
    for (let i = dates.length - 1; i >= 0; i--) {
      const current = new Date(dates[i])
      const prev = new Date(dates[i - 1])
      if (i === dates.length - 1) {
        streak = 1
      } else if (current.getTime() === prev.getTime() + 86400000) {
        streak++
      } else {
        break
      }
    }

    if (streak >= 7) {
      newAchievements.push({
        id: 5,
        name: 'Consistency King',
        description: `Tracked expenses for ${streak} days in a row`,
        icon: <Calendar size={20} />,
        unlocked: true,
        color: '#ec4899',
      })
    }

    // Category variety
    const categories = Object.keys(summary.byCategory || {})
    if (categories.length >= 5) {
      newAchievements.push({
        id: 6,
        name: 'Variety Seeker',
        description: 'Used 5 different categories',
        icon: <Target size={20} />,
        unlocked: true,
        color: '#a855f7',
      })
    }

    // Monthly goal
    if (summary.total < 5000 && summary.total > 0) {
      newAchievements.push({
        id: 7,
        name: 'Budget Master',
        description: 'Stayed under ৳5,000 this month',
        icon: <TrendingUp size={20} />,
        unlocked: true,
        color: '#14b8a6',
      })
    }

    setAchievements(newAchievements)
  }, [expenses, summary])

  const lockedAchievements = [
    {
      id: 8,
      name: 'Century Club',
      description: 'Add 100 expenses',
      icon: <Award size={20} />,
      unlocked: false,
      color: '#64748b',
    },
    {
      id: 9,
      name: 'Saving Guru',
      description: 'Save 20% of your income for 3 months',
      icon: <Trophy size={20} />,
      unlocked: false,
      color: '#64748b',
    },
    {
      id: 10,
      name: 'Category Expert',
      description: 'Use all 8 categories',
      icon: <Star size={20} />,
      unlocked: false,
      color: '#64748b',
    },
    {
      id: 11,
      name: 'Year in Review',
      description: 'Track expenses for a full year',
      icon: <Calendar size={20} />,
      unlocked: false,
      color: '#64748b',
    },
  ]

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            <Award size={20} color="#f59e0b" />
          </div>
          <div>
            <h3 style={styles.title}>Achievements</h3>
            <p style={styles.subtitle}>
              {achievements.length} of {achievements.length + lockedAchievements.length} unlocked
            </p>
          </div>
        </div>
        <button onClick={onClose} style={styles.closeBtn}>
          <X size={18} />
        </button>
      </div>

      <div style={styles.content}>
        {/* Unlocked achievements */}
        {achievements.length > 0 && (
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Unlocked</h4>
            <div style={styles.grid}>
              {achievements.map((achievement) => (
                <div key={achievement.id} style={styles.achievementCard}>
                  <div style={{
                    ...styles.achievementIcon,
                    background: `${achievement.color}15`,
                    color: achievement.color,
                  }}>
                    {achievement.icon}
                  </div>
                  <div style={styles.achievementInfo}>
                    <span style={styles.achievementName}>{achievement.name}</span>
                    <span style={styles.achievementDesc}>{achievement.description}</span>
                    {achievement.date && (
                      <span style={styles.achievementDate}>
                        {achievement.date.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked achievements */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Locked</h4>
          <div style={styles.grid}>
            {lockedAchievements.map((achievement) => (
              <div key={achievement.id} style={{
                ...styles.achievementCard,
                ...styles.achievementCardLocked,
              }}>
                <div style={{
                  ...styles.achievementIcon,
                  background: 'rgba(255,255,255,0.03)',
                  color: '#64748b',
                }}>
                  {achievement.icon}
                </div>
                <div style={styles.achievementInfo}>
                  <span style={styles.achievementNameLocked}>{achievement.name}</span>
                  <span style={styles.achievementDescLocked}>{achievement.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={styles.footer}>
        <div style={styles.progressContainer}>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${(achievements.length / (achievements.length + lockedAchievements.length)) * 100}%`,
              }}
            />
          </div>
          <span style={styles.progressText}>
            {achievements.length} / {achievements.length + lockedAchievements.length} achievements
          </span>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: 'rgba(30, 41, 59, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255,255,255,0.1)',
    width: '500px',
    maxWidth: '90vw',
    maxHeight: '80vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '20px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  headerIcon: {
    width: '44px',
    height: '44px',
    background: 'rgba(245,158,11,0.1)',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: '2px',
  },
  subtitle: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  closeBtn: {
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
    ':hover': {
      background: 'rgba(255,255,255,0.06)',
      color: '#ef4444',
    },
  },
  content: {
    padding: '24px',
    overflowY: 'auto',
    flex: 1,
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px',
  },
  achievementCard: {
    display: 'flex',
    gap: '12px',
    padding: '12px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.05)',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(255,255,255,0.03)',
    },
  },
  achievementCardLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  achievementInfo: {
    flex: 1,
    minWidth: 0,
  },
  achievementName: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: '2px',
  },
  achievementNameLocked: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    marginBottom: '2px',
  },
  achievementDesc: {
    display: 'block',
    fontSize: '11px',
    color: '#94a3b8',
    marginBottom: '4px',
  },
  achievementDescLocked: {
    display: 'block',
    fontSize: '11px',
    color: '#475569',
  },
  achievementDate: {
    display: 'block',
    fontSize: '10px',
    color: '#6366f1',
  },
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(0,0,0,0.2)',
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  progressBar: {
    flex: 1,
    height: '6px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '11px',
    color: '#94a3b8',
    minWidth: '100px',
    textAlign: 'right',
  },
}

export default AchievementBadges