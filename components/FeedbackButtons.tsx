"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface FeedbackButtonsProps {
  template: string;
  tone: string;
}

export default function FeedbackButtons({ template, tone }: FeedbackButtonsProps) {
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");
  const [commentSent, setCommentSent] = useState(false);

  const handleFeedback = async (rating: "good" | "bad") => {
    setSubmitted(rating);

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || null;

    await supabase.from("report_feedback").insert({
      user_id: userId,
      rating,
      template,
      tone,
    });

    if (rating === "bad") {
      setShowComment(true);
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || null;

    await supabase.from("report_feedback").insert({
      user_id: userId,
      rating: "bad",
      comment: comment.trim(),
      template,
      tone,
    });

    setCommentSent(true);
    setShowComment(false);
  };

  if (commentSent) {
    return (
      <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 rounded-xl px-4 py-3">
        <span>💬</span>
        <span>フィードバックありがとうございます！改善に活用させていただきます。</span>
      </div>
    );
  }

  if (submitted === "good") {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-xl px-4 py-3">
        <span>🎉</span>
        <span>ありがとうございます！高評価が励みになります。</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500">この日報の品質は？</span>
        <button
          onClick={() => handleFeedback("good")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            submitted === "good"
              ? "bg-green-100 text-green-700 border-2 border-green-300"
              : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-green-50 hover:border-green-300 hover:text-green-600"
          }`}
        >
          👍 良い
        </button>
        <button
          onClick={() => handleFeedback("bad")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            submitted === "bad"
              ? "bg-red-100 text-red-700 border-2 border-red-300"
              : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
          }`}
        >
          👎 改善希望
        </button>
      </div>

      {showComment && (
        <div className="animate-fade-in space-y-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="どこを改善できますか？（任意）"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={handleCommentSubmit}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all"
            >
              送信
            </button>
            <button
              onClick={() => { setShowComment(false); setCommentSent(true); }}
              className="px-4 py-2 text-gray-500 text-sm hover:text-gray-700 transition-colors"
            >
              スキップ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
