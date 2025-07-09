# Emotion Reflection Tool

A mobile-first web application that analyzes emotions from text reflections using a Next.js frontend and Python FastAPI backend.

## 🌟 Features

- **Mobile-first responsive design** with clean, intuitive UI
- **Real-time emotion analysis** with confidence scoring
- **TypeScript frontend** with proper error handling and loading states
- **Python FastAPI backend** with mock emotion analysis
- **Visual feedback** with emotion-specific colors and insights
- **Keyboard shortcuts** (Cmd/Ctrl + Enter for quick analysis)

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide React icons

**Backend:**
- Python 3.8+
- FastAPI
- Pydantic
- Uvicorn

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **Python** (version 3.8 or higher)
- **pip** (Python package installer)

## 🚀 Installation & Setup

### 1. Clone or Download the Project

```bash
# If using git
git clone <repository-url>
cd assignment

# Or download and extract the project files
```

### 2. Frontend Setup (Next.js)

Navigate to the project root directory and install dependencies:

```bash
# Install Node.js dependencies
npm install

# Or if you prefer yarn
yarn install
```

### 3. Backend Setup (Python FastAPI)

#### Create Python Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\\Scripts\\activate

# On macOS/Linux:
source venv/bin/activate
```

#### Install Python Dependencies

```bash
pip install fastapi uvicorn pydantic
```

### 4. Configure Frontend for Python Backend

If you want to use Nextjs Route API then change API endpoint in `app/page.tsx`:

```typescript
const response = await fetch("/api/analyze-emotion", {
```
else keep it the same

```typescript
const response = await fetch("http://localhost:8000/analyze", {
```

## 🏃‍♂️ Running the Application

You need to run both the backend and frontend simultaneously.

### Terminal 1: Start Python Backend

```bash
# Make sure you're in the project root directory
cd assignment

# Activate virtual environment (if not already activated)
# Windows:
venv\\Scripts\\activate
# macOS/Linux:
source venv/bin/activate

# Start the FastAPI server
python scripts/emotion_api.py
```

The Python API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

### Terminal 2: Start Next.js Frontend

Open a new terminal window/tab:

```bash
# Navigate to project directory
cd assignment

# Start the development server
npm run dev

# Or with yarn
yarn dev
```

The frontend will be available at: **http://localhost:3000**

## 🧪 Testing the Application

1. Open your browser and go to **http://localhost:3000**
2. Enter a reflection in the textarea, for example:
   - "I feel nervous about my job interview tomorrow"
   - "I'm excited about starting my new project"
   - "I'm frustrated with this difficult problem"
3. Click **"Analyze Emotion"** or press **Cmd/Ctrl + Enter**
4. View the emotion analysis results with confidence score and insights

## 📁 Project Structure

```
assignment/
├── app/
│   ├── api/analyze-emotion/
│   │   └── route.ts              # Next.js API route (fallback)
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main application component
├── components/ui/
│   ├── alert.tsx                 # Alert component
│   ├── button.tsx                # Button component
│   ├── card.tsx                  # Card component
│   └── textarea.tsx              # Textarea component
├── lib/
│   └── utils.ts                  # Utility functions
├── scripts/
│   └── emotion_api.py            # Python FastAPI backend
├── package.json                  # Node.js dependencies
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## 🔧 API Endpoints

### Python FastAPI Backend

- **POST** `/analyze` - Analyze emotion from text
  ```json
  Request: {"text": "I feel nervous about my interview"}
  Response: {
    "emotion": "Anxious",
    "confidence": 0.85,
    "insights": "It's natural to feel anxious about new experiences..."
  }
  ```

- **GET** `/` - API status
- **GET** `/health` - Health check
- **GET** `/docs` - Interactive API documentation

## 🐛 Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# If port 3000 is busy, use a different port
npm run dev -- --port 3001

# If port 8000 is busy, modify the port in scripts/emotion_api.py
```

**2. Python Virtual Environment Issues**
```bash
# Deactivate and recreate virtual environment
deactivate
rm -rf venv
python -m venv venv
source venv/bin/activate  # or venv\\Scripts\\activate on Windows
pip install fastapi uvicorn pydantic
```

**3. CORS Errors**
- Ensure the Python backend is running on port 8000
- CORS is pre-configured in the FastAPI app for localhost:3000

**4. Module Not Found Errors**
```bash
# Reinstall Node.js dependencies
rm -rf node_modules package-lock.json
npm install
```
