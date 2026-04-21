import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import logoUrl from '/logo.png';
import { duration, offset } from '../animations/tokens.js';
import * as presets from '../animations/presets.js';

// Floating geometric shape - with dark mode glow
function FloatShape({ className, delay = 0, duration = 8, rotateAmount = 0, type = 'ring', strokeWidth = 2 }) {
  const prefersReducedMotion = useReducedMotion()

  if (type === 'ring') {
    return (
      <motion.div
        className={className}
        animate={{
          y: [0, -14, 0],
          rotate: [0, rotateAmount, 0],
        }}
        transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Light mode: simple border */}
        <div
          className="absolute inset-0 rounded-full border border-brand-400/12 dark:hidden"
        />
        {/* Dark mode: conic-gradient ring with glow */}
        <div
          className="hidden dark:block absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, #3b82f6, #22d3ee, #818cf8, #3b82f6)',
            mask: `radial-gradient(farthest-side, transparent calc(100% - ${strokeWidth}px), #000 calc(100% - ${strokeWidth}px))`,
            WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${strokeWidth}px), #000 calc(100% - ${strokeWidth}px))`,
            filter: 'drop-shadow(0 0 12px rgba(59,130,246,0.35)) drop-shadow(0 0 24px rgba(34,211,238,0.18))',
            animation: prefersReducedMotion ? 'none' : 'ring-spin 18s linear infinite',
          }}
        />
      </motion.div>
    )
  }

  if (type === 'square') {
    return (
      <motion.div
        className={className}
        animate={{
          y: [0, -12, 0],
          rotate: [45, 45 + rotateAmount, 45],
        }}
        transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Light mode */}
        <div className="absolute inset-0 border border-brand-500/8 dark:hidden" />
        {/* Dark mode */}
        <div
          className="hidden dark:block absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, transparent, rgba(59,130,246,0.18), transparent)',
            border: '1px solid transparent',
            borderImage: 'linear-gradient(135deg, #3b82f6, #22d3ee) 1',
            filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.25))',
            animation: prefersReducedMotion ? 'none' : 'shimmer 6s ease-in-out infinite',
          }}
        />
      </motion.div>
    )
  }

  if (type === 'dot') {
    return (
      <motion.div
        className={className}
        animate={{
          y: [0, -8, 0],
        }}
        transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Light mode */}
        <div className="w-full h-full rounded-full bg-accent-400/40 dark:hidden" />
        {/* Dark mode */}
        <div
          className="hidden dark:block w-full h-full rounded-full"
          style={{
            background: 'radial-gradient(circle, #22d3ee 0%, transparent 70%)',
            boxShadow: '0 0 12px 2px rgba(34,211,238,0.5)',
          }}
        />
      </motion.div>
    )
  }

  // Fallback to simple div
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -14, 0],
        rotate: [0, rotateAmount, 0],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

export function Hero() {
  const { t } = useTranslation();

  const scrollToExpert = () => {
    const el = document.getElementById('expert-data');
    if (el) {
      const navbarH = 64;
      const y = el.getBoundingClientRect().top + window.scrollY - navbarH;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
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
      {/* Large ring - top left area */}
      <FloatShape
        duration={11}
        delay={0}
        rotateAmount={3}
        type="ring"
        strokeWidth={2}
        className="pointer-events-none absolute top-20 left-[8%] w-48 h-48"
      />
      {/* Medium ring - bottom right area */}
      <FloatShape
        duration={14}
        delay={2}
        rotateAmount={-4}
        type="ring"
        strokeWidth={1.5}
        className="pointer-events-none absolute bottom-32 right-[10%] w-36 h-36"
      />
      {/* Small ring - top right */}
      <FloatShape
        duration={9}
        delay={1.2}
        rotateAmount={2}
        type="ring"
        strokeWidth={1}
        className="pointer-events-none absolute top-32 right-[18%] w-20 h-20"
      />
      {/* Tilted square - bottom left */}
      <FloatShape
        duration={13}
        delay={0.8}
        rotateAmount={5}
        type="square"
        className="pointer-events-none absolute bottom-28 left-[12%] w-16 h-16"
      />
      {/* Tiny accent dot - near logo */}
      <FloatShape
        duration={7}
        delay={1.5}
        rotateAmount={0}
        type="dot"
        className="pointer-events-none absolute top-[40%] right-[25%] w-2.5 h-2.5"
      />

      {/* ── Layer 4: Main content ──────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: duration.slow, ease: [0.16, 1, 0.3, 1] }}
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
          initial={{ opacity: 0, y: offset.large }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.slow, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <h1 className="font-display text-7xl sm:text-8xl md:text-[110px] lg:text-[120px] font-bold tracking-tight leading-[1.05]">
            <span className="gradient-text">熵基</span>
            <span className="gradient-text">秩序</span>
          </h1>
          <div className="mt-3 flex items-center justify-center gap-3">
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-brand-400/50 to-transparent" />
            <span className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.18em] text-slate-400 dark:text-slate-500 uppercase">
              EntropyOrder
            </span>
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-brand-400/50 to-transparent" />
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: offset.medium }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.slow * 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg sm:text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Tag line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.normal, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex items-center gap-2"
        >
          {['Data', 'Intelligence', 'Future'].map((word, i) => (
            <span key={word} className="flex items-center gap-2">
              <span className="text-sm uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 font-medium">
                {word}
              </span>
              {i < 2 && <span className="w-1 h-1 rounded-full bg-brand-400/50" />}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.button
        onClick={scrollToExpert}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: duration.normal, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-slate-400 hover:text-brand-500 dark:text-slate-500 dark:hover:text-brand-400 transition-colors group"
        aria-label="Scroll down"
      >
        <span className="text-xs sm:text-sm uppercase tracking-widest opacity-70 group-hover:opacity-100">{t('hero.scrollHint')}</span>
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
