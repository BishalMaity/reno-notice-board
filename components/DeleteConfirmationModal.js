import { useEffect, useRef } from 'react';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, noticeTitle }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    cancelRef.current?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-[0_24px_48px_-12px_rgba(30,41,59,0.35)]"
      >
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 ">
          <svg className="h-5.5 w-5.5 text-rose-600 " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 id="delete-modal-title" className="mb-2 text-lg font-bold text-slate-800 ">
          Delete this notice?
        </h2>

        <p className="mb-6 text-sm leading-relaxed text-slate-500 ">
          {noticeTitle ? (
            <>
              <span className="font-semibold text-slate-700 ">
                &ldquo;{noticeTitle}&rdquo;
              </span>{' '}
              will be permanently removed from the notice board. This can&apos;t be undone.
            </>
          ) : (
            'This notice will be permanently removed from the notice board. This can\u2019t be undone.'
          )}
        </p>

        <div className="flex items-center justify-end gap-2">
          <button
            ref={cancelRef}
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-bold text-white shadow-sm shadow-rose-200 transition-colors hover:bg-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2"
          >
            Delete Notice
          </button>
        </div>
      </div>
    </div>
  );
}