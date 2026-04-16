import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import logoUrl from '/logo.png';

// Floating geometric shape
function FloatShape({ className, delay = 0, duration = 8 }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -18, 0], rotate: [0, 5, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

export function Hero() {
  const { t } = useTranslation();

  const scrollToProducts = () => {
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ── Layer 0: Base gradient ─────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(145deg, #f8faff 0%, #eef4ff 40%, #e0ecff 70%, #d8eeff 100%)',
        }}
      />
      <div className="absolute inset-0 hidden dark:block" style={{
        background: 'linear-gradient(145deg, #060d1a 0%, #0b1628 40%, #0a1932 70%, #071424 100%)',
      }} />

      {/* ── Layer 1: Ambient blobs ─────────────────────── */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-30 dark:opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.35) 0%, transparent 65%)', filter: 'blur(60px)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-20 -right-20 w-[600px] h-[600px] rounded-full opacity-25 dark:opacity-15"
        style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.3) 0%, transparent 65%)', filter: 'blur(60px)' }}
      />
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full opacity-20 dark:opacity-10"
        style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.3) 0%, transparent 65%)', filter: 'blur(80px)' }}
      />

      {/* ── Layer 2: Grid mesh ─────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(37,99,235,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37,99,235,1) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── Layer 3: Floating geometric shapes ────────── */}
      {/* Large ring top-right */}
      <FloatShape
        duration={10}
        delay={0}
        className="pointer-events-none absolute top-16 right-[8%] w-64 h-64 rounded-full border border-brand-400/15 dark:border-brand-400/20"
      />
      {/* Medium ring */}
      <FloatShape
        duration={13}
        delay={2}
        className="pointer-events-none absolute top-24 right-[10%] w-44 h-44 rounded-full border border-accent-400/15 dark:border-accent-400/20"
      />
      {/* Small filled circle top-right */}
      <FloatShape
        duration={9}
        delay={1}
        className="pointer-events-none absolute top-28 right-[12%] w-3 h-3 rounded-full bg-brand-400/30 dark:bg-brand-400/50"
      />
      {/* Large ring bottom-left */}
      <FloatShape
        duration={11}
        delay={3}
        className="pointer-events-none absolute bottom-24 left-[6%] w-56 h-56 rounded-full border border-brand-500/10 dark:border-brand-500/15"
      />
      {/* Small accent dot */}
      <FloatShape
        duration={7}
        delay={1.5}
        className="pointer-events-none absolute bottom-32 left-[10%] w-2 h-2 rounded-full bg-accent-400/50 dark:bg-accent-400/70"
      />
      {/* Medium tilted square bottom-right */}
      <FloatShape
        duration={12}
        delay={0.5}
        className="pointer-events-none absolute bottom-40 right-[5%] w-20 h-20 border border-brand-400/10 dark:border-brand-400/15 rotate-45"
      />

      {/* ── Layer 4: Main content ──────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <img
            src={logoUrl}
            alt="EntropyOrder"
            className="h-20 md:h-28 w-auto logo-glow mx-auto"
          />
        </motion.div>

        {/* Main title — very large */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[96px] font-bold tracking-tight leading-[1.05]">
            <span className="gradient-text">熵基</span>
            <span className="gradient-text">秩序</span>
          </h1>
          <div className="mt-3 flex items-center justify-center gap-3">
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-brand-400/50 to-transparent" />
            <span className="text-xl sm:text-2xl md:text-3xl font-light tracking-[0.18em] text-slate-400 dark:text-slate-500 uppercase">
              EntropyOrder
            </span>
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-brand-400/50 to-transparent" />
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Tag line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="mt-8 flex items-center gap-2"
        >
          {['Data', 'Intelligence', 'Future'].map((word, i) => (
            <span key={word} className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 font-medium">
                {word}
              </span>
              {i < 2 && <span className="w-1 h-1 rounded-full bg-brand-400/50" />}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.button
        onClick={scrollToProducts}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-slate-400 hover:text-brand-500 dark:text-slate-500 dark:hover:text-brand-400 transition-colors group"
        aria-label="Scroll down"
      >
        <span className="text-[10px] uppercase tracking-widest opacity-70 group-hover:opacity-100">scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>
    </section>
  );
}
