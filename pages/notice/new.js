import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Navbar from '../../components/Navbar';

export default function NewNotice() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm({
    defaultValues: {
      title: '',
      body: '',
      category: 'General',
      priority: 'Normal',
      publishDate: new Date().toISOString().split('T')[0],
      image: '',
    },
  });

  const [submitError, setSubmitError] = useState(null);

  const onSubmit = async (data) => {
    try {
      setSubmitError(null);
      await axios.post('/api/notices', data);
      router.push('/');
    } catch (err) {
      console.error('Error saving notice:', err);
      if (err.response?.data?.errors) {
        // Map API validation errors back to fields
        const apiErrors = err.response.data.errors;
        Object.keys(apiErrors).forEach((field) => {
          setFormError(field, {
            type: 'server',
            message: apiErrors[field],
          });
        });
      } else {
        setSubmitError(err.response?.data?.error || 'An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col font-sans text-gray-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm p-8 md:p-10">
          {/* Header */}
          <div className="mb-8 border-b border-gray-100 dark:border-slate-700 pb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Create New Notice
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
              Fill out the form below to publish a new notice to the board.
            </p>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl text-rose-700 dark:text-rose-300 text-sm flex items-center gap-3">
              <svg className="w-5 h-5 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{submitError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1.5">
                Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g. End Semester Examinations Schedule"
                className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border ${
                  errors.title ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500' : 'border-gray-200 dark:border-slate-750 focus:ring-indigo-500 focus:border-indigo-500'
                } focus:outline-none focus:ring-2 transition-all dark:text-slate-100`}
                {...register('title', {
                  required: 'Title is required',
                  maxLength: { value: 100, message: 'Title cannot exceed 100 characters' },
                })}
              />
              {errors.title && (
                <p className="mt-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">{errors.title.message}</p>
              )}
            </div>

            {/* Category & Priority Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  id="category"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-750 bg-white dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  {...register('category', { required: 'Category is required' })}
                >
                  <option value="General">General</option>
                  <option value="Exam">Exam</option>
                  <option value="Event">Event</option>
                </select>
                {errors.category && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">{errors.category.message}</p>
                )}
              </div>

              {/* Priority */}
              <div>
                <label htmlFor="priority" className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1.5">
                  Priority <span className="text-rose-500">*</span>
                </label>
                <select
                  id="priority"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-750 bg-white dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  {...register('priority', { required: 'Priority is required' })}
                >
                  <option value="Normal">Normal</option>
                  <option value="Urgent">Urgent</option>
                </select>
                {errors.priority && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">{errors.priority.message}</p>
                )}
              </div>
            </div>

            {/* Publish Date & Image URL Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Publish Date */}
              <div>
                <label htmlFor="publishDate" className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1.5">
                  Publish Date <span className="text-rose-500">*</span>
                </label>
                <input
                  id="publishDate"
                  type="date"
                  className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border ${
                    errors.publishDate ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500' : 'border-gray-200 dark:border-slate-750 focus:ring-indigo-500 focus:border-indigo-500'
                  } focus:outline-none focus:ring-2 transition-all dark:text-slate-100`}
                  {...register('publishDate', { required: 'Publish date is required' })}
                />
                {errors.publishDate && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">{errors.publishDate.message}</p>
                )}
              </div>

              {/* Image URL (Optional Bonus) */}
              <div>
                <label htmlFor="image" className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1.5">
                  Image URL <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="image"
                  type="url"
                  placeholder="e.g. https://example.com/banner.jpg"
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-750 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all dark:text-slate-100"
                  {...register('image')}
                />
              </div>
            </div>

            {/* Body */}
            <div>
              <label htmlFor="body" className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1.5">
                Body / Message <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="body"
                rows="6"
                placeholder="Type the notice content details here..."
                className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border ${
                  errors.body ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500' : 'border-gray-200 dark:border-slate-750 focus:ring-indigo-500 focus:border-indigo-500'
                } focus:outline-none focus:ring-2 transition-all resize-y dark:text-slate-100`}
                {...register('body', { required: 'Body is required' })}
              ></textarea>
              {errors.body && (
                <p className="mt-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">{errors.body.message}</p>
              )}
            </div>

            {/* Form Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-slate-700">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-sm font-bold text-gray-700 dark:text-slate-300 transition-colors focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 shadow-sm disabled:opacity-50 flex items-center gap-2 transition-all focus:outline-none"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publishing...
                  </>
                ) : (
                  'Publish Notice'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
