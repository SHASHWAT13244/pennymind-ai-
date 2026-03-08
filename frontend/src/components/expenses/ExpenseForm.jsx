import { useState, useEffect } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { PlusCircle, Save, Sparkles, X, Calendar, Tag, DollarSign, Bot, RefreshCw } from 'lucide-react'

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Education', 'Bills', 'Other']

const ExpenseForm = ({ onSuccess, editingExpense, onClose }) => {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'Other',
    date: new Date().toISOString().split('T')[0],
    note: '',
  })
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState([])
  const [showAiPanel, setShowAiPanel] = useState(false)

  useEffect(() => {
    if (editingExpense) {
      setForm({
        title: editingExpense.title,
        amount: editingExpense.amount,
        category: editingExpense.category,
        date: new Date(editingExpense.date).toISOString().split('T')[0],
        note: editingExpense.note || '',
      })
    }
  }, [editingExpense])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAISuggest = async () => {
    if (!form.title.trim()) {
      toast.error('Please enter a title first', {
        icon: '🤔',
      })
      return
    }
    setAiLoading(true)
    setShowAiPanel(true)
    try {
      const { data } = await api.post('/ai/suggest-category', { title: form.title })
      setForm({ ...form, category: data.category })
      setAiSuggestions([
        data.category,
        ...CATEGORIES.filter(c => c !== data.category).slice(0, 2)
      ])
      toast.success(
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bot size={16} />
          <span>AI suggested: {data.category}</span>
        </div>
      )
    } catch (error) {
      toast.error('AI suggestion failed', {
        icon: '😵',
      })
    } finally {
      setAiLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingExpense) {
        await api.put(`/expenses/${editingExpense._id}`, form)
        toast.success(
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} />
            <span>Expense updated! ✨</span>
          </div>
        )
      } else {
        await api.post('/expenses', form)
        toast.success(
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} />
            <span>Expense added! 🎉</span>
          </div>
        )
      }
      onSuccess()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <Bot size={20} color="#6366f1" />
          <h3 style={styles.title}>
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </h3>
        </div>
        <button onClick={onClose} style={styles.closeBtn}>
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.grid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <Tag size={14} />
              Title
            </label>
            <div style={styles.titleRow}>
              <input
                type="text"
                name="title"
                placeholder="e.g. Lunch at restaurant"
                value={form.title}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <button
                type="button"
                onClick={handleAISuggest}
                disabled={aiLoading}
                style={{
                  ...styles.aiBtn,
                  ...(aiLoading && styles.aiBtnLoading)
                }}
                title="AI Suggest Category"
              >
                {aiLoading ? <RefreshCw size={16} className="spin" /> : <Bot size={16} />}
                <span>AI Suggest</span>
              </button>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <DollarSign size={14} />
              Amount (৳)
            </label>
            <input
              type="number"
              name="amount"
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <Sparkles size={14} />
              Category
              {form.category !== 'Other' && (
                <span style={styles.aiTag}>AI suggested</span>
              )}
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={styles.input}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <Calendar size={14} />
              Date
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
        </div>

        {/* AI Suggestions Panel */}
        {showAiPanel && aiSuggestions.length > 0 && (
          <div style={styles.aiPanel}>
            <div style={styles.aiPanelHeader}>
              <Bot size={14} color="#6366f1" />
              <span style={styles.aiPanelTitle}>AI Suggestions</span>
            </div>
            <div style={styles.suggestionChips}>
              {aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setForm({ ...form, category: suggestion })}
                  style={{
                    ...styles.suggestionChip,
                    ...(form.category === suggestion && styles.suggestionChipActive)
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={styles.inputGroup}>
          <label style={styles.label}>Note (optional)</label>
          <textarea
            name="note"
            placeholder="Any additional details..."
            value={form.note}
            onChange={handleChange}
            rows={2}
            style={{ ...styles.input, ...styles.textarea }}
          />
        </div>

        <div style={styles.buttons}>
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? (
              <>
                <RefreshCw size={16} className="spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                {editingExpense ? <Save size={16} /> : <PlusCircle size={16} />}
                <span>{editingExpense ? 'Update Expense' : 'Add Expense'}</span>
              </>
            )}
          </button>
        </div>
      </form>

      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

const styles = {
  card: {
    background: 'rgba(30, 41, 59, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    padding: '28px',
    border: '1px solid rgba(99,102,241,0.2)',
    boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1) inset',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#f1f5f9',
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
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(255,255,255,0.06)',
      color: '#ef4444',
    },
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  aiTag: {
    fontSize: '10px',
    background: 'rgba(99,102,241,0.2)',
    color: '#6366f1',
    padding: '2px 8px',
    borderRadius: '20px',
    fontWeight: '600',
  },
  titleRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  input: {
    padding: '14px 16px',
    background: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '14px',
    color: '#f1f5f9',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    transition: 'all 0.2s ease',
    ':focus': {
      borderColor: '#6366f1',
      boxShadow: '0 0 0 3px rgba(99,102,241,0.2)',
    },
  },
  textarea: {
    resize: 'vertical',
    minHeight: '80px',
  },
  aiBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '14px 18px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    fontSize: '13px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 8px 15px -5px rgba(99,102,241,0.3)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 20px -5px rgba(99,102,241,0.4)',
    },
  },
  aiBtnLoading: {
    opacity: 0.8,
    cursor: 'not-allowed',
  },
  aiPanel: {
    background: 'rgba(99,102,241,0.1)',
    borderRadius: '16px',
    padding: '16px',
    border: '1px solid rgba(99,102,241,0.2)',
  },
  aiPanelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  aiPanelTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#f1f5f9',
  },
  suggestionChips: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  suggestionChip: {
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '30px',
    color: '#94a3b8',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(99,102,241,0.2)',
      borderColor: '#6366f1',
    },
  },
  suggestionChipActive: {
    background: 'rgba(99,102,241,0.3)',
    borderColor: '#6366f1',
    color: '#f1f5f9',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '8px',
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 32px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '40px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 10px 20px -5px rgba(99,102,241,0.3)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 15px 25px -5px rgba(99,102,241,0.4)',
    },
  },
}

export default ExpenseForm