import { useRouter } from 'next/router';
import NoticeForm from '../../components/NoticeForm';

export default function NewNotice() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold font-heading tracking-tight text-slate-800 ">Create Notice</h1>
        <p className="mt-1 text-xs text-slate-500 ">Publish a new college notice, event, or exam schedule.</p>
      </div>

      <NoticeForm
        actionUrl="/api/notices"
        method="POST"
        submitLabel="Publish Notice"
        onSuccess={() => router.push('/')}
        defaultValues={{
          title: '',
          body: '',
          category: 'General',
          priority: 'Normal',
          publishDate: new Date().toISOString().split('T')[0],
          image: '',
        }}
      />
    </div>
  );
}
