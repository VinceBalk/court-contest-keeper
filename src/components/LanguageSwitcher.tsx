
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useT } from "@/contexts/TranslationContext";
import { Language } from "@/hooks/useTranslations";

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useT();

  // Custom trigger for mobile (flags only)
  const MobileTrigger = () => (
    <div className="flex items-center justify-center w-8 h-8 rounded border bg-background hover:bg-accent">
      <span className="text-lg">
        {language === 'nl' ? '🇳🇱' : '🇺🇸'}
      </span>
    </div>
  );

  // Desktop version with globe icon and text
  const DesktopTrigger = () => (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-gray-600" />
      <span className="text-sm">
        {language === 'nl' ? '🇳🇱 Nederlands' : '🇺🇸 English'}
      </span>
    </div>
  );

  return (
    <div className="relative">
      {/* Mobile version - flags only */}
      <div className="sm:hidden">
        <Select value={language} onValueChange={(value: Language) => changeLanguage(value)}>
          <SelectTrigger className="w-8 h-8 p-0 border-0 bg-transparent hover:bg-accent">
            <MobileTrigger />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nl">🇳🇱 Nederlands</SelectItem>
            <SelectItem value="en">🇺🇸 English</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop version - with text */}
      <div className="hidden sm:block">
        <Select value={language} onValueChange={(value: Language) => changeLanguage(value)}>
          <SelectTrigger className="w-40">
            <SelectValue>
              <DesktopTrigger />
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nl">🇳🇱 Nederlands</SelectItem>
            <SelectItem value="en">🇺🇸 English</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
