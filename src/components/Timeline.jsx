import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function Timeline({ steps }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.3'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={containerRef} className="relative mx-auto max-w-3xl px-4">
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 md:-translate-x-1/2" />
      <motion.div
        className="absolute left-6 md:left-1/2 top-0 w-0.5 bg-brand-600 dark:bg-brand-400 md:-translate-x-1/2"
        style={{ height: lineHeight }}
      />

      <div className="space-y-16 py-8">
        {steps.map((step, idx) => {
          const isLeft = idx % 2 === 0;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`relative flex items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row gap-6 md:gap-12`}
            >
              <div className="hidden md:block w-1/2 text-right">
                {isLeft && (
                  <div className="pr-8">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-50">{step.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">{step.desc}</p>
                  </div>
                )}
              </div>

              <div className="absolute left-6 md:left-1/2 z-10 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full bg-brand-600 ring-4 ring-white dark:ring-slate-900" />

              <div className={`w-full md:w-1/2 ${isLeft ? 'md:pl-8' : 'md:pr-8 md:text-right'} pl-12`}>
                <div className="md:hidden">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-50">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm">{step.desc}</p>
                </div>
                {!isLeft && (
                  <div className="hidden md:block">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-50">{step.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">{step.desc}</p>
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
