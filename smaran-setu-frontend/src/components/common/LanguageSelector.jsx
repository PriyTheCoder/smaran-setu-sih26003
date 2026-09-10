import { useLanguage } from "../../context/LanguageContext";
import { languages } from "../../locales";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-9999">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-lg outline-none cursor-pointer"
        aria-label="Select language"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName}
          </option>
        ))}
      </select>
    </div>
  );
}