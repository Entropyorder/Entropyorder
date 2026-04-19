import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { spring } from '../animations/tokens.js';

export function DatasetCard({ dataset, onViewDetail }) {
  const { t } = useTranslation();

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.012 }}
      transition={{ type: 'spring', ...spring.snappy }}
      className="group relative rounded-2xl overflow-hidden
        bg-white dark:bg-[#0d1a2d]
        border border-slate-200/80 dark:border-white/[0.07]
        shadow-[0_2px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]
        dark:shadow-[0_4px_32px_rgba(0,0,0,0.5)]
        hover:shadow-[0_12px_40px_rgba(37,99,235,0.14),0_4px_12px_rgba(0,0,0,0.08)]
        dark:hover:shadow-[0_12px_48px_rgba(37,99,235,0.22),0_4px_16px_rgba(0,0,0,0.6)]
        transition-shadow duration-300"
    >
      {/* Top gradient accent bar */}
      <div className="h-[3px] w-full bg-gradient-to-r from-brand-500 via-accent-400 to-cyan-400" />

      {/* Shimmer sweep */}
      <div className="card-shimmer" />

      {/* Content */}
      <div className="relative p-5 z-[2]">
        {/* Title + scale badge */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-50 leading-snug">
            {dataset.name}
          </h3>
          <span className="shrink-0 px-2.5 py-0.5 text-xs font-bold rounded-full
            bg-brand-50 text-brand-700 border border-brand-200/70
            dark:bg-brand-400/15 dark:text-brand-200 dark:border-brand-400/25">
            {dataset.scale}
          </span>
        </div>

        <p className="text-base text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
          {dataset.desc}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {dataset.tags.map((tag, idx) => (
            <span
              key={`${dataset.name}-${idx}`}
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

        <button
          onClick={() => onViewDetail(dataset)}
          aria-label={`${t('products.card.viewDetail')} - ${dataset.name}`}
          className="relative w-full overflow-hidden rounded-xl px-4 py-2.5 text-base font-semibold text-white
            bg-gradient-to-r from-brand-600 to-accent-500
            hover:from-brand-500 hover:to-cyan-400
            shadow-sm hover:shadow-brand-500/35 hover:shadow-md
            transition-all duration-300"
        >
          {t('products.card.viewDetail')}
        </button>
      </div>
    </motion.div>
  );
}
