// components/visualization/DataVizDashboard.jsx
import { useState } from 'react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ComposedChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Treemap, Sankey, Funnel, FunnelChart, LabelList
} from 'recharts'
import {
  X, Download, Maximize2, TrendingUp, PieChart as PieIcon,
  BarChart3, Activity, Grid, Share2, Camera, Save,
  FileText, Image, Video, Code, Copy, Printer
} from 'lucide-react'
import toast from 'react-hot-toast'

const COLORS = ['#6366f1', '#22d3ee', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#ec4899', '#14b8a6']

const DataVizDashboard = ({ expenses, summary, trend, onClose }) => {
  const [activeChart, setActiveChart] = useState('all')
  const [chartSize, setChartSize] = useState('medium')
  const [exportFormat, setExportFormat] = useState('png')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [customColors, setCustomColors] = useState(COLORS)

  const chartTypes = [
    { id: 'all', name: 'All Charts', icon: <Grid size={14} /> },
    { id: 'line', name: 'Line', icon: <TrendingUp size={14} /> },
    { id: 'area', name: 'Area', icon: <Activity size={14} /> },
    { id: 'bar', name: 'Bar', icon: <BarChart3 size={14} /> },
    { id: 'pie', name: 'Pie', icon: <PieIcon size={14} /> },
    { id: 'radar', name: 'Radar', icon: <Activity size={14} /> },
  ]

  const sizeOptions = {
    small: { width: '100%', height: 200 },
    medium: { width: '100%', height: 300 },
    large: { width: '100%', height: 400 },
  }

  // Prepare data
  const categoryData = Object.entries(summary.byCategory || {}).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }))

  const trendData = trend || []
  
  const dailyData = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date).toLocaleDateString()
    if (!acc[date]) {
      acc[date] = { date, total: 0, count: 0 }
    }
    acc[date].total += expense.amount
    acc[date].count++
    return acc
  }, {})

  const dailyArray = Object.values(dailyData)

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

  const handleExport = () => {
    toast.success(`Exporting as ${exportFormat.toUpperCase()}...`)
    // In real app, implement actual export
  }

  const handleCopyChart = () => {
    navigator.clipboard.writeText(JSON.stringify(categoryData, null, 2))
    toast.success('Chart data copied to clipboard!')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div style={{
      ...styles.container,
      ...(isFullscreen && styles.containerFullscreen)
    }}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            <Activity size={20} color="#6366f1" />
          </div>
          <div>
            <h3 style={styles.title}>Data Visualization</h3>
            <p style={styles.subtitle}>Interactive charts and graphs</p>
          </div>
        </div>

        <div style={styles.headerControls}>
          {/* Chart Type Selector */}
          <div style={styles.chartTypeSelector}>
            {chartTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setActiveChart(type.id)}
                style={{
                  ...styles.chartTypeBtn,
                  ...(activeChart === type.id && styles.chartTypeBtnActive)
                }}
              >
                {type.icon}
                <span>{type.name}</span>
              </button>
            ))}
          </div>

          {/* Size Controls */}
          <select
            value={chartSize}
            onChange={(e) => setChartSize(e.target.value)}
            style={styles.select}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>

          {/* Export Format */}
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            style={styles.select}
          >
            <option value="png">PNG</option>
            <option value="jpg">JPG</option>
            <option value="svg">SVG</option>
            <option value="pdf">PDF</option>
          </select>

          {/* Action Buttons */}
          <button onClick={handleExport} style={styles.iconBtn} title="Export">
            <Download size={16} />
          </button>
          <button onClick={handleCopyChart} style={styles.iconBtn} title="Copy">
            <Copy size={16} />
          </button>
          <button onClick={handlePrint} style={styles.iconBtn} title="Print">
            <Printer size={16} />
          </button>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)} 
            style={styles.iconBtn}
            title="Fullscreen"
          >
            <Maximize2 size={16} />
          </button>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Chart Grid */}
      <div style={styles.chartGrid}>
        {/* Line Chart */}
        {(activeChart === 'all' || activeChart === 'line') && (
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h4 style={styles.chartTitle}>Spending Trend</h4>
              <div style={styles.chartBadge}>Line Chart</div>
            </div>
            <ResponsiveContainer width="100%" height={sizeOptions[chartSize].height}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', r: 4 }}
                  activeDot={{ r: 6, fill: '#22d3ee' }}
                  name="Spending"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Area Chart */}
        {(activeChart === 'all' || activeChart === 'area') && (
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h4 style={styles.chartTitle}>Cumulative Spending</h4>
              <div style={styles.chartBadge}>Area Chart</div>
            </div>
            <ResponsiveContainer width="100%" height={sizeOptions[chartSize].height}>
              <AreaChart data={dailyArray.slice(-30)}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#6366f1" 
                  fill="url(#colorGradient)"
                  name="Daily Spending"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Bar Chart */}
        {(activeChart === 'all' || activeChart === 'bar') && (
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h4 style={styles.chartTitle}>Category Breakdown</h4>
              <div style={styles.chartBadge}>Bar Chart</div>
            </div>
            <ResponsiveContainer width="100%" height={sizeOptions[chartSize].height}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={customColors[index % customColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Pie Chart */}
        {(activeChart === 'all' || activeChart === 'pie') && (
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h4 style={styles.chartTitle}>Category Distribution</h4>
              <div style={styles.chartBadge}>Pie Chart</div>
            </div>
            <ResponsiveContainer width="100%" height={sizeOptions[chartSize].height}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={customColors[index % customColors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Radar Chart */}
        {(activeChart === 'all' || activeChart === 'radar') && (
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h4 style={styles.chartTitle}>Category Radar</h4>
              <div style={styles.chartBadge}>Radar Chart</div>
            </div>
            <ResponsiveContainer width="100%" height={sizeOptions[chartSize].height}>
              <RadarChart data={categoryData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar 
                  name="Spending" 
                  dataKey="value" 
                  stroke="#6366f1" 
                  fill="#6366f1" 
                  fillOpacity={0.3} 
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Composed Chart */}
        {activeChart === 'all' && (
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h4 style={styles.chartTitle}>Combined Analysis</h4>
              <div style={styles.chartBadge}>Composed Chart</div>
            </div>
            <ResponsiveContainer width="100%" height={sizeOptions[chartSize].height}>
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="total" fill="#6366f1" opacity={0.3} name="Bar" />
                <Line type="monotone" dataKey="total" stroke="#22c55e" strokeWidth={2} name="Line" />
                <Area type="monotone" dataKey="total" fill="#22d3ee" fillOpacity={0.1} name="Area" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Statistics Summary */}
      <div style={styles.statsGrid}>
        <div style={styles.statBox}>
          <span style={styles.statBoxLabel}>Total Charts</span>
          <span style={styles.statBoxValue}>6</span>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statBoxLabel}>Data Points</span>
          <span style={styles.statBoxValue}>{expenses.length}</span>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statBoxLabel}>Categories</span>
          <span style={styles.statBoxValue}>{categoryData.length}</span>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statBoxLabel}>Time Range</span>
          <span style={styles.statBoxValue}>{trendData.length} months</span>
        </div>
      </div>

      {/* Export Options */}
      <div style={styles.exportOptions}>
        <button style={styles.exportBtn}>
          <FileText size={14} />
          <span>PDF Report</span>
        </button>
        <button style={styles.exportBtn}>
          <Image size={14} />
          <span>Image</span>
        </button>
        <button style={styles.exportBtn}>
          <Video size={14} />
          <span>Video</span>
        </button>
        <button style={styles.exportBtn}>
          <Code size={14} />
          <span>JSON</span>
        </button>
        <button style={styles.exportBtn}>
          <Save size={14} />
          <span>Save</span>
        </button>
        <button style={styles.exportBtn}>
          <Share2 size={14} />
          <span>Share</span>
        </button>
      </div>

      {/* Color Palette */}
      <div style={styles.colorPalette}>
        <span style={styles.colorLabel}>Color Scheme:</span>
        {customColors.map((color, index) => (
          <div
            key={index}
            style={{
              ...styles.colorSwatch,
              background: color,
            }}
            onClick={() => {
              const newColors = [...customColors]
              // Rotate colors
              newColors.push(newColors.shift())
              setCustomColors(newColors)
            }}
          />
        ))}
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
    width: '1000px',
    maxWidth: '95vw',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
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
    flexWrap: 'wrap',
    gap: '16px',
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
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  chartTypeSelector: {
    display: 'flex',
    gap: '4px',
    background: 'rgba(0,0,0,0.2)',
    padding: '4px',
    borderRadius: '30px',
  },
  chartTypeBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    background: 'transparent',
    border: 'none',
    borderRadius: '30px',
    color: '#94a3b8',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      color: '#f1f5f9',
    },
  },
  chartTypeBtnActive: {
    background: 'rgba(99,102,241,0.2)',
    color: '#6366f1',
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
  iconBtn: {
    width: '36px',
    height: '36px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '10px',
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
    borderRadius: '10px',
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
  chartGrid: {
    padding: '24px',
    overflowY: 'auto',
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px',
  },
  chartCard: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '16px',
    padding: '16px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  chartTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#f1f5f9',
  },
  chartBadge: {
    fontSize: '10px',
    padding: '2px 8px',
    background: 'rgba(99,102,241,0.1)',
    borderRadius: '20px',
    color: '#6366f1',
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    padding: '0 24px 20px',
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
    fontSize: '16px',
    fontWeight: '600',
    color: '#f1f5f9',
  },
  exportOptions: {
    display: 'flex',
    gap: '8px',
    padding: '0 24px 20px',
  },
  exportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '30px',
    color: '#94a3b8',
    fontSize: '12px',
    cursor: 'pointer',
    ':hover': {
      background: 'rgba(255,255,255,0.05)',
      color: '#f1f5f9',
    },
  },
  colorPalette: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0 24px 20px',
  },
  colorLabel: {
    fontSize: '11px',
    color: '#64748b',
    marginRight: '4px',
  },
  colorSwatch: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'scale(1.2)',
    },
  },
}

export default DataVizDashboard