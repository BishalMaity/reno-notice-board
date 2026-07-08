import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function NoticeForm({ defaultValues, actionUrl, method = 'POST', submitLabel, onSuccess }) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = async (data) => {
    try {
      setSubmitError(null);
      if (method === 'PUT') {
        await axios.put(actionUrl, data);
      } else {
        await axios.post(actionUrl, data);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error saving notice:', err);
      if (err.response?.data?.errors) {
        const apiErrors = err.response.data.errors;
        Object.keys(apiErrors).forEach((field) => {
          setError(field, { type: 'server', message: apiErrors[field] });
        });
      } else {
        setSubmitError(err.response?.data?.error || 'An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      {submitError && (
        <div className="mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Title *</label>
          <input
            type="text"
            className="w-full rounded-xl border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-950 py-2.5 px-3.5 text-xs font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            placeholder="e.g. End Semester Examinations Schedule"
            {...register('title', { required: 'Title is required', maxLength: { value: 100, message: 'Too long' } })}
          />
          {errors.title && <p className="mt-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Category *</label>
            <select
              className="w-full rounded-xl border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-950 py-2.5 px-3.5 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              {...register('category')}
            >
              <option value="General">General</option>
              <option value="Exam">Exam</option>
              <option value="Event">Event</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Priority *</label>
            <select
              className="w-full rounded-xl border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-950 py-2.5 px-3.5 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              {...register('priority')}
            >
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Publish Date */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Publish Date *</label>
            <input
              type="date"
              className="w-full rounded-xl border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-950 py-2.5 px-3.5 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              {...register('publishDate', { required: 'Publish date is required' })}
            />
            {errors.publishDate && <p className="mt-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">{errors.publishDate.message}</p>}
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Image URL</label>
            <input
              type="url"
              className="w-full rounded-xl border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-950 py-2.5 px-3.5 text-xs font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              placeholder="e.g. https://example.com/banner.jpg"
              {...register('image')}
            />
          </div>
        </div>

        {/* Body */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Body / Details *</label>
          <textarea
            rows="5"
            className="w-full rounded-xl border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-950 py-2.5 px-3.5 text-xs font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-y"
            placeholder="Write the notice details here..."
            {...register('body', { required: 'Body is required' })}
          />
          {errors.body && <p className="mt-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">{errors.body.message}</p>}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800 pt-4">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="rounded-xl border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 py-2 px-4 text-xs font-bold text-slate-500 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-indigo-600 py-2 px-4 text-xs font-bold text-white shadow-md shadow-indigo-100 dark:shadow-none hover:bg-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
