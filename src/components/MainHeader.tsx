
import { Trophy, LogOut } from "lucide-react";
import { useT } from "@/contexts/TranslationContext";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { Tournament } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MainHeaderProps {
  activeTournament: Tournament | null;
}

const MainHeader = ({ activeTournament }: MainHeaderProps) => {
  const { t } = useT();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <header className="mb-8 text-center">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <Trophy className="h-10 w-10 text-yellow-500" />
          <h1 className="text-4xl font-bold text-gray-800">{t('header.title')}</h1>
        </div>
        <div className="flex-1 flex justify-end items-center gap-2">
          <LanguageSwitcher />
          {user && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="hidden sm:flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          )}
          {user && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="sm:hidden p-2"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
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
