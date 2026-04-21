import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { stagger, offset, duration } from '../animations/tokens.js';
import { useScrollReveal } from '../animations/useScrollReveal.js';
import { publicAsset } from '../utils/assets.js';

const METHODOLOGY_IMAGES = [
  { src: publicAsset('methodology/expert-tagging.png'), key: 'tagging' },
  { src: publicAsset('methodology/knowledge-graph.png'), key: 'graph' },
  { src: publicAsset('methodology/cross-review.png'), key: 'review' },
];

function MethodologyCard({ image, title, index, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: offset.medium }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: duration.normal, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1"
    >
      <div className="relative rounded-2xl overflow-hidden
        bg-slate-50/80 dark:bg-[#0a1422]/80
        border border-slate-200/80 dark:border-white/[0.07]
        backdrop-blur-sm
        shadow-[0_4px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_40px_rgba(0,0,0,0.4)]">
        <div className="aspect-[4/3] relative overflow-hidden">
          <img
            src={image.src}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-5 text-center">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {title}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}

export function MethodologyImageStrip() {
  const { t } = useTranslation();
  const rawImageTitles = t('expertData.methodologyImages', { returnObjects: true });
  const imageTitles = Array.isArray(rawImageTitles) ? rawImageTitles : [];
  const { getChildProps } = useScrollReveal(stagger.normal);

  return (
    <div className="mb-16">
      <div className="flex flex-col md:flex-row gap-6">
        {METHODOLOGY_IMAGES.map((img, i) => (
          <MethodologyCard
            key={img.key}
            image={img}
            title={imageTitles[i]?.title || ''}
            index={i}
            delay={getChildProps(i).delay}
          />
        ))}
      </div>
    </div>
  );
}
