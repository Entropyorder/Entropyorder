import { useState, useRef, Fragment } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Check, XCircle, ExternalLink } from 'lucide-react';
import { stagger, offset, duration, spring } from '../animations/tokens.js';
import * as presets from '../animations/presets.js';
import { useScrollReveal } from '../animations/useScrollReveal.js';
import { MethodologyImageStrip } from './MethodologyImageStrip.jsx';
import { DetailedPipeline } from './DetailedPipeline.jsx';

function PaperCard({ paper, index, hoveredIndex, onHover, totalCards }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const isHovered = hoveredIndex === index;
  const isAnyHovered = hoveredIndex !== null;
  const isOtherHovered = isAnyHovered && !isHovered;

  const stackOffsets = [
    { x: -8, y: -6, rotate: -4 },
    { x: 5, y: 3, rotate: 2 },
    { x: 15, y: 10, rotate: 6 },
  ];
  const stack = stackOffsets[index] || stackOffsets[0];

  const centerIndex = Math.floor(totalCards / 2);
  const fanOffsets = Array.from({ length: totalCards }, (_, i) => {
    const delta = i - centerIndex;
    return {
      x: delta * 32,
      y: Math.abs(delta) * 6,
      rotate: delta * 6,
    };
  });
  const fan = fanOffsets[index] || fanOffsets[0];

  const target = isAnyHovered ? fan : stack;

  return (
    <motion.a
      ref={ref}
      href={paper.url}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      onTouchStart={() => onHover(index)}
      onTouchEnd={() => onHover(null)}
      initial={{ opacity: 0, y: 30 + index * 15, scale: 0.9 }}
      animate={
        isInView
          ? {
              x: target.x,
              y: target.y,
              rotate: target.rotate,
              opacity: 1,
              scale: isHovered ? 1.04 : isOtherHovered ? 0.95 : 1,
              filter: isOtherHovered ? 'brightness(0.88)' : 'brightness(1)',
            }
          : { opacity: 0, y: 30 + index * 15, scale: 0.9 }
      }
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
      className="absolute w-full rounded-xl overflow-hidden shadow-2xl cursor-pointer group origin-bottom"
      style={{
        zIndex: isHovered ? 20 : 3 - index,
        aspectRatio: '2/3',
      }}
    >
      <img
        src={paper.img}
        alt={paper.title}
        className="w-full h-full object-cover object-top"
        loading="lazy"
      />
      {/* Persistent info bar — hidden on hover */}
      <div className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 via-black/40 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
        <h4 className="text-white font-semibold text-xs leading-snug line-clamp-1 mb-0.5">{paper.title}</h4>
        <span className="text-white/60 text-[10px]">{paper.authors} · {paper.venue}</span>
      </div>
      {/* Hover overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <h4 className="text-white font-bold text-sm leading-snug mb-1 line-clamp-2">{paper.title}</h4>
        <div className="flex items-center justify-between">
          <span className="text-white/70 text-xs">{paper.authors} · {paper.venue}</span>
          <ExternalLink className="w-3.5 h-3.5 text-white/60 flex-shrink-0 ml-2" />
        </div>
      </div>
    </motion.a>
  );
}

export function ExpertDataValue() {
  const { t } = useTranslation();
  const [hoveredPaper, setHoveredPaper] = useState(null);
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
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-50 mb-5 leading-tight">
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

        {/* Pipeline Heading */}
        <motion.div
          {...presets.fadeIn(duration.normal, 0.1)}
          className="flex items-center gap-4 mb-10"
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-slate-200 dark:to-slate-700" />
          <span className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 whitespace-nowrap">
            {t('expertData.pipeline.heading')}
          </span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-slate-200 dark:to-slate-700" />
        </motion.div>

        {/* Detailed Pipeline + Papers (two-column) */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
          {/* Left: Detailed Pipeline */}
          <div className="flex-[2] min-w-0">
            <div className="relative rounded-2xl overflow-hidden
              bg-slate-50/80 dark:bg-[#0a1422]/80
              border border-slate-100 dark:border-white/[0.06]
              backdrop-blur-sm
              shadow-[0_4px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_40px_rgba(0,0,0,0.4)]
              px-6 sm:px-10 py-8">
              <DetailedPipeline />
            </div>
          </div>

          {/* Right: Papers */}
          {papers.length > 0 && (
            <div className="flex-1 w-full lg:w-[360px] xl:w-[400px] flex-shrink-0">
              <motion.div
                {...presets.fadeIn(duration.normal, 0.2)}
                className="mb-5"
              >
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  {t('expertData.pipeline.papersLabel', 'Related Publications')}
                </span>
              </motion.div>
              <div className="relative" style={{ height: 500 }}>
                {papers.map((paper, i) => (
                  <PaperCard
                    key={i}
                    paper={paper}
                    index={i}
                    hoveredIndex={hoveredPaper}
                    onHover={setHoveredPaper}
                    totalCards={papers.length}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quote */}
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

        {/* Expert vs Crowd Comparison */}
        {(() => {
          const comp = t('expertData.comparison', { returnObjects: true });
          if (!comp || !comp.expertPoints) return null;
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
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
    </section>
  );
}
