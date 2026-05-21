"use client";

export default function BlogsError({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-[#07122B] mb-2" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
          Something went wrong
        </h2>
        <p className="text-gray-500 mb-6">We couldn&apos;t load the blogs. Please try again.</p>
        <button
          onClick={reset}
          className="bg-[#07122B] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#0d1f4a] transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
