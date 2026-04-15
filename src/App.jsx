import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">{t('hero.slogan')}</h1>
      <p>{t('hero.subtitle')}</p>
      <button
        onClick={() => i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')}
        className="px-4 py-2 rounded bg-brand-600 text-white"
      >
        Toggle Language
      </button>
    </div>
  );
}
export default App;