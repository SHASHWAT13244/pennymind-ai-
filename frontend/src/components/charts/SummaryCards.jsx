import { DollarSign, TrendingUp, ShoppingBag, Activity, Sparkles, ArrowUp, ArrowDown } from 'lucide-react'

const SummaryCards = ({ summary }) => {
  const categories = Object.entries(summary.byCategory || {})
  const topCategory = categories.sort((a, b) => b[1] - a[1])[0]
  const previousTotal = summary.previousTotal || 0
  const percentChange = previousTotal ? ((summary.total - previousTotal) / previousTotal * 100).toFixed(1) : 0

  const cards = [
    {
      title: 'Total Spent',
      value: `৳ ${summary.total?.toFixed(2) || '0.00'}`,
      icon: <DollarSign size={20} />,
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      change: percentChange,
      changeLabel: 'vs last month',
    },
    {
      title: 'Total Expenses',
      value: summary.count || 0,
      icon: <Activity size={20} />,
      gradient: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
    },
    {
      title: 'Top Category',
      value: topCategory ? topCategory[0] : 'N/A',
      subValue: topCategory ? `৳ ${topCategory[1].toFixed(2)}` : '',
      icon: <TrendingUp size={20} />,
      gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
    },
    {
      title: 'Average',
      value: summary.count
        ? `৳ ${(summary.total / summary.count).toFixed(2)}`
        : '৳ 0.00',
      icon: <ShoppingBag size={20} />,
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    },
  ]

  return (
    <div style={styles.grid}>
      {cards.map((card, index) => (
        <div key={index} style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={{...styles.iconBox, background: card.gradient}}>
              {card.icon}
            </div>
            <span style={styles.cardTitle}>{card.title}</span>
          </div>
          
          <div style={styles.cardContent}>
            <div style={styles.cardValue}>{card.value}</div>
            {card.subValue && (
              <div style={styles.cardSubValue}>{card.subValue}</div>
            )}
            
            {card.change !== undefined && (
              <div style={styles.changeIndicator}>
                {card.change > 0 ? (
                  <>
                    <ArrowUp size={12} color="#ef4444" />
                    <span style={{...styles.changeText, color: '#ef4444'}}>
                      {card.change}% {card.changeLabel}
                    </span>
                  </>
                ) : card.change < 0 ? (
                  <>
                    <ArrowDown size={12} color="#22c55e" />
                    <span style={{...styles.changeText, color: '#22c55e'}}>
                      {Math.abs(card.change)}% {card.changeLabel}
                    </span>
                  </>
                ) : null}
              </div>
            )}
          </div>

          {/* Decorative sparkle for top category */}
          {index === 2 && topCategory && (
            <div style={styles.sparkle}>
              <Sparkles size={14} color="#f59e0b" />
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
    marginBottom: '28px',
  },
  card: {
    padding: '24px',
    background: 'rgba(30, 41, 59, 0.4)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    border: '1px solid rgba(255,255,255,0.05)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-4px)',
      borderColor: 'rgba(99,102,241,0.2)',
      boxShadow: '0 20px 30px -10px rgba(0,0,0,0.5)',
    },
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  iconBox: {
    width: '44px',
    height: '44px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    boxShadow: '0 8px 15px -5px rgba(0,0,0,0.3)',
  },
  cardTitle: {
    fontSize: '14px',
    color: '#94a3b8',
    fontWeight: '500',
  },
  cardContent: {
    paddingLeft: '56px', // Align with icon
  },
  cardValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#f1f5f9',
    lineHeight: '1.2',
    marginBottom: '4px',
  },
  cardSubValue: {
    fontSize: '13px',
    color: '#64748b',
  },
  changeIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginTop: '8px',
  },
  changeText: {
    fontSize: '11px',
    fontWeight: '500',
  },
  sparkle: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    animation: 'pulse 2s ease-in-out infinite',
  },

  '@global': {
    '@keyframes pulse': {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 },
    },
  },
}

export default SummaryCards