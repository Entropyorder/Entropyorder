import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, MapPin, Twitter, Github, Linkedin, ArrowUp, CheckCircle } from 'lucide-react';

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT || 'https://formspree.io/f/xkgjnqyo';

export function Footer() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-50 mb-6">{t('footer.contactTitle')}</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <Mail className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <a href={`mailto:${t('footer.email')}`} className="hover:underline">{t('footer.email')}</a>
              </li>
              <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                <MapPin className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0" />
                <span>{t('footer.address')}</span>
              </li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a href="#" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"><Github className="w-5 h-5" /></a>
              <a href="#" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center h-full py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
                <p className="text-green-600 dark:text-green-400 font-medium">{t('footer.form.success')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input required type="text" placeholder={t('footer.form.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  <input required type="email" placeholder={t('footer.form.email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <input required type="text" placeholder={t('footer.form.subject')} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                <textarea required rows={4} placeholder={t('footer.form.message')} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                <button type="submit" disabled={status === 'submitting'} className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 disabled:opacity-60 transition-colors">
                  {status === 'submitting' ? '...' : t('footer.form.submit')}
                </button>
                {status === 'error' && <p className="text-xs text-red-500 text-center">{t('footer.form.error')}</p>}
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('footer.copyright')}</p>
          <button onClick={scrollToTop} className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 transition-colors">
            {t('footer.backToTop')} <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
