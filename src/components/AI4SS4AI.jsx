import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Timeline } from './Timeline.jsx';

export function AI4SS4AI() {
  const { t } = useTranslation();
  const rawSteps = t('ai4ss.steps', { returnObjects: true });
  const steps = Array.isArray(rawSteps) ? rawSteps : [];

  return (
    <section id="ai4ss" className="relative py-28 overflow-hidden transition-colors">
      {/* Base background */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-800/40" />

      {/* Dot grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(37,99,235,0.2) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Top radial glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] opacity-30 dark:opacity-25"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.45) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="inline-block text-xs font-medium uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-1.5 mb-6">
            Vision
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-50 leading-tight">
            {t('ai4ss.title')}
          </h2>
        </motion.div>
      </div>
      <Timeline steps={steps} />
    </section>
  );
}
