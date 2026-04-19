import { motion } from 'framer-motion';
import { DatasetCard } from './DatasetCard.jsx';
import { offset, duration } from '../animations/tokens.js';
import * as presets from '../animations/presets.js';

// clip-path parallelogram that tiles all cards flat, each with a staggered float
function ParallelogramCards({ datasets, onContact }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ clipPath: 'polygon(4% 0%, 100% 0%, 96% 100%, 0% 100%)' }}
    >
      {/* Band background */}
      <div className="absolute inset-0
        bg-gradient-to-br from-brand-50 via-white to-cyan-50/50
        dark:from-[#0d1827] dark:via-[#0a1425] dark:to-slate-900/90" />

      {/* Diagonal edge fades */}
      <div className="absolute inset-y-0 left-0 w-20 z-10
        bg-gradient-to-r from-white dark:from-slate-900 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 z-10
        bg-gradient-to-l from-white dark:from-slate-900 to-transparent pointer-events-none" />

      {/* Tiled cards — px-12 keeps cards clear of the clipped diagonal edges */}
      <div className="relative z-[1] grid grid-cols-2 gap-4 px-12 py-8">
        {datasets.map((ds, i) => (
          <motion.div
            key={ds.name}
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 3.2 + i * 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.55,
            }}
          >
            <DatasetCard dataset={ds} onContact={onContact} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function ProductCategory({ title, artifact: Artifact, datasets, direction, onContact, index = 0 }) {
  const isLeft = direction === 'left';
  const sectionNum = String(index + 1).padStart(2, '0');

  return (
    <div className="py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header row: section marker + title  |  3D artifact (no container) */}
        <div className={`flex flex-col ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-10 mb-10`}>
          <motion.div
            initial={{ opacity: 0, x: isLeft ? -offset.medium : offset.medium }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: duration.normal, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-1/2"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-bold font-mono tracking-[0.35em] text-brand-500/70 dark:text-brand-400/60 uppercase">
                /{sectionNum}
              </span>
              <div className="h-px w-10 bg-gradient-to-r from-brand-500/50 to-transparent" />
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-50 leading-tight">
              {title}
            </h3>
          </motion.div>

          {/* 3D artifact — no wrapper, transparent canvas */}
          <motion.div
            initial={{ opacity: 0, x: isLeft ? offset.medium : -offset.medium }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: duration.normal, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-5/12"
          >
            <Artifact />
          </motion.div>
        </div>

        {/* Parallelogram card band */}
        <motion.div
          initial={{ opacity: 0, y: offset.medium }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: duration.normal, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <ParallelogramCards datasets={datasets} onContact={onContact} />
        </motion.div>
      </div>
    </div>
  );
}
