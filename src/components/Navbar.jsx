import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from '../hooks/useTheme.js';
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

  const toggleLang = () => {
    const next = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(next);
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-brand-600/15 dark:border-brand-500/20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center gap-2">
          <img src="/logo.png" alt="EntropyOrder" className="h-8 w-auto" />
          <span className="font-semibold text-slate-800 dark:text-slate-50">熵基秩序 · EntropyOrder</span>
        </a>

        {!isMobile && (
          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <a key={item.key} href={item.href} onClick={(e) => handleNavClick(e, item.href)} className="text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 transition-colors">
                {t(`nav.${item.key}`)}
              </a>
            ))}
            <a href="#" target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 transition-colors">
              {t('nav.bench')}
            </a>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} aria-label="Toggle theme" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            {theme === 'dark' ? <Sun className="w-5 h-5 text-slate-50" /> : <Moon className="w-5 h-5 text-slate-800" />}
          </button>
          <button onClick={toggleLang} aria-label="Toggle language" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <Globe className="w-5 h-5 text-slate-800 dark:text-slate-50" />
          </button>
          {isMobile && (
            <button onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
              {mobileOpen ? <X className="w-5 h-5 text-slate-800 dark:text-slate-50" /> : <Menu className="w-5 h-5 text-slate-800 dark:text-slate-50" />}
            </button>
          )}
        </div>
      </div>

      {isMobile && mobileOpen && (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-4">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <a key={item.key} href={item.href} onClick={(e) => handleNavClick(e, item.href)} className="text-base font-medium text-slate-700 dark:text-slate-200">
                {t(`nav.${item.key}`)}
              </a>
            ))}
            <a href="#" target="_blank" rel="noreferrer" className="text-base font-medium text-slate-700 dark:text-slate-200">
              {t('nav.bench')}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
