import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';

const BRAND = '#324CDD';

// Shared with the board page's CATEGORIES config — keep these two in sync
// if you add a new category there.
const CATEGORY_STYLES = {
  General: { accent: BRAND, gradient: 'from-[#324CDD]/10 to-[#324CDD]/[0.03]' },
  Exam: { accent: '#E1473A', gradient: 'from-[#E1473A]/10 to-[#E1473A]/[0.03]' },
  Event: { accent: '#E8A33D', gradient: 'from-[#E8A33D]/10 to-[#E8A33D]/[0.03]' },
};
const DEFAULT_STYLE = { accent: '#94A3B8', gradient: 'from-slate-50 to-slate-100/50' };

function getCategoryStyle(category) {
  return CATEGORY_STYLES[category] || DEFAULT_STYLE;
}

function CategoryPill({ category, className = '' }) {
  const { accent } = getCategoryStyle(category);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
      {category}
    </span>
  );
}

function UrgentBadge({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-rose-500 text-xs font-bold text-white shadow-sm shadow-rose-200 ${className}`}>
      <span className="h-1 w-1 animate-ping rounded-full bg-white" />
      Urgent
    </span>
  );
}

function NoticeBanner({ image, title, category, heightClass }) {
  const { gradient } = getCategoryStyle(category);
  if (!image) {
    return <div className={`w-full bg-gradient-to-br ${gradient} ${heightClass}`} />;
  }
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-lg"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={title}
        className="relative h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    </>
  );
}

export default function NoticeCard({ notice, onEdit, onDelete }) {
  const { title, body, category, priority, publishDate, image } = notice;
  const [showMenu, setShowMenu] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the action menu on outside click or Escape.
  useEffect(() => {
    if (!showMenu) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setShowMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [showMenu]);

  // Close the detail modal on Escape.
  useEffect(() => {
    if (!detailOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setDetailOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [detailOpen]);

  const formattedDate = (() => {
    try {
      return format(new Date(publishDate), 'MMM dd, yyyy');
    } catch {
      return 'Invalid Date';
    }
  })();

  const shouldTruncate = body && body.length > 150;

  return (
    <>
      <div className="group relative flex h-fit flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        {/* Visual banner */}
        <div className="relative h-28 w-full overflow-hidden bg-slate-50">
          <NoticeBanner image={image} title={title} category={category} heightClass="h-full" />

          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-slate-700 shadow-sm backdrop-blur-sm">
            <CategoryPill category={category} />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <div className="relative mb-2 flex items-start justify-between gap-4">
            <h3 className="text-lg font-bold leading-snug tracking-tight text-slate-800">
              <button
                type="button"
                onClick={() => setDetailOpen(true)}
                className="text-left transition-colors hover:text-[#324CDD] focus-visible:outline-none focus-visible:underline"
              >
                {title}
              </button>
            </h3>

            {/* Action menu */}
            <div className="relative shrink-0" ref={menuRef}>
              <button
                type="button"
                onClick={() => setShowMenu((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={showMenu}
                aria-label="Notice actions"
                title="Actions"
                className={`flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/80 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#324CDD]/40 ${showMenu ? 'bg-slate-100 text-slate-800' : 'bg-slate-50/50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-[18px] w-[18px]">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
                  />
                </svg>
              </button>

              {showMenu && (
                <div
                  role="menu"
                  className="absolute right-0 z-20 mt-2 w-32 origin-top-right rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-lg animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(notice);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-[#324CDD]/10 hover:text-[#324CDD]"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 text-[#324CDD]">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 1 1 3.536 3.536L6.5 21.036H3v-3.572L16.732 3.732Z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setShowMenu(false);
                      onDelete(notice);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 text-rose-500">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-5 text-base leading-relaxed text-slate-700">
            <p className="inline whitespace-pre-wrap">{shouldTruncate ? `${body.substring(0, 150)}...` : body}</p>
            {shouldTruncate && (
              <button
                type="button"
                onClick={() => setDetailOpen(true)}
                className="ml-1.5 inline-block text-xs font-bold text-[#324CDD] hover:underline"
              >
                Read more
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-sm font-medium text-slate-400">
            <div className="flex items-center gap-1 font-[family-name:var(--font-mono)] text-xs">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"
                />
              </svg>
              <span>{formattedDate}</span>
            </div>

            {priority === 'Urgent' && <UrgentBadge className="px-2 py-0.5" />}
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {detailOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`notice-title-${notice.id}`}
          onClick={() => setDetailOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 text-left backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="relative h-48 w-full overflow-hidden bg-slate-50 sm:h-64">
              <NoticeBanner image={image} title={title} category={category} heightClass="h-full" />

              <button
                type="button"
                onClick={() => setDetailOpen(false)}
                aria-label="Close notice"
                title="Close"
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/40 text-white backdrop-blur-sm transition-colors hover:bg-slate-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CategoryPill category={category} className="bg-slate-100 px-3 py-1 text-slate-700" />
                  {priority === 'Urgent' && <UrgentBadge className="px-3 py-1" />}
                </div>
                <div className="font-[family-name:var(--font-mono)] text-xs font-medium text-slate-400">
                  Published: {formattedDate}
                </div>
              </div>

              <h2
                id={`notice-title-${notice.id}`}
                className="font-[family-name:var(--font-display)] text-2xl font-bold leading-tight tracking-tight text-slate-800 sm:text-3xl"
              >
                {title}
              </h2>

              <div className="max-h-[250px] overflow-y-auto border-t border-slate-100 pr-2 pt-4 text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
                {body}
              </div>

              <div className="flex justify-end border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setDetailOpen(false)}
                  className="rounded-xl bg-slate-100 px-5 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-200"
                >
                  Close Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}