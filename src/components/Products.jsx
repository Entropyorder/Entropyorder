import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { ProductCategory } from './ProductCategory.jsx';
import { ExpertArtifact } from './Artifacts/ExpertArtifact.jsx';
import { MultimodalArtifact } from './Artifacts/MultimodalArtifact.jsx';
import { AgentArtifact } from './Artifacts/AgentArtifact.jsx';

function ensureArray(val) {
  return Array.isArray(val) ? val : [];
}

export function Products({ onContact }) {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [activeTab, setActiveTab] = useState(0);
  const sectionRefs = useRef([]);

  const categories = [
    { key: 'expert', title: t('products.categories.expert.name'), artifact: ExpertArtifact, datasets: ensureArray(t('products.categories.expert.datasets', { returnObjects: true })) },
    { key: 'multimodal', title: t('products.categories.multimodal.name'), artifact: MultimodalArtifact, datasets: ensureArray(t('products.categories.multimodal.datasets', { returnObjects: true })) },
    { key: 'agent', title: t('products.categories.agent.name'), artifact: AgentArtifact, datasets: ensureArray(t('products.categories.agent.datasets', { returnObjects: true })) },
  ];

  const scrollToCategory = (idx) => {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveTab(idx);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.indexOf(entry.target);
            if (idx !== -1) setActiveTab(idx);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );
    sectionRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <section id="products" className="relative bg-white dark:bg-slate-900 transition-colors">
      {/* Section label — small and muted, not a competing title */}
      <div className="pt-24 pb-4 text-center">
        <span className="inline-block text-sm font-medium uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-1.5">
          {t('products.title')}
        </span>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6">
        {!isMobile && (
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24 space-y-1.5" role="tablist" aria-label="Product categories">
              {categories.map((cat, idx) => (
                <button
                  key={cat.key}
                  role="tab"
                  aria-selected={activeTab === idx}
                  aria-controls={`product-panel-${idx}`}
                  onClick={() => scrollToCategory(idx)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-200 ${
                    activeTab === idx
                      ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-sm shadow-brand-500/20'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </aside>
        )}

        <div className="flex-1">
          {isMobile && (
            <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide" role="tablist" aria-label="Product categories">
              {categories.map((cat, idx) => (
                <button
                  key={cat.key}
                  role="tab"
                  aria-selected={activeTab === idx}
                  aria-controls={`product-panel-${idx}`}
                  onClick={() => scrollToCategory(idx)}
                  className={`shrink-0 px-4 py-2 rounded-full text-base font-medium transition-all duration-200 ${
                    activeTab === idx
                      ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {categories.map((cat, idx) => (
              <div
                key={cat.key}
                id={`product-panel-${idx}`}
                ref={(el) => { sectionRefs.current[idx] = el; }}
                role="tabpanel"
                aria-labelledby={`product-tab-${idx}`}
              >
                <ProductCategory
                  title={cat.title}
                  artifact={cat.artifact}
                  datasets={cat.datasets}
                  direction={idx % 2 === 0 ? 'left' : 'right'}
                  onContact={onContact}
                  index={idx}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
