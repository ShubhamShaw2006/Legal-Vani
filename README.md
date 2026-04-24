<div align="center">
  
# ⚖️ Legal-Vani 

**AI-powered, voice-first legal assistance platform for Indian citizens in their native language.**

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Contributing](#-contributing)

</div>

---

## 📖 Overview

Legal-Vani is a next-generation platform designed to democratize legal aid in India. By bridging the gap between complex legal jargon and everyday citizens, Legal-Vani empowers users to understand their rights, take actionable steps, and locate the nearest authorities—all through intuitive voice and text inputs.

## ✨ Features

- 🌍 **12-Language Native Support**: Full interface localization for English, Hindi, Bengali, Marathi, Tamil, Telugu, Gujarati, Malayalam, Punjabi, Kannada, Odia, and Urdu.
- 🎙️ **Voice-to-Text Analytics**: Leverages Whisper AI to allow users to describe their legal issues naturally via audio in their native tongue.
- 🧠 **AI Legal Analysis**: Processes inputs through Groq's high-speed LLMs to provide structured, easy-to-understand legal advice, rights, and actionable steps.
- 🔒 **Secure Authentication**: Robust JWT-based authentication system integrated with Supabase PostgreSQL for safe data management.
- 🚓 **Emergency Police Locator**: Utilizes the Overpass API to instantly locate the nearest police stations based on user geolocation.
- 📄 **Formal Complaint Generation**: Instantly generates downloadable PDF legal drafts based on the user's analyzed situation.
- 🗣️ **Text-to-Speech (TTS)**: Reads out the legal rights and actions in a clear voice for enhanced accessibility.
- 🎨 **Premium Aesthetic**: Features a highly polished, responsive, and accessible dark-mode UI with gold accents.

## 💻 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), React 19, Tailwind CSS v4, Lucide Icons.
- **Backend**: Next.js Route Handlers, Custom Edge Middleware for Auth.
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL).
- **AI Integration**: [Groq API](https://groq.com/) for lightning-fast LLM inference, Whisper for Speech-to-Text.
- **Security**: JWT (`jose`), `bcryptjs` for password hashing, strict `HttpOnly` cookies.

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- A Supabase Project
- A Groq API Key

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/legal-vani.git
cd legal-vani
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Rename the provided `.env.example` file to `.env` and fill in your actual credentials.
```bash
cp .env.example .env
```

### 4. Database Setup
Run the `supabase_schema.sql` file in your Supabase SQL Editor to create the required `users` and `otp_sessions` tables.

### 5. Run the development server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**. 
Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Credits
This project was built by:
* **Madhurya Dutta**
