import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xkgjnqyo'; // Replace with actual endpoint

export function ContactModal({ dataset, onClose }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', org: '', email: '', purpose: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, dataset: dataset.name }),
      });
      if (res.ok) {
        setStatus('success');
        setTimeout(onClose, 2000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-50">{t('products.modal.title')}</h3>
            <button onClick={onClose} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{dataset.name}</p>

          {status === 'success' ? (
            <div className="py-8 text-center text-green-600 dark:text-green-400 font-medium">{t('footer.form.success')}</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required type="text" placeholder={t('products.modal.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500" />
              <input required type="text" placeholder={t('products.modal.org')} value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500" />
              <input required type="email" placeholder={t('products.modal.email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500" />
              <textarea required rows={3} placeholder={t('products.modal.purpose')} value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500" />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">{t('products.modal.cancel')}</button>
                <button type="submit" disabled={status === 'submitting'} className="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 disabled:opacity-60 transition-colors">{status === 'submitting' ? '...' : t('products.modal.submit')}</button>
              </div>
              {status === 'error' && <p className="text-xs text-red-500 text-center">{t('footer.form.error')}</p>}
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
