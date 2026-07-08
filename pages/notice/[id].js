import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import NoticeForm from '../../components/NoticeForm';
import Loading from '../../components/Loading';

export default function EditNotice() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchNotice = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/notices/${id}`);
        const data = res.data;
        // Format publishDate to YYYY-MM-DD
        data.publishDate = data.publishDate ? new Date(data.publishDate).toISOString().split('T')[0] : '';
        setNotice(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching notice for edit:', err);
        setError('Failed to load notice details. Please make sure the notice ID is valid.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotice();
  }, [id]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white">Edit Notice</h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Modify the fields below to update the published notice.</p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
          {error}
        </div>
      )}

      {loading ? (
        <Loading />
      ) : (
        notice && (
          <NoticeForm
            actionUrl={`/api/notices/${id}`}
            method="PUT"
            submitLabel="Update Notice"
            onSuccess={() => router.push('/')}
            defaultValues={notice}
          />
        )
      )}
    </div>
  );
}
