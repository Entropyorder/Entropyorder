import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { ParticleCanvas } from './ParticleCanvas.jsx';

export function Hero() {
  const { t } = useTranslation();

  const scrollToProducts = () => {
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white to-brand-50 dark:from-slate-900 dark:to-slate-800">
      <ParticleCanvas />
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <motion.img
          src="/logo.png"
          alt="EntropyOrder"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="h-24 w-auto mb-6"
        />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold tracking-tight text-slate-800 dark:text-slate-50 mb-4"
        >
          {t('hero.slogan')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl"
        >
          {t('hero.subtitle')}
        </motion.p>
      </div>

      <motion.button
        onClick={scrollToProducts}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1, duration: 0.5 }, y: { repeat: Infinity, duration: 1.5 } }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 p-2 rounded-full text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.button>
    </section>
  );
}
