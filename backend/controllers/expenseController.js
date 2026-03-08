const Expense = require('../models/Expense');

// @route GET /api/expenses
const getExpenses = async (req, res) => {
  try {
    const { month, year } = req.query

    let filter = { user: req.user._id }

    if (month && year) {
      const start = new Date(year, month - 1, 1)
      const end = new Date(year, month, 1)
      filter.date = { $gte: start, $lt: end }
    }

    const expenses = await Expense.find(filter).sort({ date: -1 })
    res.json(expenses)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route POST /api/expenses
const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date, note } = req.body

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      date,
      note,
    })

    res.status(201).json(expense)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route PUT /api/expenses/:id
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)

    if (!expense) return res.status(404).json({ message: 'Expense not found' })

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route DELETE /api/expenses/:id
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)

    if (!expense) return res.status(404).json({ message: 'Expense not found' })

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    await expense.deleteOne()
    res.json({ message: 'Expense deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route GET /api/expenses/summary
const getExpenseSummary = async (req, res) => {
  try {
    const { month, year } = req.query

    let filter = { user: req.user._id }

    if (month && year) {
      const start = new Date(year, month - 1, 1)
      const end = new Date(year, month, 1)
      filter.date = { $gte: start, $lt: end }
    }

    const expenses = await Expense.find(filter)

    const total = expenses.reduce((sum, e) => sum + e.amount, 0)

    const byCategory = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount
      return acc
    }, {})

    res.json({ total, byCategory, count: expenses.length })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route GET /api/expenses/trend
const getMonthlyTrend = async (req, res) => {
  try {
    const months = []
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const start = new Date(date.getFullYear(), date.getMonth(), 1)
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 1)

      const expenses = await Expense.find({
        user: req.user._id,
        date: { $gte: start, $lt: end },
      })

      const total = expenses.reduce((sum, e) => sum + e.amount, 0)

      months.push({
        month: date.toLocaleString('default', { month: 'short' }),
        year: date.getFullYear(),
        total: parseFloat(total.toFixed(2)),
      })
    }

    res.json(months)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  getMonthlyTrend,
}