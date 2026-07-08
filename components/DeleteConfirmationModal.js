export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, noticeTitle }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Overlay */}
      <div 
        className="fixed inset-0 bg-gray-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 dark:border-slate-700/60 p-6 overflow-hidden transform transition-all scale-100 duration-300 z-10 animate-in fade-in zoom-in-95">
        {/* Warning Icon Banner */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mx-auto bg-rose-50 dark:bg-rose-950/30 w-12 h-12 rounded-xl flex items-center justify-center text-rose-600 dark:text-rose-400 sm:mx-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
              Delete Notice?
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
              Are you sure you want to delete <strong className="text-gray-900 dark:text-slate-200 font-bold">"{noticeTitle}"</strong>? This action is permanent and cannot be undone.
            </p>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 dark:border-slate-700 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-sm font-semibold text-gray-700 dark:text-slate-300 transition-colors focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-sm transition-all focus:outline-none"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
