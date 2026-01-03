# Querry – AI Knowledge Hub

Querry is a **Retrieval-Augmented Generation (RAG)** application that acts as a personal knowledge assistant.
Users can upload PDF documents into a secure knowledge base and have **context-aware conversations** with an AI (powered by **Google Gemini**) that answers **strictly from the uploaded documents**, complete with citations.

---

## 🚀 Features

- **User Authentication**
  Secure Login & Register using JWT (Access & Refresh Tokens)

- **Knowledge Base Management**
  Upload, view, and manage PDF documents

- **Context-Aware Chat**
  Ask questions about your documents — answers are generated _only_ from your data

- **Source Citations**
  Each answer includes the document name and the exact snippet used

- **Chat History**
  Conversations are auto-saved with a sidebar history

- **PDF Viewer**
  View uploaded PDFs directly in the browser

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS 4
- **Routing:** React Router DOM
- **HTTP Client:** Axios (with token refresh interceptors)

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js 5
- **Database:** MongoDB (Mongoose)
- **AI Engine:** Google Generative AI (Gemini Flash)
- **PDF Processing:** pdfjs-dist
- **File Handling:** Multer (Local Storage)

---

## ⚙️ Prerequisites

Make sure you have the following installed before running the project:

- Node.js (v18+ recommended)
- MongoDB (Local or MongoDB Atlas)
- Google Gemini API Key

---

## 📥 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd querry
```

---

### 2️⃣ Backend Setup

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
# OR
pnpm install
```

⚠️ **Important:** You must manually create the uploads directory:

```bash
mkdir uploads
```

---

### 3️⃣ Frontend Setup

Open a new terminal and install frontend dependencies:

```bash
cd frontend
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the **backend/** directory:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Database
# Local Example:
# mongodb://127.0.0.1:27017/querry_db
# Atlas Example:
# mongodb+srv://<user>:<password>@cluster.mongodb.net/querry_db
MONGO_URI=your_mongodb_connection_string

# Security (JWT Secrets)
# Generate using: openssl rand -hex 64
ACCESS_TOKEN_SECRET=some_super_long_random_secret_string_access
REFRESH_TOKEN_SECRET=some_super_long_random_secret_string_refresh

# AI Configuration
# Get your key from:
# https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_google_gemini_api_key
```

---

## 🏃‍♂️ Running the Application

You must run **backend and frontend in separate terminals**.

### Terminal 1 – Start Backend

```bash
cd backend
npm run dev
```

✅ Expected Output:

- Server running on port **8080**
- MongoDB connected successfully

---

### Terminal 2 – Start Frontend

```bash
cd frontend
npm run dev
```

✅ Expected Output:

- App running at `http://localhost:5173`

---

## 🌐 Accessing the Application

Open your browser and visit:

```
http://localhost:5173
```

---

## ⚠️ Assumptions & Limitations

### 📁 Local File Storage

- Uploaded PDFs are stored in `backend/uploads`
- **Limitation:** Files will be lost on serverless platforms (e.g., Vercel, free Heroku)
- **Production Recommendation:** Use cloud storage (AWS S3, Cloudinary)

---

### 📄 PDF Only

- Only `.pdf` files are supported
- Word documents or images will fail upload

---

### 🌍 Global Context

- All user-uploaded documents are used for answering questions
- No per-chat or per-folder document selection (yet)

---

### 🤖 AI Model

- Uses `gemini-1.5-flash` (or `2.5`, depending on API access)
- If you see **“Model not found”**, verify:

  - Your API key permissions
  - The model name in `chatController.js`

---

### 🔌 Proxy Configuration

- Frontend expects backend on **port 8080**
- If changed, update `vite.config.js` in frontend

---

## 🐛 Troubleshooting

### ❌ 404 on Login/Register

- Ensure backend is running
- Check proxy target in `frontend/vite.config.js`

---

### ❌ `ReferenceError: document is not defined`

- Ensure backend uses:

  ```
  pdfjs-dist/legacy/build/pdf.mjs
  ```

  for Node.js compatibility

---

### ❌ MongoDB Connection Issues

- Local: Ensure MongoDB service is running
- Atlas: Ensure your IP is whitelisted in **Network Access**
