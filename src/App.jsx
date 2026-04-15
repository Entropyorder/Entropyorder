import { useTranslation } from 'react-i18next';
import { useTheme } from './hooks/useTheme.js';

function App() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-50 transition-colors">
      <h1 className="text-2xl font-bold">{t('hero.slogan')}</h1>
      <p>Current theme: {theme}</p>
      <div className="flex gap-2">
        <button onClick={toggleTheme} className="px-4 py-2 rounded bg-brand-600 text-white">Toggle Theme</button>
        <button onClick={() => i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')} className="px-4 py-2 rounded bg-slate-600 text-white">Toggle Lang</button>
      </div>
    </div>
  );
}
export default App;
