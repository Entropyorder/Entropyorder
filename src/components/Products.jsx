import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { ProductCategory } from './ProductCategory.jsx';
import { ExpertArtifact } from './Artifacts/ExpertArtifact.jsx';
import { MultimodalArtifact } from './Artifacts/MultimodalArtifact.jsx';
import { AgentArtifact } from './Artifacts/AgentArtifact.jsx';

export function Products({ onContact }) {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [activeTab, setActiveTab] = useState(0);
  const sectionRefs = [useRef(null), useRef(null), useRef(null)];

  const categories = [
    { key: 'expert', title: t('products.categories.expert.name'), artifact: ExpertArtifact, datasets: t('products.categories.expert.datasets', { returnObjects: true }) },
    { key: 'multimodal', title: t('products.categories.multimodal.name'), artifact: MultimodalArtifact, datasets: t('products.categories.multimodal.datasets', { returnObjects: true }) },
    { key: 'agent', title: t('products.categories.agent.name'), artifact: AgentArtifact, datasets: t('products.categories.agent.datasets', { returnObjects: true }) },
  ];

  const scrollToCategory = (idx) => {
    sectionRefs[idx].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveTab(idx);
  };

  return (
    <section id="products" className="relative bg-white dark:bg-slate-900 transition-colors">
      <div className="pt-20 pb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-50">{t('products.title')}</h2>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6">
        {!isMobile && (
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-2">
              {categories.map((cat, idx) => (
                <button
                  key={cat.key}
                  onClick={() => scrollToCategory(idx)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === idx
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
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
            <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
              {categories.map((cat, idx) => (
                <button
                  key={cat.key}
                  onClick={() => scrollToCategory(idx)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === idx
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-8">
            {categories.map((cat, idx) => (
              <div key={cat.key} ref={sectionRefs[idx]}>
                <ProductCategory
                  title={cat.title}
                  artifact={cat.artifact}
                  datasets={cat.datasets}
                  direction={idx % 2 === 0 ? 'left' : 'right'}
                  onContact={onContact}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
