🤖 pennymind-ai – AI-Powered Expense Tracker
MongoDB • Express • React • Node.js • Groq AI • JWT Auth • Recharts

https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white
https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black
https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white
https://img.shields.io/badge/Groq-8E75B2?style=for-the-badge&logo=groq&logoColor=white
https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white
https://img.shields.io/badge/Recharts-22c55e?style=for-the-badge&logo=recharts&logoColor=white
https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
https://img.shields.io/badge/Live-Demo-ff69b4?style=for-the-badge&logo=render

A modern full-stack expense tracking application that leverages Groq AI to help users manage finances intelligently — built with the MERN stack.

🔗 GitHub Repository:
https://github.com/SHASHWAT13244/pennymind-ai-

🌐 Live Demo:
https://pennymind-ai-frontend.onrender.com/

✨ Overview
pennymind-ai transforms expense tracking from a mundane task into an intelligent financial companion by providing:

🤖 AI-powered category suggestions using Groq's Llama 3.1 model

📊 Advanced analytics with moving averages, volatility, and forecasts

🎯 Smart budget planning with real-time progress tracking

🏆 Gamification system with achievements and streaks

📈 Interactive visualizations powered by Recharts

📄 PDF report generation with embedded charts

🔐 Secure JWT authentication with bcrypt encryption

🎨 2026-inspired glassmorphism UI with dark/light themes

🔧 Key Features
💰 Expense Management
CRUD Operations – Add, edit, delete expenses with ease

AI Category Suggestions – Automatic category prediction using Groq AI

Rich Metadata – Notes, dates, and 8 predefined categories

Quick Actions – Duplicate, archive, and quick-edit options

Smart Search – Filter by category, amount range, and date

🤖 AI Integration (Groq)
Smart Categorization – /api/ai/suggest-category endpoint using Llama 3.1 8B model

Zero-shot Learning – AI understands context from expense titles

Real-time Responses – Groq's fast inference (<500ms)

Fallback Mechanism – Defaults to 'Other' if AI is uncertain

Expandable Architecture – Ready for more AI features

📊 Advanced Analytics
Overview Dashboard – Total spent, top categories, averages

Spending Trends – 6-month trend analysis with line/area charts

Category Distribution – Pie and bar charts with percentages

Moving Averages – 7-day and 30-day rolling averages

Volatility Metrics – Standard deviation and variance

Percentile Analysis – 10th, 25th, 50th, 75th, 90th percentiles

Pattern Analysis – Day-of-week and hourly spending patterns

Forecasting – 30-day spending predictions with confidence intervals

🎯 Budget Planning
Category Budgets – Set monthly spending limits per category

Progress Tracking – Visual progress bars with color coding:

🟢 Under 80% – Green

🟡 80–100% – Orange

🔴 Over 100% – Red

Real-time Comparison – Budget vs. actual spending

Smart Alerts – Notifications when approaching limits

Budget Insights – AI-powered recommendations

🏆 Gamification
Achievement System – Unlock badges for financial milestones:

First Step – Add first expense

Getting Started – 10 expenses

Power User – 50 expenses

Big Spender – ₹10,000 total

Consistency King – 7-day streak

Variety Seeker – 5 categories

Budget Master – Stay under ₹5,000

Streak Tracking – Consecutive days of expense logging

Progress Bars – Visual feedback on achievement progress

📈 Interactive Visualizations
Line Charts – Spending trends over time

Area Charts – Cumulative spending with gradients

Bar Charts – Category comparisons

Pie Charts – Distribution with inner radius

Radar Charts – Multi-category comparison

Composed Charts – Combine bars, lines, and areas

Fullscreen Mode – Expanded view for analysis

📄 Export & Sharing
PDF Reports – Professional reports with:

Summary statistics

Category breakdown charts

Expense tables

Page numbers and timestamps

CSV Export – Raw data for spreadsheet analysis

Chart Export – Save visualizations as PNG

Share Functionality – Copy report links

🔐 Authentication & Security
JWT Authentication – Stateless auth with Bearer tokens

Password Hashing – bcrypt with 10 salt rounds

Protected Routes – Auth middleware for API endpoints

Auto-login – Persistent sessions with token validation

Logout – Token removal and state cleanup

Live Demo Security – Login page visible at:

text
https://pennymind-ai-frontend.onrender.com/
📁 Project Structure
text
pennymind-ai/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── pages/
│       ├── services/
│       ├── styles/
│       ├── App.jsx
│       └── main.jsx
│
├── package.json
└── README.md
🧠 Technologies Used
Technology	Description
MongoDB	NoSQL database with Mongoose ODM
Express.js	Backend framework for REST APIs
React	Frontend SPA with modern hooks
Node.js	Backend runtime
Groq AI	AI categorization via Llama 3.1
JWT	Secure authentication
Bcrypt	Password hashing
Recharts	Interactive data visualizations
Axios	HTTP client for API requests
React Router	Client-side routing
jsPDF/html2pdf	PDF report generation
date-fns	Date manipulation and formatting
Tailwind CSS	Utility-first styling
Vite	Fast frontend build tool
Render	Cloud hosting platform
🎨 Design Highlights
Login Screen (Live Demo)
Secure Authentication Portal – Glassmorphism design with 2026 aesthetics

Security Badges – 256-bit encryption, GDPR compliant, ISO 27001

User-Friendly Interface – Clear calls-to-action and account creation link

Version Badge – "v2026.1" showcasing the modern release

Dashboard
Clean analytics overview

Spending trend visualizations

Quick actions and summaries

Expense Management
Glassmorphism card design

Intuitive CRUD interface

AI category suggestion chips

Analytics View
Multi-chart interactive dashboard

Time-range selectors

Pattern analysis insights

Budget Planner
Real-time progress bars

Category-wise budget cards

Visual warning indicators

🚀 Quick Start
Prerequisites
Node.js (v14+)

MongoDB

Groq API Key

Installation
Clone the repository

bash
git clone https://github.com/SHASHWAT13244/pennymind-ai-.git
cd pennymind-ai-
Install backend dependencies

bash
cd backend
npm install
Configure environment variables
Create a .env file in the backend directory:

env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
Install frontend dependencies

bash
cd ../frontend
npm install
Run the application

bash
# Backend (from backend directory)
npm start

# Frontend (from frontend directory)
npm run dev
Access the app

text
http://localhost:5173
🧑‍💻 Author
Shashwat Khandelwal
B.Tech Computer Science Student | MERN Stack Developer | AI Enthusiast

https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white
https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white

📧 Email: shashwatk340@gmail.com

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

⭐ If you find this project useful, consider giving it a star on GitHub!
