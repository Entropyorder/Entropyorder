import { motion } from 'framer-motion';
import { DatasetCard } from './DatasetCard.jsx';

export function ProductCategory({ title, artifact: Artifact, datasets, direction, onContact }) {
  const isLeft = direction === 'left';

  return (
    <div className="py-16 md:py-24">
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-10 lg:gap-16`}>
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="w-full lg:w-1/2"
        >
          <Artifact />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: isLeft ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="w-full lg:w-1/2"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-50 mb-8">{title}</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            {datasets.map((ds, idx) => (
              <motion.div
                key={`${ds.name}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 + idx * 0.1 }}
              >
                <DatasetCard dataset={ds} onContact={onContact} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
