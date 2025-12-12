import { motion } from "framer-motion";
import { Star, MapPin, Phone, Heart, Clock, Crown, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Provider, SERVICE_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ProviderCardProps {
  provider: Provider;
  onViewDetails: (provider: Provider) => void;
}

export function ProviderCard({ provider, onViewDetails }: ProviderCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { t } = useLanguage();
  const favorite = isFavorite(provider._id);
  const category = SERVICE_CATEGORIES.find((c) => c.id === provider.category);

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://wa.me/${provider.whatsapp}`, "_blank");
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`tel:${provider.phone}`, "_self");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        variant={provider.isPremium ? "premium" : "interactive"}
        className="cursor-pointer overflow-hidden"
        onClick={() => onViewDetails(provider)}
      >
        {/* Premium badge */}
        {provider.isPremium && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-md">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(provider._id);
          }}
          className={cn(
            "absolute top-3 right-3 z-10 h-9 w-9 rounded-full flex items-center justify-center transition-all duration-200",
            favorite
              ? "bg-primary text-primary-foreground shadow-glow"
              : "bg-card/80 backdrop-blur text-muted-foreground hover:bg-card hover:text-primary"
          )}
        >
          <Heart className={cn("h-5 w-5", favorite && "fill-current")} />
        </button>

        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="h-16 w-16 rounded-xl overflow-hidden bg-muted">
                <img
                  src={provider.photo}
                  alt={provider.name}
                  className="h-full w-full object-cover"
                />
              </div>
              {provider.isAvailable && (
                <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-success rounded-full border-2 border-card flex items-center justify-center">
                  <Check className="h-3 w-3 text-success-foreground" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-foreground truncate">{provider.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3" />
                    {provider.location}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-md">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="text-sm font-semibold">{provider.rating}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  ({provider.reviewCount} {t("avis", "تقييم")})
                </span>
                {category && (
                  <Badge variant="secondary" className="text-xs">
                    {category.name}
                  </Badge>
                )}
              </div>

              {/* Availability & Price */}
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {provider.availability}
                </span>
                <span className="font-medium text-foreground">{provider.priceRange}</span>
              </div>
            </div>
          </div>

          {/* Services preview */}
          <div className="mt-3">
            <p className="text-xs text-muted-foreground line-clamp-2">
              {provider.services ? provider.services.substring(0, 80) + (provider.services.length > 80 ? "..." : "") : "Services non spécifiés"}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-4">
            <Button variant="whatsapp" size="sm" className="flex-1" onClick={handleWhatsApp}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </Button>
            <Button variant="call" size="sm" className="flex-1" onClick={handleCall}>
              <Phone className="h-4 w-4" />
              {t("Appeler", "اتصل")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
