import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Moon, Sun, Globe, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export function Header({ onSearch, searchQuery }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
              <span className="text-xl font-bold text-white">S</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">Serveeny</h1>
              <p className="text-xs text-muted-foreground">{t("Votre service, votre besoin", "خدمات منزلية")}</p>
            </div>
          </motion.div>

          {/* Search Bar - Desktop */}
          {onSearch && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "hidden md:flex flex-1 max-w-xl mx-4 relative",
                isSearchFocused && "z-50"
              )}
            >
              <div
                className={cn(
                  "relative w-full transition-all duration-300",
                  isSearchFocused && "scale-[1.02]"
                )}
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t("Rechercher un service ou prestataire...", "ابحث عن خدمة أو مزود...")}
                  value={searchQuery || ""}
                  onChange={(e) => onSearch(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={cn(
                    "w-full h-12 pl-12 pr-4 rounded-xl bg-muted/50 border-2 border-transparent",
                    "text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:border-primary/50 focus:bg-background",
                    "transition-all duration-300"
                  )}
                />
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLanguage(language === "fr" ? "ar" : "fr")}
              className="hidden sm:flex"
            >
              <Globe className="h-5 w-5" />
              <span className="sr-only">Toggle language</span>
            </Button>

            {/* Provider Actions */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/provider-login'}
                className="text-sm"
              >
                {t("Se connecter", "دخول")}
              </Button>
              <Button
                size="sm"
                onClick={() => window.location.href = '/provider-registration'}
                className="text-sm"
              >
                {t("Devenir prestataire", "كن مزود خدمة")}
              </Button>
            </div>

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "light" ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {onSearch && (
          <div className="mt-3 md:hidden">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("Rechercher...", "ابحث...")}
                value={searchQuery || ""}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full h-11 pl-12 pr-4 rounded-xl bg-muted/50 border-2 border-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border/50 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setLanguage(language === "fr" ? "ar" : "fr");
                  setMobileMenuOpen(false);
                }}
              >
                <Globe className="h-5 w-5 mr-2" />
                {language === "fr" ? "العربية" : "Français"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
