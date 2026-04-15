import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function DatasetCard({ dataset, onContact }) {
  const { t } = useTranslation();

  return (
    <motion.div
      whileHover={{ y: -6, rotateX: 2, rotateY: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative rounded-2xl border border-brand-600/15 dark:border-brand-500/20 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-5 shadow-sm hover:shadow-lg hover:shadow-brand-500/10 dark:hover:shadow-brand-400/10 transition-shadow"
      style={{ transformStyle: 'preserve-3d', perspective: 800 }}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, transparent 60%)' }}
      />
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-2">{dataset.name}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{dataset.desc}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{t('products.card.scale')}: {dataset.scale}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {dataset.tags.map((tag) => (
          <span key={tag} className="px-2 py-1 text-xs rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
            {tag}
          </span>
        ))}
      </div>
      <button
        onClick={() => onContact(dataset)}
        className="relative z-10 w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 transition-colors"
      >
        {t('products.card.contact')}
      </button>
    </motion.div>
  );
}
