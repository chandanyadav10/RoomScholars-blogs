export default function BlogsLoading() {
  return (
    <div>
      <div className="bg-[#07122B] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-3 w-32 bg-white/10 rounded mb-3 skeleton" />
          <div className="h-10 w-64 bg-white/10 rounded skeleton" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-10 w-full max-w-md rounded-xl mb-10 skeleton" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-gray-100">
              <div className="h-52 skeleton" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 skeleton rounded" />
                <div className="h-4 w-full skeleton rounded" />
                <div className="h-4 w-2/3 skeleton rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
