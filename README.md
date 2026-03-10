# 🤖 pennymind-ai – AI-Powered Expense Tracker
**MongoDB • Express • React • Node.js • Groq AI • JWT Auth • Recharts**

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](#)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](#)
[![Groq](https://img.shields.io/badge/Groq-8E75B2?style=for-the-badge&logo=groq&logoColor=white)](#)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](#)
[![Recharts](https://img.shields.io/badge/Recharts-22c55e?style=for-the-badge&logo=recharts&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](#)

A **modern full-stack expense tracking application** that leverages **Groq AI** to help users manage finances intelligently — built with the **MERN stack**.

🔗 **GitHub Repository:**  
https://github.com/SHASHWAT13244/pennymind-ai-

---

## 📋 Table of Contents
- [✨ Overview](#-overview)
- [🚀 Features](#-features)
  - [💰 Expense Management](#-expense-management)
  - [🤖 AI Integration](#-ai-integration-groq)
  - [📊 Advanced Analytics](#-advanced-analytics)
  - [🎯 Budget Planning](#-budget-planning)
  - [🏆 Gamification](#-gamification)
  - [📈 Visualizations](#-interactive-visualizations)
  - [📄 Export & Sharing](#-export--sharing)
  - [🔐 Authentication](#-authentication--security)
- [🛠️ Tech Stack](#️-tech-stack)
- [👨‍💻 Author](#-author)

---

## ✨ Overview

**pennymind-ai** transforms expense tracking from a mundane task into an intelligent financial companion by providing:

- 🤖 **AI-powered category suggestions** using Groq's Llama 3.1 model
- 📊 **Advanced analytics** with moving averages, volatility, and forecasts
- 🎯 **Smart budget planning** with real-time progress tracking
- 🏆 **Gamification system** with achievements and streaks
- 📈 **Interactive visualizations** powered by Recharts
- 📄 **PDF report generation** with embedded charts
- 🔐 **Secure JWT authentication** with bcrypt encryption
- 🎨 **2026-inspired glassmorphism UI** with dark/light themes

---

## 🚀 Features

### 💰 Expense Management

- **CRUD Operations** – Add, edit, delete expenses with ease
- **AI Category Suggestions** – Automatic category prediction using Groq AI
- **Rich Metadata** – Notes, dates, and 8 predefined categories
- **Quick Actions** – Duplicate, archive, and quick-edit options
- **Smart Search** – Filter by category, amount range, and date

### 🤖 AI Integration (Groq)

- **Smart Categorization** – `/api/ai/suggest-category` endpoint using Llama 3.1 8B model
- **Zero-shot Learning** – AI understands context from expense titles
- **Real-time Responses** – Groq's fast inference (<500ms)
- **Fallback Mechanism** – Defaults to 'Other' if AI is uncertain
- **Expandable Architecture** – Ready for more AI features

### 📊 Advanced Analytics

- **Overview Dashboard** – Total spent, top categories, averages
- **Spending Trends** – 6-month trend analysis with line/area charts
- **Category Distribution** – Pie and bar charts with percentages
- **Moving Averages** – 7-day and 30-day rolling averages
- **Volatility Metrics** – Standard deviation and variance
- **Percentile Analysis** – 10th, 25th, 50th, 75th, 90th percentiles
- **Pattern Analysis** – Day-of-week and hourly spending patterns
- **Forecasting** – 30-day spending predictions with confidence intervals

### 🎯 Budget Planning

- **Category Budgets** – Set monthly spending limits per category
- **Progress Tracking** – Visual progress bars with color coding:
  - 🟢 **Under 80%** – Green
  - 🟡 **80-100%** – Orange
  - 🔴 **Over 100%** – Red
- **Real-time Comparison** – Budget vs. actual spending
- **Smart Alerts** – Notifications when approaching limits
- **Budget Insights** – AI-powered recommendations

### 🏆 Gamification

- **Achievement System** – Unlock badges for financial milestones:
  - 🎯 **First Step** – Add first expense
  - 🚀 **Getting Started** – 10 expenses
  - ⚡ **Power User** – 50 expenses
  - 💰 **Big Spender** – ₹10,000 total
  - 🔥 **Consistency King** – 7-day streak
  - 🎨 **Variety Seeker** – 5 categories
  - 👑 **Budget Master** – Stay under ₹5,000
- **Streak Tracking** – Consecutive days of expense logging
- **Progress Bars** – Visual feedback on achievement progress

### 📈 Interactive Visualizations

- **Line Charts** – Spending trends over time
- **Area Charts** – Cumulative spending with gradients
- **Bar Charts** – Category comparisons
- **Pie Charts** – Distribution with inner radius
- **Radar Charts** – Multi-category comparison
- **Composed Charts** – Combine bars, lines, and areas
- **Fullscreen Mode** – Expanded view for analysis

### 📄 Export & Sharing

- **PDF Reports** – Professional reports with:
  - Summary statistics
  - Category breakdown charts
  - Expense tables
  - Page numbers and timestamps
- **CSV Export** – Raw data for spreadsheet analysis
- **Chart Export** – Save visualizations as PNG
- **Share Functionality** – Copy report links

### 🔐 Authentication & Security

- **JWT Authentication** – Stateless auth with Bearer tokens
- **Password Hashing** – bcrypt with 10 salt rounds
- **Protected Routes** – Auth middleware for API endpoints
- **Auto-login** – Persistent sessions with token validation
- **Logout** – Token removal and state cleanup

---

## 🛠️ Tech Stack

### Frontend
- **React 18** – UI library with hooks and functional components
- **Vite** – Next-generation build tool for fast development
- **Recharts** – Composable charting library
- **Axios** – Promise-based HTTP client
- **React Router v6** – Navigation and routing
- **Context API** – State management
- **CSS Modules** – Scoped styling with glassmorphism effects

### Backend
- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **MongoDB Atlas** – Cloud database
- **Mongoose** – ODM for MongoDB
- **JWT** – Authentication tokens
- **bcrypt** – Password hashing
- **Groq SDK** – AI integration

### AI/ML
- **Groq Cloud** – LLM inference API
- **Llama 3.1 8B** – Language model for categorization

### DevOps & Tools
- **Git** – Version control
- **Postman** – API testing
- **MongoDB Compass** – Database GUI
- **Vercel/Netlify** – Frontend deployment
- **Render/Heroku** – Backend deployment

---

👨‍💻 Author
Shashwat Khandelwal

B.Tech Computer Science Student | MERN Stack Developer | AI Enthusiast



