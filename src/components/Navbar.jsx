import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme.js';
import { spring } from '../animations/tokens.js';
import logoUrl from '/logo.png';
import { useMediaQuery } from '../hooks/useMediaQuery.js';

export function Navbar({ activeTab, onTabChange, sectionIds }) {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollY, setScrollY] = useState(window.scrollY);
  const [visibleSection, setVisibleSection] = useState('home');
  const toggleRef = useRef(null);

  const navItems = [
    { key: 'home', tab: 'home', label: t('nav.home') },
    { key: 'products', tab: 'home', label: t('nav.products') },
    { key: 'blog', tab: 'blog', label: t('nav.blog') },
    { key: 'ai4ss', tab: 'ai4ss', label: t('nav.ai4ss') },
  ];

  const isScrolled = scrollY > 80;

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (activeTab !== 'home') {
      setVisibleSection(null);
      return;
    }
    const ids = sectionIds || ['home', 'products'];
    const observer = new IntersectionObserver(
      (entries) => {
        let best = null;
        let bestRatio = 0;
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            best = entry.target.id;
          }
        });
        if (best) setVisibleSection(best);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.1, 0.2, 0.3, 0.5] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [activeTab, sectionIds]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && mobileOpen) setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
      toggleRef.current?.focus();
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [mobileOpen]);

  const toggleLang = () => {
    const next = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(next);
  };

  const isActive = (item) => {
    if (item.tab !== 'home') return activeTab === item.tab;
    if (activeTab !== 'home') return false;
    return visibleSection === item.key;
  };

  const handleNavClick = (e, item) => {
    e.preventDefault();
    setMobileOpen(false);
    if (item.tab !== 'home') {
      onTabChange(item.tab);
      return;
    }
    onTabChange('home');
    const target = document.getElementById(item.key);
    if (target) {
      const navbarH = 64;
      const y = target.getBoundingClientRect().top + window.scrollY - navbarH;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const isLightNotScrolled = !isScrolled && theme !== 'dark';

  const navBg = isScrolled
    ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm border-b border-brand-600/10 dark:border-slate-700/60'
    : theme === 'dark'
    ? 'bg-transparent border-b border-transparent'
    : 'bg-white/70 backdrop-blur-xl border-b border-slate-200/40';

  const textColor = isScrolled
    ? ''
    : theme === 'dark'
    ? 'text-white dark:text-white'
    : '';

  const logoTextColor = isScrolled
    ? 'text-slate-700 dark:text-slate-200'
    : theme === 'dark'
    ? 'text-white'
    : 'text-slate-800';

  const navTextBase = isScrolled
    ? 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
    : theme === 'dark'
    ? 'text-white/80 hover:text-white dark:text-white/80 dark:hover:text-white'
    : 'text-slate-600 hover:text-slate-800';

  const activeTextCls = isScrolled
    ? 'text-brand-600 dark:text-brand-400'
    : theme === 'dark'
    ? 'text-white dark:text-white'
    : 'text-brand-600';

  const activeBgCls = isScrolled
    ? 'bg-brand-50 dark:bg-brand-900/30'
    : theme === 'dark'
    ? 'bg-white/15 dark:bg-white/15'
    : 'bg-brand-50';

  const iconColor = isScrolled ? undefined : isLightNotScrolled ? 'text-slate-600' : 'text-white';

  const langBtnCls = isScrolled
    ? 'text-xs font-semibold text-slate-600 dark:text-slate-400 min-w-[36px]'
    : theme === 'dark'
    ? 'text-xs font-semibold text-white/90 dark:text-white/90 min-w-[36px]'
    : 'text-xs font-semibold text-slate-600 min-w-[36px]';

  const themeBtnHover = isScrolled
    ? 'hover:bg-slate-100 dark:hover:bg-slate-800'
    : theme === 'dark'
    ? 'hover:bg-white/15 dark:hover:bg-white/15'
    : 'hover:bg-slate-100';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${navBg}`}>
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, navItems[0])}
          className="flex items-center gap-2.5 group"
        >
          <img src={logoUrl} alt="EntropyOrder" className="h-7 w-auto transition-opacity group-hover:opacity-80" />
          <span className={`font-semibold text-sm ${logoTextColor} tracking-tight`}>
            熵基秩序
            <span className={`hidden sm:inline ${isScrolled ? 'text-slate-400 dark:text-slate-500' : theme === 'dark' ? 'text-white/60 dark:text-white/60' : 'text-slate-400'} font-light`}> · EntropyOrder</span>
          </span>
        </a>

        {!isMobile && (
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={`#${item.key}`}
                onClick={(e) => handleNavClick(e, item)}
                aria-current={isActive(item) ? 'page' : undefined}
                className={`relative px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item)
                    ? `${activeTextCls}`
                    : navTextBase
                }`}
              >
                {isActive(item) && (
                  <motion.span
                    layoutId="nav-indicator"
                    className={`absolute inset-0 rounded-lg ${activeBgCls}`}
                    transition={{ type: 'spring', ...spring.heavy }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </a>
            ))}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className={`px-3 py-1.5 text-sm font-medium rounded-lg ${navTextBase} transition-colors`}
            >
              {t('nav.bench')}
            </a>
          </div>
        )}

        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`p-2 rounded-lg ${themeBtnHover} transition-colors`}
          >
            {theme === 'dark'
              ? <Sun className={`w-4 h-4 ${isScrolled ? 'text-slate-400' : 'text-white/80'}`} />
              : <Moon className={`w-4 h-4 ${isScrolled ? 'text-slate-600' : isLightNotScrolled ? 'text-slate-600' : 'text-white/80'}`} />}
          </button>
          <button
            onClick={toggleLang}
            aria-label="Toggle language"
            className={`p-2 rounded-lg ${themeBtnHover} transition-colors ${langBtnCls}`}
          >
            {i18n.language === 'zh' ? 'EN' : '中'}
          </button>
          {isMobile && (
            <button
              ref={toggleRef}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className={`p-2 rounded-lg ${themeBtnHover} transition-colors`}
            >
              {mobileOpen
                ? <X className={`w-4 h-4 ${isScrolled ? 'text-slate-700 dark:text-slate-300' : theme === 'dark' ? 'text-white' : 'text-slate-700'}`} />
                : <Menu className={`w-4 h-4 ${isScrolled ? 'text-slate-700 dark:text-slate-300' : theme === 'dark' ? 'text-white' : 'text-slate-700'}`} />}
            </button>
          )}
        </div>
      </div>

      {isMobile && mobileOpen && (
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={`border-t ${isLightNotScrolled ? 'border-slate-200 bg-white/95' : 'border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95'} backdrop-blur-xl px-4 py-4`}
        >
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={`#${item.key}`}
                onClick={(e) => handleNavClick(e, item)}
                aria-current={isActive(item) ? 'page' : undefined}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item)
                    ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              {t('nav.bench')}
            </a>
          </div>
        </motion.div>
      )}
    </nav>
  );
}