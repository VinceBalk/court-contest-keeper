
import { Trophy, LogIn, LogOut, User, Shield } from "lucide-react";
import { useT } from "@/contexts/TranslationContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";
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
  const { userProfile, userRoles } = useRole();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="mb-6 sm:mb-8 text-center">
      <div className="flex items-center justify-between mb-2 sm:mb-4 gap-2">
        <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
          {user ? (
            <>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <User className="h-3 w-3" />
                  <span className="hidden sm:inline">{user.email}</span>
                  <span className="sm:hidden">{userProfile?.username || user.email?.split('@')[0]}</span>
                </Badge>
                {userRoles.length > 0 && (
                  <Badge variant="outline" className="flex items-center gap-1 text-xs">
                    <Shield className="h-3 w-3" />
                    {userRoles.join(', ')}
                  </Badge>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-1 text-xs sm:text-sm"
              >
                <LogOut className="h-3 w-3" />
                Sign Out
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs sm:text-sm">
                <LogIn className="h-3 w-3" />
                Login
              </Button>
            </Link>
          )}
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-500" />
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">{t('header.title')}</h1>
        </div>
        
        <div className="flex-1 flex justify-end items-center gap-2">
          <LanguageSwitcher />
        </div>
      </div>
      
      <p className="text-sm sm:text-lg text-gray-600">{t('header.subtitle')}</p>
      
      {activeTournament && (
        <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-100 rounded-lg">
          <p className="text-blue-800 font-medium text-sm sm:text-base">
            {t('tournament.activeDescription')} {activeTournament.name}
          </p>
        </div>
      )}
    </header>
  );
};

export default MainHeader;
