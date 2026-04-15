import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Timeline } from './Timeline.jsx';

export function AI4SS4AI() {
  const { t } = useTranslation();
  const steps = t('ai4ss.steps', { returnObjects: true });

  return (
    <section id="ai4ss" className="relative py-24 bg-brand-50 dark:bg-slate-800/50 transition-colors overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(37,99,235,0.15) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-50 mb-16"
        >
          {t('ai4ss.title')}
        </motion.h2>
      </div>
      <Timeline steps={steps} />
    </section>
  );
}
