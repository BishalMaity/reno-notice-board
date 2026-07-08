import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Navbar from '../components/Navbar';
import NoticeCard from '../components/NoticeCard';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

export default function Home() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/notices');
      setNotices(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching notices:', err);
      setError('Failed to fetch notices. Please check your database connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (notice) => {
    router.push(`/notice/${notice.id}`);
  };

  const handleDeleteClick = (notice) => {
    setSelectedNotice(notice);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedNotice) return;
    try {
      await axios.delete(`/api/notices/${selectedNotice.id}`);
      setNotices((prev) => prev.filter((n) => n.id !== selectedNotice.id));
      setModalOpen(false);
      setSelectedNotice(null);
    } catch (err) {
      console.error('Error deleting notice:', err);
      alert('Failed to delete the notice. Please try again.');
    }
  };

  const closeDeleteModal = () => {
    setModalOpen(false);
    setSelectedNotice(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col font-sans text-gray-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Notice Board
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              Stay updated with the latest college notices, exams, and event schedules.
            </p>
          </div>
          <button
            onClick={() => router.push('/notice/new')}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 shadow-sm transition-all duration-200 focus:outline-none"
          >
            Create Notice
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl text-rose-700 dark:text-rose-300 text-sm flex items-center gap-3">
            <svg className="w-5 h-5 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 flex flex-col space-y-4 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded-full w-24"></div>
                <div className="h-7 bg-gray-200 dark:bg-slate-700 rounded-lg w-3/4"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-lg w-5/6"></div>
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-lg w-2/3"></div>
                </div>
                <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded-xl pt-4 border-t border-gray-100 dark:border-slate-700/60"></div>
              </div>
            ))}
          </div>
        ) : notices.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 py-16 px-4 text-center max-w-xl mx-auto shadow-sm mt-8">
            <div className="mx-auto w-16 h-16 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No notices published yet</h3>
            <p className="text-gray-500 dark:text-slate-400 text-sm mb-6 max-w-sm mx-auto">
              Get started by creating a new notice. It will appear here for all users to read.
            </p>
            <button
              onClick={() => router.push('/notice/new')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 shadow-sm transition-all duration-200 focus:outline-none"
            >
              Publish First Notice
            </button>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notices.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </main>

      <DeleteConfirmationModal
        isOpen={modalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        noticeTitle={selectedNotice?.title || ''}
      />
    </div>
  );
}
