import { useTranslation } from 'react-i18next';
import { LANG_KEY } from '../i18n';

const LANGUAGES = [
  { code: 'de', label: 'DE', flag: '🇩🇪' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language;

  function switchTo(code: string) {
    i18n.changeLanguage(code);
    localStorage.setItem(LANG_KEY, code);
  }

  return (
    <div className="flex shrink-0 overflow-hidden rounded-lg border border-gray-300">
      {LANGUAGES.map((lang, idx) => (
        <button
          key={lang.code}
          onClick={() => switchTo(lang.code)}
          className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
            idx > 0 ? 'border-l border-gray-300' : ''
          } ${
            current === lang.code
              ? 'bg-gray-900 text-white'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
          }`}
        >
          <span>{lang.flag}</span>
          <span>{lang.label}</span>
        </button>
      ))}
    </div>
  );
}
