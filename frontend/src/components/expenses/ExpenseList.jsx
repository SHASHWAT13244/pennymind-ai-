import { Pencil, Trash2, Calendar, Tag, MoreVertical, Eye, Copy, Archive } from 'lucide-react'
import { useState } from 'react'

const CATEGORY_COLORS = {
  Food: '#22c55e',
  Transport: '#22d3ee',
  Shopping: '#a855f7',
  Health: '#ef4444',
  Entertainment: '#f59e0b',
  Education: '#6366f1',
  Bills: '#ec4899',
  Other: '#94a3b8',
}

const CATEGORY_GRADIENTS = {
  Food: 'linear-gradient(135deg, #22c55e20, #22c55e05)',
  Transport: 'linear-gradient(135deg, #22d3ee20, #22d3ee05)',
  Shopping: 'linear-gradient(135deg, #a855f720, #a855f705)',
  Health: 'linear-gradient(135deg, #ef444420, #ef444405)',
  Entertainment: 'linear-gradient(135deg, #f59e0b20, #f59e0b05)',
  Education: 'linear-gradient(135deg, #6366f120, #6366f105)',
  Bills: 'linear-gradient(135deg, #ec489920, #ec489905)',
  Other: 'linear-gradient(135deg, #94a3b820, #94a3b805)',
}

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [hoveredExpense, setHoveredExpense] = useState(null)

  if (expenses.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>💰</div>
        <p style={styles.emptyTitle}>No expenses yet</p>
        <p style={styles.emptyText}>Add your first expense to start tracking</p>
        <button style={styles.emptyBtn} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Add Expense
        </button>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Recent Expenses</h3>
        <span style={styles.count}>{expenses.length} items</span>
      </div>
      
      <div style={styles.list}>
        {expenses.map((expense) => (
          <div
            key={expense._id}
            style={{
              ...styles.card,
              ...(hoveredExpense === expense._id && styles.cardHovered),
              background: CATEGORY_GRADIENTS[expense.category] || 'rgba(255,255,255,0.02)',
              borderLeft: `3px solid ${CATEGORY_COLORS[expense.category] || '#94a3b8'}`,
            }}
            onMouseEnter={() => setHoveredExpense(expense._id)}
            onMouseLeave={() => setHoveredExpense(null)}
          >
            <div style={styles.left}>
              <div style={{
                ...styles.categoryDot,
                background: CATEGORY_COLORS[expense.category] || '#94a3b8',
              }} />
              <div>
                <p style={styles.expenseTitle}>{expense.title}</p>
                <div style={styles.meta}>
                  <span style={styles.metaItem}>
                    <Tag size={11} />
                    {expense.category}
                  </span>
                  <span style={styles.metaItem}>
                    <Calendar size={11} />
                    {new Date(expense.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  {expense.note && (
                    <span style={styles.note}>📝 {expense.note}</span>
                  )}
                </div>
              </div>
            </div>

            <div style={styles.right}>
              <span style={styles.amount}>৳ {expense.amount.toFixed(2)}</span>
              <div style={styles.actions}>
                <button
                  onClick={() => onEdit(expense)}
                  style={styles.editBtn}
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => onDelete(expense._id)}
                  style={styles.deleteBtn}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Quick action tooltip on hover */}
            {hoveredExpense === expense._id && (
              <div style={styles.quickActions}>
                <button style={styles.quickAction} title="Copy">
                  <Copy size={12} />
                </button>
                <button style={styles.quickAction} title="Archive">
                  <Archive size={12} />
                </button>
                <button style={styles.quickAction} title="More">
                  <MoreVertical size={12} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary footer */}
      <div style={styles.footer}>
        <div style={styles.footerItem}>
          <span style={styles.footerLabel}>Total</span>
          <span style={styles.footerValue}>
            ৳ {expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
          </span>
        </div>
        <div style={styles.footerDivider} />
        <div style={styles.footerItem}>
          <span style={styles.footerLabel}>Average</span>
          <span style={styles.footerValue}>
            ৳ {(expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: 'rgba(30, 41, 59, 0.4)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    padding: '24px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#f1f5f9',
  },
  count: {
    fontSize: '13px',
    padding: '4px 10px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '20px',
    color: '#94a3b8',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 18px',
    background: 'rgba(15, 23, 42, 0.6)',
    borderRadius: '18px',
    border: '1px solid rgba(255,255,255,0.03)',
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden',
  },
  cardHovered: {
    transform: 'translateX(4px)',
    borderColor: 'rgba(255,255,255,0.1)',
    boxShadow: '0 10px 20px -10px rgba(0,0,0,0.5)',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  categoryDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    flexShrink: 0,
    boxShadow: '0 0 0 2px rgba(255,255,255,0.05)',
  },
  expenseTitle: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#f1f5f9',
    marginBottom: '6px',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    color: '#64748b',
  },
  note: {
    fontSize: '11px',
    color: '#475569',
    fontStyle: 'italic',
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  amount: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#f1f5f9',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  editBtn: {
    padding: '8px',
    background: 'rgba(99,102,241,0.1)',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: '10px',
    color: '#6366f1',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(99,102,241,0.2)',
      transform: 'scale(1.1)',
    },
  },
  deleteBtn: {
    padding: '8px',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '10px',
    color: '#ef4444',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(239,68,68,0.2)',
      transform: 'scale(1.1)',
    },
  },
  quickActions: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    display: 'flex',
    gap: '4px',
    background: 'rgba(15,23,42,0.9)',
    backdropFilter: 'blur(4px)',
    padding: '4px',
    borderRadius: '30px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  quickAction: {
    padding: '6px',
    background: 'transparent',
    border: 'none',
    borderRadius: '20px',
    color: '#94a3b8',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(255,255,255,0.1)',
      color: '#f1f5f9',
    },
  },
  empty: {
    background: 'rgba(30, 41, 59, 0.4)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    padding: '60px 20px',
    border: '1px solid rgba(255,255,255,0.05)',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: '8px',
  },
  emptyText: {
    color: '#64748b',
    fontSize: '14px',
    marginBottom: '20px',
  },
  emptyBtn: {
    padding: '12px 28px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '40px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 20px -5px rgba(99,102,241,0.3)',
    },
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '20px',
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  footerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  footerLabel: {
    fontSize: '12px',
    color: '#64748b',
  },
  footerValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#f1f5f9',
  },
  footerDivider: {
    width: '1px',
    height: '20px',
    background: 'rgba(255,255,255,0.1)',
  },
}

export default ExpenseList