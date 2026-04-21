import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ExternalLink, X } from 'lucide-react';
import { DATASET_CATEGORIES } from '../data/datasets.js';
import { OverlayShell } from '../components/OverlayShell.jsx';

function findDataset(id, t) {
  for (const cat of DATASET_CATEGORIES) {
    if (cat.datasets.includes(id)) {
      return {
        id,
        categoryKey: cat.key,
        ...t(`datasets.${id}`, { returnObjects: true }),
      };
    }
  }
  return null;
}

export function DatasetDetailPage({ onContactSample }) {
  const { id } = useParams();
  const { t } = useTranslation();
  const dataset = findDataset(id, t);

  return (
    <OverlayShell>
      {({ close }) => {
        if (!dataset || typeof dataset.name !== 'string') {
          return (
            <div className="p-12 text-center">
              <button
                onClick={close}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="关闭"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
              <h1 className="font-display text-2xl font-bold mb-2">数据集未找到</h1>
              <Link to="/" className="text-brand-600 hover:underline">返回首页</Link>
            </div>
          );
        }

        const hasPaper = dataset.paper && dataset.paper.title;

        return (
          <div className="relative">
            {/* Close button */}
            <button
              onClick={close}
              className="absolute top-4 right-4 z-10 p-2 rounded-full
                bg-white/80 dark:bg-slate-900/80 backdrop-blur
                hover:bg-slate-100 dark:hover:bg-slate-800
                transition-colors"
              aria-label="关闭"
            >
              <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>

            {/* Header — title + scale badge */}
            <div className="px-6 sm:px-10 pt-10 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-start justify-between gap-4 mb-3">
                <motion.h1
                  layoutId={`dataset-title-${id}`}
                  className="font-display text-2xl md:text-3xl font-bold leading-tight text-slate-800 dark:text-slate-50"
                >
                  {dataset.name}
                </motion.h1>
                <span className="flex-shrink-0 mt-1 px-2.5 py-0.5 text-xs font-bold rounded-full
                  bg-brand-50 text-brand-700 border border-brand-200/70
                  dark:bg-brand-400/15 dark:text-brand-200 dark:border-brand-400/25">
                  {dataset.scale}
                </span>
              </div>
              {dataset.tags && dataset.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
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
              )}
            </div>

            {/* Body — two-column */}
            <div className="p-6 sm:p-10">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-8">
                <div className="space-y-8 min-w-0">
                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500 dark:text-brand-400 mb-3">
                      {t('products.detail.overview')}
                    </h3>
                    <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                      {dataset.brief || dataset.desc}
                    </p>
                  </section>

                  {dataset.structure && (
                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500 dark:text-brand-400 mb-3">
                        {t('products.detail.dataStructure')}
                      </h3>
                      <div className="rounded-xl bg-slate-900 dark:bg-slate-950 border border-slate-700/50 overflow-hidden">
                        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-700/50 bg-slate-800/60">
                          <span className="w-3 h-3 rounded-full bg-red-500/80" />
                          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                          <span className="w-3 h-3 rounded-full bg-green-500/80" />
                          <span className="ml-3 text-xs text-slate-400 font-mono">sample.jsonl</span>
                        </div>
                        <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
                          <code className="text-slate-200 font-mono whitespace-pre">
                            {dataset.structure}
                          </code>
                        </pre>
                      </div>
                    </section>
                  )}
                </div>

                {hasPaper && (
                  <aside>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500 dark:text-brand-400 mb-3">
                      {t('products.detail.relatedPaper')}
                    </h3>
                    <a
                      href={dataset.paper.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex flex-col rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/50 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/60 dark:to-slate-800/30 hover:border-brand-300 dark:hover:border-brand-600/50 transition-all hover:shadow-lg hover:shadow-brand-500/10"
                    >
                      {dataset.paper.img && (
                        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
                          <img
                            src={dataset.paper.img}
                            alt={dataset.paper.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        </div>
                      )}
                      <div className="p-3">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-snug mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-3">
                          {dataset.paper.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <span className="truncate">{dataset.paper.authors}</span>
                          <span className="flex-shrink-0">·</span>
                          <span className="flex-shrink-0">{dataset.paper.venue}</span>
                          <ExternalLink className="w-3 h-3 ml-auto flex-shrink-0 text-slate-400 group-hover:text-brand-500 transition-colors" />
                        </div>
                      </div>
                    </a>
                  </aside>
                )}
              </div>

              {/* CTA */}
              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => onContactSample?.(dataset)}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-accent-500 px-6 py-3 text-sm font-semibold text-white hover:from-brand-500 hover:to-cyan-400 shadow-sm hover:shadow-brand-500/35 hover:shadow-md transition-all"
                >
                  {t('products.detail.contactSample')}
                </button>
              </div>
            </div>
          </div>
        );
      }}
    </OverlayShell>
  );
}
