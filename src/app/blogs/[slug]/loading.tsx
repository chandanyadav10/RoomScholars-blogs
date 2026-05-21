export default function BlogLoading() {
  return (
    <div>
      <div className="bg-navy py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-3 w-24 bg-white/10 rounded mb-6 skeleton" />
          <div className="h-12 w-3/4 bg-white/10 rounded skeleton mb-4" />
          <div className="h-6 w-full bg-white/10 rounded skeleton mb-2" />
          <div className="h-6 w-2/3 bg-white/10 rounded skeleton" />
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`h-5 skeleton rounded ${i % 3 === 2 ? "w-2/3" : "w-full"}`} />
        ))}
      </div>
    </div>
  );
}
