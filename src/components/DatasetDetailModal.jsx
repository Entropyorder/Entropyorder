import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, ExternalLink } from 'lucide-react';
import { duration } from '../animations/tokens.js';

export function DatasetDetailModal({ dataset, onClose, onContactSample }) {
  const { t } = useTranslation();

  if (!dataset) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: duration.fast }}
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-8"
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ duration: duration.normal, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[85vh] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-50 leading-snug">{dataset.name}</h2>
              </div>
              <span className="inline-block mt-1 px-2.5 py-0.5 text-xs font-bold rounded-full bg-brand-50 text-brand-700 border border-brand-200/70 dark:bg-brand-400/15 dark:text-brand-200 dark:border-brand-400/25">
                {dataset.scale}
              </span>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0">
              <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>

          {/* Body — scrollable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Overview */}
            <section>
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-brand-500 dark:text-brand-400 mb-3">
                {t('products.detail.overview')}
              </h3>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {dataset.brief || dataset.desc}
              </p>
            </section>

            {/* Data Structure */}
            {dataset.structure && (
              <section>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-brand-500 dark:text-brand-400 mb-3">
                  {t('products.detail.dataStructure')}
                </h3>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 p-4">
                  <code className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
                    {dataset.structure}
                  </code>
                </div>
              </section>
            )}

            {/* Related Paper */}
            {dataset.paper && (
              <section>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-brand-500 dark:text-brand-400 mb-3">
                  {t('products.detail.relatedPaper')}
                </h3>
                <a
                  href={dataset.paper.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl p-4 border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/40 hover:border-brand-300 dark:hover:border-brand-600/50 transition-colors group"
                >
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 leading-snug mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {dataset.paper.title}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <span>{dataset.paper.authors}</span>
                    <span>·</span>
                    <span>{dataset.paper.venue}</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-auto flex-shrink-0" />
                  </div>
                </a>
              </section>
            )}

            {/* Tags */}
            {dataset.tags && dataset.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {dataset.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`px-2.5 py-0.5 text-xs rounded-full font-medium border ${
                      idx % 3 === 0
                        ? 'bg-blue-50 text-blue-700 border-blue-200/70 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/50'
                        : idx % 3 === 1
                          ? 'bg-cyan-50 text-cyan-700 border-cyan-200/70 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800/50'
                          : 'bg-violet-50 text-violet-700 border-violet-200/70 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800/50'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {t('products.detail.close')}
            </button>
            <button
              onClick={() => onContactSample(dataset)}
              className="flex-1 rounded-lg bg-gradient-to-r from-brand-600 to-accent-500 px-4 py-2.5 text-sm font-semibold text-white hover:from-brand-500 hover:to-cyan-400 shadow-sm hover:shadow-brand-500/35 hover:shadow-md transition-all"
            >
              {t('products.detail.contactSample')}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
