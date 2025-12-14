"use client";

import React, { useState } from "react";
import {
  Copy,
  Download,
  RefreshCw,
  History,
  FileText,
  Code,
  File,
  MessageSquare,
  Check,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

// Only declare once
const feedbackTypes = [
  { name: "Essay", icon: FileText },
  { name: "Code", icon: Code },
  { name: "Resume", icon: File },
  { name: "General", icon: MessageSquare },
];

const FeedbackPage = () => {
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackType, setFeedbackType] = useState("Essay");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [aiData, setAiData] = useState<any | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const wordCount = feedbackText.trim().split(/\s+/).filter(Boolean).length;

  // ------------------------------
  // 🔥 Extract Text from PDF/DOCX
  // ------------------------------
  const extractTextFromFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("/api/extract-text", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.text;
  };


  // ------------------------------
  // 🔥 Final Submission Handler

  // ------------------------------
  const handleGrammarCheck = async () => {
    setLoading(true);

    try {
      const textToAnalyze =
        feedbackType === "Resume" ? resumeText : feedbackText;

      if (!textToAnalyze.trim()) {
        toast.error("No text found to analyze.");
        setLoading(false);
        return;
      }

      const res = await axios.post("/api/ai/chat", {
        type: "GrammarCheck",
        content: textToAnalyze,
      });

      setAiData(res.data);
      setShowResult(true);

      setTimeout(() => {
        document.getElementById("result-section")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 200);

    } catch (err) {
      toast.error("Grammar analysis failed.");
    }

    setLoading(false);
  };

  const handleGenerateFeedback = async () => {
    setLoading(true);

    try {
      let finalContent = feedbackText;

      // Resume upload only if resume type is selected
      if (feedbackType === "Resume") {
        if (!resumeFile) {
          toast.error("Please upload a resume file.");
          setLoading(false);
          return;
        }

        // Extract PDF/DOCX → pure text
        finalContent = await extractTextFromFile(resumeFile);
        setResumeText(finalContent);
      }

      // --- Send extracted / raw content to AI ---
      const res = await axios.post("/api/ai/chat", {
        type: feedbackType,
        content: finalContent,
      });

      setAiData(res.data);
      setShowResult(true);

      // Auto-scroll to result section
      setTimeout(() => {
        document.getElementById("result-section")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 250);
    } catch (err) {
      toast.error("Failed to process your input.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e0e0e] via-[#1a1a1c] to-[#222325]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 bg-gradient-to-r from-red-700 to-orange-500 bg-clip-text text-transparent">
            AI Feedback Generator
          </h1>
          <p className="text-lg sm:text-xl text-white-600 max-w-2xl mx-auto">
            Get instant, detailed feedback on your essays, code, resumes, and more
          </p>
        </div>

        {/* Feedback Input Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8 transition-all hover:shadow-2xl">
          {/* Feedback Type Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Feedback Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {feedbackTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.name}
                    onClick={() => setFeedbackType(type.name)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${feedbackType === type.name
                      ? 'bg-red-600 text-white shadow-lg shadow-blue-200 scale-105'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm">{type.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Textarea */}
          {/* ================== INPUT SECTION ================== */}
          {feedbackType !== "Resume" ? (
            /* Normal textarea input */
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Your Content
              </label>
              <textarea
                
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Paste your essay, code, resume, or any text here..."
                className="w-full h-64 px-4 py-3 border-2 border-slate-200 rounded-xl resize-none focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-700 placeholder:text-slate-400"
              />
            </div>
          ) : (
            /* File upload for Resume */
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Upload Resume (PDF, DOC, DOCX)
              </label>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setResumeFile(file);
                }}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-700"
              />

              {resumeFile && (
                <p className="mt-2 text-sm text-slate-600">
                  Selected: <span className="font-semibold">{resumeFile.name}</span>
                </p>
              )}
            </div>
          )}


          {/* Word Count */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{wordCount}</span> words
            </span>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateFeedback}
            disabled={
              loading ||
              (
                feedbackType !== "Resume"
                  ? !feedbackText.trim()
                  : !resumeFile
              )
            }
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? "Analyzing with AI..." : "Generate Feedback"}
          </button>
          {/* <button
            onClick={handleGrammarCheck}
            disabled={loading || (!resumeText && !feedbackText)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg mt-3"
          >
            {loading ? "Analyzing Grammar..." : "Grammar & Tone Check"}
          </button> */}


        </div>

        {/* Result Section */}
        {showResult && aiData && (
          <div
            id="result-section"
            className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8 animate-slide-up"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-6">AI Feedback</h2>

            {/* ================= SUMMARY ================= */}
            {aiData.summary && (
              <div className="mb-6 p-5 bg-blue-50 rounded-xl border-l-4 border-blue-600">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Summary</h3>
                <p className="text-slate-700 leading-relaxed">{aiData.summary}</p>
              </div>
            )}

            {/* ================= STRENGTHS ================= */}
            {aiData.strengths?.length > 0 && (
              <div className="mb-6 p-5 bg-green-50 rounded-xl border-l-4 border-green-600">
                <h3 className="text-lg text-slate-900 font-semibold mb-2">Strengths</h3>
                <ul className="space-y-2 text-slate-700">
                  {aiData.strengths.map((p: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ================= WEAKNESSES ================= */}
            {aiData.weaknesses?.length > 0 && (
              <div className="mb-6 p-5 bg-orange-50 rounded-xl border-l-4 border-orange-600">
                <h3 className="text-lg text-slate-900 font-semibold mb-3">Weaknesses</h3>
                <ul className="space-y-2 text-slate-700">
                  {aiData.weaknesses.map((p: string, i: number) => (
                    <li key={i}>
                      <span className="text-orange-600 mr-2">!</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ================= IMPROVEMENTS ================= */}
            {aiData.improvements?.length > 0 && (
              <div className="mb-6 p-5 bg-purple-50 rounded-xl border-l-4 border-purple-600">
                <h3 className="text-lg text-slate-900 font-semibold mb-3">
                  Suggested Improvements
                </h3>
                <ul className="space-y-2 text-slate-700">
                  {aiData.improvements.map((p: string, i: number) => (
                    <li key={i}>
                      <span className="text-purple-600 mr-2">→</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ================= CODE BLOCK (only for code type) ================= */}
            {aiData.correctedCode && (
              <div className="mb-6 p-5 bg-slate-900 text-white rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-3">Corrected Code</h3>

                <pre className="bg-black/40 p-4 rounded-lg overflow-auto text-sm border border-white/10">
                  {aiData.correctedCode}
                </pre>

                {aiData.timeComplexity && (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-blue-300">Time Complexity</h4>
                    <p className="text-gray-300">{aiData.timeComplexity}</p>
                  </div>
                )}

                {aiData.spaceComplexity && (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-purple-300">Space Complexity</h4>
                    <p className="text-gray-300">{aiData.spaceComplexity}</p>
                  </div>
                )}
              </div>
            )}

            {/* ======================= RESUME UI ======================= */}
            {aiData.skillsFound && (
              <div className="mb-6 p-5 bg-green-50 rounded-xl border-l-4 border-green-600">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Skills Found</h3>
                <div className="flex flex-wrap gap-2">
                  {aiData.skillsFound.map((s: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {aiData.missingSkills && (
              <div className="mb-6 p-5 bg-red-50 rounded-xl border-l-4 border-red-600">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Missing Skills</h3>
                <ul className="space-y-2 text-slate-700">
                  {aiData.missingSkills.map((s: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <span className="text-red-600 mr-2">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Formatting Issues */}
            {aiData.formattingIssues && (
              <div className="mb-6 p-5 bg-yellow-50 rounded-xl border-l-4 border-yellow-600">
                <h3 className="text-lg font-semibold mb-3 text-slate-900">Formatting Issues</h3>
                <ul className="space-y-2 text-slate-700">
                  {aiData.formattingIssues.map((f: string, i: number) => (
                    <li key={i}>
                      <span className="text-yellow-600 mr-2">⚠</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ATS SCORE */}
            {aiData.atsScore !== undefined && (
              <div className="mb-6 p-6 bg-slate-50 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">ATS Score</h3>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-4xl font-bold text-indigo-600">{aiData.atsScore}/100</span>
                  <span className="text-slate-600 text-sm">Higher score → better match</span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                    style={{ width: `${aiData.atsScore}%` }}
                  />
                </div>
              </div>
            )}
            {aiData.grammarIssues && aiData.grammarIssues.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-lg text-red-600">Grammar Issues</h3>
                <ul className="list-disc ml-5 text-sm">
                  {aiData.grammarIssues.map((issue: string, i: number) => (
                    <li key={i}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {aiData.toneIssues && aiData.toneIssues.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-lg text-orange-600">Tone Issues</h3>
                <ul className="list-disc ml-5 text-sm">
                  {aiData.toneIssues.map((issue: string, i: number) => (
                    <li key={i}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {aiData.rewrittenText && (
              <div className="mt-4 p-3 bg-slate-100 rounded-lg text-sm">
                <h3 className="font-semibold text-green-600 text-lg">Improved Professional Rewrite</h3>
                <p>{aiData.rewrittenText}</p>
              </div>
            )}


            {/* ================= SCORE ================= */}
            {aiData.score && (
              <div className="mb-6 p-5 bg-slate-50 rounded-xl">
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Final Score</h3>
                  <span className="text-3xl font-bold text-blue-600">{aiData.score}/100</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                    style={{ width: `${aiData.score}%` }}
                  />
                </div>

                {aiData.finalRemark && (
                  <p className="text-sm text-slate-600 mt-2">{aiData.finalRemark}</p>
                )}
              </div>
            )}
          </div>
        )}


        {/* Latest Feedbacks */}
        {/* <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Feedback</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestFeedbacks.map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {item.type}
                  </span>
                  <span className="text-xs text-slate-500">{item.date}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <div 
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{item.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FeedbackPage;