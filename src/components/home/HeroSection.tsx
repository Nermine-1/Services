import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden py-12 md:py-20">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse-soft" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[80px] animate-pulse-soft" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center md:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {t("Plus de 500 prestataires", "أكثر من 500 مزود خدمة")}
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              <span className="text-foreground">
                {t("Trouvez le ", "اعثر على ")}
              </span>
              <span className="text-gradient">
                {t("meilleur service", "أفضل خدمة")}
              </span>
              <br />
              <span className="text-foreground">
                {t("près de chez vous", "بالقرب منك")}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg mx-auto md:mx-0">
              {t(
                "Électriciens, plombiers, femmes de ménage, jardiniers... Contactez-les directement par téléphone ou WhatsApp.",
                "كهربائيون، سباكون، عاملات تنظيف، بستانيون... تواصل معهم مباشرة عبر الهاتف أو واتساب."
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button variant="hero" size="xl" className="group">
                {t("Explorer les services", "استكشف الخدمات")}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="xl">
                {t("Devenir prestataire", "كن مزود خدمة")}
              </Button>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex items-center justify-center md:justify-start gap-8 mt-10"
            >
              {[
                { value: "500+", label: t("Prestataires", "مزود") },
                { value: "12", label: t("Catégories", "فئة") },
                { value: "10K+", label: t("Clients", "عميل") },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex-1 relative"
          >
            <div className="relative w-full max-w-md mx-auto">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/30 rounded-2xl rotate-12 animate-float" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/20 rounded-full animate-float" style={{ animationDelay: "2s" }} />
              
              {/* Main image container */}
              <div className="relative bg-gradient-card rounded-3xl p-6 shadow-elevated border border-border/50">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=600&fit=crop"
                    alt="Service professional"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                
                {/* Floating cards */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="absolute -right-4 top-1/4 bg-card shadow-card rounded-xl p-3 border border-border/50"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
                      <span className="text-success text-sm">✓</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold">{t("Vérifié", "موثق")}</p>
                      <p className="text-[10px] text-muted-foreground">{t("Profil complet", "ملف كامل")}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -left-4 bottom-1/4 bg-card shadow-card rounded-xl p-3 border border-border/50"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20" />
                      <div className="h-6 w-6 rounded-full bg-accent/30" />
                      <div className="h-6 w-6 rounded-full bg-secondary/30" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold">4.9 ★</p>
                      <p className="text-[10px] text-muted-foreground">124 {t("avis", "تقييم")}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
