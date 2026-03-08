// pages/Dashboard.jsx
import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import ExpenseForm from '../components/expenses/ExpenseForm'
import ExpenseList from '../components/expenses/ExpenseList'
import SummaryCards from '../components/charts/SummaryCards'
import SpendingChart from '../components/charts/SpendingChart'
import TrendChart from '../components/charts/TrendChart'
import ExportPDF from '../components/expenses/ExportPDF'
import AIAssistant from '../components/ai/AIAssistant'
import BudgetPlanner from '../components/budget/BudgetPlanner'
import QuickStats from '../components/widgets/QuickStats'
import AdvancedAnalytics from '../components/analytics/AdvancedAnalytics'
import QuickActions from '../components/common/QuickActions'
import AchievementBadges from '../components/achievements/AchievementBadges'
import DataInsights from '../components/insights/DataInsights'
import DataVizDashboard from '../components/visualization/DataVizDashboard'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { 
  Plus, X, ChevronLeft, ChevronRight, Sparkles, 
  Calendar, Target, Bell, Zap, TrendingUp, 
  Menu, Grid, List, BarChart3, Download, Share2,
  Settings, Moon, Sun, Eye, EyeOff, Filter,
  Award, AlertCircle, CheckCircle, Clock, Github,
  Activity, PieChart, LineChart, Copy, Printer,
  Maximize2, Save, Image, FileText, Code, Video,
  RefreshCw
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const MONTHS = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
]

const Dashboard = () => {
  const now = new Date()
  const { user, logout } = useAuth()
  
  // State management
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState({ total: 0, byCategory: {}, count: 0 })
  const [trend, setTrend] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [showAIInsights, setShowAIInsights] = useState(false)
  const [showBudget, setShowBudget] = useState(false)
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showDataInsights, setShowDataInsights] = useState(false)
  const [showDataViz, setShowDataViz] = useState(false)
  const [selectedView, setSelectedView] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: 'all',
    minAmount: '',
    maxAmount: '',
    dateRange: 'all',
  })
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [theme, setTheme] = useState('dark')
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [stats, setStats] = useState({
    dailyAvg: 0,
    monthlyProjection: 0,
    bestDay: null,
    streak: 0,
    savingsRate: 0,
  })

  // AI-generated insights
  const [aiInsights, setAiInsights] = useState([])

  // Fetch all data
  const fetchExpenses = async () => {
    try {
      console.log('Fetching expenses for:', selectedMonth, selectedYear)
      const { data } = await api.get('/expenses', {
        params: { month: selectedMonth, year: selectedYear }
      })
      console.log('Expenses fetched:', data)
      setExpenses(data)
      generateNotifications(data, summary)
    } catch (error) {
      console.error('Failed to fetch expenses:', error)
      toast.error('Failed to fetch expenses')
    }
  }

  const fetchSummary = async () => {
    try {
      console.log('Fetching summary for:', selectedMonth, selectedYear)
      const { data } = await api.get('/expenses/summary', {
        params: { month: selectedMonth, year: selectedYear }
      })
      console.log('Summary fetched:', data)
      setSummary(data)
      calculateStats(data, expenses)
    } catch (error) {
      console.error('Failed to fetch summary:', error)
      toast.error('Failed to fetch summary')
    }
  }

  const fetchTrend = async () => {
    try {
      console.log('Fetching trend...')
      const { data } = await api.get('/expenses/trend')
      console.log('Trend fetched:', data)
      setTrend(data)
      generateAIInsights(data, summary)
    } catch (error) {
      console.error('Failed to fetch trend:', error)
      toast.error('Failed to fetch trend')
    } finally {
      setLoading(false)
      setRefreshing(false)
      setLastUpdated(new Date())
    }
  }

  // Calculate statistics
  const calculateStats = (summaryData, expensesData) => {
    if (expensesData.length > 0) {
      const today = new Date()
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      const daysPassed = Math.ceil((today - firstDay) / (1000 * 60 * 60 * 24))
      const dailyAvg = summaryData.total / daysPassed
      const monthlyProjection = dailyAvg * new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

      const dailyTotals = expensesData.reduce((acc, expense) => {
        const date = new Date(expense.date).toDateString()
        acc[date] = (acc[date] || 0) + expense.amount
        return acc
      }, {})

      const bestDay = Object.entries(dailyTotals).sort((a, b) => a[1] - b[1])[0]

      let streak = 0
      const dates = [...new Set(expensesData.map(e => new Date(e.date).toDateString()))].sort()
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

      const savingsRate = trend && trend.length >= 2 
        ? ((trend[trend.length - 1].total - trend[trend.length - 2].total) / trend[trend.length - 2].total * 100).toFixed(1)
        : 0

      setStats({
        dailyAvg,
        monthlyProjection,
        bestDay,
        streak,
        savingsRate,
      })
    }
  }

  // Generate AI insights
  const generateAIInsights = (trendData, summaryData) => {
    const insights = []
    
    const categories = Object.entries(summaryData.byCategory || {})
    if (categories.length > 0) {
      const [topCat, topAmount] = categories.sort((a, b) => b[1] - a[1])[0]
      insights.push({
        id: 1,
        type: 'info',
        icon: <TrendingUp size={14} />,
        title: 'Top Spender',
        message: `${topCat} leads at ৳${topAmount.toFixed(2)}`,
        action: 'Analyze',
      })
    }

    if (trendData && trendData.length >= 2) {
      const lastMonth = trendData[trendData.length - 1]?.total || 0
      const prevMonth = trendData[trendData.length - 2]?.total || 0
      if (prevMonth > 0) {
        const change = ((lastMonth - prevMonth) / prevMonth * 100).toFixed(1)
        
        if (change > 0) {
          insights.push({
            id: 2,
            type: 'warning',
            icon: <AlertCircle size={14} />,
            title: 'Spending Alert',
            message: `Spending up ${change}% from last month`,
            action: 'Review',
          })
        } else if (change < 0) {
          insights.push({
            id: 2,
            type: 'success',
            icon: <CheckCircle size={14} />,
            title: 'Savings Achieved',
            message: `You saved ${Math.abs(change)}% this month!`,
            action: 'Celebrate',
          })
        }
      }
    }

    if (summaryData.total > 0) {
      insights.push({
        id: 3,
        type: 'tip',
        icon: <Target size={14} />,
        title: 'Budget Tip',
        message: 'Set a budget to track your spending goals',
        action: 'Set Budget',
      })
    }

    if (stats.streak > 3) {
      insights.push({
        id: 4,
        type: 'achievement',
        icon: <Award size={14} />,
        title: 'Tracking Streak',
        message: `${stats.streak} day streak! Keep it up!`,
        action: 'View',
      })
    }

    setAiInsights(insights)
  }

  // Generate notifications
  const generateNotifications = (expensesData, summaryData) => {
    const notifs = []
    
    const largeExpense = expensesData.find(e => e.amount > 5000)
    if (largeExpense) {
      notifs.push({
        id: Date.now(),
        type: 'warning',
        message: `Large expense detected: ${largeExpense.title} (৳${largeExpense.amount})`,
        time: 'Just now',
        read: false,
      })
    }

    if (summaryData.count > 20) {
      notifs.push({
        id: Date.now() + 1,
        type: 'success',
        message: `🎉 You've added ${summaryData.count} expenses this month!`,
        time: '5 min ago',
        read: false,
      })
    }

    if (summaryData.count === 0 && expensesData.length === 0) {
      notifs.push({
        id: Date.now() + 2,
        type: 'info',
        message: '👋 Welcome! Start by adding your first expense',
        time: 'Just now',
        read: false,
      })
    }

    setNotifications(prev => [...notifs, ...prev].slice(0, 5))
  }

  // Filter expenses
  const getFilteredExpenses = () => {
    return expenses.filter(expense => {
      if (filters.category !== 'all' && expense.category !== filters.category) return false
      if (filters.minAmount && expense.amount < parseFloat(filters.minAmount)) return false
      if (filters.maxAmount && expense.amount > parseFloat(filters.maxAmount)) return false
      return true
    })
  }

  useEffect(() => {
    setLoading(true)
    fetchExpenses()
    fetchSummary()
    fetchTrend()
  }, [selectedMonth, selectedYear])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchExpenses()
    fetchSummary()
    fetchTrend()
    toast.success('Data refreshed!', { icon: '🔄' })
  }

  const handleExpenseAdded = () => {
    fetchExpenses()
    fetchSummary()
    fetchTrend()
    setShowForm(false)
    setEditingExpense(null)
    toast.success(
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Sparkles size={18} />
        <span>Expense added successfully! ✨</span>
      </div>
    )
  }

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`)
      toast.success('Expense deleted', {
        icon: '🗑️',
      })
      fetchExpenses()
      fetchSummary()
      fetchTrend()
    } catch (error) {
      toast.error('Failed to delete expense')
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingExpense(null)
  }

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12)
      setSelectedYear(selectedYear - 1)
    } else {
      setSelectedMonth(selectedMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1)
      setSelectedYear(selectedYear + 1)
    } else {
      setSelectedMonth(selectedMonth + 1)
    }
  }

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const clearAllNotifications = () => {
    setNotifications([])
    toast.success('All notifications cleared')
  }

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
    toast.success(`Switched to ${theme === 'dark' ? 'light' : 'dark'} mode`)
  }

  const filteredExpenses = getFilteredExpenses()
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div style={{
      ...styles.page,
      background: theme === 'dark' ? '#0a0a0f' : '#f8fafc',
    }}>
      {/* Navbar with all props */}
 <Navbar 
  theme={theme}
  onThemeToggle={handleThemeToggle}
  onOpenAIAssistant={() => {
    // Method 1: Use the global function (preferred)
    if (window.openAIAssistant) {
      window.openAIAssistant()
      toast.success('AI Assistant opened!', { icon: '🤖' })
    } 
    // Method 2: Fallback to clicking the button
    else {
      const aiButton = document.querySelector('[aria-label="Open AI Assistant"]')
      if (aiButton) {
        aiButton.click()
        toast.success('AI Assistant opened!', { icon: '🤖' })
      } else {
        toast.error('AI Assistant not available')
      }
    }
  }}
  onOpenBudget={() => {
    setShowBudget(true)
    toast.success('Budget planner opened!', { icon: '💰' })
  }}
  onOpenNotifications={() => {
    setShowNotifications(!showNotifications)
  }}
  onOpenAnalytics={() => {
    setShowAdvancedAnalytics(true)
    toast.success('Analytics opened!', { icon: '📊' })
  }}
  onOpenAchievements={() => {
    setShowAchievements(true)
    toast.success('Achievements opened!', { icon: '🏆' })
  }}
  notificationCount={unreadCount}
/>

      {/* Background Effects */}
      <div style={styles.backgroundGlow1}></div>
      <div style={styles.backgroundGlow2}></div>
      <div style={styles.gridPattern}></div>
      
      <div style={styles.container}>
        {/* Header Section */}
        <div style={styles.header}>
          <div>
            <div style={styles.welcomeBadge}>
              <Zap size={14} color="#6366f1" />
              <span>Welcome back, {user?.name?.split(' ')[0] || 'User'}</span>
              <span style={styles.lastUpdated}>
                <Clock size={12} />
                {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
            <h1 style={{
              ...styles.title,
              color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
            }}>Financial Dashboard</h1>
            <p style={styles.subtitle}>Track, analyze, and optimize your spending</p>
          </div>
          
          <div style={styles.headerActions}>
            {/* Refresh Button */}
            <button 
              onClick={handleRefresh}
              style={styles.iconBtn}
              disabled={refreshing}
              title="Refresh data"
            >
              <RefreshCw size={18} className={refreshing ? 'spin' : ''} />
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={handleThemeToggle}
              style={styles.iconBtn}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* AI Insights Button */}
            <button
              onClick={() => setShowAIInsights(!showAIInsights)}
              style={{
                ...styles.aiBtn,
                ...(showAIInsights && styles.aiBtnActive)
              }}
            >
              <Sparkles size={18} />
              <span>AI Insights</span>
              {aiInsights.length > 0 && (
                <span style={styles.notificationBadge}>{aiInsights.length}</span>
              )}
            </button>

            {/* Budget Button */}
            <button
              onClick={() => setShowBudget(true)}
              style={styles.budgetBtn}
            >
              <Target size={18} />
              <span>Budget</span>
            </button>

            {/* Analytics Button */}
            <button
              onClick={() => setShowAdvancedAnalytics(true)}
              style={styles.analyticsBtn}
            >
              <BarChart3 size={18} />
              <span>Analytics</span>
            </button>

            {/* Visualization Button */}
            <button
              onClick={() => setShowDataViz(true)}
              style={styles.vizBtn}
            >
              <Activity size={18} />
              <span>Visualize</span>
            </button>

            {/* Achievements Button */}
            <button
              onClick={() => setShowAchievements(true)}
              style={styles.achievementsBtn}
            >
              <Award size={18} />
              <span>Achievements</span>
            </button>

            {/* Export PDF */}
            <ExportPDF
              expenses={filteredExpenses}
              summary={summary}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              userName={user?.name}
            />

            {/* Add Expense Button */}
            <button
              onClick={() => setShowForm(!showForm)}
              style={styles.addBtn}
            >
              {showForm ? <X size={18} /> : <Plus size={18} />}
              <span>{showForm ? 'Cancel' : 'Add Expense'}</span>
            </button>
          </div>
        </div>

        {/* AI Insights Panel */}
        {showAIInsights && (
          <div style={styles.insightsPanel}>
            <div style={styles.insightsHeader}>
              <Sparkles size={16} color="#6366f1" />
              <span style={styles.insightsTitle}>AI-Powered Insights</span>
              <span style={styles.insightsUpdate}>Updated just now</span>
            </div>
            <div style={styles.insightsGrid}>
              {aiInsights.map((insight) => (
                <div key={insight.id} style={{
                  ...styles.insightCard,
                  borderLeftColor: 
                    insight.type === 'warning' ? '#ef4444' :
                    insight.type === 'success' ? '#22c55e' :
                    insight.type === 'tip' ? '#6366f1' : '#f59e0b'
                }}>
                  <div style={styles.insightIcon}>{insight.icon}</div>
                  <div style={styles.insightContent}>
                    <div style={styles.insightTitle}>{insight.title}</div>
                    <span style={styles.insightMessage}>{insight.message}</span>
                  </div>
                  <button style={styles.insightAction}>{insight.action}</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Budget Planner Modal */}
        {showBudget && (
          <div style={styles.modalOverlay} onClick={() => setShowBudget(false)}>
            <div onClick={e => e.stopPropagation()}>
              <BudgetPlanner
                expenses={expenses}
                summary={summary}
                onClose={() => setShowBudget(false)}
              />
            </div>
          </div>
        )}

        {/* Advanced Analytics Modal */}
        {showAdvancedAnalytics && (
          <div style={styles.modalOverlay} onClick={() => setShowAdvancedAnalytics(false)}>
            <div onClick={e => e.stopPropagation()}>
              <AdvancedAnalytics
                expenses={expenses}
                summary={summary}
                trend={trend}
                onClose={() => setShowAdvancedAnalytics(false)}
              />
            </div>
          </div>
        )}

        {/* Data Visualization Modal */}
        {showDataViz && (
          <div style={styles.modalOverlay} onClick={() => setShowDataViz(false)}>
            <div onClick={e => e.stopPropagation()}>
              <DataVizDashboard
                expenses={expenses}
                summary={summary}
                trend={trend}
                onClose={() => setShowDataViz(false)}
              />
            </div>
          </div>
        )}

        {/* Achievements Modal */}
        {showAchievements && (
          <div style={styles.modalOverlay} onClick={() => setShowAchievements(false)}>
            <div onClick={e => e.stopPropagation()}>
              <AchievementBadges
                expenses={expenses}
                summary={summary}
                onClose={() => setShowAchievements(false)}
              />
            </div>
          </div>
        )}

        {/* Data Insights Modal */}
        {showDataInsights && (
          <div style={styles.modalOverlay} onClick={() => setShowDataInsights(false)}>
            <div onClick={e => e.stopPropagation()}>
              <DataInsights
                expenses={expenses}
                summary={summary}
                trend={trend}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onClose={() => setShowDataInsights(false)}
              />
            </div>
          </div>
        )}

        {/* Month Navigator */}
        <div style={styles.monthNavigator}>
          <button onClick={handlePrevMonth} style={styles.navBtn}>
            <ChevronLeft size={20} />
          </button>
          
          <div style={styles.monthDisplay}>
            <Calendar size={18} color="#6366f1" />
            <span style={styles.monthText}>
              {MONTHS[selectedMonth - 1]} {selectedYear}
            </span>
          </div>
          
          <button onClick={handleNextMonth} style={styles.navBtn}>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Quick Stats */}
        <QuickStats 
          expenses={expenses} 
          summary={summary} 
          trend={trend} 
          stats={stats} 
        />

        {/* View Controls */}
        <div style={styles.viewControls}>
          <div style={styles.viewToggle}>
            <button
              onClick={() => setSelectedView('all')}
              style={{
                ...styles.viewBtn,
                ...(selectedView === 'all' && styles.viewBtnActive)
              }}
            >
              <BarChart3 size={14} />
              <span>All</span>
            </button>
            <button
              onClick={() => setSelectedView('charts')}
              style={{
                ...styles.viewBtn,
                ...(selectedView === 'charts' && styles.viewBtnActive)
              }}
            >
              <TrendingUp size={14} />
              <span>Charts</span>
            </button>
            <button
              onClick={() => setSelectedView('list')}
              style={{
                ...styles.viewBtn,
                ...(selectedView === 'list' && styles.viewBtnActive)
              }}
            >
              <List size={14} />
              <span>List</span>
            </button>
          </div>

          <div style={styles.rightControls}>
            {/* Filter Button */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              style={{
                ...styles.filterBtn,
                ...(showFilters && styles.filterBtnActive)
              }}
            >
              <Filter size={14} />
              <span>Filter</span>
              {(filters.category !== 'all' || filters.minAmount || filters.maxAmount) && (
                <span style={styles.filterBadge}>1</span>
              )}
            </button>

            {/* View Mode Toggle */}
            <div style={styles.viewModeToggle}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  ...styles.modeBtn,
                  ...(viewMode === 'grid' && styles.modeBtnActive)
                }}
              >
                <Grid size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  ...styles.modeBtn,
                  ...(viewMode === 'list' && styles.modeBtnActive)
                }}
              >
                <Menu size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div style={styles.filtersPanel}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                style={styles.filterSelect}
              >
                <option value="all">All Categories</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Health">Health</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Education">Education</option>
                <option value="Bills">Bills</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Min Amount</label>
              <input
                type="number"
                value={filters.minAmount}
                onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                placeholder="0"
                style={styles.filterInput}
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Max Amount</label>
              <input
                type="number"
                value={filters.maxAmount}
                onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                placeholder="10000"
                style={styles.filterInput}
              />
            </div>

            <button
              onClick={() => setFilters({ category: 'all', minAmount: '', maxAmount: '', dateRange: 'all' })}
              style={styles.clearFiltersBtn}
            >
              Clear Filters
            </button>
          </div>
        )}

        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loader}></div>
            <p style={styles.loadingText}>Loading your financial data...</p>
            <div style={styles.loadingProgress}>
              <div style={styles.progressBar}>
                <div style={styles.progressFill}></div>
              </div>
              <span style={styles.progressText}>Syncing data...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <SummaryCards summary={summary} />

            {/* Expense Form */}
            {showForm && (
              <div style={styles.formWrapper}>
                <ExpenseForm
                  onSuccess={handleExpenseAdded}
                  editingExpense={editingExpense}
                  onClose={handleCloseForm}
                />
              </div>
            )}

            {/* Charts Section */}
            {(selectedView === 'all' || selectedView === 'charts') && (
              <>
                <TrendChart data={trend} />
                <SpendingChart summary={summary} />
              </>
            )}

            {/* Expense List Section */}
            {(selectedView === 'all' || selectedView === 'list') && (
              <ExpenseList
                expenses={viewMode === 'grid' ? filteredExpenses : filteredExpenses}
                onEdit={handleEdit}
                onDelete={handleDelete}
                viewMode={viewMode}
              />
            )}

            {/* Results Summary */}
            {filteredExpenses.length > 0 && (
              <div style={styles.resultsSummary}>
                <span style={styles.resultsText}>
                  Showing {filteredExpenses.length} of {expenses.length} expenses
                </span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(filteredExpenses, null, 2))
                    toast.success('Data copied to clipboard')
                  }}
                  style={styles.copyBtn}
                >
                  <Share2 size={14} />
                  Share
                </button>
              </div>
            )}

            {/* Quick Stats Footer */}
            {expenses.length > 0 && (
              <div style={styles.statsFooter}>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Total Expenses</span>
                  <span style={styles.statValue}>{expenses.length}</span>
                </div>
                <div style={styles.statDivider} />
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Average/Day</span>
                  <span style={styles.statValue}>
                    ৳ {stats.dailyAvg ? stats.dailyAvg.toFixed(2) : '0.00'}
                  </span>
                </div>
                <div style={styles.statDivider} />
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Largest</span>
                  <span style={styles.statValue}>
                    ৳ {expenses.length > 0 ? Math.max(...expenses.map(e => e.amount)).toFixed(2) : '0.00'}
                  </span>
                </div>
                <div style={styles.statDivider} />
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Streak</span>
                  <span style={styles.statValue}>{stats.streak} days</span>
                </div>
              </div>
            )}

            {/* Empty State */}
            {expenses.length === 0 && !loading && (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📊</div>
                <h3 style={styles.emptyTitle}>No expenses yet</h3>
                <p style={styles.emptyText}>
                  Start tracking your expenses by adding your first transaction
                </p>
                <button 
                  onClick={() => setShowForm(true)}
                  style={styles.emptyBtn}
                >
                  <Plus size={16} />
                  Add Your First Expense
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* AI Assistant */}
      <AIAssistant 
        expenses={expenses} 
        summary={summary} 
        trend={trend} 
      />

      {/* Quick Actions Menu */}
      <QuickActions
        onAddExpense={() => setShowForm(true)}
        onOpenBudget={() => setShowBudget(true)}
        onOpenAchievements={() => setShowAchievements(true)}
        onOpenAnalytics={() => setShowAdvancedAnalytics(true)}
        onOpenInsights={() => setShowDataInsights(true)}
        onOpenVisualization={() => setShowDataViz(true)}
        onExport={() => {
          toast.success('Preparing export...')
        }}
        onThemeToggle={handleThemeToggle}
        onLogout={logout}
        theme={theme}
      />
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    position: 'relative',
    fontFamily: "'Inter', sans-serif",
    transition: 'background 0.3s ease',
  },
  backgroundGlow1: {
    position: 'fixed',
    top: '-50%',
    right: '-20%',
    width: '800px',
    height: '800px',
    background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0) 70%)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    zIndex: 0,
    pointerEvents: 'none',
  },
  backgroundGlow2: {
    position: 'fixed',
    bottom: '-50%',
    left: '-20%',
    width: '800px',
    height: '800px',
    background: 'radial-gradient(circle, rgba(34,211,238,0.1) 0%, rgba(34,211,238,0) 70%)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    zIndex: 0,
    pointerEvents: 'none',
  },
  gridPattern: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px',
    zIndex: 0,
    pointerEvents: 'none',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '32px 24px',
    position: 'relative',
    zIndex: 1,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  welcomeBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(99,102,241,0.1)',
    padding: '6px 12px',
    borderRadius: '30px',
    width: 'fit-content',
    marginBottom: '12px',
    border: '1px solid rgba(99,102,241,0.2)',
    color: '#94a3b8',
    fontSize: '13px',
    fontWeight: '500',
  },
  lastUpdated: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginLeft: '8px',
    paddingLeft: '8px',
    borderLeft: '1px solid rgba(255,255,255,0.1)',
    color: '#64748b',
    fontSize: '11px',
  },
  title: {
    fontSize: '36px',
    fontWeight: '800',
    marginBottom: '8px',
    letterSpacing: '-1px',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '15px',
  },
  headerActions: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  iconBtn: {
    position: 'relative',
    width: '44px',
    height: '44px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '14px',
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
    },
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  aiBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'rgba(99,102,241,0.1)',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: '14px',
    color: '#f1f5f9',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    ':hover': {
      background: 'rgba(99,102,241,0.15)',
      borderColor: 'rgba(99,102,241,0.3)',
    },
  },
  aiBtnActive: {
    background: 'rgba(99,102,241,0.2)',
    borderColor: '#6366f1',
  },
  budgetBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'rgba(34,197,94,0.1)',
    border: '1px solid rgba(34,197,94,0.2)',
    borderRadius: '14px',
    color: '#f1f5f9',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(34,197,94,0.15)',
      borderColor: 'rgba(34,197,94,0.3)',
    },
  },
  analyticsBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'rgba(139,92,246,0.1)',
    border: '1px solid rgba(139,92,246,0.2)',
    borderRadius: '14px',
    color: '#f1f5f9',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(139,92,246,0.15)',
      borderColor: 'rgba(139,92,246,0.3)',
    },
  },
  vizBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'rgba(20,184,166,0.1)',
    border: '1px solid rgba(20,184,166,0.2)',
    borderRadius: '14px',
    color: '#f1f5f9',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(20,184,166,0.15)',
      borderColor: 'rgba(20,184,166,0.3)',
    },
  },
  achievementsBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'rgba(245,158,11,0.1)',
    border: '1px solid rgba(245,158,11,0.2)',
    borderRadius: '14px',
    color: '#f1f5f9',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(245,158,11,0.15)',
      borderColor: 'rgba(245,158,11,0.3)',
    },
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 10px 20px -5px rgba(99,102,241,0.3)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 15px 25px -5px rgba(99,102,241,0.4)',
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
  insightsPanel: {
    background: 'rgba(20,20,30,0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    padding: '20px',
    marginBottom: '28px',
    border: '1px solid rgba(255,255,255,0.05)',
    animation: 'slideIn 0.3s ease',
  },
  insightsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  insightsTitle: {
    color: '#f1f5f9',
    fontSize: '15px',
    fontWeight: '600',
  },
  insightsUpdate: {
    marginLeft: 'auto',
    fontSize: '11px',
    color: '#64748b',
  },
  insightsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '12px',
  },
  insightCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '14px',
    borderLeft: '3px solid',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(255,255,255,0.05)',
    },
  },
  insightIcon: {
    width: '32px',
    height: '32px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: '2px',
  },
  insightMessage: {
    fontSize: '11px',
    color: '#94a3b8',
  },
  insightAction: {
    padding: '4px 10px',
    background: 'rgba(99,102,241,0.1)',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: '20px',
    color: '#6366f1',
    fontSize: '10px',
    fontWeight: '600',
    cursor: 'pointer',
    ':hover': {
      background: 'rgba(99,102,241,0.2)',
    },
  },
  modalOverlay: {
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
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease',
  },
  monthNavigator: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
    background: 'rgba(20,20,30,0.6)',
    backdropFilter: 'blur(10px)',
    padding: '8px 12px',
    borderRadius: '50px',
    border: '1px solid rgba(255,255,255,0.05)',
    width: 'fit-content',
  },
  navBtn: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '30px',
    color: '#94a3b8',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(255,255,255,0.06)',
      color: '#f1f5f9',
    },
  },
  monthDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0 16px',
  },
  monthText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#f1f5f9',
  },
  viewControls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  viewToggle: {
    display: 'flex',
    gap: '6px',
    background: 'rgba(20,20,30,0.6)',
    padding: '4px',
    borderRadius: '40px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  viewBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: 'transparent',
    border: 'none',
    borderRadius: '30px',
    color: '#94a3b8',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      color: '#f1f5f9',
    },
  },
  viewBtnActive: {
    background: 'rgba(99,102,241,0.2)',
    color: '#f1f5f9',
  },
  rightControls: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  filterBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '30px',
    color: '#94a3b8',
    fontSize: '13px',
    cursor: 'pointer',
    position: 'relative',
    ':hover': {
      background: 'rgba(255,255,255,0.05)',
    },
  },
  filterBtnActive: {
    background: 'rgba(99,102,241,0.1)',
    borderColor: 'rgba(99,102,241,0.3)',
    color: '#6366f1',
  },
  filterBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    background: '#6366f1',
    color: 'white',
    fontSize: '9px',
    padding: '2px 4px',
    borderRadius: '8px',
    minWidth: '16px',
    textAlign: 'center',
  },
  viewModeToggle: {
    display: 'flex',
    gap: '4px',
    background: 'rgba(20,20,30,0.6)',
    padding: '4px',
    borderRadius: '30px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  modeBtn: {
    padding: '8px',
    background: 'transparent',
    border: 'none',
    borderRadius: '30px',
    color: '#94a3b8',
    cursor: 'pointer',
    ':hover': {
      color: '#f1f5f9',
    },
  },
  modeBtnActive: {
    background: 'rgba(99,102,241,0.2)',
    color: '#6366f1',
  },
  filtersPanel: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    padding: '20px',
    background: 'rgba(20,20,30,0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    marginBottom: '24px',
    border: '1px solid rgba(255,255,255,0.05)',
    animation: 'slideIn 0.2s ease',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  filterLabel: {
    fontSize: '11px',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  filterSelect: {
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '12px',
    color: '#f1f5f9',
    fontSize: '13px',
    outline: 'none',
    ':focus': {
      borderColor: '#6366f1',
    },
  },
  filterInput: {
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '12px',
    color: '#f1f5f9',
    fontSize: '13px',
    outline: 'none',
    ':focus': {
      borderColor: '#6366f1',
    },
  },
  clearFiltersBtn: {
    padding: '10px',
    background: 'transparent',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '12px',
    color: '#ef4444',
    fontSize: '13px',
    cursor: 'pointer',
    alignSelf: 'flex-end',
    ':hover': {
      background: 'rgba(239,68,68,0.1)',
    },
  },
  formWrapper: {
    marginBottom: '28px',
    animation: 'slideIn 0.3s ease',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    background: 'rgba(20,20,30,0.4)',
    backdropFilter: 'blur(10px)',
    borderRadius: '30px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  loader: {
    width: '48px',
    height: '48px',
    border: '3px solid rgba(99,102,241,0.2)',
    borderRadius: '50%',
    borderTopColor: '#6366f1',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  loadingText: {
    color: '#f1f5f9',
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '16px',
  },
  loadingProgress: {
    width: '200px',
    textAlign: 'center',
  },
  progressBar: {
    width: '100%',
    height: '4px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  progressFill: {
    width: '60%',
    height: '100%',
    background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
    animation: 'progress 2s ease-in-out infinite',
  },
  progressText: {
    fontSize: '11px',
    color: '#64748b',
  },
  resultsSummary: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '16px',
    padding: '12px 16px',
    background: 'rgba(20,20,30,0.4)',
    borderRadius: '30px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  resultsText: {
    fontSize: '13px',
    color: '#94a3b8',
  },
  copyBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '20px',
    color: '#94a3b8',
    fontSize: '12px',
    cursor: 'pointer',
    ':hover': {
      background: 'rgba(255,255,255,0.05)',
    },
  },
  statsFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
    marginTop: '32px',
    padding: '20px',
    background: 'rgba(20,20,30,0.4)',
    backdropFilter: 'blur(10px)',
    borderRadius: '30px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  statLabel: {
    fontSize: '11px',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  statValue: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#f1f5f9',
  },
  statDivider: {
    width: '1px',
    height: '30px',
    background: 'rgba(255,255,255,0.1)',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    background: 'rgba(20,20,30,0.4)',
    backdropFilter: 'blur(10px)',
    borderRadius: '30px',
    border: '1px solid rgba(255,255,255,0.05)',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px',
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: '8px',
  },
  emptyText: {
    color: '#64748b',
    fontSize: '14px',
    marginBottom: '24px',
    maxWidth: '300px',
  },
  emptyBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '40px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 15px 25px -5px rgba(99,102,241,0.4)',
    },
  },

  '@global': {
    '@keyframes spin': {
      to: { transform: 'rotate(360deg)' },
    },
    '@keyframes pulse': {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 },
    },
    '@keyframes fadeIn': {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    '@keyframes slideIn': {
      from: { transform: 'translateY(-10px)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 },
    },
    '@keyframes progress': {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(400%)' },
    },
  },
}

export default Dashboard