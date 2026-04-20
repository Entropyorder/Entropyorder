import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Bot, Users, Network } from 'lucide-react';
import { stagger, offset, duration } from '../animations/tokens.js';
import { useScrollReveal } from '../animations/useScrollReveal.js';

const STEP_ICONS = {
  ai: Bot,
  human: Users,
  hybrid: Network,
};

const STEP_META = {
  ai: {
    iconBg: 'from-blue-500 to-violet-500',
    glow: 'rgba(99,102,241,0.35)',
    badgeCls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  },
  human: {
    iconBg: 'from-violet-500 to-amber-500',
    glow: 'rgba(167,139,250,0.35)',
    badgeCls: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  },
  hybrid: {
    iconBg: 'from-cyan-500 to-blue-500',
    glow: 'rgba(34,211,238,0.35)',
    badgeCls: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  },
};

function PipelineStep({ step, index, delay }) {
  const isHuman = step.type === 'human';
  const meta = STEP_META[step.type] || STEP_META.human;
  const Icon = STEP_ICONS[step.type] || Users;

  return (
    <motion.div
      initial={{ opacity: 0, y: offset.medium }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: duration.normal, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-start gap-4 ${isHuman ? 'flex-row-reverse' : ''}`}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <div
          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center
            bg-gradient-to-br ${meta.iconBg} shadow-lg`}
          style={{ boxShadow: `0 4px 20px ${meta.glow}` }}
        >
          <Icon className="w-7 h-7 text-white" strokeWidth={1.8} />
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 pt-1 ${isHuman ? 'text-right' : 'text-left'}`}>
        <div className={`flex items-center gap-2 mb-2 ${isHuman ? 'flex-row-reverse' : ''}`}>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug">
            {step.title}
          </h3>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${meta.badgeCls}`}>
            {step.badge}
          </span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {step.desc}
        </p>
      </div>

      {/* Spacer for visual balance */}
      <div className="hidden sm:block w-14 flex-shrink-0" />
    </motion.div>
  );
}

export function DetailedPipeline() {
  const { t } = useTranslation();
  const rawSteps = t('expertData.pipeline.detailedSteps', { returnObjects: true });
  const steps = Array.isArray(rawSteps) ? rawSteps : [];
  const { getChildProps } = useScrollReveal(stagger.normal * 0.8);

  return (
    <div className="space-y-8">
      {steps.map((step, i) => (
        <PipelineStep
          key={i}
          step={step}
          index={i}
          delay={getChildProps(i).delay}
        />
      ))}
    </div>
  );
}
