import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import NoticeCard from '../components/NoticeCard';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import Loading from '../components/Loading';
import NoticeForm from '../components/NoticeForm';

const CATEGORY_FILTERS = [
  { label: 'All', dot: 'bg-slate-400' },
  { label: 'General', dot: 'bg-indigo-500' },
  { label: 'Exam', dot: 'bg-rose-500' },
  { label: 'Event', dot: 'bg-amber-500' },
];

export default function Home() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('board'); // 'board' or 'grid'
  const [activeFilter, setActiveFilter] = useState('All');

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [editingNotice, setEditingNotice] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const router = useRouter();

  useEffect(() => {
    let active = true;
    axios.get('/api/notices')
      .then((response) => {
        if (active) {
          setNotices(response.data);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching notices:', err);
        if (active) {
          setError('Failed to fetch notices. Please check your database connection.');
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [refreshTrigger]);

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

  const filteredBySearch = useMemo(() => {
    if (!searchQuery.trim()) return notices;
    const q = searchQuery.toLowerCase();
    return notices.filter(
      (n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
    );
  }, [notices, searchQuery]);

  // Grouped columns for board view
  const columns = useMemo(() => [
    { id: 'General', label: 'General Info', dot: 'bg-indigo-500', list: filteredBySearch.filter(n => n.category === 'General') },
    { id: 'Exam', label: 'Exams & Schedules', dot: 'bg-rose-500', list: filteredBySearch.filter(n => n.category === 'Exam') },
    { id: 'Event', label: 'Events & Activities', dot: 'bg-amber-500', list: filteredBySearch.filter(n => n.category === 'Event') },
  ], [filteredBySearch]);

  // Grid view filtered list
  const gridNotices = useMemo(() => {
    if (activeFilter === 'All') return filteredBySearch;
    return filteredBySearch.filter(n => n.category === activeFilter);
  }, [filteredBySearch, activeFilter]);

  return (
    <div className="min-h-screen px-4 py-2">
      {/* Workspace Header (styled as a floating rounded top card) */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-slate-200/20 p-6 border border-slate-200/50 shadow-[0_0_8px_rgba(0,0,0,0.15)] ">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-extrabold font-heading text-slate-800 ">Notice Board</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500 ">Keep track of examinations, schedules, and active campus events.</p>
        </div>

        {/* Create Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/notice/new')}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-500 focus:outline-none"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Create Notice
          </button>
        </div>
      </div>

      {/* Control bar (Search + View Toggles) */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}


        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setViewMode('board')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold transition-all ${viewMode === 'board' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700 '}`}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>
            Board
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold transition-all ${viewMode === 'grid' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700 '}`}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Grid
          </button>
        </div>

        <div className="relative w-full max-w-xs">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </span>
          <input
            type="text"
            placeholder="Search notices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl shadow-sm bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-xs font-medium text-rose-600 ">
          <svg className="h-5 w-5 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          {error}
        </div>
      )}

      {loading ? (
        <Loading type="grid" />
      ) : notices.length === 0 ? (
        /* Empty board */
        <div className="mx-auto mt-16 max-w-sm rounded-2xl bg-white p-8 text-center shadow-xs border border-slate-100 ">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
          </div>
          <h3 className="text-base font-bold text-slate-800 ">No notices published yet</h3>
          <p className="mt-1.5 text-xs text-slate-500 ">Get started by creating a new notice. It will appear here for all users to read.</p>
          <button
            onClick={() => router.push('/notice/new')}
            className="mt-5 inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-500 focus:outline-none"
          >
            Publish First Notice
          </button>
        </div>
      ) : viewMode === 'board' ? (
        /* Board/Kanban Column View */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col rounded-2xl shadow-[0_0_2px_rgba(0,0,0,0.08)] bg-slate-50 p-4 border border-slate-100/50 min-h-[500px]">
              {/* Column Header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${column.dot}`} />
                  <h3 className="text-sm font-bold text-slate-700 ">{column.label}</h3>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-2xs font-bold text-slate-500 ">
                  {column.list.length}
                </span>
              </div>

              {/* Notice cards list */}
              <div className="flex flex-col gap-8 flex-1 overflow-y-auto">
                {column.list.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-400 ">
                    <p className="text-2xs font-bold uppercase tracking-wider">No notices</p>
                  </div>
                ) : (
                  column.list.map((notice) => (
                    <NoticeCard
                      key={notice.id}
                      notice={notice}
                      onEdit={(n) => setEditingNotice(n)}
                      onDelete={(n) => { setSelectedNotice(n); setModalOpen(true); }}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Grid View with Category Filters */
        <div className="space-y-6">
          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORY_FILTERS.map(({ label, dot }) => {
              const isActive = activeFilter === label;
              return (
                <button
                  key={label}
                  onClick={() => setActiveFilter(label)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold transition-all shadow-xs border ${isActive ? 'bg-slate-850 text-white border-transparent shadow-sm' : 'bg-white text-slate-500 hover:text-slate-700 border-slate-100 '}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                  {label}
                  <span className={`text-xs ${isActive ? 'opacity-80' : 'opacity-40'}`}>
                    {label === 'All' ? filteredBySearch.length : filteredBySearch.filter(n => n.category === label).length}
                  </span>
                </button>
              );
            })}
          </div>

          {gridNotices.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-205 py-16 text-center text-slate-500">
              No notices match the selected category filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {gridNotices.map((notice) => (
                <NoticeCard
                  key={notice.id}
                  notice={notice}
                  onEdit={(n) => setEditingNotice(n)}
                  onDelete={(n) => { setSelectedNotice(n); setModalOpen(true); }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete modal */}
      <DeleteConfirmationModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedNotice(null); }}
        onConfirm={confirmDelete}
        noticeTitle={selectedNotice?.title || ''}
      />

      {/* Edit modal */}
      {editingNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl p-6 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold font-heading text-slate-800">Edit Notice</h2>
                <p className="text-xs text-slate-500">Modify the fields below to update the published notice.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingNotice(null)}
                className="text-slate-400 hover:text-slate-655 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <NoticeForm
              actionUrl={`/api/notices/${editingNotice.id}`}
              method="PUT"
              submitLabel="Update Notice"
              onSuccess={() => {
                setEditingNotice(null);
                setRefreshTrigger((prev) => prev + 1);
              }}
              defaultValues={{
                ...editingNotice,
                publishDate: editingNotice.publishDate ? new Date(editingNotice.publishDate).toISOString().split('T')[0] : '',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}