# QuizMind AI 🧠

An AI-powered quiz generator built with the **MERN Stack** (MongoDB, Express, React, Node.js) and **Google Gemini 2.5 Flash**.

---

## ✨ Features

- 🤖 **AI-Powered Quiz Generation** — Generates unique quiz questions on any topic using Google Gemini AI
- ⏱️ **Timed Gameplay** — 30-second countdown timer per question
- 🎯 **Difficulty Levels** — Easy, Medium, Hard
- 📊 **Visual Results** — Animated score ring with confetti celebration
- 🗃️ **Persistent History** — Quiz history saved to MongoDB
- 📝 **AI Explanations** — Detailed explanations for every question

---

## 🗂️ Project Structure

```
QuizMind/
├── client/          # React + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── History.jsx
│   │   │   ├── QuizCustomizer.jsx
│   │   │   ├── QuizPlay.jsx
│   │   │   └── QuizResults.jsx
│   │   ├── services/
│   │   │   └── gemini.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── server/          # Node.js + Express Backend
    ├── models/
    │   └── History.js
    ├── routes/
    │   └── api.js
    ├── server.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API Key (get it free from [Google AI Studio](https://aistudio.google.com/app/apikey))

### 1. Clone the repository
```bash
git clone https://github.com/vishalelectrica1/QuizMind.git
cd QuizMind
```

### 2. Set up the Backend
```bash
cd server
npm install
```
Create a `.env` file inside the `server/` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_gemini_api_key
```
Start the backend:
```bash
node server.js
```

### 3. Set up the Frontend
Open a new terminal:
```bash
cd client
npm install
npm run dev
```

### 4. Open the app
Go to **http://localhost:3000** in your browser.

---

## 🛠️ Tech Stack

| Layer     | Technology                      |
|-----------|---------------------------------|
| Frontend  | React 19, Vite, Vanilla CSS     |
| Backend   | Node.js, Express.js             |
| Database  | MongoDB Atlas, Mongoose         |
| AI        | Google Gemini 2.5 Flash         |
| Icons     | Lucide React                    |
| Animation | Canvas Confetti                 |

---

## 📡 API Endpoints

| Method | Endpoint              | Description                  |
|--------|-----------------------|------------------------------|
| POST   | `/api/generate-quiz`  | Generate a new quiz using AI |
| GET    | `/api/history`        | Fetch all quiz history       |
| POST   | `/api/history`        | Save a quiz result           |
| DELETE | `/api/history`        | Clear all quiz history       |
