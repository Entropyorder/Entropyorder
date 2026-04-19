import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Eye, FlaskConical, Users, Database, Sparkles } from 'lucide-react';
import { stagger, offset, duration } from '../animations/tokens.js';
import * as presets from '../animations/presets.js';
import { useScrollReveal } from '../animations/useScrollReveal.js';

const STEP_ICONS = [Eye, FlaskConical, Users, Database, Sparkles];

const STEP_COLORS = [
  { ring: '#3b82f6', glow: 'rgba(59,130,246,0.45)', from: 'from-blue-500', to: 'to-cyan-400' },
  { ring: '#22d3ee', glow: 'rgba(34,211,238,0.40)', from: 'from-cyan-500', to: 'to-blue-400' },
  { ring: '#a78bfa', glow: 'rgba(167,139,250,0.40)', from: 'from-violet-500', to: 'to-blue-500' },
  { ring: '#34d399', glow: 'rgba(52,211,153,0.40)', from: 'from-emerald-400', to: 'to-cyan-500' },
  { ring: '#60a5fa', glow: 'rgba(96,165,250,0.50)', from: 'from-blue-400', to: 'to-violet-500' },
];

function PipelineConnector({ index }) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: duration.normal, delay: 0.25 + index * stagger.normal, ease: [0.16, 1, 0.3, 1] }}
      className="hidden lg:flex flex-shrink-0 items-center w-8 xl:w-12 mt-6"
      style={{ transformOrigin: 'left' }}
    >
      <div className="flex-1 h-px bg-gradient-to-r from-brand-400/60 to-brand-300/30" />
      <svg
        viewBox="0 0 8 10"
        className="w-2 h-2.5 flex-shrink-0 text-brand-400/60 fill-current"
      >
        <path d="M0 0 L8 5 L0 10 Z" />
      </svg>
    </motion.div>
  );
}

function PipelineNode({ step, index, color, Icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: offset.medium }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: duration.normal, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 flex flex-col items-center text-center min-w-0 relative"
    >
      {/* Node circle */}
      <div className="relative mb-5">
        {/* Outer ring animation */}
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.15, 0.35] }}
          transition={{ duration: 3 + index * 0.4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.6 }}
          className="absolute -inset-2.5 rounded-full"
          style={{ border: `1px solid ${color.ring}`, opacity: 0.35 }}
        />
        {/* Main circle */}
        <div
          className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br ${color.from} ${color.to} shadow-lg`}
          style={{ boxShadow: `0 4px 20px ${color.glow}` }}
        >
          <Icon className="w-6 h-6 text-white" strokeWidth={1.8} />
        </div>
      </div>

      {/* Text */}
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2 px-1 leading-snug">
        {step.title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed px-1 max-w-[160px] lg:max-w-none">
        {step.desc}
      </p>
    </motion.div>
  );
}

export function AI4SS4AI() {
  const { t } = useTranslation();
  const rawSteps = t('ai4ss.steps', { returnObjects: true });
  const steps = Array.isArray(rawSteps) ? rawSteps : [];
  const callout = t('ai4ss.personaCallout', { returnObjects: true });
  const { getChildProps } = useScrollReveal(stagger.slow);

  return (
    <section id="ai4ss" className="relative py-32 overflow-hidden bg-slate-50 dark:bg-[#060c17]">

      {/* ── Background layers ─────────────────────────────────── */}

      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25 dark:opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(37,99,235,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.12) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial spotlight center */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-full"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(59,130,246,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-slate-900 to-transparent" />

      {/* ── Large "AI4SS4AI" watermark ──────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          text-[160px] sm:text-[220px] font-black uppercase tracking-tighter select-none whitespace-nowrap
          text-transparent"
        style={{
          WebkitTextStroke: '1px rgba(59,130,246,0.06)',
          textStroke: '1px rgba(59,130,246,0.06)',
        }}
      >
        AI4SS4AI
      </div>

      {/* ── Content ───────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          {...presets.fadeUp(offset.medium, duration.slow)}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-brand-500 dark:text-brand-400 border border-brand-200 dark:border-brand-800/60 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 dark:bg-brand-400 animate-pulse inline-block" />
            {t('ai4ss.tag')}
          </span>

          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter mb-6
            text-transparent bg-clip-text
            bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-500
            dark:from-blue-400 dark:via-cyan-300 dark:to-violet-400">
            {t('ai4ss.title')}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('ai4ss.subtitle')}
          </p>
        </motion.div>

        {/* ── Persona × Skills Callout ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: offset.medium }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: duration.normal, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 mx-auto max-w-3xl"
        >
          <div className="relative rounded-2xl overflow-hidden
            bg-gradient-to-br from-blue-600/[0.08] via-cyan-500/[0.05] to-violet-500/[0.08]
            dark:from-blue-600/[0.12] dark:via-cyan-500/[0.08] dark:to-violet-500/[0.12]
            border border-brand-200/50 dark:border-brand-500/20
            px-8 py-7">

            {/* Decorative corner glow */}
            <div
              className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 dark:opacity-15 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.6) 0%, transparent 70%)' }}
            />
            <div
              className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-15 dark:opacity-10 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.6) 0%, transparent 70%)' }}
            />

            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Stat */}
              <div className="text-center sm:text-left sm:border-r sm:border-brand-200/40 sm:dark:border-brand-700/30 sm:pr-8 flex-shrink-0">
                <div className="text-4xl sm:text-5xl font-black tracking-tight
                  text-transparent bg-clip-text
                  bg-gradient-to-r from-blue-600 to-cyan-500
                  dark:from-blue-400 dark:to-cyan-300">
                  {callout.stat}
                </div>
                <div className="mt-1 text-sm font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                  {callout.label}
                </div>
              </div>
              {/* Description */}
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {callout.desc}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Pipeline ─────────────────────────────────────────── */}
        <div className="relative">

          {/* "FROM REAL" / "TO REAL" bookends row */}
          <div className="flex items-center justify-between mb-6 px-0 lg:px-2">
            <motion.div
              initial={{ opacity: 0, x: -offset.small }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: duration.normal, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3"
            >
              <div className="text-left">
                <div className="text-xs font-black uppercase tracking-[0.4em] text-brand-500/70 dark:text-brand-400/60 leading-none">
                  {t('ai4ss.fromReal')}
                </div>
                <div className="mt-1 h-px w-16 bg-gradient-to-r from-brand-400/60 to-transparent" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: offset.small }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: duration.normal, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3"
            >
              <div className="text-right">
                <div className="text-xs font-black uppercase tracking-[0.4em] text-brand-500/70 dark:text-brand-400/60 leading-none">
                  {t('ai4ss.toReal')}
                </div>
                <div className="mt-1 h-px w-16 ml-auto bg-gradient-to-l from-brand-400/60 to-transparent" />
              </div>
            </motion.div>
          </div>

          {/* Pipeline nodes — horizontal desktop, vertical mobile */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-0">
            {steps.map((step, i) => {
              const Icon = STEP_ICONS[i % STEP_ICONS.length];
              const color = STEP_COLORS[i % STEP_COLORS.length];
              return (
                <div key={i} className="flex lg:contents w-full lg:w-auto">
                  {/* Mobile: vertical connector above (except first) */}
                  {i > 0 && (
                    <div className="lg:hidden w-px h-8 bg-gradient-to-b from-brand-400/40 to-brand-300/20 mx-auto -mb-2" />
                  )}
                  <PipelineNode step={step} index={i} color={color} Icon={Icon} delay={getChildProps(i).delay} />
                  {/* Desktop: horizontal connector (except after last) */}
                  {i < steps.length - 1 && (
                    <PipelineConnector index={i} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Loop description */}
          <motion.div
            initial={{ opacity: 0, y: offset.small }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: duration.normal, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 mx-auto max-w-2xl"
          >
            {/* Loop visual line */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-brand-400/60 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
            </div>
            <p className="text-center text-sm text-slate-400 dark:text-slate-500 leading-relaxed">
              {t('ai4ss.loopDesc')}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
