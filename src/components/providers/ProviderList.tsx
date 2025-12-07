import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, TrendingUp, Star, MapPin } from "lucide-react";
import { ProviderCard } from "./ProviderCard";
import { ProviderModal } from "./ProviderModal";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { PROVIDERS, Provider, SERVICE_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ProviderListProps {
  searchQuery: string;
  selectedCategory: string | null;
}

type SortOption = "rating" | "reviews" | "availability";

export function ProviderList({ searchQuery, selectedCategory }: ProviderListProps) {
  const { t, language } = useLanguage();
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  const filteredProviders = useMemo(() => {
    let result = [...PROVIDERS];

    // Filter by category
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.services.some((s) => s.toLowerCase().includes(query)) ||
          p.location.toLowerCase().includes(query) ||
          SERVICE_CATEGORIES.find((c) => c.id === p.category)?.name.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "availability":
        result.sort((a, b) => (a.isAvailable === b.isAvailable ? 0 : a.isAvailable ? -1 : 1));
        break;
    }

    // Premium first
    result.sort((a, b) => (a.isPremium === b.isPremium ? 0 : a.isPremium ? -1 : 1));

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  const sortOptions: { id: SortOption; label: string; icon: typeof Star }[] = [
    { id: "rating", label: t("Note", "التقييم"), icon: Star },
    { id: "reviews", label: t("Avis", "التعليقات"), icon: TrendingUp },
    { id: "availability", label: t("Dispo.", "متاح"), icon: MapPin },
  ];

  const getCategoryName = () => {
    if (!selectedCategory) return t("Tous les prestataires", "جميع مزودي الخدمات");
    const category = SERVICE_CATEGORIES.find((c) => c.id === selectedCategory);
    return language === "fr" ? category?.name : category?.nameAr;
  };

  return (
    <section className="py-8 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              {getCategoryName()}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredProviders.length} {t("prestataires trouvés", "مزود خدمة")}
            </p>
          </div>

          {/* Sort options */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <div className="flex bg-muted rounded-lg p-1">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                    sortBy === option.id
                      ? "bg-card text-foreground shadow-soft"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <option.icon className="h-3.5 w-3.5" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Provider grid */}
        <AnimatePresence mode="popLayout">
          {filteredProviders.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            >
              {filteredProviders.map((provider, index) => (
                <motion.div
                  key={provider.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProviderCard
                    provider={provider}
                    onViewDetails={setSelectedProvider}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="h-20 w-20 bg-muted rounded-2xl flex items-center justify-center mb-4">
                <MapPin className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t("Aucun prestataire trouvé", "لم يتم العثور على مزودين")}
              </h3>
              <p className="text-muted-foreground max-w-sm">
                {t(
                  "Essayez de modifier vos critères de recherche ou explorez d'autres catégories.",
                  "حاول تعديل معايير البحث أو استكشف فئات أخرى."
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Provider Modal */}
        <ProviderModal
          provider={selectedProvider}
          onClose={() => setSelectedProvider(null)}
        />
      </div>
    </section>
  );
}
