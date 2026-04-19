import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Bot, BookOpen, Network, PenLine, Users, ShieldCheck, Check, XCircle, ExternalLink } from 'lucide-react';
import { stagger, offset, duration, spring } from '../animations/tokens.js';
import * as presets from '../animations/presets.js';
import { useScrollReveal } from '../animations/useScrollReveal.js';

const STEP_META = [
  {
    icon: Bot,
    bg: 'from-blue-500 to-violet-500',
    glow: 'rgba(99,102,241,0.35)',
    badgeCls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    lineCls: 'bg-gradient-to-b from-blue-200 to-teal-200 dark:from-blue-900/50 dark:to-teal-900/50',
  },
  {
    icon: BookOpen,
    bg: 'from-teal-500 to-cyan-400',
    glow: 'rgba(20,184,166,0.35)',
    badgeCls: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    lineCls: 'bg-gradient-to-b from-teal-200 to-violet-200 dark:from-teal-900/50 dark:to-violet-900/50',
  },
  {
    icon: Network,
    bg: 'from-violet-500 to-blue-400',
    glow: 'rgba(139,92,246,0.35)',
    badgeCls: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    lineCls: 'bg-gradient-to-b from-violet-200 to-emerald-200 dark:from-violet-900/50 dark:to-emerald-900/50',
  },
  {
    icon: PenLine,
    bg: 'from-emerald-500 to-teal-400',
    glow: 'rgba(52,211,153,0.35)',
    badgeCls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    lineCls: 'bg-gradient-to-b from-emerald-200 to-amber-200 dark:from-emerald-900/50 dark:to-amber-900/50',
  },
  {
    icon: Users,
    bg: 'from-amber-400 to-orange-400',
    glow: 'rgba(245,158,11,0.35)',
    badgeCls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    lineCls: 'bg-gradient-to-b from-amber-200 to-blue-200 dark:from-amber-900/50 dark:to-blue-900/50',
  },
  {
    icon: ShieldCheck,
    bg: 'from-blue-600 to-cyan-400',
    glow: 'rgba(37,99,235,0.50)',
    badgeCls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    lineCls: '',
  },
];

function PaperCard({ paper, index, hoveredIndex, onHover, totalCards }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const isHovered = hoveredIndex === index;
  const isAnyHovered = hoveredIndex !== null;
  const isOtherHovered = isAnyHovered && !isHovered;

  // Stacked (idle) offsets — slight random-looking pile
  const stackOffsets = [
    { x: -6, y: -4, rotate: -3 },
    { x: 4, y: 2, rotate: 1.5 },
    { x: 12, y: 8, rotate: 5 },
  ];
  const stack = stackOffsets[index] || stackOffsets[0];

  // Fanned (hover) offsets — horizontal fan from bottom center
  const centerIndex = Math.floor(totalCards / 2);
  const fanOffsets = Array.from({ length: totalCards }, (_, i) => {
    const delta = i - centerIndex;
    return {
      x: delta * 28,
      y: Math.abs(delta) * 5,
      rotate: delta * 5,
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
      onHoverStart={() => onHover(index)}
      onHoverEnd={() => onHover(null)}
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
        ...spring.snappy,
      }}
      className="absolute w-full rounded-xl overflow-hidden shadow-2xl cursor-pointer group origin-bottom"
      style={{
        zIndex: isHovered ? 20 : 3 - index,
        aspectRatio: '3/4',
      }}
    >
      <img
        src={paper.img}
        alt={paper.title}
        className="w-full h-full object-cover object-top"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
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
  const rawSteps = t('expertData.pipeline.steps', { returnObjects: true });
  const steps = Array.isArray(rawSteps) ? rawSteps : [];
  const rawPapers = t('expertData.pipeline.papers', { returnObjects: true });
  const papers = Array.isArray(rawPapers) ? rawPapers : [];
  const isGateStep = (idx) => idx === steps.length - 1;
  const { getChildProps: getStepProps } = useScrollReveal(stagger.normal * 0.9);

  return (
    <section id="expert-data" className="relative py-28 overflow-hidden bg-white dark:bg-slate-900">
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

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
          <div className="flex-1 min-w-0">
            <div className="relative rounded-2xl overflow-hidden
              bg-slate-50/80 dark:bg-[#0a1422]/80
              border border-slate-100 dark:border-white/[0.06]
              backdrop-blur-sm
              shadow-[0_4px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_40px_rgba(0,0,0,0.4)]
              px-6 sm:px-10 py-8">

              <div className="space-y-0">
                {steps.map((step, i) => {
                  const meta = STEP_META[i % STEP_META.length];
                  const Icon = meta.icon;
                  const isLast = isGateStep(i);

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -offset.small }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-30px' }}
                      transition={{ duration: duration.normal, delay: getStepProps(i).delay, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-stretch gap-5"
                    >
                      <div className="flex flex-col items-center flex-shrink-0 w-12">
                        <div
                          className={`relative w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                            bg-gradient-to-br ${meta.bg}
                            ${isLast ? 'shadow-[0_0_24px_rgba(37,99,235,0.4)]' : 'shadow-md'}`}
                          style={{ boxShadow: `0 4px 16px ${meta.glow}` }}
                        >
                          <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 flex-1 min-h-[1.75rem] mt-1 ${meta.lineCls}`} />
                        )}
                        {!isLast && i === steps.length - 2 && (
                          <svg viewBox="0 0 8 6" className="w-2 text-blue-300 dark:text-blue-800 fill-current flex-shrink-0 mb-0.5">
                            <path d="M4 6 L0 0 L8 0 Z" />
                          </svg>
                        )}
                      </div>

                      <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-6'} pt-0.5`}>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <h3 className={`font-bold text-slate-800 dark:text-slate-100 leading-snug ${isLast ? 'text-lg' : 'text-base'}`}>
                            {step.title}
                          </h3>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${meta.badgeCls}`}>
                            {step.badge}
                          </span>
                        </div>
                        {!isLast && (
                          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            {step.desc}
                          </p>
                        )}
                        {isLast && (
                          <div>
                            <p className="text-sm font-mono text-blue-500 dark:text-blue-400 mb-4">
                              {step.desc}
                            </p>
                            <div className="flex gap-3 flex-col sm:flex-row">
                              <motion.div
                                initial={{ opacity: 0, y: offset.small }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: duration.fast, delay: steps.length * stagger.normal + 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="flex-1 rounded-xl p-4
                                  bg-emerald-50 dark:bg-emerald-900/15
                                  border border-emerald-200/70 dark:border-emerald-700/30"
                              >
                                <div className="flex items-center gap-2 mb-1.5">
                                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
                                  </div>
                                  <span className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                                    {t('expertData.pipeline.passLabel')}
                                  </span>
                                </div>
                                <p className="text-sm text-emerald-600 dark:text-emerald-500 pl-7">
                                  {t('expertData.pipeline.passDesc')}
                                </p>
                              </motion.div>

                              <motion.div
                                initial={{ opacity: 0, y: offset.small }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: duration.fast, delay: steps.length * stagger.normal + 0.18, ease: [0.16, 1, 0.3, 1] }}
                                className="flex-1 rounded-xl p-4
                                  bg-slate-100/80 dark:bg-slate-800/40
                                  border border-slate-200 dark:border-slate-700/50"
                              >
                                <div className="flex items-center gap-2 mb-1.5">
                                  <div className="w-5 h-5 rounded-full bg-slate-400 dark:bg-slate-600 flex items-center justify-center flex-shrink-0">
                                    <XCircle className="w-3 h-3 text-white" strokeWidth={2.5} />
                                  </div>
                                  <span className="text-base font-bold text-slate-500 dark:text-slate-400">
                                    {t('expertData.pipeline.rejectLabel')}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-400 dark:text-slate-500 pl-7">
                                  {t('expertData.pipeline.rejectDesc')}
                                </p>
                              </motion.div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {papers.length > 0 && (
            <div className="w-full lg:w-[280px] xl:w-[310px] flex-shrink-0">
              <motion.div
                {...presets.fadeIn(duration.normal, 0.2)}
                className="mb-5"
              >
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  {t('expertData.pipeline.papersLabel', 'Related Publications')}
                </span>
              </motion.div>
              <div className="relative" style={{ height: 380 }}>
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
      </div>
    </section>
  );
}
