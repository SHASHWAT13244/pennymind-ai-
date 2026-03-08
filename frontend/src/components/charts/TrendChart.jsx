import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from 'recharts'
import { useState } from 'react'
import { TrendingUp as TrendingIcon, Calendar, Filter } from 'lucide-react'

const TrendChart = ({ data }) => {
  const [timeRange, setTimeRange] = useState('6m') // 3m, 6m, 1y
  const [chartType, setChartType] = useState('area') // area, line

  if (!data || data.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>📈</div>
        <p style={styles.emptyTitle}>No trend data yet</p>
        <p style={styles.emptyText}>Add expenses over time to see your spending trends</p>
      </div>
    )
  }

  // Calculate average for reference line
  const average = data.reduce((sum, item) => sum + item.total, 0) / data.length

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.tooltip}>
          <p style={styles.tooltipMonth}>{label}</p>
          <p style={styles.tooltipValue}>৳ {payload[0].value.toFixed(2)}</p>
          {payload[0].value > average && (
            <p style={styles.tooltipWarning}>↑ Above average</p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <div style={styles.titleIcon}>
            <TrendingIcon size={18} color="#6366f1" />
          </div>
          <div>
            <h3 style={styles.title}>Spending Trend</h3>
            <p style={styles.subtitle}>Last 6 months overview</p>
          </div>
        </div>

        <div style={styles.controls}>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            style={styles.select}
          >
            <option value="3m">Last 3 months</option>
            <option value="6m">Last 6 months</option>
            <option value="1y">Last year</option>
          </select>

          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            style={styles.select}
          >
            <option value="area">Area Chart</option>
            <option value="line">Line Chart</option>
          </select>
        </div>
      </div>

      <div style={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={300}>
          {chartType === 'area' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={{ stroke: '#334155' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={{ stroke: '#334155' }}
                tickLine={false}
                tickFormatter={(value) => `৳${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine 
                y={average} 
                stroke="#f59e0b" 
                strokeDasharray="3 3"
                label={{ 
                  value: 'Avg', 
                  fill: '#f59e0b', 
                  fontSize: 11,
                  position: 'right' 
                }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#6366f1"
                strokeWidth={3}
                fill="url(#trendGradient)"
                dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#22d3ee' }}
              />
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={{ stroke: '#334155' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={{ stroke: '#334155' }}
                tickLine={false}
                tickFormatter={(value) => `৳${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine 
                y={average} 
                stroke="#f59e0b" 
                strokeDasharray="3 3"
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#22d3ee' }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Summary stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Highest</span>
          <span style={styles.statValue}>
            ৳ {Math.max(...data.map(d => d.total)).toFixed(2)}
          </span>
          <span style={styles.statMonth}>
            {data.find(d => d.total === Math.max(...data.map(d => d.total)))?.month}
          </span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Lowest</span>
          <span style={styles.statValue}>
            ৳ {Math.min(...data.map(d => d.total)).toFixed(2)}
          </span>
          <span style={styles.statMonth}>
            {data.find(d => d.total === Math.min(...data.map(d => d.total)))?.month}
          </span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Average</span>
          <span style={styles.statValue}>৳ {average.toFixed(2)}</span>
          <span style={styles.statMonth}>per month</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Total</span>
          <span style={styles.statValue}>
            ৳ {data.reduce((sum, d) => sum + d.total, 0).toFixed(2)}
          </span>
          <span style={styles.statMonth}>all time</span>
        </div>
      </div>

      {/* Trend indicator */}
      <div style={styles.trendFooter}>
        <div style={styles.trendIndicator}>
          <span style={styles.trendDot}></span>
          <span style={styles.trendText}>
            {data.length >= 2 ? (
              data[data.length - 1].total > data[0].total 
                ? '↑ Spending is increasing' 
                : '↓ Spending is decreasing'
            ) : 'Not enough data for trend'}
          </span>
        </div>
        <span style={styles.updateText}>Updated just now</span>
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
    marginBottom: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  titleSection: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  titleIcon: {
    width: '40px',
    height: '40px',
    background: 'rgba(99,102,241,0.1)',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '12px',
    color: '#64748b',
  },
  controls: {
    display: 'flex',
    gap: '8px',
  },
  select: {
    padding: '8px 12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '12px',
    color: '#f1f5f9',
    fontSize: '13px',
    outline: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      borderColor: 'rgba(99,102,241,0.3)',
    },
  },
  chartContainer: {
    marginBottom: '24px',
  },
  tooltip: {
    background: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
  },
  tooltipMonth: {
    color: '#94a3b8',
    fontSize: '11px',
    marginBottom: '4px',
  },
  tooltipValue: {
    color: '#6366f1',
    fontSize: '16px',
    fontWeight: '700',
  },
  tooltipWarning: {
    color: '#ef4444',
    fontSize: '11px',
    marginTop: '4px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px',
    marginBottom: '20px',
  },
  statCard: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '16px',
    padding: '16px',
    textAlign: 'center',
  },
  statLabel: {
    display: 'block',
    fontSize: '11px',
    color: '#64748b',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  statValue: {
    display: 'block',
    fontSize: '18px',
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: '4px',
  },
  statMonth: {
    fontSize: '11px',
    color: '#94a3b8',
  },
  trendFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  trendIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  trendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#22c55e',
    animation: 'pulse 2s infinite',
  },
  trendText: {
    fontSize: '13px',
    color: '#94a3b8',
  },
  updateText: {
    fontSize: '11px',
    color: '#475569',
  },
  empty: {
    background: 'rgba(30, 41, 59, 0.4)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    padding: '60px 20px',
    border: '1px solid rgba(255,255,255,0.05)',
    textAlign: 'center',
    marginBottom: '24px',
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
  },

  '@global': {
    '@keyframes pulse': {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 },
    },
  },
}

export default TrendChart