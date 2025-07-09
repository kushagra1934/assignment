"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Brain, Heart, AlertCircle } from "lucide-react";

interface EmotionResult {
  emotion: string;
  confidence: number;
  insights?: string;
}

interface ApiResponse {
  emotion: string;
  confidence: number;
  insights?: string;
}

export default function EmotionReflectionTool() {
  const [reflection, setReflection] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeEmotion = async () => {
    if (!reflection.trim()) {
      setError("Please enter your reflection before analyzing.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze-emotion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: reflection }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError("Failed to analyze emotion. Please try again.");
      console.error("Analysis error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      analyzeEmotion();
    }
  };

  const getEmotionColor = (emotion: string): string => {
    const emotionColors: Record<string, string> = {
      Happy: "text-yellow-600 bg-yellow-50 border-yellow-200",
      Sad: "text-blue-600 bg-blue-50 border-blue-200",
      Anxious: "text-orange-600 bg-orange-50 border-orange-200",
      Excited: "text-green-600 bg-green-50 border-green-200",
      Frustrated: "text-red-600 bg-red-50 border-red-200",
      Calm: "text-teal-600 bg-teal-50 border-teal-200",
      Confused: "text-purple-600 bg-purple-50 border-purple-200",
    };
    return emotionColors[emotion] || "text-gray-600 bg-gray-50 border-gray-200";
  };

  const resetForm = () => {
    setReflection("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto space-y-6 pt-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-indigo-100 rounded-full">
              <Brain className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Emotion Reflection
          </h1>
          <p className="text-gray-600 text-sm">
            Share your thoughts and discover the emotions behind them
          </p>
        </div>

        {/* Input Form */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              How are you feeling?
            </CardTitle>
            <CardDescription>
              Write about your current thoughts or experiences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="I feel nervous about my first job interview..."
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[120px] resize-none border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
              disabled={isLoading}
            />

            <div className="flex gap-2">
              <Button
                onClick={analyzeEmotion}
                disabled={isLoading || !reflection.trim()}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Emotion"
                )}
              </Button>

              {(result || error) && (
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="px-4 bg-transparent"
                >
                  Reset
                </Button>
              )}
            </div>

            <p className="text-xs text-gray-500 text-center">
              Tip: Press Cmd/Ctrl + Enter to analyze quickly
            </p>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {result && (
          <Card
            className={`shadow-lg border-2 ${getEmotionColor(result.emotion)}`}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Analysis Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold">{result.emotion}</div>
                <div className="text-sm opacity-75">
                  Confidence: {Math.round(result.confidence * 100)}%
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs opacity-75">
                  <span>Confidence Level</span>
                  <span>{Math.round(result.confidence * 100)}%</span>
                </div>
                <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                  <div
                    className="bg-current h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${result.confidence * 100}%` }}
                  />
                </div>
              </div>

              {result.insights && (
                <div className="mt-4 p-3 bg-white bg-opacity-50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Insights:</p>
                  <p className="text-sm opacity-90">{result.insights}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 pt-4">
          <p>This is a demonstration tool with mock analysis results</p>
        </div>
      </div>
    </div>
  );
}
