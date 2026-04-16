import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme.js';
import logoUrl from '/logo.png';
import { useMediaQuery } from '../hooks/useMediaQuery.js';

const navItems = [
  { key: 'home', href: '#home' },
  { key: 'products', href: '#products' },
  { key: 'ai4ss', href: '#ai4ss' },
];

export function Navbar() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const toggleRef = useRef(null);
  const [activeHash, setActiveHash] = useState(window.location.hash || '#home');

  // Hysteresis: show after 60px, only hide when back below 10px
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible((prev) => {
        if (!prev && y > 60) return true;
        if (prev && y < 10) return false;
        return prev;
      });
      setAtTop(y < 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onHashChange = () => setActiveHash(window.location.hash || '#home');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

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

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    setActiveHash(href);
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    window.history.pushState(null, '', href);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          key="navbar"
          initial={{ y: -72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -72, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-brand-600/10 dark:border-slate-700/60 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl shadow-sm"
        >
          <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              className="flex items-center gap-2.5 group"
            >
              <img src={logoUrl} alt="EntropyOrder" className="h-7 w-auto transition-opacity group-hover:opacity-80" />
              <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 tracking-tight">
                熵基秩序
                <span className="hidden sm:inline text-slate-400 dark:text-slate-500 font-light"> · EntropyOrder</span>
              </span>
            </a>

            {!isMobile && (
              <div className="flex items-center gap-1">
                {navItems.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    aria-current={activeHash === item.href ? 'page' : undefined}
                    className={`relative px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      activeHash === item.href
                        ? 'text-brand-600 dark:text-brand-400'
                        : 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    {activeHash === item.href && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-lg bg-brand-50 dark:bg-brand-900/30"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative">{t(`nav.${item.key}`)}</span>
                  </a>
                ))}
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 text-sm font-medium rounded-lg text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  {t('nav.bench')}
                </a>
              </div>
            )}

            <div className="flex items-center gap-1">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {theme === 'dark'
                  ? <Sun className="w-4 h-4 text-slate-400" />
                  : <Moon className="w-4 h-4 text-slate-600" />}
              </button>
              <button
                onClick={toggleLang}
                aria-label="Toggle language"
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold text-slate-600 dark:text-slate-400 min-w-[36px]"
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
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {mobileOpen
                    ? <X className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                    : <Menu className="w-4 h-4 text-slate-700 dark:text-slate-300" />}
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
              className="border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 py-4"
            >
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    aria-current={activeHash === item.href ? 'page' : undefined}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeHash === item.href
                        ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {t(`nav.${item.key}`)}
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
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
