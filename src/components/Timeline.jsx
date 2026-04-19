import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Brain, Layers, Rocket } from 'lucide-react';
import { stagger, offset, duration } from '../animations/tokens.js';
import { useScrollReveal } from '../animations/useScrollReveal.js';

const STEP_ICONS = [Brain, Layers, Rocket];

export function Timeline({ steps }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.25'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const { getChildProps } = useScrollReveal(stagger.normal);

  return (
    <div ref={containerRef} className="relative mx-auto max-w-3xl px-4">
      {/* Background track */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200/60 dark:bg-slate-700/60 md:-translate-x-1/2" />
      {/* Animated fill */}
      <motion.div
        className="absolute left-6 md:left-1/2 top-0 w-0.5 md:-translate-x-1/2"
        style={{
          height: lineHeight,
          background: 'linear-gradient(to bottom, #2563eb, #22d3ee)',
        }}
      />

      <div className="space-y-20 py-8">
        {steps.map((step, idx) => {
          const isLeft = idx % 2 === 0;
          const Icon = STEP_ICONS[idx % STEP_ICONS.length];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: offset.medium }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: duration.normal, delay: getChildProps(idx).delay, ease: [0.16, 1, 0.3, 1] }}
              className={`relative flex items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row gap-6 md:gap-12`}
            >
              {/* Desktop: left-side text */}
              <div className="hidden md:block w-1/2 text-right">
                {isLeft && (
                  <div className="pr-10">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-50 mb-1">{step.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                )}
              </div>

              {/* Node with icon */}
              <div className="absolute left-6 md:left-1/2 z-10 -translate-x-1/2">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full
                  bg-gradient-to-br from-brand-500 to-accent-500
                  shadow-lg shadow-brand-500/30 dark:shadow-brand-400/40
                  timeline-pulse"
                >
                  <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                  {/* Outer ring */}
                  <div className="absolute -inset-1.5 rounded-full border border-brand-400/30 dark:border-brand-300/30" />
                </div>
              </div>

              {/* Desktop: right-side text */}
              <div className={`w-full md:w-1/2 ${isLeft ? 'md:pl-10' : 'md:pr-10 md:text-right'} pl-14`}>
                {/* Mobile text */}
                <div className="md:hidden">
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-50 mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
                {/* Desktop right-side text */}
                {!isLeft && (
                  <div className="hidden md:block">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-50 mb-1">{step.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
