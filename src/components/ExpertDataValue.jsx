import { useState, useRef, Fragment } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Check, XCircle, ExternalLink } from 'lucide-react';
import { stagger, offset, duration, spring } from '../animations/tokens.js';
import * as presets from '../animations/presets.js';
import { useScrollReveal } from '../animations/useScrollReveal.js';
import { MethodologyImageStrip } from './MethodologyImageStrip.jsx';
import { DetailedPipeline } from './DetailedPipeline.jsx';
import { publicAsset } from '../utils/assets.js';

// Punch-hole bookmark card — A4 ratio, image hero with translucent text overlay
function BookmarkCard({ paper, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.a
      ref={ref}
      href={paper.url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, x: 20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
      transition={{ duration: duration.normal, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.06, y: -4, rotate: -0.5 }}
      whileTap={{ scale: 1.02 }}
      style={{ aspectRatio: '210 / 297', transformOrigin: 'center center' }}
      className="group relative block rounded-md overflow-hidden mx-auto max-w-[200px] w-full
        bg-white dark:bg-slate-800
        border border-slate-200/80 dark:border-white/10
        shadow-md hover:shadow-2xl hover:shadow-brand-500/15
        hover:z-10
        transition-shadow duration-300"
    >
      {/* Punch holes on left — overlay the content area */}
      <div className="absolute left-0 top-0 bottom-0 w-5 flex flex-col justify-around items-center pointer-events-none z-20 py-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-page-bg dark:bg-page-bg-dark
              shadow-[inset_0_1px_2px_rgba(0,0,0,0.18)]
              border border-slate-200/60 dark:border-white/5"
          />
        ))}
      </div>
      {/* Binding strip */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-200/60 dark:bg-white/10 pointer-events-none z-20" />

      {/* Full-bleed cover image */}
      <div className="absolute inset-0 pl-6">
        <img
          src={publicAsset(paper.img)}
          alt={paper.title}
          className="w-full h-full object-cover object-top group-hover:scale-[1.05] transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Translucent gradient text overlay — bottom half */}
      <div className="absolute inset-x-0 bottom-0 pl-6 pt-12
        bg-gradient-to-t from-black/85 via-black/55 to-transparent
        pointer-events-none">
        <div className="px-3 pb-2.5">
          <h4 className="text-white text-[11px] font-semibold leading-snug line-clamp-2 drop-shadow">
            {paper.title}
          </h4>
          <div className="mt-1 flex items-center gap-1 text-[9px] text-white/70">
            <span className="truncate">{paper.authors}</span>
            <span className="flex-shrink-0">·</span>
            <span className="flex-shrink-0">{paper.venue}</span>
          </div>
        </div>
      </div>

      {/* Hover external-link cue */}
      <div className="absolute top-1.5 right-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="p-1 rounded bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow">
          <ExternalLink className="w-3 h-3 text-slate-700 dark:text-slate-200" />
        </div>
      </div>
    </motion.a>
  );
}

export function ExpertDataValue() {
  const { t } = useTranslation();
  const rawPapers = t('expertData.pipeline.papers', { returnObjects: true });
  const papers = Array.isArray(rawPapers) ? rawPapers : [];
  const { getChildProps: getStepProps } = useScrollReveal(stagger.normal * 0.9);

  return (
    <section id="expert-data" className="relative py-28 overflow-hidden bg-page-bg dark:bg-page-bg-dark">
      <div
        className="pointer-events-none absolute inset-0 opacity-25 dark:opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1.5px 1.5px, rgba(37,99,235,0.18) 1.5px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-400/20 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          {...presets.fadeUp(offset.medium)}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-brand-500 dark:text-brand-400 border border-brand-200 dark:border-brand-800/60 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 dark:bg-brand-400 inline-block" />
            {t('expertData.tag')}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-50 mb-5 leading-tight">
            {t('expertData.title')}
          </h2>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('expertData.subtitle')}
          </p>
        </motion.div>

        {/* Stats Banner */}
        {(() => {
          const rawStats = t('expertData.stats', { returnObjects: true });
          const stats = Array.isArray(rawStats) ? rawStats : [];
          return stats.length > 0 ? (
            <motion.div
              {...presets.fadeUp(offset.medium, duration.normal, 0.15)}
              className="flex items-center justify-center gap-6 sm:gap-10 md:gap-16 mb-16"
            >
              {stats.map((stat, i) => (
                <Fragment key={i}>
                  {i > 0 && <div className="w-px h-10 bg-slate-200 dark:bg-slate-700/60" />}
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-cyan-500 dark:from-brand-400 dark:to-cyan-300">
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
                  </div>
                </Fragment>
              ))}
            </motion.div>
          ) : null;
        })()}

        {/* Methodology Image Strip */}
        <MethodologyImageStrip />

        {/* Headings row — aligned with columns below */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 mb-6">
          <motion.div
            {...presets.fadeIn(duration.normal, 0.1)}
            className="flex-1 min-w-0 w-full flex items-center gap-4"
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-slate-200 dark:to-slate-700" />
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 whitespace-nowrap">
              {t('expertData.pipeline.heading')}
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-slate-200 dark:to-slate-700" />
          </motion.div>

          {papers.length > 0 && (
            <div className="w-full lg:w-[240px] flex-shrink-0 text-center"
            >
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500"
              >
                {t('expertData.pipeline.papersLabel', 'Related Publications')}
              </span>
            </div>
          )}
        </div>

        {/* Detailed Pipeline + Papers (two-column) */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-stretch">
          {/* Left: Pipeline + Comparison stacked, total height aligned with right column */}
          <div className="flex-1 min-w-0 w-full flex flex-col gap-6">
            <div className="relative rounded-2xl overflow-hidden
              bg-slate-50/80 dark:bg-[#0a1422]/80
              border border-slate-100 dark:border-white/[0.06]
              backdrop-blur-sm
              shadow-[0_4px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_40px_rgba(0,0,0,0.4)]
              px-6 sm:px-10 py-8">
              <DetailedPipeline />
            </div>

            {/* Expert vs Crowd Comparison — moved into left column to match right column height */}
            {(() => {
              const comp = t('expertData.comparison', { returnObjects: true });
              if (!comp || !comp.expertPoints) return null;
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                  <motion.div
                    {...presets.fadeLeft(offset.medium, duration.normal, 0.1)}
                    className="relative rounded-2xl p-6 border-2 border-emerald-300/60 dark:border-emerald-600/40 bg-emerald-50/50 dark:bg-emerald-900/10"
                  >
                    <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5">
                      <Check className="w-3 h-3" strokeWidth={3} />
                      {comp.expertTitle}
                    </div>
                    <ul className="mt-3 space-y-3">
                      {comp.expertPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-emerald-700 dark:text-emerald-300">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div
                    {...presets.fadeRight(offset.medium, duration.normal, 0.2)}
                    className="relative rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/20"
                  >
                    <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-slate-400 dark:bg-slate-600 text-white text-xs font-bold flex items-center gap-1.5">
                      <XCircle className="w-3 h-3" strokeWidth={3} />
                      {comp.crowdTitle}
                    </div>
                    <ul className="mt-3 space-y-3">
                      {comp.crowdPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-400 dark:text-slate-500 line-through decoration-slate-300 dark:decoration-slate-600">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              );
            })()}
          </div>

          {/* Right: single-column vertical bookmark stack */}
          {papers.length > 0 && (
            <div className="w-full lg:w-[240px] flex-shrink-0 flex flex-col">
              <div className="flex-1 flex flex-col justify-between">
                {papers
                  .filter((p) => !p.title?.includes('SCBench'))
                  .map((paper, i) => (
                    <BookmarkCard key={i} paper={paper} index={i} />
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Quote — full width below both columns */}
        <motion.div
          initial={{ opacity: 0, y: offset.small }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: duration.normal, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 mx-auto max-w-3xl"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
          </div>
          <p className="mt-6 text-center text-lg sm:text-xl italic text-slate-500 dark:text-slate-400 leading-relaxed">
            "{t('expertData.pipeline.quote')}"
          </p>
        </motion.div>
      </div>
    </section>
  );
}
