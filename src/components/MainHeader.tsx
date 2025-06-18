
import { Tournament } from "@/pages/Index";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useT } from "@/contexts/TranslationContext";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { Link } from "react-router-dom";
import { LogIn, LogOut } from "lucide-react";

interface MainHeaderProps {
  activeTournament: Tournament | null;
}

const MainHeader = ({ activeTournament }: MainHeaderProps) => {
  const { t } = useT();
  const { user, signOut } = useAuth();

  return (
    <header className="text-center mb-4 sm:mb-6 lg:mb-8">
      {/* Top bar with language switcher and auth */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {user ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={signOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Main title section */}
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
