// components/widgets/QuickStats.jsx
import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Calendar, Target, Award, Zap } from 'lucide-react'

const QuickStats = ({ expenses, summary, trend }) => {
  const [stats, setStats] = useState({
    dailyAvg: 0,
    monthlyProjection: 0,
    bestDay: null,
    streak: 0,
  })

  useEffect(() => {
    if (expenses.length > 0) {
      // Calculate daily average
      const today = new Date()
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      const daysPassed = Math.ceil((today - firstDay) / (1000 * 60 * 60 * 24))
      const dailyAvg = summary.total / daysPassed

      // Calculate monthly projection
      const monthlyProjection = dailyAvg * new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

      // Find best day (lowest spending)
      const dailyTotals = expenses.reduce((acc, expense) => {
        const date = new Date(expense.date).toDateString()
        acc[date] = (acc[date] || 0) + expense.amount
        return acc
      }, {})

      const bestDay = Object.entries(dailyTotals).sort((a, b) => a[1] - b[1])[0]

      // Calculate streak (consecutive days with expenses)
      let streak = 0
      const dates = [...new Set(expenses.map(e => new Date(e.date).toDateString()))].sort()
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

      setStats({
        dailyAvg,
        monthlyProjection,
        bestDay,
        streak,
      })
    }
  }, [expenses, summary])

  const statCards = [
    {
      title: 'Daily Average',
      value: `৳ ${stats.dailyAvg.toFixed(2)}`,
      icon: <Calendar size={16} />,
      change: trend && trend.length >= 2 
        ? ((trend[trend.length - 1].total - stats.dailyAvg * 30) / (stats.dailyAvg * 30) * 100).toFixed(1)
        : 0,
      color: '#6366f1',
    },
    {
      title: 'Projected Monthly',
      value: `৳ ${stats.monthlyProjection.toFixed(2)}`,
      icon: <Target size={16} />,
      warning: stats.monthlyProjection > summary.total * 1.2,
      color: '#f59e0b',
    },
    {
      title: 'Best Day',
      value: stats.bestDay 
        ? `৳ ${stats.bestDay[1].toFixed(2)}` 
        : 'No data',
      subtitle: stats.bestDay?.split(' ').slice(1, 3).join(' '),
      icon: <Award size={16} />,
      color: '#22c55e',
    },
    {
      title: 'Tracking Streak',
      value: `${stats.streak} ${stats.streak === 1 ? 'day' : 'days'}`,
      icon: <Zap size={16} />,
      subtitle: 'consecutive',
      color: '#22d3ee',
    },
  ]

  return (
    <div style={styles.grid}>
      {statCards.map((stat, index) => (
        <div key={index} style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={{...styles.icon, color: stat.color, background: `${stat.color}15`}}>
              {stat.icon}
            </div>
            <span style={styles.cardTitle}>{stat.title}</span>
          </div>
          <div style={styles.cardValue}>{stat.value}</div>
          {stat.subtitle && (
            <div style={styles.cardSubtitle}>{stat.subtitle}</div>
          )}
          {stat.change !== undefined && (
            <div style={styles.changeContainer}>
              {stat.change > 0 ? (
                <>
                  <TrendingUp size={12} color="#ef4444" />
                  <span style={{...styles.changeText, color: '#ef4444'}}>
                    {stat.change}% vs last month
                  </span>
                </>
              ) : stat.change < 0 ? (
                <>
                  <TrendingDown size={12} color="#22c55e" />
                  <span style={{...styles.changeText, color: '#22c55e'}}>
                    {Math.abs(stat.change)}% vs last month
                  </span>
                </>
              ) : null}
            </div>
          )}
          {stat.warning && (
            <div style={styles.warning}>
              ⚠️ Above average
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '24px',
  },
  card: {
    background: 'rgba(30, 41, 59, 0.4)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '16px',
    border: '1px solid rgba(255,255,255,0.05)',
    transition: 'all 0.2s ease',
    ':hover': {
      transform: 'translateY(-2px)',
      borderColor: 'rgba(99,102,241,0.2)',
    },
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  icon: {
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  cardValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: '4px',
  },
  cardSubtitle: {
    fontSize: '11px',
    color: '#64748b',
  },
  changeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginTop: '8px',
  },
  changeText: {
    fontSize: '11px',
  },
  warning: {
    marginTop: '8px',
    fontSize: '11px',
    color: '#ef4444',
    background: 'rgba(239,68,68,0.1)',
    padding: '4px 8px',
    borderRadius: '20px',
    display: 'inline-block',
  },
}

export default QuickStats