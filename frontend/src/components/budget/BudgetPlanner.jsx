// components/budget/BudgetPlanner.jsx
import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Target, TrendingUp, AlertCircle, Edit2, Check, X, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Education', 'Bills', 'Other']
const COLORS = ['#6366f1', '#22d3ee', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#ec4899', '#14b8a6']

const BudgetPlanner = ({ expenses, summary, onClose }) => {
  const [budgets, setBudgets] = useState(() => {
    // Initialize budgets from localStorage or defaults
    const saved = localStorage.getItem('budgets')
    if (saved) return JSON.parse(saved)
    
    // Default budgets
    return CATEGORIES.reduce((acc, cat) => {
      acc[cat] = {
        amount: cat === 'Food' ? 5000 : 
                cat === 'Transport' ? 3000 :
                cat === 'Shopping' ? 4000 :
                cat === 'Bills' ? 8000 : 2000,
        enabled: true,
      }
      return acc
    }, {})
  })

  const [editing, setEditing] = useState(null)
  const [editValue, setEditValue] = useState('')

  const handleSaveBudget = (category) => {
    const amount = parseFloat(editValue)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    const newBudgets = {
      ...budgets,
      [category]: {
        ...budgets[category],
        amount,
      },
    }
    setBudgets(newBudgets)
    localStorage.setItem('budgets', JSON.stringify(newBudgets))
    setEditing(null)
    toast.success('Budget updated!')
  }

  const toggleBudget = (category) => {
    const newBudgets = {
      ...budgets,
      [category]: {
        ...budgets[category],
        enabled: !budgets[category].enabled,
      },
    }
    setBudgets(newBudgets)
    localStorage.setItem('budgets', JSON.stringify(newBudgets))
  }

  // Calculate spending vs budget
  const spending = summary.byCategory || {}
  const budgetData = CATEGORIES.map(cat => ({
    name: cat,
    budget: budgets[cat]?.enabled ? budgets[cat].amount : 0,
    spent: spending[cat] || 0,
    remaining: (budgets[cat]?.enabled ? budgets[cat].amount : 0) - (spending[cat] || 0),
    percent: budgets[cat]?.enabled ? ((spending[cat] || 0) / budgets[cat].amount * 100).toFixed(1) : 0,
  }))

  const totalBudget = budgetData.reduce((sum, cat) => sum + cat.budget, 0)
  const totalSpent = budgetData.reduce((sum, cat) => sum + cat.spent, 0)
  const totalRemaining = totalBudget - totalSpent

  // Chart data for budget vs actual
  const chartData = [
    { name: 'Spent', value: totalSpent, color: '#6366f1' },
    { name: 'Remaining', value: Math.max(totalRemaining, 0), color: '#22c55e' },
  ]

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            <Target size={20} color="#6366f1" />
          </div>
          <div>
            <h3 style={styles.title}>Budget Planner</h3>
            <p style={styles.subtitle}>Track and manage your spending limits</p>
          </div>
        </div>
        <button onClick={onClose} style={styles.closeBtn}>
          <X size={18} />
        </button>
      </div>

      {/* Summary Card */}
      <div style={styles.summaryCard}>
        <div style={styles.summaryLeft}>
          <span style={styles.summaryLabel}>Total Budget</span>
          <span style={styles.summaryValue}>৳ {totalBudget.toFixed(2)}</span>
          <span style={styles.summarySub}>
            Spent: ৳ {totalSpent.toFixed(2)} · Remaining: ৳ {totalRemaining.toFixed(2)}
          </span>
        </div>
        <div style={styles.chartContainer}>
          <ResponsiveContainer width={80} height={80}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={35}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget Progress */}
      <div style={styles.budgetList}>
        {budgetData.map((cat, index) => (
          <div key={cat.name} style={styles.budgetItem}>
            <div style={styles.budgetHeader}>
              <div style={styles.categoryInfo}>
                <div style={{
                  ...styles.categoryDot,
                  background: COLORS[index % COLORS.length],
                }} />
                <span style={styles.categoryName}>{cat.name}</span>
                {!budgets[cat.name]?.enabled && (
                  <span style={styles.disabledBadge}>Disabled</span>
                )}
              </div>
              
              {editing === cat.name ? (
                <div style={styles.editContainer}>
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    style={styles.editInput}
                    autoFocus
                  />
                  <button onClick={() => handleSaveBudget(cat.name)} style={styles.editSaveBtn}>
                    <Check size={14} />
                  </button>
                  <button onClick={() => setEditing(null)} style={styles.editCancelBtn}>
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div style={styles.budgetActions}>
                  <span style={styles.budgetAmount}>
                    ৳ {cat.spent.toFixed(2)} / ৳ {cat.budget.toFixed(2)}
                  </span>
                  <button
                    onClick={() => {
                      setEditing(cat.name)
                      setEditValue(cat.budget.toString())
                    }}
                    style={styles.editBtn}
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => toggleBudget(cat.name)}
                    style={{
                      ...styles.toggleBtn,
                      background: budgets[cat.name]?.enabled 
                        ? 'rgba(34,197,94,0.1)' 
                        : 'rgba(239,68,68,0.1)',
                      color: budgets[cat.name]?.enabled ? '#22c55e' : '#ef4444',
                    }}
                  >
                    {budgets[cat.name]?.enabled ? 'On' : 'Off'}
                  </button>
                </div>
              )}
            </div>

            {budgets[cat.name]?.enabled && (
              <div style={styles.progressContainer}>
                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${Math.min(cat.percent, 100)}%`,
                      background: cat.percent > 100 
                        ? '#ef4444' 
                        : cat.percent > 80 
                          ? '#f59e0b' 
                          : '#22c55e',
                    }}
                  />
                </div>
                <span style={{
                  ...styles.percentLabel,
                  color: cat.percent > 100 ? '#ef4444' : '#94a3b8',
                }}>
                  {cat.percent}%
                </span>
              </div>
            )}

            {cat.remaining < 0 && budgets[cat.name]?.enabled && (
              <div style={styles.warning}>
                <AlertCircle size={12} color="#ef4444" />
                <span>Over budget by ৳ {Math.abs(cat.remaining).toFixed(2)}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Insights */}
      <div style={styles.insights}>
        <div style={styles.insightsHeader}>
          <TrendingUp size={14} color="#6366f1" />
          <span style={styles.insightsTitle}>Budget Insights</span>
        </div>
        <ul style={styles.insightsList}>
          {budgetData.filter(c => c.percent > 100).length > 0 && (
            <li style={styles.insightItem}>
              ⚠️ You're over budget in {budgetData.filter(c => c.percent > 100).length} categories
            </li>
          )}
          {totalRemaining > 0 && (
            <li style={styles.insightItem}>
              💰 You have ৳ {totalRemaining.toFixed(2)} remaining this month
            </li>
          )}
          {budgetData.filter(c => c.percent < 50 && c.percent > 0).length > 0 && (
            <li style={styles.insightItem}>
              📊 You're under budget in {budgetData.filter(c => c.percent < 50).length} categories
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: 'rgba(30, 41, 59, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '24px',
    border: '1px solid rgba(255,255,255,0.1)',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
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
    color: '#64748b',
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
  summaryCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '20px',
    marginBottom: '24px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  summaryLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  summaryLabel: {
    fontSize: '12px',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  summaryValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#f1f5f9',
  },
  summarySub: {
    fontSize: '11px',
    color: '#94a3b8',
  },
  chartContainer: {
    width: '80px',
    height: '80px',
  },
  budgetList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px',
  },
  budgetItem: {
    padding: '12px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  budgetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  categoryInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  categoryDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  categoryName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#f1f5f9',
  },
  disabledBadge: {
    fontSize: '10px',
    padding: '2px 6px',
    background: 'rgba(100,116,139,0.2)',
    borderRadius: '20px',
    color: '#64748b',
  },
  budgetActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  budgetAmount: {
    fontSize: '13px',
    color: '#94a3b8',
  },
  editBtn: {
    padding: '6px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '8px',
    color: '#6366f1',
    cursor: 'pointer',
    ':hover': {
      background: 'rgba(99,102,241,0.1)',
    },
  },
  toggleBtn: {
    padding: '4px 8px',
    border: 'none',
    borderRadius: '20px',
    fontSize: '10px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  editContainer: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
  },
  editInput: {
    width: '80px',
    padding: '6px 8px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid #6366f1',
    borderRadius: '8px',
    color: '#f1f5f9',
    fontSize: '12px',
    outline: 'none',
  },
  editSaveBtn: {
    padding: '6px',
    background: 'rgba(34,197,94,0.1)',
    border: '1px solid rgba(34,197,94,0.2)',
    borderRadius: '8px',
    color: '#22c55e',
    cursor: 'pointer',
  },
  editCancelBtn: {
    padding: '6px',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '8px',
    color: '#ef4444',
    cursor: 'pointer',
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  percentLabel: {
    fontSize: '11px',
    minWidth: '40px',
    textAlign: 'right',
  },
  warning: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginTop: '8px',
    padding: '6px 10px',
    background: 'rgba(239,68,68,0.1)',
    borderRadius: '20px',
    fontSize: '11px',
    color: '#ef4444',
  },
  insights: {
    padding: '16px',
    background: 'rgba(99,102,241,0.1)',
    borderRadius: '16px',
    border: '1px solid rgba(99,102,241,0.2)',
  },
  insightsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  insightsTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#f1f5f9',
  },
  insightsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  insightItem: {
    fontSize: '12px',
    color: '#94a3b8',
    padding: '4px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
}

export default BudgetPlanner