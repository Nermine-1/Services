import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, MapPin, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Provider } from "@/lib/constants";
import { providerApi } from "@/lib/api";
import { cn } from "@/lib/utils";

interface FeaturedProvidersProps {
  onViewDetails: (provider: Provider) => void;
}

export function FeaturedProviders({ onViewDetails }: FeaturedProvidersProps) {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Fetch featured providers from API
  const { data: premiumProviders = [] } = useQuery({
    queryKey: ["featured-providers"],
    queryFn: () => providerApi.getFeaturedProviders().then(res => res.data),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 320;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-10 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                {t("Prestataires vedettes", "مزودون مميزون")}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {t("Les plus recommandés", "الأكثر توصية")}
            </h2>
          </div>

          {/* Navigation arrows */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-4 px-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {premiumProviders.map((provider, index) => (
            <motion.div
              key={provider._id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onViewDetails(provider)}
              className="flex-shrink-0 w-[280px] snap-start cursor-pointer group"
            >
              <div className="relative h-[360px] rounded-2xl overflow-hidden shadow-card">
                <img
                  src={provider.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"}
                  alt={provider.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-overlay" />

                {/* Premium badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-md">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-xl font-bold text-white mb-1">{provider.name}</h3>
                  <p className="flex items-center gap-1 text-white/80 text-sm mb-3">
                    <MapPin className="h-3 w-3" />
                    {provider.location}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-md">
                      <Star className="h-4 w-4 fill-current text-amber-400" />
                      <span className="font-semibold">{provider.rating}</span>
                      <span className="text-xs opacity-80">({provider.reviewCount})</span>
                    </div>
                    <span className="text-white font-medium">{provider.priceRange}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
