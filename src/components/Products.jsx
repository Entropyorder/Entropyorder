import { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { ProductCategory } from './ProductCategory.jsx';
import { ExpertArtifact } from './Artifacts/ExpertArtifact.jsx';
import { MultimodalArtifact } from './Artifacts/MultimodalArtifact.jsx';
import { AgentArtifact } from './Artifacts/AgentArtifact.jsx';
import { DATASET_CATEGORIES } from '../data/datasets.js';
import { Search, X, FileText, Image, Video, AudioLines } from 'lucide-react';

const ARTIFACTS = { ExpertArtifact, MultimodalArtifact, AgentArtifact };

const MODALITY_META = {
  text:  { Icon: FileText,    label: '文本' },
  image: { Icon: Image,       label: '图片' },
  video: { Icon: Video,       label: '视频' },
  audio: { Icon: AudioLines,  label: '音频' },
};

export function Products() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [activeTab, setActiveTab] = useState(0);
  const sectionRefs = useRef([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCapabilities, setSelectedCapabilities] = useState([]);
  const [selectedProductions, setSelectedProductions] = useState([]);
  const [selectedModalities, setSelectedModalities] = useState([]);

  const onViewDetail = (dataset) => {
    navigate(`/datasets/${dataset.id}`, { state: { backgroundLocation: location } });
  };

  const allCategories = useMemo(() => DATASET_CATEGORIES.map((cat) => ({
    key: cat.key,
    title: t(`${cat.i18nKey}.name`),
    artifact: ARTIFACTS[cat.artifact] || ExpertArtifact,
    datasets: cat.datasets.map((id) => ({
      id,
      ...t(`datasets.${id}`, { returnObjects: true }),
    })),
  })), [t]);

  const filterOptions = useMemo(() => {
    const capabilities = new Set();
    const productions = new Set();
    const modalities = new Set();
    allCategories.forEach((cat) => {
      cat.datasets.forEach((ds) => {
        (ds.tags || []).forEach((t) => capabilities.add(t));
        (ds.production || []).forEach((p) => productions.add(p));
        (ds.modalities || []).forEach((m) => modalities.add(m));
      });
    });
    return {
      capabilities: [...capabilities],
      productions: [...productions],
      modalities: [...modalities],
    };
  }, [allCategories]);

  const filteredCategories = useMemo(() => {
    const hasAnyFilter = searchTerm || selectedCapabilities.length > 0 || selectedProductions.length > 0 || selectedModalities.length > 0;
    if (!hasAnyFilter) return allCategories;

    return allCategories.map((cat) => {
      const filteredDatasets = cat.datasets.filter((ds) => {
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          if (!(ds.name || '').toLowerCase().includes(term) && !(ds.desc || '').toLowerCase().includes(term)) return false;
        }
        if (selectedCapabilities.length > 0) {
          const dsTags = ds.tags || [];
          if (!selectedCapabilities.every((c) => dsTags.includes(c))) return false;
        }
        if (selectedProductions.length > 0) {
          const dsProd = ds.production || [];
          if (!selectedProductions.every((p) => dsProd.includes(p))) return false;
        }
        if (selectedModalities.length > 0) {
          const dsMod = ds.modalities || [];
          if (!selectedModalities.every((m) => dsMod.includes(m))) return false;
        }
        return true;
      });
      return { ...cat, datasets: filteredDatasets };
    }).filter((cat) => cat.datasets.length > 0);
  }, [allCategories, searchTerm, selectedCapabilities, selectedProductions, selectedModalities]);

  const hasActiveFilters = searchTerm || selectedCapabilities.length > 0 || selectedProductions.length > 0 || selectedModalities.length > 0;
  const totalFiltered = filteredCategories.reduce((sum, cat) => sum + cat.datasets.length, 0);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCapabilities([]);
    setSelectedProductions([]);
    setSelectedModalities([]);
  };

  const toggleItem = (setter) => (val) => {
    setter((prev) => (prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]));
  };

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
  }, [filteredCategories]);

  const pillCls = (selected) =>
    `px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 cursor-pointer ${
      selected
        ? 'bg-brand-600 text-white border-brand-600 shadow-sm shadow-brand-500/20'
        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-600'
    }`;

  const dimLabel = 'text-xs font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mb-2 block';

  return (
    <section id="products" className="relative bg-page-bg dark:bg-page-bg-dark transition-colors">
      <div className="pt-24 pb-4 text-center">
        <span className="inline-block text-sm font-medium uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-1.5">
          {t('products.title')}
        </span>
      </div>

      {/* ── Filter bar ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
        <div className="rounded-2xl bg-white dark:bg-[#0d1a2d] border border-slate-200/80 dark:border-white/[0.07] p-5 space-y-4">

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('products.filter.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
            />
          </div>

          {/* Capabilities */}
          <div>
            <span className={dimLabel}>{t('products.filter.capabilities')}</span>
            <div className="flex flex-wrap gap-2">
              {filterOptions.capabilities.map((cap) => (
                <button key={cap} onClick={() => toggleItem(setSelectedCapabilities)(cap)} className={pillCls(selectedCapabilities.includes(cap))}>
                  {cap}
                </button>
              ))}
            </div>
          </div>

          {/* Production */}
          <div>
            <span className={dimLabel}>{t('products.filter.production')}</span>
            <div className="flex flex-wrap gap-2">
              {filterOptions.productions.map((prod) => (
                <button key={prod} onClick={() => toggleItem(setSelectedProductions)(prod)} className={pillCls(selectedProductions.includes(prod))}>
                  {prod}
                </button>
              ))}
            </div>
          </div>

          {/* Modalities */}
          <div>
            <span className={dimLabel}>{t('products.filter.modalities')}</span>
            <div className="flex flex-wrap gap-2">
              {filterOptions.modalities.map((mod) => {
                const meta = MODALITY_META[mod];
                const Icon = meta?.Icon;
                const selected = selectedModalities.includes(mod);
                return (
                  <button key={mod} onClick={() => toggleItem(setSelectedModalities)(mod)} className={pillCls(selected) + ' inline-flex items-center gap-1.5'}>
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    {meta?.label || mod}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary + clear */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {t('products.filter.matchCount', { count: totalFiltered })}
              </span>
              <button onClick={clearFilters} className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
                <X className="w-3 h-3" />
                {t('products.filter.clear')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Empty state ── */}
      {filteredCategories.length === 0 ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-slate-400 dark:text-slate-500 text-lg mb-4">
            {t('products.filter.empty')}
          </p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:from-brand-500 hover:to-brand-400 shadow-sm hover:shadow-brand-500/35 transition-all"
          >
            <X className="w-4 h-4" />
            {t('products.filter.clear')}
          </button>
        </div>
      ) : (
        /* ── Category list ── */
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6">
          {!isMobile && (
            <aside className="hidden lg:block w-56 shrink-0">
              <div className="sticky top-24 space-y-1.5" role="tablist" aria-label="Product categories">
                {filteredCategories.map((cat, idx) => (
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
                {filteredCategories.map((cat, idx) => (
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
              {filteredCategories.map((cat, idx) => (
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
                    onViewDetail={onViewDetail}
                    index={idx}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
