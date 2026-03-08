import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis,
  ResponsiveContainer, Legend
} from 'recharts'
import { useState } from 'react'
import { PieChart as PieChartIcon, BarChart as BarChartIcon, Download, Maximize2 } from 'lucide-react'

const COLORS = ['#6366f1', '#22d3ee', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#ec4899', '#14b8a6']

const SpendingChart = ({ summary }) => {
  const [chartType, setChartType] = useState('pie')
  const [expanded, setExpanded] = useState(false)

  const data = Object.entries(summary.byCategory || {}).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }))

  if (data.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>📊</div>
        <p style={styles.emptyTitle}>No data to visualize</p>
        <p style={styles.emptyText}>Add some expenses to see beautiful charts</p>
      </div>
    )
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const percent = ((payload[0].value / total) * 100).toFixed(1)
      return (
        <div style={styles.tooltip}>
          <p style={styles.tooltipTitle}>{payload[0].name}</p>
          <p style={styles.tooltipValue}>৳ {payload[0].value.toFixed(2)}</p>
          <p style={styles.tooltipPercent}>{percent}% of total</p>
        </div>
      )
    }
    return null
  }

  const downloadChart = () => {
    // In a real app, this would download the chart as PNG
    alert('Chart download feature coming soon!')
  }

  return (
    <div style={{
      ...styles.container,
      ...(expanded && styles.containerExpanded)
    }}>
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <h3 style={styles.title}>Spending Analytics</h3>
          <span style={styles.subtitle}>Category breakdown</span>
        </div>
        
        <div style={styles.controls}>
          <div style={styles.chartToggle}>
            <button
              onClick={() => setChartType('pie')}
              style={{
                ...styles.toggleBtn,
                ...(chartType === 'pie' && styles.toggleBtnActive)
              }}
            >
              <PieChartIcon size={16} />
            </button>
            <button
              onClick={() => setChartType('bar')}
              style={{
                ...styles.toggleBtn,
                ...(chartType === 'bar' && styles.toggleBtnActive)
              }}
            >
              <BarChartIcon size={16} />
            </button>
          </div>
          
          <button onClick={downloadChart} style={styles.iconBtn}>
            <Download size={16} />
          </button>
          
          <button 
            onClick={() => setExpanded(!expanded)} 
            style={styles.iconBtn}
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      <div style={styles.chartContainer}>
        {chartType === 'pie' ? (
          <ResponsiveContainer width="100%" height={expanded ? 500 : 300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={expanded ? 100 : 60}
                outerRadius={expanded ? 160 : 100}
                paddingAngle={2}
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={index} 
                    fill={COLORS[index % COLORS.length]}
                    style={{
                      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.filter = 'drop-shadow(0 8px 12px rgba(99,102,241,0.3))'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.filter = 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px',
                  color: '#94a3b8',
                }}
                formatter={(value) => (
                  <span style={{ color: '#e2e8f0', fontSize: '12px' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={expanded ? 500 : 300}>
            <BarChart 
              data={data} 
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              layout={expanded ? 'vertical' : 'horizontal'}
            >
              <XAxis 
                type={expanded ? 'number' : 'category'}
                dataKey={expanded ? undefined : 'name'}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis 
                type={expanded ? 'category' : 'number'}
                dataKey={expanded ? 'name' : undefined}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={{ stroke: '#334155' }}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                radius={[6, 6, 0, 0]}
                animationDuration={1000}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={index} 
                    fill={COLORS[index % COLORS.length]}
                    style={{
                      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend with percentages */}
      <div style={styles.legendGrid}>
        {data.map((item, index) => {
          const percent = ((item.value / total) * 100).toFixed(1)
          return (
            <div key={index} style={styles.legendItem}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '4px',
                  background: COLORS[index % COLORS.length],
                }} />
                <span style={styles.legendName}>{item.name}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={styles.legendValue}>৳ {item.value.toFixed(2)}</span>
                <span style={styles.legendPercent}>({percent}%)</span>
              </div>
            </div>
          )
        })}
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
    transition: 'all 0.3s ease',
  },
  containerExpanded: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90vw',
    height: '90vh',
    zIndex: 1000,
    background: '#1e293b',
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  titleSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#f1f5f9',
  },
  subtitle: {
    fontSize: '12px',
    color: '#64748b',
  },
  controls: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  chartToggle: {
    display: 'flex',
    gap: '4px',
    background: 'rgba(255,255,255,0.03)',
    padding: '4px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  toggleBtn: {
    padding: '8px 12px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: '#94a3b8',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnActive: {
    background: 'rgba(99,102,241,0.2)',
    color: '#6366f1',
  },
  iconBtn: {
    padding: '8px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '10px',
    color: '#94a3b8',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ':hover': {
      background: 'rgba(255,255,255,0.06)',
      color: '#f1f5f9',
    },
  },
  chartContainer: {
    marginBottom: '20px',
  },
  tooltip: {
    background: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
  },
  tooltipTitle: {
    color: '#f1f5f9',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '4px',
  },
  tooltipValue: {
    color: '#6366f1',
    fontSize: '15px',
    fontWeight: '700',
  },
  tooltipPercent: {
    color: '#64748b',
    fontSize: '11px',
    marginTop: '4px',
  },
  legendGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  legendItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '10px',
  },
  legendName: {
    color: '#94a3b8',
    fontSize: '12px',
  },
  legendValue: {
    color: '#f1f5f9',
    fontSize: '12px',
    fontWeight: '600',
    marginRight: '4px',
  },
  legendPercent: {
    color: '#64748b',
    fontSize: '11px',
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
}

export default SpendingChart