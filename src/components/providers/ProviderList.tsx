import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, TrendingUp, Star, MapPin } from "lucide-react";
import { ProviderCard } from "./ProviderCard";
import { ProviderModal } from "./ProviderModal";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Provider, SERVICE_CATEGORIES } from "@/lib/constants";
import { providerApi } from "@/lib/api";
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

  // Fetch providers from API
  const { data: providers = [], isLoading, isError } = useQuery({
    queryKey: ["providers", selectedCategory, searchQuery],
    queryFn: () =>
      providerApi.getProviders({
        category: selectedCategory,
        search: searchQuery
      }).then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const filteredProviders = useMemo(() => {
    const result = [...providers];

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
  }, [providers, sortBy]);

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
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="h-20 w-20 bg-destructive/10 rounded-2xl flex items-center justify-center mb-4">
                <MapPin className="h-10 w-10 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t("Erreur de chargement", "خطأ في التحميل")}
              </h3>
              <p className="text-muted-foreground max-w-sm">
                {t("Impossible de charger les prestataires. Veuillez réessayer.", "تعذر تحميل المزودين. يرجى المحاولة مرة أخرى.")}
              </p>
            </motion.div>
          ) : filteredProviders.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            >
              {filteredProviders.map((provider, index) => (
                <motion.div
                  key={provider._id}
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
