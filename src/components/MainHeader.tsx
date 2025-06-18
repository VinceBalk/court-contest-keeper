
import { Trophy, LogIn, LogOut, User } from "lucide-react";
import { useT } from "@/contexts/TranslationContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { Tournament } from "@/pages/Index";

interface MainHeaderProps {
  activeTournament: Tournament | null;
}

const MainHeader = ({ activeTournament }: MainHeaderProps) => {
  const { t } = useT();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="mb-8 text-center">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          {user ? (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {user.email}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-1"
              >
                <LogOut className="h-3 w-3" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <LogIn className="h-3 w-3" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Trophy className="h-10 w-10 text-yellow-500" />
          <h1 className="text-4xl font-bold text-gray-800">{t('header.title')}</h1>
        </div>
        <div className="flex-1 flex justify-end items-center gap-2">
          <LanguageSwitcher />
        </div>
      </div>
      <p className="text-lg text-gray-600">{t('header.subtitle')}</p>
      {activeTournament && (
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-blue-800 font-medium">{t('tournament.activeDescription')} {activeTournament.name}</p>
        </div>
      )}
    </header>
  );
};

export default MainHeader;
