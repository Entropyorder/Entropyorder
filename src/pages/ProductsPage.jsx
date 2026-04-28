import { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { ProductCategory } from '../components/ProductCategory.jsx';
import { ExpertArtifact } from '../components/Artifacts/ExpertArtifact.jsx';
import { MultimodalArtifact } from '../components/Artifacts/MultimodalArtifact.jsx';
import { AgentArtifact } from '../components/Artifacts/AgentArtifact.jsx';
import { DATASET_CATEGORIES } from '../data/datasets.js';
import { Search, X, FileText, Image, Video, AudioLines, Filter } from 'lucide-react';

const ARTIFACTS = { ExpertArtifact, MultimodalArtifact, AgentArtifact };

const MODALITY_META = {
  text: { Icon: FileText },
  image: { Icon: Image },
  video: { Icon: Video },
  audio: { Icon: AudioLines },
};

export function ProductsPage() {
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
        (ds.tags || []).forEach((tag) => capabilities.add(tag));
        (ds.production || []).forEach((p) => productions.add(p));
        (ds.modalities || []).forEach((m) => modalities.add(m));
      });
    });
    return {
      capabilities: Array.from(capabilities),
      productions: Array.from(productions),
      modalities: Array.from(modalities),
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
  const totalDatasets = allCategories.reduce((sum, cat) => sum + cat.datasets.length, 0);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCapabilities([]);
    setSelectedProductions([]);
    setSelectedModalities([]);
  };

  const toggleItem = (setter) => (value) => {
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const scrollToCategory = (index) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveTab(index);
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
    const currentRefs = sectionRefs.current;
    currentRefs.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [filteredCategories]);

  const pillCls = (selected) =>
    `px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 cursor-pointer ${
      selected
        ? 'bg-brand-600 text-white border-brand-600 shadow-sm shadow-brand-500/20'
        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-600'
    }`;

  const dimLabel = 'text-xs font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mb-2 block';

  const getModalityLabel = (modality) => {
    switch (modality) {
      case 'text': return t('products.filter.modalitiesText');
      case 'image': return t('products.filter.modalitiesImage');
      case 'video': return t('products.filter.modalitiesVideo');
      case 'audio': return t('products.filter.modalitiesAudio');
      default: return modality;
    }
  };

  const renderActiveTagCloud = () => {
    const allSelected = [
      ...selectedCapabilities.map((c) => ({ type: 'capability', value: c })),
      ...selectedProductions.map((p) => ({ type: 'production', value: p })),
      ...selectedModalities.map((m) => ({ type: 'modality', value: m })),
    ];

    if (searchTerm) {
      allSelected.unshift({ type: 'search', value: searchTerm });
    }

    if (allSelected.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Filter className="w-3 h-3" /> {t('products.filter.activeFilters')}:
        </span>
        {allSelected.map((item, idx) => {
          const isSearch = item.type === 'search';
          const label = item.type === 'modality' ? getModalityLabel(item.value) : item.value;
          return (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            >
              {isSearch && <Search className="w-3 h-3" />}
              <span className="max-w-[120px] truncate">{label}</span>
              <button
                onClick={() => {
                  if (item.type === 'search') setSearchTerm('');
                  else if (item.type === 'capability') toggleItem(setSelectedCapabilities)(item.value);
                  else if (item.type === 'production') toggleItem(setSelectedProductions)(item.value);
                  else if (item.type === 'modality') toggleItem(setSelectedModalities)(item.value);
                }}
                className="ml-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          );
        })}
        <button
          onClick={clearFilters}
          className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 underline"
        >
          {t('products.filter.clearAll')}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-page-bg dark:bg-page-bg-dark transition-colors pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
              {t('products.pageTitle')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {t('products.pageSubtitle', { count: totalDatasets })}
            </p>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {t('products.totalCount')}: <span className="font-semibold text-slate-700 dark:text-slate-300">{totalDatasets}</span>
          </div>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
        <div className="rounded-2xl bg-white dark:bg-[#0d1a2d] border border-slate-200/80 dark:border-white/[0.07] p-5 space-y-5">
          {/* Search + Tag Cloud Row */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('products.filter.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
              />
            </div>
            <div className="flex-1 min-w-0">
              {renderActiveTagCloud()}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 dark:border-slate-800" />

          {/* Capabilities */}
          <div className="relative pl-3">
            <div className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-blue-500" />
            <span className={dimLabel}>{t('products.filter.capabilities')}</span>
            <div className="flex flex-wrap gap-2">
              {filterOptions.capabilities.map((cap) => (
                <button
                  key={cap}
                  onClick={() => toggleItem(setSelectedCapabilities)(cap)}
                  className={pillCls(selectedCapabilities.includes(cap))}
                >
                  {cap}
                </button>
              ))}
            </div>
          </div>

          {/* Production */}
          <div className="relative pl-3">
            <div className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-cyan-500" />
            <span className={dimLabel}>{t('products.filter.production')}</span>
            <div className="flex flex-wrap gap-2">
              {filterOptions.productions.map((prod) => (
                <button
                  key={prod}
                  onClick={() => toggleItem(setSelectedProductions)(prod)}
                  className={pillCls(selectedProductions.includes(prod))}
                >
                  {prod}
                </button>
              ))}
            </div>
          </div>

          {/* Modalities */}
          <div className="relative pl-3">
            <div className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-violet-500" />
            <span className={dimLabel}>{t('products.filter.modalities')}</span>
            <div className="flex flex-wrap gap-2">
              {filterOptions.modalities.map((mod) => {
                const meta = MODALITY_META[mod];
                const Icon = meta?.Icon;
                const selected = selectedModalities.includes(mod);
                return (
                  <button
                    key={mod}
                    onClick={() => toggleItem(setSelectedModalities)(mod)}
                    className={`${pillCls(selected)} inline-flex items-center gap-1.5`}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    {getModalityLabel(mod)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {t('products.filter.matchCount', { count: totalFiltered })}
              </span>
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
            {t('products.filter.clearAll')}
          </button>
        </div>
      ) : (
        /* ── Category list ── */
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6 pb-16">
          {!isMobile && (
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 space-y-1.5" role="tablist" aria-label="Product categories">
                {filteredCategories.map((cat, index) => (
                  <button
                    key={cat.key}
                    role="tab"
                    aria-selected={activeTab === index}
                    aria-controls={`product-panel-${index}`}
                    onClick={() => scrollToCategory(index)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-200 flex items-center justify-between ${
                      activeTab === index
                        ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-sm shadow-brand-500/20'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{cat.title}</span>
                    <span className={`text-xs ${activeTab === index ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'}`}>
                      {cat.datasets.length}
                    </span>
                  </button>
                ))}
              </div>
            </aside>
          )}

          <div className="flex-1">
            {isMobile && (
              <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide" role="tablist" aria-label="Product categories">
                {filteredCategories.map((cat, index) => (
                  <button
                    key={cat.key}
                    role="tab"
                    aria-selected={activeTab === index}
                    aria-controls={`product-panel-${index}`}
                    onClick={() => scrollToCategory(index)}
                    className={`shrink-0 px-4 py-2 rounded-full text-base font-medium transition-all duration-200 flex items-center gap-1 ${
                      activeTab === index
                        ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {cat.title}
                    <span className={`text-xs ${activeTab === index ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'}`}>
                      {cat.datasets.length}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-6">
              {filteredCategories.map((cat, index) => (
                <div
                  key={cat.key}
                  id={`product-panel-${index}`}
                  ref={(el) => { sectionRefs.current[index] = el; }}
                  role="tabpanel"
                  aria-labelledby={`product-tab-${index}`}
                >
                  <ProductCategory
                    title={cat.title}
                    artifact={cat.artifact}
                    datasets={cat.datasets}
                    direction={index % 2 === 0 ? 'left' : 'right'}
                    onViewDetail={onViewDetail}
                    index={index}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
