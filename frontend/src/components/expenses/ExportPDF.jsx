import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { FileDown, Download, Share2, Sparkles } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import toast from 'react-hot-toast'

const MONTHS = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
]

const COLORS = ['#6366f1', '#22d3ee', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#ec4899', '#14b8a6']

const ExportPDF = ({ expenses, summary, selectedMonth, selectedYear, userName }) => {
  const chartRef = useRef(null)
  const [exporting, setExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState('pdf') // pdf, csv

  const handleExport = async () => {
    if (exportFormat === 'csv') {
      exportCSV()
    } else {
      exportPDF()
    }
  }

  const exportCSV = () => {
    try {
      // Create CSV content
      const headers = ['Title', 'Category', 'Amount (BDT)', 'Date', 'Note']
      const rows = expenses.map(expense => [
        expense.title,
        expense.category,
        expense.amount.toFixed(2),
        new Date(expense.date).toLocaleDateString('en-GB'),
        expense.note || ''
      ])

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n')

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `SpendSmart_${MONTHS[selectedMonth - 1]}_${selectedYear}.csv`
      a.click()
      
      toast.success('CSV exported successfully!', { icon: '📊' })
    } catch (error) {
      toast.error('Failed to export CSV')
    }
  }

  const exportPDF = async () => {
    setExporting(true)
    try {
      const doc = new jsPDF()

      // Cover page with gradient
      doc.setFillColor(99, 102, 241)
      doc.rect(0, 0, 210, 297, 'F')

      // Title
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(32)
      doc.setFont('helvetica', 'bold')
      doc.text('SpendSmart', 105, 100, { align: 'center' })

      doc.setFontSize(16)
      doc.setFont('helvetica', 'normal')
      doc.text('Expense Report', 105, 120, { align: 'center' })

      doc.setFontSize(12)
      doc.text(`${MONTHS[selectedMonth - 1]} ${selectedYear}`, 105, 140, { align: 'center' })
      doc.text(`Generated for: ${userName}`, 105, 150, { align: 'center' })

      doc.setFontSize(10)
      doc.text(new Date().toLocaleDateString(), 105, 170, { align: 'center' })

      // Add new page
      doc.addPage()

      // Summary section
      doc.setFillColor(241, 245, 249)
      doc.rect(14, 20, 182, 40, 'F')

      doc.setTextColor(30, 41, 59)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Summary', 20, 32)

      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.text(`Total Spent: ৳ ${summary.total?.toFixed(2) || '0.00'}`, 20, 45)
      doc.text(`Total Expenses: ${summary.count || 0}`, 20, 55)
      doc.text(
        `Average: ৳ ${summary.count ? (summary.total / summary.count).toFixed(2) : '0.00'}`,
        120,
        45
      )

      // Capture chart as image
      if (chartRef.current) {
        const canvas = await html2canvas(chartRef.current, { 
          backgroundColor: '#ffffff',
          scale: 2 
        })
        const chartImage = canvas.toDataURL('image/png')
        doc.addImage(chartImage, 'PNG', 14, 70, 182, 90)
      }

      // Expenses table
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(30, 41, 59)
      doc.text('Expenses', 14, 170)

      autoTable(doc, {
        startY: 175,
        head: [['#', 'Title', 'Category', 'Amount (৳)', 'Date', 'Note']],
        body: expenses.map((expense, index) => [
          index + 1,
          expense.title,
          expense.category,
          expense.amount.toFixed(2),
          new Date(expense.date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
          expense.note || '-',
        ]),
        headStyles: {
          fillColor: [99, 102, 241],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [30, 41, 59],
        },
        alternateRowStyles: {
          fillColor: [241, 245, 249],
        },
        margin: { left: 14, right: 14 },
      })

      // Category breakdown
      const finalY = doc.lastAutoTable.finalY + 15

      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(30, 41, 59)
      doc.text('Category Breakdown', 14, finalY)

      const categoryData = Object.entries(summary.byCategory || {}).map(
        ([category, amount]) => [
          category,
          `৳ ${amount.toFixed(2)}`,
          `${((amount / summary.total) * 100).toFixed(1)}%`,
        ]
      )

      autoTable(doc, {
        startY: finalY + 5,
        head: [['Category', 'Amount (৳)', 'Percentage']],
        body: categoryData,
        headStyles: {
          fillColor: [99, 102, 241],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [30, 41, 59],
        },
        alternateRowStyles: {
          fillColor: [241, 245, 249],
        },
        margin: { left: 14, right: 14 },
      })

      // Footer with page numbers
      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(148, 163, 184)
        doc.text(
          `Generated by SpendSmart · Page ${i} of ${pageCount} · ${new Date().toLocaleDateString()}`,
          14,
          doc.internal.pageSize.height - 10
        )
      }

      doc.save(`SpendSmart_${MONTHS[selectedMonth - 1]}_${selectedYear}.pdf`)
      toast.success('PDF exported successfully!', { icon: '📄' })
    } catch (error) {
      toast.error('Failed to export PDF')
    } finally {
      setExporting(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'SpendSmart Expense Report',
        text: `My expense report for ${MONTHS[selectedMonth - 1]} ${selectedYear}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const chartData = Object.entries(summary.byCategory || {}).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }))

  return (
    <>
      {/* Hidden chart for PDF capture */}
      <div
        ref={chartRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          background: '#ffffff',
          padding: '20px',
          width: '600px',
          height: '300px',
        }}
      >
        <div style={{ display: 'flex', gap: '20px', height: '100%' }}>
          <div style={{ width: '50%', height: '100%' }}>
            <p style={{ color: '#1e293b', fontWeight: 'bold', marginBottom: '10px', fontSize: '14px' }}>
              Spending by Category
            </p>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie 
                  data={chartData} 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={80} 
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ width: '50%', height: '100%' }}>
            <p style={{ color: '#1e293b', fontWeight: 'bold', marginBottom: '10px', fontSize: '14px' }}>
              Amount by Category
            </p>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={styles.container}>
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value)}
          style={styles.select}
        >
          <option value="pdf">PDF Document</option>
          <option value="csv">CSV Spreadsheet</option>
        </select>

        <button 
          onClick={handleExport} 
          disabled={exporting}
          style={{
            ...styles.btn,
            ...(exporting && styles.btnDisabled)
          }}
        >
          {exporting ? (
            <>
              <div style={styles.loader}></div>
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Download size={16} />
              <span>Export {exportFormat.toUpperCase()}</span>
            </>
          )}
        </button>

        <button onClick={handleShare} style={styles.shareBtn}>
          <Share2 size={16} />
        </button>

        {expenses.length === 0 && (
          <div style={styles.warning}>
            <Sparkles size={14} />
            <span>Add expenses to export</span>
          </div>
        )}
      </div>
    </>
  )
}

const styles = {
  container: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    position: 'relative',
  },
  select: {
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '14px',
    color: '#f1f5f9',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 10px 20px -5px rgba(34,197,94,0.3)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 15px 25px -5px rgba(34,197,94,0.4)',
    },
  },
  btnDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
    ':hover': {
      transform: 'none',
      boxShadow: 'none',
    },
  },
  shareBtn: {
    padding: '12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '14px',
    color: '#94a3b8',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(255,255,255,0.06)',
      color: '#f1f5f9',
    },
  },
  loader: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
    borderTopColor: 'white',
    animation: 'spin 1s linear infinite',
  },
  warning: {
    position: 'absolute',
    top: '-30px',
    right: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'rgba(245,158,11,0.1)',
    padding: '6px 12px',
    borderRadius: '20px',
    color: '#f59e0b',
    fontSize: '11px',
    border: '1px solid rgba(245,158,11,0.2)',
  },

  '@global': {
    '@keyframes spin': {
      to: { transform: 'rotate(360deg)' },
    },
  },
}

export default ExportPDF