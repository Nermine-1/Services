import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="bg-muted/50 pt-12 pb-24 md:pb-12 border-t border-border/50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                            Serveeny
                        </h3>
                        <p className="text-muted-foreground text-sm max-w-xs">
                            {t(
                                "Votre plateforme de confiance pour trouver les meilleurs prestataires de services en Tunisie.",
                                "منصتك الموثوقة للعثور على أفضل مزودي الخدمات في تونس."
                            )}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">
                            {t("Liens rapides", "روابط سريعة")}
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <a href="/" className="hover:text-primary transition-colors">
                                    {t("Accueil", "الرئيسية")}
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    {t("À propos", "من نحن")}
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    {t("Devenir prestataire", "كن مزود خدمة")}
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors">
                                    {t("Contact", "اتصل بنا")}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">
                            {t("Contactez-nous", "اتصل بنا")}
                        </h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                <span>+216 12 345 678</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-primary" />
                                <span>contact@serveeny.tn</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span>Tunis, Tunisie</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">
                            {t("Suivez-nous", "تابعنا")}
                        </h4>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="h-10 w-10 bg-background rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="h-10 w-10 bg-background rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
                    <p>
                        &copy; {new Date().getFullYear()} Serveeny. {t("Tous droits réservés.", "جميع الحقوق محفوظة.")}
                    </p>
                </div>
            </div>
        </footer>
    );
}
