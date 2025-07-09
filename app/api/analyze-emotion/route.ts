import { type NextRequest, NextResponse } from "next/server"

interface AnalyzeRequest {
  text: string
}

interface EmotionResponse {
  emotion: string
  confidence: number
  insights: string
}

// Mock emotion analysis - simulates calling a Python backend
const mockEmotionAnalysis = (text: string): EmotionResponse => {
  const emotions = [
    {
      emotion: "Anxious",
      keywords: ["nervous", "worried", "scared", "afraid", "interview", "test", "exam"],
      insights:
        "It's natural to feel anxious about new experiences. Consider deep breathing exercises or positive visualization.",
    },
    {
      emotion: "Excited",
      keywords: ["excited", "happy", "thrilled", "amazing", "great", "wonderful", "love"],
      insights: "Your excitement shows positive anticipation! Channel this energy into productive preparation.",
    },
    {
      emotion: "Frustrated",
      keywords: ["frustrated", "angry", "annoyed", "difficult", "hard", "struggle"],
      insights:
        "Frustration often indicates you care deeply about the outcome. Take breaks and approach challenges step by step.",
    },
    {
      emotion: "Sad",
      keywords: ["sad", "down", "depressed", "lonely", "hurt", "disappointed"],
      insights:
        "It's okay to feel sad sometimes. Consider reaching out to friends or engaging in activities you enjoy.",
    },
    {
      emotion: "Calm",
      keywords: ["calm", "peaceful", "relaxed", "content", "serene", "balanced"],
      insights: "Your sense of calm is valuable. This balanced state can help you make clearer decisions.",
    },
    {
      emotion: "Confused",
      keywords: ["confused", "unsure", "don't know", "uncertain", "mixed"],
      insights:
        "Confusion is often the first step toward clarity. Consider breaking down complex situations into smaller parts.",
    },
  ]

  const lowerText = text.toLowerCase()

  // Find matching emotion based on keywords
  for (const emotionData of emotions) {
    for (const keyword of emotionData.keywords) {
      if (lowerText.includes(keyword)) {
        return {
          emotion: emotionData.emotion,
          confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
          insights: emotionData.insights,
        }
      }
    }
  }

  // Default emotion if no keywords match
  const defaultEmotions = ["Happy", "Calm", "Thoughtful"]
  const randomEmotion = defaultEmotions[Math.floor(Math.random() * defaultEmotions.length)]

  return {
    emotion: randomEmotion,
    confidence: Math.random() * 0.2 + 0.6, // 60-80% confidence
    insights: "Your reflection shows self-awareness, which is a positive step toward emotional understanding.",
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json()

    if (!body.text || typeof body.text !== "string") {
      return NextResponse.json({ error: "Text input is required" }, { status: 400 })
    }

    if (body.text.trim().length < 5) {
      return NextResponse.json({ error: "Please provide a longer reflection for better analysis" }, { status: 400 })
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    const result = mockEmotionAnalysis(body.text)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error analyzing emotion:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
