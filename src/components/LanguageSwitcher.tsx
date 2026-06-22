import { useTranslation } from 'react-i18next';
import { LANG_KEY } from '../i18n';

const LANGUAGES = [
  { code: 'de', label: 'DE' },
  { code: 'en', label: 'EN' },
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
          className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
            idx > 0 ? 'border-l border-gray-300' : ''
          } ${
            current === lang.code
              ? 'bg-gray-900 text-white'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
