import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { LogIn, UserPlus } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const ProviderLogin = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      // Check if admin login
      if (data.email === "admin@khedma.tn" && data.password === "admin123") {
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("userEmail", data.email);
        toast.success("Connexion admin réussie !");
        navigate("/admin");
        return;
      }

      // Check verified providers
      const verifiedProviders = JSON.parse(localStorage.getItem("verifiedProviders") || "[]");

      const provider = verifiedProviders.find((p: any) =>
        p.email === data.email && p.password === data.password
      );

      if (provider) {
        localStorage.setItem("userRole", "provider");
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("providerData", JSON.stringify(provider));
        toast.success("Connexion réussie !");
        navigate("/provider-dashboard");
      } else {
        toast.error("Email ou mot de passe incorrect");
      }
    } catch (error) {
      toast.error("Erreur lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {t("Connexion Prestataire", "دخول المزود")}
              </CardTitle>
              <CardDescription>
                {t("Connectez-vous à votre compte", "سجل الدخول إلى حسابك")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t("Email", "البريد الإلكتروني")}
                  </label>
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="votre@email.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t("Mot de passe", "كلمة المرور")}
                  </label>
                  <Input
                    {...register("password")}
                    type="password"
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  <LogIn className="h-4 w-4 mr-2" />
                  {isLoading ? t("Connexion...", "جاري الدخول...") : t("Se connecter", "دخول")}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  {t("Pas encore inscrit ?", "غير مسجل بعد؟")}
                </p>
                <Link to="/provider-registration">
                  <Button variant="outline" className="w-full">
                    <UserPlus className="h-4 w-4 mr-2" />
                    {t("S'inscrire", "التسجيل")}
                  </Button>
                </Link>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">
                  {t("Connexion Admin", "دخول الإدارة")}
                </p>
                <p className="text-xs text-muted-foreground">
                  Email: admin@khedma.tn<br />
                  Mot de passe: admin123
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProviderLogin;