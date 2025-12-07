import { motion } from "framer-motion";
import { Home, Grid3X3, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFavorites } from "@/contexts/FavoritesContext";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { t } = useLanguage();
  const { favorites } = useFavorites();

  const tabs = [
    { id: "home", icon: Home, label: t("Accueil", "الرئيسية") },
    { id: "categories", icon: Grid3X3, label: t("Catégories", "الفئات") },
    { id: "favorites", icon: Heart, label: t("Favoris", "المفضلة"), badge: favorites.length },
    { id: "profile", icon: User, label: t("Profil", "الملف") },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass border-t border-border/50">
        <div className="flex items-center justify-around py-2 px-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "relative flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-200",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <div className="relative">
                  <tab.icon className={cn("h-6 w-6", isActive && "stroke-[2.5px]")} />
                  {tab.badge && tab.badge > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                      {tab.badge > 9 ? "9+" : tab.badge}
                    </span>
                  )}
                </div>
                <span className={cn("text-xs mt-1 font-medium", isActive && "font-semibold")}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {/* Safe area spacer for iOS */}
      <div className="h-safe-area-inset-bottom bg-background" />
    </nav>
  );
}
