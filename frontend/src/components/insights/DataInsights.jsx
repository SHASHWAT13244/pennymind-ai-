// components/insights/DataInsights.jsx
import { useState } from 'react'
import {
  TrendingUp, TrendingDown, Calendar, DollarSign,
  PieChart, BarChart3, Target, Award, X,
  ChevronRight, AlertCircle, CheckCircle, Clock
} from 'lucide-react'

const DataInsights = ({ expenses, summary, trend, onClose }) => {
  const [selectedInsight, setSelectedInsight] = useState(null)

  // Calculate detailed insights
  const calculateInsights = () => {
    const insights = []

    // Spending patterns by day of week
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dayTotals = Array(7).fill(0)
    const dayCounts = Array(7).fill(0)

    expenses.forEach(expense => {
      const day = new Date(expense.date).getDay()
      dayTotals[day] += expense.amount
      dayCounts[day]++
    })

    const highestSpendingDay = dayTotals.indexOf(Math.max(...dayTotals))
    const lowestSpendingDay = dayTotals.indexOf(Math.min(...dayTotals.filter(d => d > 0)))

    insights.push({
      id: 1,
      title: 'Peak Spending Day',
      value: dayNames[highestSpendingDay],
      description: `You spend the most on ${dayNames[highestSpendingDay]}s`,
      icon: <Calendar size={16} />,
      color: '#6366f1',
      data: dayTotals,
    })

    insights.push({
      id: 2,
      title: 'Best Saving Day',
      value: dayNames[lowestSpendingDay],
      description: `You spend the least on ${dayNames[lowestSpendingDay]}s`,
      icon: <TrendingDown size={16} />,
      color: '#22c55e',
      data: dayTotals,
    })

    // Category distribution
    const categories = Object.entries(summary.byCategory || {})
    if (categories.length > 0) {
      const [topCat, topAmount] = categories.sort((a, b) => b[1] - a[1])[0]
      insights.push({
        id: 3,
        title: 'Top Category',
        value: topCat,
        description: `Spent ৳${topAmount.toFixed(2)} on ${topCat}`,
        icon: <PieChart size={16} />,
        color: '#f59e0b',
      })
    }

    // Average transaction
    const avgAmount = summary.count > 0 ? summary.total / summary.count : 0
    insights.push({
      id: 4,
      title: 'Average Transaction',
      value: `৳${avgAmount.toFixed(2)}`,
      description: 'Per expense average',
      icon: <DollarSign size={16} />,
      color: '#22d3ee',
    })

    // Monthly trend
    if (trend && trend.length >= 2) {
      const lastMonth = trend[trend.length - 1].total
      const prevMonth = trend[trend.length - 2].total
      const change = ((lastMonth - prevMonth) / prevMonth * 100).toFixed(1)
      
      insights.push({
        id: 5,
        title: 'Month over Month',
        value: `${change > 0 ? '+' : ''}${change}%`,
        description: change > 0 ? 'Spending increased' : 'Spending decreased',
        icon: change > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />,
        color: change > 0 ? '#ef4444' : '#22c55e',
      })
    }

    // Transaction frequency
    const daysWithExpenses = new Set(expenses.map(e => new Date(e.date).toDateString())).size
    const totalDays = new Date(selectedYear, selectedMonth, 0).getDate()
    const frequency = (daysWithExpenses / totalDays * 100).toFixed(1)

    insights.push({
      id: 6,
      title: 'Tracking Frequency',
      value: `${frequency}%`,
      description: `You track expenses on ${frequency}% of days`,
      icon: <Clock size={16} />,
      color: '#a855f7',
    })

    return insights
  }

  const insights = calculateInsights()

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            <BarChart3 size={20} color="#6366f1" />
          </div>
          <div>
            <h3 style={styles.title}>Data Insights</h3>
            <p style={styles.subtitle}>Deep dive into your spending patterns</p>
          </div>
        </div>
        <button onClick={onClose} style={styles.closeBtn}>
          <X size={18} />
        </button>
      </div>

      <div style={styles.content}>
        {/* Main insights grid */}
        <div style={styles.insightsGrid}>
          {insights.map((insight) => (
            <div
              key={insight.id}
              style={styles.insightCard}
              onClick={() => setSelectedInsight(insight)}
            >
              <div style={styles.insightHeader}>
                <div style={{
                  ...styles.insightIcon,
                  background: `${insight.color}15`,
                  color: insight.color,
                }}>
                  {insight.icon}
                </div>
                <ChevronRight size={16} color="#64748b" />
              </div>
              <div style={styles.insightValue}>{insight.value}</div>
              <div style={styles.insightTitle}>{insight.title}</div>
              <div style={styles.insightDescription}>{insight.description}</div>
            </div>
          ))}
        </div>

        {/* Spending by day chart */}
        <div style={styles.chartSection}>
          <h4 style={styles.chartTitle}>Spending by Day of Week</h4>
          <div style={styles.barChart}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
              const max = Math.max(...insights.find(i => i.data)?.data || [1])
              const value = insights.find(i => i.data)?.data[index] || 0
              const height = (value / max) * 100
              
              return (
                <div key={day} style={styles.barContainer}>
                  <div style={styles.barWrapper}>
                    <div
                      style={{
                        ...styles.bar,
                        height: `${height}%`,
                        background: index === 5 || index === 6 ? '#6366f1' : '#22c55e',
                      }}
                    />
                  </div>
                  <span style={styles.barLabel}>{day}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div style={styles.recommendations}>
          <h4 style={styles.recommendationsTitle}>Smart Recommendations</h4>
          <div style={styles.recommendationsList}>
            {insights[0]?.value === 'Saturday' && (
              <div style={styles.recommendation}>
                <AlertCircle size={16} color="#f59e0b" />
                <span>You spend most on weekends. Consider meal prepping on Fridays!</span>
              </div>
            )}
            {summary.total > 5000 && (
              <div style={styles.recommendation}>
                <Target size={16} color="#6366f1" />
                <span>Set a monthly budget of ৳{Math.round(summary.total * 0.8)} to save 20%</span>
              </div>
            )}
            {insights[5]?.value < '50%' && (
              <div style={styles.recommendation}>
                <CheckCircle size={16} color="#22c55e" />
                <span>Track expenses daily to improve your financial awareness</span>
              </div>
            )}
            {categories.length < 5 && (
              <div style={styles.recommendation}>
                <PieChart size={16} color="#a855f7" />
                <span>Use more categories to better understand your spending</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick tips */}
        <div style={styles.tips}>
          <div style={styles.tip}>
            <div style={styles.tipDot} />
            <span style={styles.tipText}>Review your expenses weekly to spot trends</span>
          </div>
          <div style={styles.tip}>
            <div style={styles.tipDot} />
            <span style={styles.tipText}>Set savings goals for each category</span>
          </div>
          <div style={styles.tip}>
            <div style={styles.tipDot} />
            <span style={styles.tipText}>Use AI suggestions to categorize faster</span>
          </div>
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
    width: '600px',
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
    background: 'rgba(99,102,241,0.1)',
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
  insightsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
    marginBottom: '24px',
  },
  insightCard: {
    padding: '16px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.05)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(255,255,255,0.03)',
      transform: 'translateY(-2px)',
    },
  },
  insightHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  insightIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: '4px',
  },
  insightTitle: {
    fontSize: '12px',
    color: '#94a3b8',
    marginBottom: '4px',
  },
  insightDescription: {
    fontSize: '11px',
    color: '#64748b',
  },
  chartSection: {
    marginBottom: '24px',
  },
  chartTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: '16px',
  },
  barChart: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: '8px',
    height: '150px',
  },
  barContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  barWrapper: {
    width: '100%',
    height: '120px',
    display: 'flex',
    alignItems: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: '4px',
    transition: 'height 0.3s ease',
  },
  barLabel: {
    fontSize: '10px',
    color: '#64748b',
  },
  recommendations: {
    marginBottom: '24px',
  },
  recommendationsTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: '12px',
  },
  recommendationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  recommendation: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    fontSize: '12px',
    color: '#e2e8f0',
  },
  tips: {
    background: 'rgba(99,102,241,0.1)',
    borderRadius: '16px',
    padding: '16px',
  },
  tip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    ':last-child': {
      borderBottom: 'none',
    },
  },
  tipDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#6366f1',
  },
  tipText: {
    fontSize: '12px',
    color: '#94a3b8',
  },
}

export default DataInsights