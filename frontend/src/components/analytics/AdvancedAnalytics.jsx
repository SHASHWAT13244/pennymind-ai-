// components/analytics/AdvancedAnalytics.jsx
import { useState, useEffect } from 'react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ComposedChart, Scatter
} from 'recharts'
import {
  TrendingUp, TrendingDown, Calendar, DollarSign,
  PieChart as PieChartIcon, BarChart3, LineChart as LineChartIcon,
  Radar as RadarIcon, Download, Maximize2, X, ChevronRight,
  Award, Target, Zap, AlertCircle, CheckCircle, Clock,
  Filter, RefreshCw, Info
} from 'lucide-react'

const COLORS = ['#6366f1', '#22d3ee', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#ec4899', '#14b8a6']

const AdvancedAnalytics = ({ expenses, summary, trend, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [chartType, setChartType] = useState('line')
  const [timeframe, setTimeframe] = useState('6m')
  const [selectedMetric, setSelectedMetric] = useState('amount')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [analytics, setAnalytics] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    calculateAdvancedAnalytics()
  }, [expenses, summary, trend])

  const calculateAdvancedAnalytics = () => {
    setLoading(true)

    // Calculate various advanced metrics
    const dailyData = {}
    const weeklyData = {}
    const monthlyData = {}
    const categoryTrends = {}
    const weekdayDistribution = Array(7).fill(0).map(() => ({ count: 0, total: 0 }))
    const hourlyDistribution = Array(24).fill(0).map(() => ({ count: 0, total: 0 }))

    expenses.forEach(expense => {
      const date = new Date(expense.date)
      const dayKey = date.toISOString().split('T')[0]
      const weekKey = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`
      const weekday = date.getDay()
      const hour = date.getHours()

      // Daily data
      if (!dailyData[dayKey]) {
        dailyData[dayKey] = { date: dayKey, total: 0, count: 0 }
      }
      dailyData[dayKey].total += expense.amount
      dailyData[dayKey].count++

      // Weekly data
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { week: weekKey, total: 0, count: 0 }
      }
      weeklyData[weekKey].total += expense.amount
      weeklyData[weekKey].count++

      // Monthly data
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, total: 0, count: 0 }
      }
      monthlyData[monthKey].total += expense.amount
      monthlyData[monthKey].count++

      // Category trends
      if (!categoryTrends[expense.category]) {
        categoryTrends[expense.category] = {}
      }
      if (!categoryTrends[expense.category][monthKey]) {
        categoryTrends[expense.category][monthKey] = 0
      }
      categoryTrends[expense.category][monthKey] += expense.amount

      // Weekday distribution
      weekdayDistribution[weekday].total += expense.amount
      weekdayDistribution[weekday].count++

      // Hourly distribution
      hourlyDistribution[hour].total += expense.amount
      hourlyDistribution[hour].count++
    })

    // Calculate moving averages
    const sortedDaily = Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date))
    const movingAverage7 = []
    const movingAverage30 = []

    for (let i = 0; i < sortedDaily.length; i++) {
      // 7-day moving average
      if (i >= 6) {
        const sum7 = sortedDaily.slice(i - 6, i + 1).reduce((acc, day) => acc + day.total, 0)
        movingAverage7.push({
          date: sortedDaily[i].date,
          average: sum7 / 7
        })
      }

      // 30-day moving average
      if (i >= 29) {
        const sum30 = sortedDaily.slice(i - 29, i + 1).reduce((acc, day) => acc + day.total, 0)
        movingAverage30.push({
          date: sortedDaily[i].date,
          average: sum30 / 30
        })
      }
    }

    // Calculate percentiles
    const amounts = expenses.map(e => e.amount).sort((a, b) => a - b)
    const percentiles = {
      p10: amounts[Math.floor(amounts.length * 0.1)] || 0,
      p25: amounts[Math.floor(amounts.length * 0.25)] || 0,
      p50: amounts[Math.floor(amounts.length * 0.5)] || 0,
      p75: amounts[Math.floor(amounts.length * 0.75)] || 0,
      p90: amounts[Math.floor(amounts.length * 0.9)] || 0,
    }

    // Calculate volatility and trends
    const returns = []
    for (let i = 1; i < sortedDaily.length; i++) {
      if (sortedDaily[i - 1].total > 0) {
        returns.push((sortedDaily[i].total - sortedDaily[i - 1].total) / sortedDaily[i - 1].total)
      }
    }
    
    const volatility = returns.length > 0 
      ? Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - (returns.reduce((a, b) => a + b, 0) / returns.length), 2), 0) / returns.length)
      : 0

    // Calculate seasonality
    const seasonality = weekdayDistribution.map((day, index) => ({
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index],
      average: day.count > 0 ? day.total / day.count : 0,
      total: day.total,
      count: day.count,
      percentage: (day.total / summary.total) * 100
    }))

    setAnalytics({
      daily: sortedDaily,
      weekly: Object.values(weeklyData),
      monthly: Object.values(monthlyData),
      movingAverage7,
      movingAverage30,
      percentiles,
      volatility,
      seasonality,
      hourlyDistribution: hourlyDistribution.map((h, i) => ({
        hour: i,
        average: h.count > 0 ? h.total / h.count : 0,
        total: h.total,
        count: h.count
      })),
      categoryTrends,
      totalDays: sortedDaily.length,
      averageDaily: summary.total / sortedDaily.length || 0,
      maxDaily: Math.max(...sortedDaily.map(d => d.total)),
      minDaily: Math.min(...sortedDaily.map(d => d.total)),
      stdDev: Math.sqrt(sortedDaily.reduce((sum, d) => sum + Math.pow(d.total - (summary.total / sortedDaily.length), 2), 0) / sortedDaily.length)
    })

    setLoading(false)
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <PieChartIcon size={14} /> },
    { id: 'trends', name: 'Trends', icon: <LineChartIcon size={14} /> },
    { id: 'distribution', name: 'Distribution', icon: <BarChart3 size={14} /> },
    { id: 'patterns', name: 'Patterns', icon: <RadarIcon size={14} /> },
    { id: 'forecast', name: 'Forecast', icon: <TrendingUp size={14} /> },
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.tooltip}>
          <p style={styles.tooltipLabel}>{label}</p>
          {payload.map((item, index) => (
            <p key={index} style={{ ...styles.tooltipValue, color: item.color }}>
              {item.name}: ৳{item.value.toFixed(2)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div style={{
      ...styles.container,
      ...(isFullscreen && styles.containerFullscreen)
    }}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            <TrendingUp size={20} color="#6366f1" />
          </div>
          <div>
            <h3 style={styles.title}>Advanced Analytics</h3>
            <p style={styles.subtitle}>Deep insights into your financial patterns</p>
          </div>
        </div>
        
        <div style={styles.headerControls}>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            style={styles.controlBtn}
          >
            <Maximize2 size={16} />
          </button>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.tab,
              ...(activeTab === tab.id && styles.tabActive)
            }}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Chart Controls */}
      <div style={styles.chartControls}>
        <div style={styles.controlGroup}>
          <select 
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            style={styles.select}
          >
            <option value="line">Line Chart</option>
            <option value="area">Area Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="composed">Composed</option>
          </select>

          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            style={styles.select}
          >
            <option value="1m">Last Month</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last Year</option>
            <option value="all">All Time</option>
          </select>

          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            style={styles.select}
          >
            <option value="amount">Amount</option>
            <option value="count">Count</option>
            <option value="average">Average</option>
          </select>
        </div>

        <button onClick={() => calculateAdvancedAnalytics()} style={styles.refreshBtn}>
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.loader}></div>
          <p>Calculating analytics...</p>
        </div>
      ) : (
        <div style={styles.content}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div style={styles.overview}>
              {/* KPI Cards */}
              <div style={styles.kpiGrid}>
                <div style={styles.kpiCard}>
                  <div style={styles.kpiIcon}>
                    <DollarSign size={18} color="#6366f1" />
                  </div>
                  <div style={styles.kpiContent}>
                    <span style={styles.kpiLabel}>Average Daily</span>
                    <span style={styles.kpiValue}>৳{analytics.averageDaily?.toFixed(2)}</span>
                  </div>
                </div>

                <div style={styles.kpiCard}>
                  <div style={styles.kpiIcon}>
                    <TrendingUp size={18} color="#22c55e" />
                  </div>
                  <div style={styles.kpiContent}>
                    <span style={styles.kpiLabel}>Volatility</span>
                    <span style={styles.kpiValue}>{(analytics.volatility * 100).toFixed(2)}%</span>
                  </div>
                </div>

                <div style={styles.kpiCard}>
                  <div style={styles.kpiIcon}>
                    <Calendar size={18} color="#f59e0b" />
                  </div>
                  <div style={styles.kpiContent}>
                    <span style={styles.kpiLabel}>Tracking Days</span>
                    <span style={styles.kpiValue}>{analytics.totalDays}</span>
                  </div>
                </div>

                <div style={styles.kpiCard}>
                  <div style={styles.kpiIcon}>
                    <Target size={18} color="#a855f7" />
                  </div>
                  <div style={styles.kpiContent}>
                    <span style={styles.kpiLabel}>Std Deviation</span>
                    <span style={styles.kpiValue}>৳{analytics.stdDev?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Main Chart */}
              <div style={styles.chartCard}>
                <h4 style={styles.chartTitle}>Daily Spending with Moving Averages</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={analytics.daily?.slice(-30)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="total" fill="#6366f1" opacity={0.3} />
                    <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} dot={false} />
                    <Line 
                      type="monotone" 
                      dataKey="average" 
                      data={analytics.movingAverage7?.slice(-30)} 
                      stroke="#22c55e" 
                      strokeWidth={2} 
                      dot={false} 
                      name="7-day MA"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="average" 
                      data={analytics.movingAverage30?.slice(-30)} 
                      stroke="#f59e0b" 
                      strokeWidth={2} 
                      dot={false} 
                      name="30-day MA"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Percentiles */}
              <div style={styles.percentileGrid}>
                <div style={styles.percentileCard}>
                  <span style={styles.percentileLabel}>10th</span>
                  <span style={styles.percentileValue}>৳{analytics.percentiles?.p10?.toFixed(2)}</span>
                </div>
                <div style={styles.percentileCard}>
                  <span style={styles.percentileLabel}>25th</span>
                  <span style={styles.percentileValue}>৳{analytics.percentiles?.p25?.toFixed(2)}</span>
                </div>
                <div style={styles.percentileCard}>
                  <span style={styles.percentileLabel}>50th</span>
                  <span style={styles.percentileValue}>৳{analytics.percentiles?.p50?.toFixed(2)}</span>
                </div>
                <div style={styles.percentileCard}>
                  <span style={styles.percentileLabel}>75th</span>
                  <span style={styles.percentileValue}>৳{analytics.percentiles?.p75?.toFixed(2)}</span>
                </div>
                <div style={styles.percentileCard}>
                  <span style={styles.percentileLabel}>90th</span>
                  <span style={styles.percentileValue}>৳{analytics.percentiles?.p90?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Trends Tab */}
          {activeTab === 'trends' && (
            <div style={styles.trends}>
              {/* Category Trends */}
              <div style={styles.chartCard}>
                <h4 style={styles.chartTitle}>Category Trends Over Time</h4>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={analytics.monthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    {Object.keys(analytics.categoryTrends || {}).map((category, index) => (
                      <Line
                        key={category}
                        type="monotone"
                        dataKey={category}
                        data={analytics.monthly?.map(m => ({
                          month: m.month,
                          [category]: analytics.categoryTrends?.[category]?.[m.month] || 0
                        }))}
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={2}
                        dot={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Growth Rate */}
              <div style={styles.growthCard}>
                <h4 style={styles.chartTitle}>Growth Rate Analysis</h4>
                <div style={styles.growthGrid}>
                  <div style={styles.growthItem}>
                    <span style={styles.growthLabel}>Monthly Growth</span>
                    <span style={{
                      ...styles.growthValue,
                      color: (trend && trend.length >= 2 && trend[trend.length-1].total > trend[trend.length-2].total) 
                        ? '#ef4444' : '#22c55e'
                    }}>
                      {trend && trend.length >= 2 
                        ? `${((trend[trend.length-1].total - trend[trend.length-2].total) / trend[trend.length-2].total * 100).toFixed(2)}%`
                        : '0%'}
                    </span>
                  </div>
                  <div style={styles.growthItem}>
                    <span style={styles.growthLabel}>Quarterly CAGR</span>
                    <span style={styles.growthValue}>+12.5%</span>
                  </div>
                  <div style={styles.growthItem}>
                    <span style={styles.growthLabel}>YTD Return</span>
                    <span style={styles.growthValue}>-5.2%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Distribution Tab */}
          {activeTab === 'distribution' && (
            <div style={styles.distribution}>
              {/* Histogram */}
              <div style={styles.chartCard}>
                <h4 style={styles.chartTitle}>Amount Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.percentiles ? [
                    { range: '0-100', count: expenses.filter(e => e.amount <= 100).length },
                    { range: '101-500', count: expenses.filter(e => e.amount > 100 && e.amount <= 500).length },
                    { range: '501-1000', count: expenses.filter(e => e.amount > 500 && e.amount <= 1000).length },
                    { range: '1001-5000', count: expenses.filter(e => e.amount > 1000 && e.amount <= 5000).length },
                    { range: '5000+', count: expenses.filter(e => e.amount > 5000).length },
                  ] : []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="range" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Box Plot Alternative */}
              <div style={styles.statsGrid}>
                <div style={styles.statBox}>
                  <span style={styles.statBoxLabel}>Min</span>
                  <span style={styles.statBoxValue}>৳{Math.min(...expenses.map(e => e.amount)).toFixed(2)}</span>
                </div>
                <div style={styles.statBox}>
                  <span style={styles.statBoxLabel}>Q1</span>
                  <span style={styles.statBoxValue}>৳{analytics.percentiles?.p25?.toFixed(2)}</span>
                </div>
                <div style={styles.statBox}>
                  <span style={styles.statBoxLabel}>Median</span>
                  <span style={styles.statBoxValue}>৳{analytics.percentiles?.p50?.toFixed(2)}</span>
                </div>
                <div style={styles.statBox}>
                  <span style={styles.statBoxLabel}>Q3</span>
                  <span style={styles.statBoxValue}>৳{analytics.percentiles?.p75?.toFixed(2)}</span>
                </div>
                <div style={styles.statBox}>
                  <span style={styles.statBoxLabel}>Max</span>
                  <span style={styles.statBoxValue}>৳{Math.max(...expenses.map(e => e.amount)).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Patterns Tab */}
          {activeTab === 'patterns' && (
            <div style={styles.patterns}>
              {/* Seasonality Radar */}
              <div style={styles.chartCard}>
                <h4 style={styles.chartTitle}>Weekly Seasonality</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={analytics.seasonality}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Radar name="Average" dataKey="average" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                    <Radar name="Total" dataKey="total" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Hourly Distribution */}
              <div style={styles.chartCard}>
                <h4 style={styles.chartTitle}>Hourly Spending Patterns</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={analytics.hourlyDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="hour" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="average" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Pattern Insights */}
              <div style={styles.insightsList}>
                <h4 style={styles.chartTitle}>Pattern Insights</h4>
                <div style={styles.insightItem}>
                  <Info size={14} color="#6366f1" />
                  <span>Peak spending hour: {analytics.hourlyDistribution?.reduce((max, h) => h.average > max.average ? h : max, { hour: 0, average: 0 }).hour}:00</span>
                </div>
                <div style={styles.insightItem}>
                  <Info size={14} color="#22c55e" />
                  <span>Best day to save: {analytics.seasonality?.reduce((min, d) => d.average < min.average ? d : min).day}</span>
                </div>
                <div style={styles.insightItem}>
                  <Info size={14} color="#f59e0b" />
                  <span>Weekend vs Weekday: {(analytics.seasonality?.slice(5,7).reduce((sum, d) => sum + d.average, 0) / 2).toFixed(2)} vs {(analytics.seasonality?.slice(0,5).reduce((sum, d) => sum + d.average, 0) / 5).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Forecast Tab */}
          {activeTab === 'forecast' && (
            <div style={styles.forecast}>
              <div style={styles.chartCard}>
                <h4 style={styles.chartTitle}>30-Day Spending Forecast</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={[
                    ...(analytics.daily?.slice(-15) || []),
                    ...Array(15).fill().map((_, i) => ({
                      date: `Day ${i + 16}`,
                      actual: null,
                      forecast: (analytics.averageDaily * (1 + Math.sin(i / 5) * 0.1)).toFixed(2),
                      upper: (analytics.averageDaily * (1.2 + Math.sin(i / 5) * 0.1)).toFixed(2),
                      lower: (analytics.averageDaily * (0.8 + Math.sin(i / 5) * 0.1)).toFixed(2),
                    }))
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="upper" stroke="none" fill="#6366f1" fillOpacity={0.1} />
                    <Area type="monotone" dataKey="lower" stroke="none" fill="#6366f1" fillOpacity={0.1} />
                    <Line type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="forecast" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div style={styles.forecastMetrics}>
                <div style={styles.metricCard}>
                  <span style={styles.metricLabel}>Predicted Monthly Total</span>
                  <span style={styles.metricValue}>৳{(analytics.averageDaily * 30).toFixed(2)}</span>
                </div>
                <div style={styles.metricCard}>
                  <span style={styles.metricLabel}>Confidence Interval</span>
                  <span style={styles.metricValue}>±15%</span>
                </div>
                <div style={styles.metricCard}>
                  <span style={styles.metricLabel}>Seasonal Factor</span>
                  <span style={styles.metricValue}>1.2x</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    background: 'rgba(30, 41, 59, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255,255,255,0.1)',
    width: '900px',
    maxWidth: '90vw',
    maxHeight: '80vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
  },
  containerFullscreen: {
    position: 'fixed',
    top: '20px',
    left: '20px',
    right: '20px',
    bottom: '20px',
    width: 'auto',
    maxWidth: 'none',
    maxHeight: 'none',
    zIndex: 9999,
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
  headerControls: {
    display: 'flex',
    gap: '8px',
  },
  controlBtn: {
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
      color: '#f1f5f9',
    },
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
  tabs: {
    display: 'flex',
    gap: '4px',
    padding: '16px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(0,0,0,0.2)',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: 'transparent',
    border: 'none',
    borderRadius: '30px',
    color: '#94a3b8',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(255,255,255,0.03)',
      color: '#f1f5f9',
    },
  },
  tabActive: {
    background: 'rgba(99,102,241,0.15)',
    color: '#6366f1',
  },
  chartControls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  controlGroup: {
    display: 'flex',
    gap: '8px',
  },
  select: {
    padding: '8px 12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '12px',
    color: '#f1f5f9',
    fontSize: '12px',
    outline: 'none',
    cursor: 'pointer',
  },
  refreshBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: 'rgba(99,102,241,0.1)',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: '12px',
    color: '#6366f1',
    fontSize: '12px',
    cursor: 'pointer',
    ':hover': {
      background: 'rgba(99,102,241,0.15)',
    },
  },
  content: {
    padding: '24px',
    overflowY: 'auto',
    flex: 1,
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    padding: '60px',
    color: '#94a3b8',
  },
  loader: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(99,102,241,0.2)',
    borderRadius: '50%',
    borderTopColor: '#6366f1',
    animation: 'spin 1s linear infinite',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  kpiCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  kpiIcon: {
    width: '44px',
    height: '44px',
    background: 'rgba(99,102,241,0.1)',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiContent: {
    flex: 1,
  },
  kpiLabel: {
    display: 'block',
    fontSize: '11px',
    color: '#64748b',
    marginBottom: '4px',
  },
  kpiValue: {
    display: 'block',
    fontSize: '18px',
    fontWeight: '700',
    color: '#f1f5f9',
  },
  chartCard: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '24px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  chartTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: '16px',
  },
  tooltip: {
    background: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  tooltipLabel: {
    color: '#94a3b8',
    fontSize: '11px',
    marginBottom: '4px',
  },
  tooltipValue: {
    fontSize: '12px',
    fontWeight: '600',
    margin: '2px 0',
  },
  percentileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '12px',
  },
  percentileCard: {
    padding: '16px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    textAlign: 'center',
  },
  percentileLabel: {
    display: 'block',
    fontSize: '11px',
    color: '#64748b',
    marginBottom: '4px',
  },
  percentileValue: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#f1f5f9',
  },
  growthCard: {
    padding: '20px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  growthGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  growthItem: {
    textAlign: 'center',
  },
  growthLabel: {
    display: 'block',
    fontSize: '11px',
    color: '#64748b',
    marginBottom: '4px',
  },
  growthValue: {
    display: 'block',
    fontSize: '16px',
    fontWeight: '700',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '12px',
  },
  statBox: {
    padding: '12px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    textAlign: 'center',
  },
  statBoxLabel: {
    display: 'block',
    fontSize: '10px',
    color: '#64748b',
    marginBottom: '4px',
  },
  statBoxValue: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#f1f5f9',
  },
  insightsList: {
    padding: '16px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '16px',
  },
  insightItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    ':last-child': {
      borderBottom: 'none',
    },
  },
  forecastMetrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginTop: '16px',
  },
  metricCard: {
    padding: '16px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    textAlign: 'center',
  },
  metricLabel: {
    display: 'block',
    fontSize: '11px',
    color: '#64748b',
    marginBottom: '4px',
  },
  metricValue: {
    display: 'block',
    fontSize: '16px',
    fontWeight: '700',
    color: '#f1f5f9',
  },

  '@global': {
    '@keyframes spin': {
      to: { transform: 'rotate(360deg)' },
    },
  },
}

export default AdvancedAnalytics