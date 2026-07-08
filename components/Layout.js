import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const navItems = [
    {
      href: '/',
      label: 'Board',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      href: '/notice/new',
      label: 'Add',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#F6F7FB] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col items-center justify-between w-20 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 py-6 px-2 sticky top-0 h-screen shrink-0">
        <div className="flex flex-col items-center gap-8 w-full">
          {/* Logo */}
          <Link href="/" className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-200 dark:shadow-none hover:opacity-90 transition-opacity">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-col gap-3 w-full items-center">
            {navItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all ${isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100/50 dark:border-indigo-900/30'
                    : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                  title={item.label}
                >
                  {item.icon}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col items-center gap-4 w-full mb-16">
          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-all focus:outline-none"
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {darkMode ? (
              <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="flex flex-col flex-1 w-full min-w-0">
        <header className="md:hidden flex items-center justify-between h-14 bg-slate-100/90 dark:bg-slate-900/90 text-slate-800 dark:text-white px-4 rounded-xl mx-4 mt-4 sticky top-4 z-40 shadow-md border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">R</span>
            <span className="text-sm font-bold tracking-tight text-slate-800 dark:text-white">Reno Board</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              {darkMode ? (
                <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <nav className="flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isActive ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
