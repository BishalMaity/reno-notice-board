export default function Loading({ type = 'spinner' }) {
  if (type === 'grid') {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex animate-pulse flex-col space-y-3.5 rounded-2xl bg-white p-5 shadow-xs border border-slate-100 ">
            <div className="h-28 rounded-xl bg-slate-100 "></div>
            <div className="h-5 w-3/4 rounded bg-slate-100 "></div>
            <div className="space-y-1.5 flex-1">
              <div className="h-3 rounded bg-slate-100 "></div>
              <div className="h-3 w-5/6 rounded bg-slate-100 "></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <svg className="animate-spin h-6 w-6 text-indigo-600 mb-2" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Loading details...</p>
    </div>
  );
}
