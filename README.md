
## 🚀 Overview

**Taxicity** (formerly Tax-Loss Shadow) is an intelligent financial dashboard designed to help Indian freelancers and professionals stop overpaying taxes. 

By analyzing your raw bank statements using **Google Gemini AI**, Taxicity automatically categorizes transactions, identifies hidden deductions (Section 80C, 80D, NPS), and performs a real-time "Regime War" to determine whether the **Old Regime** or **New Regime (u/s 115BAC)** saves you more money based on your *actual* spending habits.

## ✨ Features

- **📄 Smart Document Processing**
  - Drag-and-drop support for PDF/CSV bank statements.
  - Multi-statement aggregation for a unified view of your finances.

- **🤖 AI-Powered Ledger**
  - Uses **Gemini 1.5 Flash** to clean and classify ambiguous transactions (e.g., "UPI-Mcdonalds" → "Food", "LIC Premium" → "Investment").
  - Automatically separates **Business Expenses** (Section 37) from Personal spending.

- **⚔️ Real-Time Regime Comparison**
  - Live tax calculation for both Old and New Regimes.
  - Dynamic "Winner" badges showing exactly how much you save by switching.

- **🕵️ Shadow Savings Detection**
  - Identifies missed tax-saving opportunities.
  - Detects investments (SIPs, PPF), medical insurance, and NPS contributions automatically.
  - Progress bars for 80C (₹1.5L), 80D (₹50k), and 80CCD (₹50k) limits.

- **🇮🇳 India-First Design**
  - Built for FY 2024-25 / AY 2025-26.
  - Indian Number Formatting (₹1,00,000) throughout the UI.
  - Specific support for Indian tax sections.

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (React, TypeScript)
- **Styling**: Tailwind CSS, Lucide Icons
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage)
- **AI Engine**: Google Gemini API (via Vercel AI SDK)
- **Processing**: PDF parsing & server-side logic

## 🏗️ Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project
- A Google Cloud Project with Gemini API enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/taxicity.git
   cd taxicity
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   Fill in your keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_google_ai_key
   ```

4. **Initialize Database**
   Run the SQL commands found in `database.sql` in your Supabase SQL Editor to set up tables and policies.

5. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the app.

## 💡 How It Works

1. **Upload**: User uploads a bank statement (PDF).
2. **Parse**: The system extracts raw text from the document.
3. **Analyze**: Gemini AI scans line items to classify them (e.g., identifying "Star Health" as an 80D deduction).
4. **Calculate**: The Tax Engine sums up deductions, business expenses, and income.
5. **Recommend**: The dashboard displays the tax liability under both regimes and suggests actionable steps to save tax.

## 📜 License

This project is licensed under the MIT License.

---
*Built with ❤️ for Indian Taxpayers.*
