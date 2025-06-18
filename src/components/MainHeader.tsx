
import { Tournament } from "@/pages/Index";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/contexts/TranslationContext";

interface MainHeaderProps {
  activeTournament: Tournament | null;
}

const MainHeader = ({ activeTournament }: MainHeaderProps) => {
  const { t } = useT();

  return (
    <header className="text-center mb-4 sm:mb-6 lg:mb-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
        {t('header.title')}
      </h1>
      <p className="text-sm sm:text-base text-gray-600 mb-3">
        {t('header.subtitle')}
      </p>
      {activeTournament && (
        <div className="flex justify-center">
          <Badge 
            variant="secondary" 
            className="bg-green-100 text-green-800 border border-green-200 px-3 py-1 text-xs sm:text-sm"
          >
            Active: {activeTournament.name}
          </Badge>
        </div>
      )}
    </header>
  );
};

export default MainHeader;
