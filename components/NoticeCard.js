import { format } from 'date-fns';

export default function NoticeCard({ notice, onEdit, onDelete }) {
  const { id, title, body, category, priority, publishDate, image } = notice;

  // Format date safely
  const formattedDate = (() => {
    try {
      return format(new Date(publishDate), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid Date';
    }
  })();

  // Define badge colors for categories
  const getCategoryStyles = (cat) => {
    switch (cat) {
      case 'Exam':
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60';
      case 'Event':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60';
      case 'General':
      default:
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60';
    }
  };

  const handleDeleteConfirm = () => {
    onDelete(notice);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-slate-900/30 transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Notice Image (Optional Bonus) */}
      {image && (
        <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-slate-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none'; // Fallback if image fails to load
            }}
          />
        </div>
      )}

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Badges/Category */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getCategoryStyles(category)}`}>
            {category}
          </span>
          {priority === 'Urgent' && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500 text-white shadow-sm shadow-rose-200 dark:shadow-none animate-pulse">
               Urgent
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>

        {/* Body */}
        <p className="text-gray-600 dark:text-slate-300 text-sm mb-6 flex-1 line-clamp-4 whitespace-pre-wrap">
          {body}
        </p>

        {/* Footer info & action buttons */}
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
          {/* Publish Date */}
          <div className="flex items-center gap-1.5 font-medium">
            <svg className="w-4 h-4 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formattedDate}</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(notice)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 font-semibold transition-colors focus:outline-none"
              title="Edit Notice"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold transition-colors focus:outline-none"
              title="Delete Notice"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
