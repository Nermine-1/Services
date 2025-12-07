import { motion, AnimatePresence } from "framer-motion";
import { X, Star, MapPin, Phone, Clock, Heart, Flag, Share2, Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Provider, SERVICE_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ProviderModalProps {
  provider: Provider | null;
  onClose: () => void;
}

export function ProviderModal({ provider, onClose }: ProviderModalProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { t } = useLanguage();

  if (!provider) return null;

  const favorite = isFavorite(provider.id);
  const category = SERVICE_CATEGORIES.find((c) => c.id === provider.category);

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${provider.whatsapp}`, "_blank");
  };

  const handleCall = () => {
    window.open(`tel:${provider.phone}`, "_self");
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: provider.name,
        text: provider.description,
        url: window.location.href,
      });
    }
  };

  return (
    <AnimatePresence>
      {provider && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full"
          >
            <div className="bg-card rounded-t-3xl md:rounded-3xl shadow-elevated max-h-[90vh] overflow-y-auto">
              {/* Header image */}
              <div className="relative h-48 md:h-56 bg-gradient-to-br from-primary/20 to-accent/20">
                <img
                  src={provider.photo}
                  alt={provider.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-overlay" />

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 h-10 w-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center text-foreground hover:bg-card transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Actions */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <button
                    onClick={() => toggleFavorite(provider.id)}
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center transition-all",
                      favorite
                        ? "bg-primary text-primary-foreground"
                        : "bg-card/80 backdrop-blur text-foreground hover:bg-card"
                    )}
                  >
                    <Heart className={cn("h-5 w-5", favorite && "fill-current")} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="h-10 w-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center text-foreground hover:bg-card transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>

                {/* Premium badge */}
                {provider.isPremium && (
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-md">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                )}

                {/* Availability */}
                <div className="absolute bottom-4 right-4">
                  <Badge
                    className={cn(
                      "border-0 shadow-md",
                      provider.isAvailable
                        ? "bg-success text-success-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <span className="flex items-center gap-1">
                      {provider.isAvailable ? (
                        <>
                          <Check className="h-3 w-3" />
                          {t("Disponible", "متاح")}
                        </>
                      ) : (
                        t("Indisponible", "غير متاح")
                      )}
                    </span>
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Name & Rating */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{provider.name}</h2>
                    <p className="flex items-center gap-1 text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4" />
                      {provider.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-lg">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="font-bold">{provider.rating}</span>
                    <span className="text-sm">({provider.reviewCount})</span>
                  </div>
                </div>

                {/* Category & Price */}
                <div className="flex items-center gap-3 mb-4">
                  {category && (
                    <Badge variant="secondary" className="text-sm">
                      {category.name}
                    </Badge>
                  )}
                  <span className="text-sm font-semibold text-foreground">
                    {provider.priceRange && provider.priceRange !== "À définir" ? provider.priceRange : t("Prix sur demande", "السعر عند الطلب")}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {provider.availability && provider.availability !== "À définir" ? provider.availability : t("Horaires à définir", "الأوقات المحددة")}
                  </span>
                </div>

                {/* Description */}
                <p className="text-foreground mb-6">{provider.description}</p>

                {/* Services */}
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-3">
                    {t("Services proposés", "الخدمات المقدمة")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {provider.services && provider.services.length > 0 ? (
                      provider.services.map((service, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {service}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {t("Aucun service spécifié", "لا توجد خدمات محددة")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Certifications */}
                {provider.certifications && provider.certifications.trim() && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-foreground mb-3">
                      {t("Certifications", "الشهادات")}
                    </h3>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-foreground">{provider.certifications}</p>
                    </div>
                  </div>
                )}

                {/* Service Area */}
                {provider.serviceArea && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-foreground mb-3">
                      {t("Zone de service", "منطقة الخدمة")}
                    </h3>
                    <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-foreground">{provider.serviceArea}</span>
                    </div>
                  </div>
                )}

                {/* Phone */}
                <div className="mb-6 p-4 bg-muted rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-secondary/20 rounded-full flex items-center justify-center">
                      <Phone className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t("Téléphone", "الهاتف")}</p>
                      <p className="font-semibold text-foreground">{provider.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <Button variant="whatsapp" size="lg" className="flex-1" onClick={handleWhatsApp}>
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </Button>
                  <Button variant="call" size="lg" className="flex-1" onClick={handleCall}>
                    <Phone className="h-5 w-5" />
                    {t("Appeler", "اتصل")}
                  </Button>
                </div>

                {/* Report button */}
                <button className="flex items-center justify-center gap-2 w-full mt-4 py-3 text-sm text-muted-foreground hover:text-destructive transition-colors">
                  <Flag className="h-4 w-4" />
                  {t("Signaler ce profil", "الإبلاغ عن هذا الملف")}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
