import { motion } from "framer-motion";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface CategoryGridProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export function CategoryGrid({ selectedCategory, onCategorySelect }: CategoryGridProps) {
  const { t, language } = useLanguage();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {t("Our Services", "Nos services", "خدماتنا")}
            </h2>
            <p className="text-muted-foreground mt-1">
              {t("Choose a category", "Choisissez une catégorie", "اختر فئة")}
            </p>
          </div>
          {selectedCategory && (
            <button
              onClick={() => onCategorySelect(null)}
              className="text-sm text-primary font-medium hover:underline"
            >
              {t("View all", "Voir tout", "عرض الكل")}
            </button>
          )}
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4"
        >
          {SERVICE_CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;

            return (
              <motion.button
                key={category.id}
                variants={item}
                onClick={() => onCategorySelect(isSelected ? null : category.id)}
                className={cn(
                  "group flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl border-2 transition-all duration-300",
                  isSelected
                    ? "border-primary bg-primary/10 shadow-card"
                    : "border-border/50 bg-card hover:border-primary/30 hover:shadow-soft"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={cn(
                    "w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 bg-gradient-to-br",
                    category.color,
                    isSelected ? "shadow-glow scale-110" : "group-hover:scale-105"
                  )}
                >
                  <Icon className="h-6 w-6 md:h-7 md:w-7 text-white" />
                </div>
                <span
                  className={cn(
                    "text-xs md:text-sm font-medium text-center transition-colors",
                    isSelected ? "text-primary" : "text-foreground"
                  )}
                >
                  {language === "en" ? category.nameEn || category.name : language === "fr" ? category.name : category.nameAr}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
