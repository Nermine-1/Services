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
      const { authApi } = await import("@/lib/api");
      
      // Check if admin login
      if (data.email === "admin@serveeny.tn" && data.password === "admin123") {
        const adminResponse = await authApi.loginAdmin(data);
        if (adminResponse.data) {
          const adminData = adminResponse.data;
          localStorage.setItem("userRole", "admin");
          localStorage.setItem("userEmail", adminData.email);
          localStorage.setItem("token", adminData.token);
          toast.success(t("Admin login successful!", "Connexion admin réussie !", "تم تسجيل دخول الإدارة بنجاح!"));
          navigate("/admin");
          return;
        }
      }

      // Use backend API for provider login
      const response = await authApi.loginProvider(data);

      if (response.data) {
        const providerData = response.data;
        localStorage.setItem("userRole", "provider");
        localStorage.setItem("userEmail", providerData.email);
        localStorage.setItem("providerData", JSON.stringify(providerData));
        localStorage.setItem("token", providerData.token);
        toast.success(t("Login successful!", "Connexion réussie !", "تم تسجيل الدخول بنجاح!"));
        navigate("/provider-dashboard");
      }
    } catch (error: any) {
      if (error.response?.status === 403) {
        // Handle pending or rejected status
        const errorData = error.response.data;
        if (errorData.status === "pending") {
          toast.error(t("Your account is pending approval by the administrator", "Votre compte est en attente d'approbation par l'administrateur", "حسابك في انتظار الموافقة من قبل المسؤول"));
        } else if (errorData.status === "rejected") {
          toast.error(t("Your account has been rejected. Please contact the administrator", "Votre compte a été rejeté. Veuillez contacter l'administrateur", "تم رفض حسابك. يرجى الاتصال بالمسؤول"));
        } else {
          toast.error(errorData.message || t("Access denied", "Accès refusé", "تم رفض الوصول"));
        }
      } else if (error.response?.status === 401) {
        toast.error(t("Incorrect email or password", "Email ou mot de passe incorrect", "البريد الإلكتروني أو كلمة المرور غير صحيحة"));
      } else {
        toast.error(t("Error during login", "Erreur lors de la connexion", "خطأ أثناء تسجيل الدخول"));
      }
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
                {t("Provider Login", "Connexion Prestataire", "دخول المزود")}
              </CardTitle>
              <CardDescription>
                {t("Sign in to your account", "Connectez-vous à votre compte", "سجل الدخول إلى حسابك")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t("Email", "Email", "البريد الإلكتروني")}
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
                    {t("Password", "Mot de passe", "كلمة المرور")}
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
                  {isLoading ? t("Logging in...", "Connexion...", "جاري الدخول...") : t("Sign in", "Se connecter", "دخول")}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  {t("Not registered yet?", "Pas encore inscrit ?", "غير مسجل بعد؟")}
                </p>
                <Link to="/provider-registration">
                  <Button variant="outline" className="w-full">
                    <UserPlus className="h-4 w-4 mr-2" />
                    {t("Register", "S'inscrire", "التسجيل")}
                  </Button>
                </Link>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">
                  {t("Admin Login", "Connexion Admin", "دخول الإدارة")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("Email:", "Email:", "البريد الإلكتروني:")} admin@serveeny.tn<br />
                  {t("Password:", "Mot de passe:", "كلمة المرور:")} admin123
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