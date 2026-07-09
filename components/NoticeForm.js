import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getMimeFromExtension } from '../utils/image';

export default function NoticeForm({ defaultValues, actionUrl, method = 'POST', submitLabel, onSuccess }) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues });

  const imageUrlValue = watch('image');

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

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let mimeType = file.type;
    const ext = file.name.split('.').pop().toLowerCase();

    if (!mimeType) {
      mimeType = getMimeFromExtension(ext);
    }

    const isImage = mimeType.startsWith('image/') || !!getMimeFromExtension(ext);
    if (!isImage) {
      alert('Please upload an image file.');
      return;
    }

    try {
      setUploading(true);
      setSubmitError(null);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: file,
        headers: {
          'Content-Type': mimeType || 'application/octet-stream',
          'X-File-Name': file.name,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload image. Please try again.');
      }

      const data = await response.json();
      if (data.url) {
        const absoluteUrl = `${window.location.origin}${data.url}`;
        setValue('image', absoluteUrl, { shouldDirty: true });
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setSubmitError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      {submitError && (
        <div className="mb-4 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-600 ">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Title *</label>
          <input
            type="text"
            className="w-full rounded-xl border border-slate-205 bg-white py-2.5 px-3.5 text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            placeholder="e.g. End Semester Examinations Schedule"
            {...register('title', { required: 'Title is required', maxLength: { value: 100, message: 'Too long' } })}
          />
          {errors.title && <p className="mt-1 text-[11px] font-bold text-rose-600 ">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Category *</label>
            <select
              className="w-full rounded-xl border border-slate-205 bg-white py-2.5 px-3.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              {...register('category')}
            >
              <option value="General">General</option>
              <option value="Exam">Exam</option>
              <option value="Event">Event</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Priority *</label>
            <select
              className="w-full rounded-xl border border-slate-205 bg-white py-2.5 px-3.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Publish Date *</label>
            <input
              type="date"
              className="w-full rounded-xl border border-slate-205 bg-white py-2.5 px-3.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              {...register('publishDate', { required: 'Publish date is required' })}
            />
            {errors.publishDate && <p className="mt-1 text-[11px] font-bold text-rose-600 ">{errors.publishDate.message}</p>}
          </div>
        </div>

        {/* Image Upload & URL */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 ">Notice Image (Optional)</label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Upload Zone */}
            <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 text-center hover:bg-slate-50 transition-colors min-h-[120px]">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading}
              />
              
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <svg className="animate-spin h-6 w-6 text-indigo-600 " fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-xs font-medium text-slate-500 ">Uploading...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <svg className="h-6 w-6 text-slate-400 " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <div className="text-xs font-bold text-slate-700 ">
                    Upload an image
                  </div>
                  <p className="text-[10px] text-slate-400 ">
                    PNG, JPG, GIF, WEBP up to 10MB
                  </p>
                </div>
              )}
            </div>

            {/* Image Preview & URL input */}
            <div className="flex flex-col justify-between gap-3">
              {imageUrlValue ? (
                <div className="relative rounded-xl border border-slate-205 bg-white p-2 flex items-center gap-3">
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-100 ">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrlValue}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Active Image</p>
                    <p className="text-xs font-semibold text-slate-700 truncate">{imageUrlValue}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setValue('image', '', { shouldDirty: true })}
                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors focus:outline-none"
                    title="Remove image"
                  >
                    <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex flex-1 items-center justify-center rounded-xl border border-slate-205 bg-slate-50/20 p-3 text-center text-xs text-slate-400 ">
                  No image active
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Or paste Image URL</label>
                <input
                  type="url"
                  className="w-full rounded-xl border border-slate-205 bg-white py-2 px-3.5 text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="e.g. https://example.com/banner.jpg"
                  {...register('image')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Body / Details *</label>
          <textarea
            rows="5"
            className="w-full rounded-xl border border-slate-205 bg-white py-2.5 px-3.5 text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-y"
            placeholder="Write the notice details here..."
            {...register('body', { required: 'Body is required' })}
          />
          {errors.body && <p className="mt-1 text-[11px] font-bold text-rose-600 ">{errors.body.message}</p>}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2.5 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="rounded-xl border border-slate-205 bg-white py-2 px-4 text-xs font-bold text-slate-500 hover:bg-slate-50 "
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-indigo-600 py-2 px-4 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
