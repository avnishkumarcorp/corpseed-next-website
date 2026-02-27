"use client";

import { useEffect, useState } from "react";
import { submitFeedback } from "@/app/lib/feedback";
import { SmilePlus, Smile, Meh, Frown, Angry, X } from "lucide-react";

const RATINGS = [
  { key: "Excellent", Icon: SmilePlus, color: "text-green-600" },
  { key: "Good", Icon: Smile, color: "text-lime-600" },
  { key: "Average", Icon: Meh, color: "text-yellow-600" },
  { key: "Poor", Icon: Frown, color: "text-orange-600" },
  { key: "Bad", Icon: Angry, color: "text-red-600" },
];

function Backdrop({ children }) {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 px-4">
      {children}
    </div>
  );
}

function SuccessPopup({ open, onClose }) {
  if (!open) return null;

  return (
    <Backdrop>
      <div className="relative w-full max-w-2xl rounded-md bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 cursor-pointer text-gray-700 hover:text-black"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="px-6 py-10 text-center">
          <p className="text-xl font-semibold text-green-600">
            Thanks so much for sharing your experience with us !!
          </p>
          <p className="mt-2 text-base text-blue-600">
            We hope to see you again soon. !!
          </p>

          <div className="mt-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 shadow-lg">
              <svg
                width="44"
                height="44"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Backdrop>
  );
}

function CommentPopup({
  open,
  onClose,
  ratingValue,
  comment,
  setComment,
  onSubmit,
  loading,
  error,
}) {
  if (!open) return null;

  return (
    <Backdrop>
      <div className="relative w-full max-w-xl rounded-xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 cursor-pointer text-gray-700 hover:text-black"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-6">
          <p className="text-lg font-semibold text-gray-900">
            Add your feedback
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Rating: <span className="font-semibold">{ratingValue}</span>
          </p>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Type your comment here..."
            className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-semibold hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={loading || !comment.trim()}
              className={[
                "rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md cursor-pointer",
                "hover:bg-blue-700 hover:shadow-lg transition",
                loading || !comment.trim()
                  ? "opacity-60 cursor-not-allowed"
                  : "",
              ].join(" ")}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </Backdrop>
  );
}

export default function FeedbackBox({ type = "product", className = "" }) {
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const [commentOpen, setCommentOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState("");
  const [comment, setComment] = useState("");

  const [error, setError] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLocation(window.location.href);
    }
  }, []);

  const send = async ({ ratingValue, commentText }) => {
    setLoading(true);
    setError("");

    const res = await submitFeedback({
      type,
      ratingValue,
      comment: commentText,
      location,
    });

    setLoading(false);

    if (!res.ok) {
      setError(`Failed (${res.status}). Please try again.`);
      return false;
    }

    setSuccessOpen(true);
    return true;
  };

  const onClickRating = async (ratingKey) => {
    setSelectedRating(ratingKey);
    setError("");

    // ✅ If Excellent: no comment popup, direct submit + success popup
    if (ratingKey === "Excellent") {
      await send({
        ratingValue: "Excellent",
        commentText: "Excellent",
      });
      return;
    }

    // ✅ Others: open comment popup
    setComment(""); // reset
    setCommentOpen(true);
  };

  const onSubmitComment = async () => {
    const ok = await send({
      ratingValue: selectedRating,
      commentText: comment || selectedRating,
    });

    if (ok) setCommentOpen(false);
  };

  return (
    <>
      <div className={`w-full ${className}`}>
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-900">
            Give us your feedback
          </p>
          <p className="mt-1 text-sm text-gray-700">
            What do you think about this article?
          </p>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4">
          {RATINGS.map(({ key, Icon, color }) => (
            <button
              key={key}
              type="button"
              onClick={() => onClickRating(key)}
              title={key}
              disabled={loading}
              className={[
                "h-10 w-10 rounded-full bg-white shadow-sm cursor-pointer",
                "border border-gray-200 flex items-center justify-center",
                "hover:shadow-md transition",
                loading ? "opacity-60 cursor-not-allowed" : "",
              ].join(" ")}
            >
              <Icon className={`h-5 w-5 ${color}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Comment popup (only for Good/Average/Poor/Bad) */}
      <CommentPopup
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
        ratingValue={selectedRating}
        comment={comment}
        setComment={setComment}
        onSubmit={onSubmitComment}
        loading={loading}
        error={error}
      />

      {/* Success popup */}
      <SuccessPopup open={successOpen} onClose={() => setSuccessOpen(false)} />
    </>
  );
}
