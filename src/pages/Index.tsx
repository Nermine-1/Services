import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProviders } from "@/components/home/FeaturedProviders";
import { ProviderList } from "@/components/providers/ProviderList";
import { ProviderModal } from "@/components/providers/ProviderModal";
import { Provider, PROVIDERS } from "@/lib/constants";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, User, Settings } from "lucide-react";
import { ProviderCard } from "@/components/providers/ProviderCard";

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("home");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const { favorites } = useFavorites();
  const { t } = useLanguage();
  const resultsRef = useRef<HTMLDivElement>(null);

  const favoriteProviders = PROVIDERS.filter((p) => favorites.includes(p.id));

  useEffect(() => {
    if (searchQuery && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Reset category filter when searching
      setSelectedCategory(null);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (selectedCategory && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedCategory]);

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    if (category) {
      setSearchQuery(""); // Clear search to ensure we see category results
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <>
            <HeroSection />
            <CategoryGrid
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
            <FeaturedProviders onViewDetails={setSelectedProvider} />
            <div ref={resultsRef} className="scroll-mt-24">
              <ProviderList searchQuery={searchQuery} selectedCategory={selectedCategory} />
            </div>
          </>
        );

      case "categories":
        return (
          <div className="pt-4">
            <CategoryGrid
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
            <div ref={resultsRef} className="scroll-mt-24">
              <ProviderList searchQuery={searchQuery} selectedCategory={selectedCategory} />
            </div>
          </div>
        );

      case "favorites":
        return (
          <div className="container mx-auto px-4 py-8 pb-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {t("Mes favoris", "المفضلة")}
                </h1>
                <p className="text-muted-foreground">
                  {favoriteProviders.length} {t("prestataires sauvegardés", "مزود محفوظ")}
                </p>
              </div>
            </div>

            {favoriteProviders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteProviders.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    onViewDetails={setSelectedProvider}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-20 w-20 bg-muted rounded-2xl flex items-center justify-center mb-4">
                  <Heart className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("Aucun favori", "لا يوجد مفضلات")}
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  {t(
                    "Ajoutez des prestataires à vos favoris pour les retrouver facilement.",
                    "أضف مزودي خدمات إلى المفضلة للعثور عليهم بسهولة."
                  )}
                </p>
              </div>
            )}
          </div>
        );

      case "profile":
        return (
          <div className="container mx-auto px-4 py-8 pb-24">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-16 w-16 bg-gradient-hero rounded-2xl flex items-center justify-center shadow-glow">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {t("Mon profil", "ملفي الشخصي")}
                </h1>
                <p className="text-muted-foreground">
                  {t("Gérez votre compte", "إدارة حسابك")}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {t("Paramètres", "الإعدادات")}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {t(
                    "Connectez-vous pour accéder à toutes les fonctionnalités.",
                    "سجّل الدخول للوصول إلى جميع الميزات."
                  )}
                </p>
              </div>

              <div className="bg-gradient-card rounded-2xl border border-primary/20 p-6">
                <h2 className="font-semibold text-foreground mb-2">
                  {t("Devenez prestataire", "كن مزود خدمة")}
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                  {t(
                    "Rejoignez notre réseau et développez votre activité.",
                    "انضم إلى شبكتنا وطوّر نشاطك."
                  )}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('/provider-registration')}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex-1"
                  >
                    {t("S'inscrire", "التسجيل")}
                  </button>
                  <button
                    onClick={() => navigate('/provider-login')}
                    className="border border-primary text-primary px-4 py-2 rounded-lg font-medium hover:bg-primary/10 transition-colors flex-1"
                  >
                    {t("Se connecter", "دخول")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />

      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <ProviderModal provider={selectedProvider} onClose={() => setSelectedProvider(null)} />
    </div>
  );
};

export default Index;
