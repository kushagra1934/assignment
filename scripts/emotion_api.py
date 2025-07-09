"""
FastAPI Backend for Emotion Analysis
Run with: python scripts/emotion_api.py
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import re
from typing import Optional
import uvicorn


app = FastAPI(title="Emotion Analysis API", version="1.0.0")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextInput(BaseModel):
    text: str

class EmotionResponse(BaseModel):
    emotion: str
    confidence: float
    insights: Optional[str] = None

# Mock emotion analysis data
EMOTION_PATTERNS = [
    {
        "emotion": "Anxious",
        "keywords": ["nervous", "worried", "scared", "afraid", "interview", "test", "exam", "anxiety"],
        "insights": "It's natural to feel anxious about new experiences. Consider deep breathing exercises or positive visualization."
    },
    {
        "emotion": "Excited",
        "keywords": ["excited", "happy", "thrilled", "amazing", "great", "wonderful", "love", "fantastic"],
        "insights": "Your excitement shows positive anticipation! Channel this energy into productive preparation."
    },
    {
        "emotion": "Frustrated",
        "keywords": ["frustrated", "angry", "annoyed", "difficult", "hard", "struggle", "irritated"],
        "insights": "Frustration often indicates you care deeply about the outcome. Take breaks and approach challenges step by step."
    },
    {
        "emotion": "Sad",
        "keywords": ["sad", "down", "depressed", "lonely", "hurt", "disappointed", "upset"],
        "insights": "It's okay to feel sad sometimes. Consider reaching out to friends or engaging in activities you enjoy."
    },
    {
        "emotion": "Calm",
        "keywords": ["calm", "peaceful", "relaxed", "content", "serene", "balanced", "tranquil"],
        "insights": "Your sense of calm is valuable. This balanced state can help you make clearer decisions."
    },
    {
        "emotion": "Confused",
        "keywords": ["confused", "unsure", "don't know", "uncertain", "mixed", "unclear"],
        "insights": "Confusion is often the first step toward clarity. Consider breaking down complex situations into smaller parts."
    },
    {
        "emotion": "Hopeful",
        "keywords": ["hope", "optimistic", "positive", "looking forward", "bright", "promising"],
        "insights": "Hope is a powerful emotion that can drive positive action. Use this optimism to fuel your goals."
    }
]

def analyze_emotion(text: str) -> EmotionResponse:
    """
    Mock emotion analysis function
    In a real application, this would use ML models like BERT, RoBERTa, or external APIs
    """
    text_lower = text.lower()
    
    # Remove punctuation and split into words
    words = re.findall(r'\b\w+\b', text_lower)
    
    # Find matching emotions based on keywords
    emotion_scores = {}
    
    for pattern in EMOTION_PATTERNS:
        score = 0
        for keyword in pattern["keywords"]:
            if keyword in text_lower:
                score += 1
                # Boost score for exact word matches
                if keyword in words:
                    score += 1
        
        if score > 0:
            emotion_scores[pattern["emotion"]] = {
                "score": score,
                "insights": pattern["insights"]
            }
    
    if emotion_scores:
        # Get the emotion with highest score
        best_emotion = max(emotion_scores.keys(), key=lambda x: emotion_scores[x]["score"])
        confidence = min(0.95, 0.6 + (emotion_scores[best_emotion]["score"] * 0.1))
        
        return EmotionResponse(
            emotion=best_emotion,
            confidence=round(confidence, 2),
            insights=emotion_scores[best_emotion]["insights"]
        )
    else:
        # Default emotions for neutral text
        default_emotions = ["Thoughtful", "Reflective", "Neutral"]
        selected_emotion = random.choice(default_emotions)
        
        return EmotionResponse(
            emotion=selected_emotion,
            confidence=round(random.uniform(0.6, 0.8), 2),
            insights="Your reflection shows self-awareness, which is a positive step toward emotional understanding."
        )

@app.get("/")
async def root():
    return {"message": "Emotion Analysis API is running!", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "emotion-analysis"}

@app.post("/analyze", response_model=EmotionResponse)
async def analyze_text(input_data: TextInput):
    """
    Analyze the emotional content of the provided text
    """
    if not input_data.text or not input_data.text.strip():
        raise HTTPException(status_code=400, detail="Text input cannot be empty")
    
    if len(input_data.text.strip()) < 5:
        raise HTTPException(
            status_code=400, 
            detail="Please provide a longer reflection for better analysis"
        )
    
    try:
        # Simulate processing time
        import time
        time.sleep(random.uniform(0.5, 1.5))
        
        result = analyze_emotion(input_data.text)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

if __name__ == "__main__":
    print("Starting Emotion Analysis API...")
    print("API will be available at: http://localhost:8000")
    print("Interactive docs at: http://localhost:8000/docs")
    
    uvicorn.run(
        "emotion_api:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
