import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';

export default function NoticeCard({ notice, onEdit, onDelete }) {
  const { id, title, body, category, priority, publishDate, image } = notice;
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu on click outside
  useEffect(() => {
    if (!showMenu) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMenu]);

  const formattedDate = (() => {
    try {
      return format(new Date(publishDate), 'MMM dd, yyyy');
    } catch {
      return 'Invalid Date';
    }
  })();

  const bannerGradients = {
    General: 'from-blue-50 to-indigo-100/50 dark:from-slate-800 dark:to-indigo-950/30',
    Exam: 'from-rose-50 to-pink-100/50 dark:from-slate-800 dark:to-rose-950/30',
    Event: 'from-amber-50 to-orange-100/50 dark:from-slate-800 dark:to-amber-950/30',
  };

  const dotColors = {
    General: 'bg-indigo-500',
    Exam: 'bg-rose-500',
    Event: 'bg-amber-500',
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:hover:shadow-slate-950/50">
      {/* Visual Banner */}
      <div className="relative h-28 w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
        {image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className={`h-full w-full bg-gradient-to-br ${bannerGradients[category] || bannerGradients.General}`} />
        )}

        {/* Category Pill Overlaid */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 shadow-sm">
          <span className={`h-1.5 w-1.5 rounded-full ${dotColors[category] || 'bg-slate-400'}`} />
          {category}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="relative mb-2 flex items-start justify-between gap-4">
          <h3 className="text-lg font-bold leading-tight text-slate-800 dark:text-white transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            {title}
          </h3>

          {/* Action Menu button (3-dot menu / hamburger) */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/80 dark:border-slate-700/80 shadow-2xs transition-all focus:outline-none ${
                showMenu
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white'
                  : 'bg-slate-50/50 dark:bg-slate-900/40 text-slate-650 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Actions"
            >
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 z-20 w-32 origin-top-right rounded-xl bg-white dark:bg-slate-850 p-1.5 shadow-lg border border-slate-200/80 dark:border-slate-800 animate-in fade-in slide-in-from-top-1 duration-150">
                <button
                  onClick={() => { setShowMenu(false); onEdit(notice); }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors"
                >
                  <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => { setShowMenu(false); onDelete(notice); }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                >
                  <svg className="h-4 w-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Description body */}
        <p className="mb-5 text-base leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
          {body}
        </p>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-sm font-medium text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Urgent Badge */}
            {priority === 'Urgent' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-2 py-0.5 text-xs font-bold text-white shadow-sm shadow-rose-200 dark:shadow-none">
                <span className="h-1 w-1 animate-ping rounded-full bg-white" />
                Urgent
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
