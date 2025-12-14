'use client';


import { motion } from 'framer-motion';
import { X, User, FileText, MessageSquare, Code, Calendar, TrendingUp } from 'lucide-react';
import { useEffect, useState } from "react";


//Mock Data
const mockUser = {
    username: 'Sarah Mitchell',
    email: 'sarah.mitchell@example.com',
    memberSince: 'January 2024',
    avatar: null,
    stats: {
        totalFeedback: 47,
        resumeChecks: 12,
        grammarChecks: 23,
        codeFeedback: 12,
    },
};

// const mockFeedback = [
//     {
//         id: 1,
//         type: 'Resume',
//         preview: 'Senior Software Engineer position at tech startup. Looking for feedback on technical skills section and project descriptions...',
//         score: 8.5,
//         date: '2024-12-10',
//         fullContent: 'Detailed resume review with recommendations for improving technical skills presentation, quantifying achievements, and optimizing ATS compatibility.',
//     },
//     {
//         id: 2,
//         type: 'Grammar',
//         preview: 'Check my cover letter for the marketing manager role. I want to make sure the tone is professional and engaging...',
//         score: 9.2,
//         date: '2024-12-09',
//         fullContent: 'Grammar and style review identifying minor punctuation improvements and suggestions for stronger action verbs.',
//     },
//     {
//         id: 3,
//         type: 'Code',
//         preview: 'React component optimization - useState vs useReducer for complex state management in large forms...',
//         score: 7.8,
//         date: '2024-12-08',
//         fullContent: 'Code review suggesting useReducer for complex form state, implementing proper error boundaries, and optimizing re-renders.',
//     },
//     {
//         id: 4,
//         type: 'General',
//         preview: 'How can I improve my LinkedIn profile summary to attract recruiters in the fintech industry?',
//         score: null,
//         date: '2024-12-07',
//         fullContent: 'Comprehensive LinkedIn profile feedback with keyword optimization, industry-specific terminology, and engagement strategies.',
//     },
//     {
//         id: 5,
//         type: 'Resume',
//         preview: 'Entry-level data analyst resume review. First job out of college, mainly academic projects and internship experience...',
//         score: 7.5,
//         date: '2024-12-06',
//         fullContent: 'Entry-level resume guidance focusing on highlighting transferable skills, academic achievements, and internship impact.',
//     },
//     {
//         id: 6,
//         type: 'Grammar',
//         preview: 'Professional email to potential clients introducing our new SaaS product. Need to ensure clarity and persuasiveness...',
//         score: 8.9,
//         date: '2024-12-05',
//         fullContent: 'Email copywriting review with suggestions for clearer value proposition, stronger call-to-action, and tone adjustments.',
//     },
// ];


const typeIcons: Record<string, any> = {
    essay: MessageSquare,
    resume: FileText,
    code: Code,
    general: TrendingUp,
};

const typeColors: Record<string, string> = {
    essay: "bg-green-100 text-green-700 border-green-200",
    resume: "bg-blue-100 text-blue-700 border-blue-200",
    code: "bg-purple-100 text-purple-700 border-purple-200",
    general: "bg-gray-100 text-gray-700 border-gray-200",
};


function StatCard({ label, value, icon: Icon, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + (index * 0.1) }}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors group"
        >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                    <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                    <p className="text-2xl font-semibold text-gray-900">{value}</p>
                    <p className="text-sm text-gray-500">{label}</p>
                </div>
            </div>
        </motion.div>
    );
}

function FeedbackCard({
    feedback,
    index,
    onViewDetails,
    onDelete,
}: {
    feedback: any;
    index: number;
    onViewDetails: (f: any) => void;
    onDelete: (id: string) => void;
}) {
    const safeType = feedback.type || "general";
    const TypeIcon = typeIcons[safeType] ?? MessageSquare;

    const formatType = (type?: string) => {
        if (!type || typeof type !== "string") return "General";
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 group"
        >
            <div className="flex items-start justify-between mb-3">
                <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${typeColors[safeType] || typeColors.general}`}
                >
                    <TypeIcon className="w-3.5 h-3.5" />
                    {formatType(safeType)}
                </span>

                {typeof feedback.aiResponse?.score === "number" && (
                    <div className="flex items-center gap-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                                {feedback.aiResponse.score}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
                {feedback.content}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {feedback.createdAt
                        ? new Date(feedback.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })
                        : "—"}
                </div>

                <button
                    onClick={() => onViewDetails(feedback)}
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                    View Details
                </button>
                <button
                    onClick={() => onDelete(feedback._id)}
                    className="
    flex items-center gap-1
    px-3 py-1.5 sm:px-4 sm:py-2
    text-xs sm:text-sm
    font-medium
    text-red-500
    rounded-md
    hover:bg-red-50 hover:text-red-600
    active:bg-red-100
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-red-400
  "
                >
                    🗑️ <span className="hidden sm:inline">Delete</span>
                </button>



            </div>
        </motion.div>
    );
}

function Modal({ feedback, onClose }) {
    const TypeIcon = typeIcons[feedback.type] || TrendingUp;


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${typeColors[feedback.type] ||
                                "bg-gray-100 text-gray-700 border-gray-200"
                                }`}
                        >
                            <TypeIcon className="w-3.5 h-3.5" />
                            {feedback.type}
                        </span>

                        {typeof feedback.aiResponse?.score === "number" && (
                            <span className="text-sm font-semibold text-gray-700">
                                Score: {feedback.aiResponse.score}/100
                            </span>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            User Input
                        </h3>
                        <p className="text-gray-700 leading-relaxed"> {feedback.content} </p>


                    </div>

                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            AI Feedback
                        </h3>

                        <div className="space-y-3">
                            {feedback.aiResponse?.summary && (
                                <p className="text-gray-700 leading-relaxed line-clamp-2">
                                    {feedback.content}
                                </p>

                            )}

                            {Array.isArray(feedback.aiResponse?.improvements) && (
                                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                    {feedback.aiResponse.improvements.map(
                                        (item: string, index: number) => (
                                            <li key={index}>{item}</li>
                                        )
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {new Date(feedback.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </div>
                </div>


            </motion.div>
        </motion.div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No feedback history yet</h3>
            <p className="text-gray-500 text-center max-w-sm">
                Your feedback and search history will appear here once you start using our services.
            </p>
        </div>
    );
}

export default function Dashboard() {
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hiddenIds, setHiddenIds] = useState<string[]>([]);


    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await fetch("/api/dashboard");
                if (!res.ok) throw new Error("Failed to fetch dashboard");
                const data = await res.json();
                setDashboardData(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    useEffect(() => {
        const stored = localStorage.getItem("hiddenFeedbackIds");
        if (stored) {
            setHiddenIds(JSON.parse(stored));
        }
    }, []);


    const handleDelete = (id: string) => {
        const updated = [...hiddenIds, id];
        setHiddenIds(updated);
        localStorage.setItem("hiddenFeedbackIds", JSON.stringify(updated));
    };



    // Utility: initials
    const getInitials = (name?: string) => {
        if (!name) return "";
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase();
    };


    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-400">
                Loading dashboard...
            </div>
        );
    }

    // Error state
    if (!dashboardData) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                Failed to load dashboard
            </div>
        );
    }
    const { profile, stats, history } = dashboardData;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-8"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600 to-blue-400 flex items-center justify-center text-white text-2xl font-semibold shadow-lg">
                            {getInitials(profile.username)}
                        </div>

                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">
                                {profile.username}
                            </h1>
                            <p className="text-gray-600 mb-2">{profile.email}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <User className="w-4 h-4" />
                                <span>Member since {profile.memberSince}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            label="Total Feedback"
                            value={stats.total}
                            icon={TrendingUp}
                            index={0}
                        />
                        <StatCard
                            label="Resume Checks"
                            value={stats.resume}
                            icon={FileText}
                            index={1}
                        />
                        <StatCard
                            label="Essay Checks"
                            value={stats.essay} // still grammar internally
                            icon={MessageSquare}
                            index={2}
                        />

                        <StatCard
                            label="Code Feedback"
                            value={stats.code}
                            icon={Code}
                            index={3}
                        />
                    </div>

                </motion.div>

                {/* Feedback History */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Feedback History</h2>
                        <span className="text-sm text-gray-500">
                            {dashboardData?.history?.length || 0}{" "}
                            {(dashboardData?.history?.length || 0) === 1 ? "item" : "items"}
                        </span>

                    </div>
                    {isLoading ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse"
                                >
                                    <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                                    <div className="h-10 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : !dashboardData?.history || dashboardData.history.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {dashboardData.history
                                .filter((item: any) => !hiddenIds.includes(item._id))
                                .map((feedback: any, index: number) => (
                                    <FeedbackCard
                                        key={feedback._id}
                                        feedback={feedback}
                                        index={index}
                                        onViewDetails={setSelectedFeedback}
                                        onDelete={handleDelete}
                                    />
                                ))}
                        </div>

                    )}

                </motion.div>
            </div>

            {/* Modal */}
            {selectedFeedback && (
                <Modal
                    feedback={selectedFeedback}
                    onClose={() => setSelectedFeedback(null)}
                />
            )}
        </div>
    );
}