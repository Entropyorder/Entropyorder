import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { spring, duration } from '../animations/tokens.js';
import { FileText, Image, Video, AudioLines } from 'lucide-react';

const MODALITY_META = {
  text: { Icon: FileText },
  image: { Icon: Image },
  video: { Icon: Video },
  audio: { Icon: AudioLines },
};

function getProductionBadgeStyle(prod) {
  if (prod.includes('专家') || prod.includes('Expert')) {
    return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50';
  }
  if (prod.includes('人工') || prod.includes('Human')) {
    return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50';
  }
  return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
}

function computeFlyoutTop(cardTop, flyoutHeight) {
  const pad = 12;
  const viewportH = window.innerHeight;
  // Prefer top-aligned with card
  let top = cardTop - pad;
  // If bottom spills past viewport, shift up
  if (top + flyoutHeight + pad > viewportH) {
    top = Math.max(pad, viewportH - flyoutHeight - pad);
  }
  // If top goes above viewport, clamp
  if (top < pad) top = pad;
  return top;
}

function computeFlyoutLeft(cardLeft, cardWidth, flyoutWidth) {
  const viewportW = window.innerWidth;
  const pad = 16;
  // Center the flyout horizontally over the card
  let left = cardLeft + (cardWidth - flyoutWidth) / 2;
  if (left < pad) left = pad;
  if (left + flyoutWidth > viewportW - pad) left = viewportW - flyoutWidth - pad;
  return left;
}

export function DatasetCard({ dataset }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [showFlyout, setShowFlyout] = useState(false);
  const cardRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const FLYOUT_WIDTH = 380;

  const updatePos = useCallback(() => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setPos({
        top: rect.top,
        left: rect.left,
        width: rect.width,
      });
    }
  }, []);

  const handleEnter = useCallback(() => {
    updatePos();
    setShowFlyout(true);
  }, [updatePos]);

  const handleLeave = useCallback(() => {
    setShowFlyout(false);
  }, []);

  useEffect(() => {
    if (showFlyout) {
      window.addEventListener('scroll', updatePos, true);
      window.addEventListener('resize', updatePos);
      return () => {
        window.removeEventListener('scroll', updatePos, true);
        window.removeEventListener('resize', updatePos);
      };
    }
  }, [showFlyout, updatePos]);

  const hasPaper = dataset.paper && dataset.paper.title;

  const handleRequestSample = () => {
    const isZh = lang === 'zh';
    const subject = encodeURIComponent(
      isZh ? `[数据集咨询] ${dataset.name}` : `[Dataset Inquiry] ${dataset.name}`
    );
    const body = encodeURIComponent(
      isZh
        ? `熵基秩序团队您好，

我对以下数据集感兴趣：

数据集：${dataset.name}
简介：${dataset.desc || ''}
标签：${(dataset.tags || []).join('、')}
生产方式：${(dataset.production || []).join('、')}
存量：${dataset.inventory || ''}

请提供样例数据及更多信息。

此致
[您的姓名]
[您的单位]`
        : `Dear EntropyOrder Team,

I am interested in the following dataset:

Dataset: ${dataset.name}
Description: ${dataset.desc || ''}
Tags: ${(dataset.tags || []).join(', ')}
Production Method: ${(dataset.production || []).join(', ')}
Inventory: ${dataset.inventory || ''}

Please provide a sample and further details.

Best regards,
[Your Name]
[Your Organization]`
    );
    window.open(`mailto:jscott2402@gmail.com?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <>
      {/* Card */}
      <div ref={cardRef} onMouseEnter={handleEnter}>
        <motion.div
          whileHover={{ y: -6, scale: 1.015 }}
          transition={{ type: 'spring', ...spring.snappy }}
          className="group relative rounded-2xl overflow-hidden
            bg-white dark:bg-[#0d1a2d]
            border border-slate-200/80 dark:border-white/[0.07]
            shadow-[0_2px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]
            dark:shadow-[0_4px_32px_rgba(0,0,0,0.5)]
            hover:shadow-[0_16px_56px_rgba(37,99,235,0.16),0_6px_16px_rgba(0,0,0,0.1)]
            dark:hover:shadow-[0_16px_56px_rgba(37,99,235,0.26),0_6px_16px_rgba(0,0,0,0.7)]
            hover:border-brand-200 dark:hover:border-brand-500/40
            transition-all duration-300"
        >
          <div className="h-[3px] w-full bg-gradient-to-r from-brand-500 via-accent-400 to-cyan-400" />
          <div className="card-shimmer" />
          <div className="relative p-5 z-[2]">
            <div className="flex items-start justify-between gap-3 mb-2">
              <motion.h3
                layoutId={dataset.id ? `dataset-title-${dataset.id}` : undefined}
                className="font-display text-base font-semibold text-slate-800 dark:text-slate-50 leading-snug"
              >
                {dataset.name}
              </motion.h3>
              <span className="shrink-0 px-2.5 py-0.5 text-xs font-bold rounded-full
                bg-brand-50 text-brand-700 border border-brand-200/70
                dark:bg-brand-400/15 dark:text-brand-200 dark:border-brand-400/25">
                {dataset.scale}
              </span>
            </div>
            <p className="text-base text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
              {dataset.desc}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {dataset.tags.map((tag, idx) => (
                <span
                  key={`${dataset.name}-${idx}`}
                  className={`px-2.5 py-0.5 text-xs rounded-full font-medium border ${
                    idx % 3 === 0
                      ? 'bg-blue-50 text-blue-700 border-blue-200/70 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/50'
                      : idx % 3 === 1
                        ? 'bg-cyan-50 text-cyan-700 border-cyan-200/70 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800/50'
                        : 'bg-violet-50 text-violet-700 border-violet-200/70 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800/50'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
            {(dataset.production && dataset.production.length > 0) && (
              <div className="flex flex-wrap gap-2 items-center">
                {dataset.production.map((p) => (
                  <span key={p} className={`inline-flex items-center px-2 py-0.5 text-xs rounded-md font-medium border ${getProductionBadgeStyle(p)}`}>
                    {p}
                  </span>
                ))}
                {(dataset.modalities || []).map((mod, idx) => {
                  const meta = MODALITY_META[mod];
                  const Icon = meta?.Icon;
                  return (
                    <span key={`mod-${idx}`} className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs rounded-md bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
                      {Icon && <Icon className="w-3 h-3" />}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Flyout via Portal */}
      {createPortal(
        <AnimatePresence>
          {showFlyout && (
            <motion.div
              key="flyout"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: duration.fast, ease: 'easeOut' }}
              onMouseLeave={handleLeave}
              className="fixed z-[9999] rounded-2xl overflow-visible bg-white dark:bg-[#0d1a2d] border border-slate-200/80 dark:border-white/[0.07] shadow-[0_24px_80px_rgba(0,0,0,0.18)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.7)]"
              style={{
                width: FLYOUT_WIDTH,
                top: computeFlyoutTop(pos.top, FLYOUT_WIDTH),
                left: computeFlyoutLeft(pos.left, pos.width, FLYOUT_WIDTH),
              }}
            >
              <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h4 className="font-display text-lg font-bold text-slate-800 dark:text-slate-50">
                    {dataset.name}
                  </h4>
                  <span className="shrink-0 px-2.5 py-0.5 text-xs font-bold rounded-full
                    bg-brand-50 text-brand-700 border border-brand-200/70
                    dark:bg-brand-400/15 dark:text-brand-200 dark:border-brand-400/25">
                    {dataset.scale}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {dataset.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`px-2.5 py-0.5 text-xs rounded-full font-medium border ${
                        idx % 3 === 0
                          ? 'bg-blue-50 text-blue-700 border-blue-200/70 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/50'
                          : idx % 3 === 1
                            ? 'bg-cyan-50 text-cyan-700 border-cyan-200/70 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800/50'
                            : 'bg-violet-50 text-violet-700 border-violet-200/70 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800/50'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {(dataset.production && dataset.production.length > 0) && (
                  <div className="flex flex-wrap gap-2 items-center">
                    {dataset.production.map((p) => (
                      <span key={p} className={`inline-flex items-center px-2 py-0.5 text-xs rounded-md font-medium border ${getProductionBadgeStyle(p)}`}>
                        {p}
                      </span>
                    ))}
                    {(dataset.modalities || []).map((mod, idx) => {
                      const meta = MODALITY_META[mod];
                      const Icon = meta?.Icon;
                      return (
                        <span key={`mod-${idx}`} className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs rounded-md bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
                          {Icon && <Icon className="w-3 h-3" />}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="space-y-4">
                  <section>
                    <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500 dark:text-brand-400 mb-2">
                      {t('products.detail.overview')}
                    </h5>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {dataset.brief || dataset.desc}
                    </p>
                  </section>

                  {dataset.structure && (
                    <section>
                      <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500 dark:text-brand-400 mb-2">
                        {t('products.detail.dataStructure')}
                      </h5>
                      <div className="rounded-xl bg-slate-900 dark:bg-slate-950 border border-slate-700/50 overflow-hidden">
                        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-700/50 bg-slate-800/60">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                          <span className="ml-2.5 text-xs text-slate-400 font-mono">sample.jsonl</span>
                        </div>
                        <pre className="p-3 overflow-x-auto text-xs leading-relaxed">
                          <code className="text-slate-200 font-mono whitespace-pre">
                            {dataset.structure}
                          </code>
                        </pre>
                      </div>
                    </section>
                  )}
                </div>

                {hasPaper && (
                  <section className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                    <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500 dark:text-brand-400 mb-3">
                      {t('products.detail.relatedPaper')}
                    </h5>
                    <a
                      href={dataset.paper.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex gap-3 rounded-xl p-3 border border-slate-200 dark:border-slate-700/50 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/60 dark:to-slate-800/30 hover:border-brand-300 dark:hover:border-brand-600/50 transition-all hover:shadow-lg hover:shadow-brand-500/10"
                    >
                      {dataset.paper.img && (
                        <div className="relative shrink-0 w-24 overflow-hidden rounded-lg" style={{ aspectRatio: '4/3' }}>
                          <img
                            src={dataset.paper.img}
                            alt={dataset.paper.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h6 className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-snug mb-1.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-3">
                          {dataset.paper.title}
                        </h6>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <span className="truncate">{dataset.paper.authors}</span>
                          <span className="flex-shrink-0">·</span>
                          <span className="flex-shrink-0">{dataset.paper.venue}</span>
                        </div>
                      </div>
                    </a>
                  </section>
                )}
              </div>

              {/* Request Sample Button */}
              <div className="px-4 pb-3 pt-2">
                <button
                  onClick={handleRequestSample}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 px-5 py-2.5 text-sm font-semibold text-white hover:from-brand-500 hover:to-cyan-400 shadow-sm hover:shadow-brand-500/35 hover:shadow-md transition-all"
                >
                  {t('products.detail.contactSample')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
