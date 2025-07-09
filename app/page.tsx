"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import {
  Loader2,
  Brain,
  AlertCircle,
  Moon,
  Sun,
  Sparkles,
  TrendingUp,
  RefreshCw,
  AudioLines,
} from "lucide-react";

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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    } else {
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
      document.documentElement.classList.toggle("dark", isDarkMode);
    }
  }, [isDarkMode, mounted]);

  const analyzeEmotion = async () => {
    if (!reflection.trim()) {
      setError("Please share your thoughts before we can analyze them.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/analyze", {
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
      setError(
        "We couldn't analyze your emotions right now. Please try again in a moment."
      );
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

  const getEmotionStyle = (emotion: string): string => {
    const emotionStyles: Record<string, string> = {
      Happy:
        "from-amber-500/10 to-yellow-500/10 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300",
      Sad: "from-blue-500/10 to-cyan-500/10 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300",
      Anxious:
        "from-orange-500/10 to-red-500/10 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300",
      Excited:
        "from-green-500/10 to-emerald-500/10 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300",
      Frustrated:
        "from-red-500/10 to-pink-500/10 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300",
      Calm: "from-teal-500/10 to-blue-500/10 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300",
      Confused:
        "from-purple-500/10 to-indigo-500/10 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300",
    };
    return (
      emotionStyles[emotion] ||
      "from-gray-500/10 to-slate-500/10 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
    );
  };

  const resetForm = () => {
    setReflection("");
    setResult(null);
    setError(null);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 font-cascadia ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900"
          : "bg-gradient-to-br from-slate-50 via-white to-slate-100"
      }`}
    >
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header with Theme Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-2xl transition-all duration-300 ${
                isDarkMode
                  ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm"
                  : "bg-gradient-to-r from-indigo-100 to-purple-100"
              }`}
            >
              <Brain
                className={`w-7 h-7 ${
                  isDarkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              />
            </div>
            <div>
              <h1
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Reflection Space
              </h1>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Understand your emotions better
              </p>
            </div>
          </div>

          <Button
            onClick={toggleTheme}
            variant="outline"
            size="icon"
            className={`rounded-full transition-all duration-300 ${
              isDarkMode
                ? "bg-gray-800 border-gray-400 hover:bg-gray-700"
                : "bg-white border-gray-400 hover:bg-gray-50"
            }`}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </Button>
        </div>

        {/* Input Form */}
        <Card
          className={`shadow-xl border-0 transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-900/50 backdrop-blur-sm"
              : "bg-gray-200 backdrop-blur-sm"
          }`}
        >
          <CardHeader className="pb-5">
            <CardTitle
              className={`text-lg flex items-center gap-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <AudioLines className="w-5 h-5 text-rose-500" />
              What's on your mind?
            </CardTitle>
            <CardDescription
              className={`${isDarkMode ? "text-gray-300" : "text-gray-800"}`}
            >
              Share your thoughts, feelings, or experiences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="relative">
              <Textarea
                placeholder="Write here"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`min-h-[140px] resize-none border-0 rounded-xl transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700/50 text-white placeholder-gray-400 focus:bg-gray-700/80"
                    : "bg-gray-50 text-gray-900 placeholder-gray-500 focus:bg-gray-100/80"
                } focus:ring-2 focus:ring-indigo-500/50`}
                disabled={isLoading}
              />
              <div
                className={`absolute bottom-3 right-3 text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {reflection.length}/500
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={analyzeEmotion}
                disabled={isLoading || !reflection.trim()}
                className={`flex-1 rounded-xl font-medium transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25"
                    : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/25"
                } text-white border-0`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyze Emotions
                  </>
                )}
              </Button>

              {(result || error) && (
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className={`px-5 rounded-xl transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-700/50 border-gray-600 hover:bg-gray-700 text-gray-300"
                      : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              )}
            </div>

            <p
              className={`text-xs text-center ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Press{" "}
              <kbd
                className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                ctrl
              </kbd>{" "}
              +{" "}
              <kbd
                className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Enter
              </kbd>{" "}
              for quick analysis
            </p>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Alert
            className={`mt-5 border-0 rounded-xl ${
              isDarkMode
                ? "bg-red-900/20 border-red-800"
                : "bg-red-50 border-red-200"
            }`}
          >
            <AlertCircle
              className={`h-4 w-4 ${
                isDarkMode ? "text-red-400" : "text-red-600"
              }`}
            />
            <AlertDescription
              className={`${isDarkMode ? "text-red-300" : "text-red-700"}`}
            >
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {result && (
          <Card
            className={`mt-5 shadow-xl border-0 rounded-xl bg-gradient-to-br ${getEmotionStyle(
              result.emotion
            )} transition-all duration-500 animate-in slide-in-from-bottom-4`}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Your Emotional State
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="text-center space-y-3">
                <div className="text-4xl font-bold tracking-tight">
                  {result.emotion}
                </div>
                <div className="text-sm opacity-80 font-medium">
                  {Math.round(result.confidence * 100)}% confidence
                </div>
              </div>

              {/* Enhanced Confidence Visualization */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm opacity-80">
                  <span>Confidence Level</span>
                  <span className="font-mono">
                    {Math.round(result.confidence * 100)}%
                  </span>
                </div>
                <div
                  className={`w-full rounded-full h-2 overflow-hidden ${
                    isDarkMode ? "bg-white/20" : "bg-white/40"
                  }`}
                >
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out bg-current"
                    style={{ width: `${result.confidence * 100}%` }}
                  />
                </div>
              </div>

              {result.insights && (
                <div
                  className={`mt-5 p-4 rounded-xl backdrop-blur-sm ${
                    isDarkMode ? "bg-white/10" : "bg-white/60"
                  }`}
                >
                  <p className="text-sm font-semibold mb-2 opacity-90">
                    Insights & Reflection:
                  </p>
                  <p className="text-sm leading-relaxed opacity-85">
                    {result.insights}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div
          className={`text-center mt-8 text-xs ${
            isDarkMode ? "text-gray-500" : "text-gray-400"
          }`}
        >
          <p>A thoughtful space for emotional awareness and growth</p>
          <p>Made with ❤️ by Kushagra</p>
        </div>
      </div>
    </div>
  );
}
