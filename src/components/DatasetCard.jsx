import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function DatasetCard({ dataset, onContact }) {
  const { t } = useTranslation();

  return (
    <motion.div
      whileHover={{ y: -6, rotateX: 5, rotateY: -5, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 280, damping: 18 }}
      className="group relative rounded-2xl p-px overflow-hidden"
      style={{ transformStyle: 'preserve-3d', perspective: 600 }}
    >
      {/* Animated gradient border — base state (subtle) */}
      <div
        className="absolute inset-0 rounded-2xl opacity-40 group-hover:opacity-0 transition-opacity duration-300 card-border-glow"
      />
      {/* Animated gradient border — hover state (vivid) */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 card-border-glow-hover"
      />

      {/* Card body */}
      <div className="relative rounded-[calc(1rem-1px)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 h-full">
        {/* Hover inner glow */}
        <div
          className="absolute inset-0 rounded-[calc(1rem-1px)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(34,211,238,0.04) 100%)' }}
        />

        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-50 mb-1.5 relative">
          {dataset.name}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 leading-relaxed relative">
          {dataset.desc}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-3 relative">
          {t('products.card.scale')}: <span className="text-brand-500 dark:text-brand-400 font-medium">{dataset.scale}</span>
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4 relative">
          {dataset.tags.map((tag, idx) => (
            <span
              key={`${dataset.name}-${idx}`}
              className="px-2 py-0.5 text-xs rounded-full font-medium
                bg-blue-100 text-blue-800
                dark:bg-blue-950/70 dark:text-cyan-300 dark:border dark:border-cyan-500/20"
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => onContact(dataset)}
          aria-label={`${t('products.card.contact')} - ${dataset.name}`}
          className="relative w-full rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-200
            bg-gradient-to-r from-brand-600 to-brand-500
            hover:from-brand-500 hover:to-accent-500
            shadow-sm hover:shadow-brand-500/30 hover:shadow-md"
        >
          {t('products.card.contact')}
        </button>
      </div>
    </motion.div>
  );
}
