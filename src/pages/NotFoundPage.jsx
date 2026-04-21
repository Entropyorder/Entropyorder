import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-page-bg dark:bg-page-bg-dark">
      <div className="text-center px-6">
        <h1 className="font-display text-7xl font-bold text-slate-800 dark:text-slate-100 mb-4">404</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">页面未找到 / Page Not Found</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:underline"
        >
          返回首页 →
        </Link>
      </div>
    </main>
  );
}
