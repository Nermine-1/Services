import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { providerApi } from "@/lib/api";
import {
  User,
  Settings,
  Star,
  MessageSquare,
  DollarSign,
  Calendar,
  MapPin,
  Phone,
  Mail,
  LogOut
} from "lucide-react";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  id: string;
  role: string;
}

const ProviderDashboard = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [providerId, setProviderId] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication
    const userRole = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    if (userRole !== "provider" || !token) {
      navigate("/provider-login");
      return;
    }

    // Extract provider ID from token
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      if (decoded.id && decoded.role === "provider") {
        setProviderId(decoded.id);
      } else {
        // Fallback: try to get from localStorage providerData
        const providerData = localStorage.getItem("providerData");
        if (providerData) {
          const data = JSON.parse(providerData);
          setProviderId(data._id);
        } else {
          navigate("/provider-login");
        }
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      navigate("/provider-login");
    }
  }, [navigate]);

  // Fetch provider data from API
  const { data: provider, isLoading, error } = useQuery({
    queryKey: ["provider", providerId],
    queryFn: () => providerApi.getProviderById(providerId!).then(res => res.data),
    enabled: !!providerId,
  });

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("providerData");
    localStorage.removeItem("token");
    toast.success(t("Logout successful", "Déconnexion réussie", "تم تسجيل الخروج بنجاح"));
    navigate("/");
  };

  if (isLoading || !providerId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t("Loading...", "Chargement...", "جاري التحميل...")}</p>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{t("Error loading", "Erreur lors du chargement", "خطأ في التحميل")}</p>
          <Button onClick={() => navigate("/provider-login")}>
            {t("Back to login", "Retour à la connexion", "العودة إلى تسجيل الدخول")}
          </Button>
        </div>
      </div>
    );
  }

  const category = SERVICE_CATEGORIES.find(c => c.id === provider.category);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {t("My Provider Space", "Mon Espace Prestataire", "مساحة المزود الخاصة بي")}
              </h1>
              <p className="text-muted-foreground">
                {t("Welcome,", "Bienvenue,", "مرحباً,")} {provider.name}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              {t("Logout", "Déconnexion", "خروج")}
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Average Rating", "Note Moyenne", "متوسط التقييم")}
                </CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{provider.rating || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {provider.reviewCount || 0} {t("reviews", "avis", "تقييمات")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Price Range", "Fourchette de prix", "نطاق الأسعار")}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{provider.priceRange || "N/A"}</div>
                <p className="text-xs text-muted-foreground">
                  {provider.isPremium ? t("Premium Account", "Compte Premium", "حساب مميز") : t("Standard Account", "Compte Standard", "حساب عادي")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Status", "Statut", "الحالة")}
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <Badge variant={provider.status === "verified" ? "default" : "secondary"}>
                    {provider.status === "verified" ? t("Verified", "Vérifié", "معتمد") : 
                     provider.status === "pending" ? t("Pending", "En attente", "في الانتظار") : 
                     t("Rejected", "Rejeté", "مرفوض")}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {provider.status === "verified" ? t("Active on platform", "Actif sur la plateforme", "نشط على المنصة") : 
                   provider.status === "pending" ? t("Awaiting approval", "En attente d'approbation", "في انتظار الموافقة") : 
                   t("Account rejected", "Compte rejeté", "حساب مرفوض")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Availability", "Disponibilité", "التوفر")}
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Badge variant={provider.isAvailable ? "default" : "secondary"}>
                  {provider.isAvailable ? t("Available", "Disponible", "متاح") : t("Unavailable", "Indisponible", "غير متاح")}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                {t("Profile", "Profil", "الملف الشخصي")}
              </TabsTrigger>
              <TabsTrigger value="services">
                <Settings className="h-4 w-4 mr-2" />
                {t("Services", "Services", "الخدمات")}
              </TabsTrigger>
              <TabsTrigger value="requests">
                <MessageSquare className="h-4 w-4 mr-2" />
                {t("Requests", "Demandes", "الطلبات")}
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <Calendar className="h-4 w-4 mr-2" />
                {t("Statistics", "Statistiques", "الإحصائيات")}
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <img
                          src={provider.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"}
                          alt={provider.name}
                          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                        />
                        <h3 className="text-xl font-semibold">{provider.name}</h3>
                        <Badge variant="secondary" className="mt-2">
                          {category ? (language === "en" ? (category.nameEn || category.name) : language === "fr" ? category.name : category.nameAr) : ""}
                        </Badge>
                        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center justify-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {provider.location}
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <Phone className="h-4 w-4" />
                            {provider.phone}
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <Mail className="h-4 w-4" />
                            {provider.email}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("Detailed Information", "Informations Détaillées", "المعلومات التفصيلية")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">{t("Description", "Description", "الوصف")}</h4>
                        <p className="text-sm text-muted-foreground">{provider.description}</p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">{t("Services Offered", "Services Proposés", "الخدمات المقدمة")}</h4>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm text-foreground whitespace-pre-line">
                            {provider.services}
                          </p>
                        </div>
                      </div>

                      {provider.serviceArea && (
                        <div>
                          <h4 className="font-medium mb-2">{t("Service Area", "Zone de Service", "منطقة الخدمة")}</h4>
                          <p className="text-sm text-muted-foreground">{provider.serviceArea}</p>
                        </div>
                      )}

                      <div>
                        <h4 className="font-medium mb-2">{t("Availability", "Disponibilité", "التوفر")}</h4>
                        <p className="text-sm text-muted-foreground">{provider.availability}</p>
                      </div>

                      {provider.certifications && (
                        <div>
                          <h4 className="font-medium mb-2">{t("Certifications", "Certifications", "الشهادات")}</h4>
                          <p className="text-sm text-muted-foreground">{provider.certifications}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle>{t("Service Management", "Gestion des Services", "إدارة الخدمات")}</CardTitle>
                  <CardDescription>
                    {t("Modify your services and rates", "Modifiez vos services et tarifs", "عدل خدماتك وأسعارك")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          {t("Default Price", "Prix par défaut", "السعر الافتراضي")}
                        </label>
                        <p className="text-sm text-muted-foreground">{provider.priceRange}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          {t("Availability Status", "Statut de disponibilité", "حالة التوفر")}
                        </label>
                        <Badge variant={provider.isAvailable ? "default" : "secondary"}>
                          {provider.isAvailable ? t("Available", "Disponible", "متاح") : t("Unavailable", "Indisponible", "غير متاح")}
                        </Badge>
                      </div>
                    </div>

                    <Button className="w-full md:w-auto">
                      {t("Modify my services", "Modifier mes services", "تعديل خدماتي")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Requests Tab */}
            <TabsContent value="requests">
              <Card>
                <CardHeader>
                  <CardTitle>{t("Client Requests", "Demandes Clients", "طلبات العملاء")}</CardTitle>
                  <CardDescription>
                    {t("Manage your service requests", "Gérez vos demandes de service", "إدارة طلبات الخدمة")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {t("No requests at the moment", "Aucune demande pour le moment", "لا توجد طلبات في الوقت الحالي")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("Service Information", "Informations de Service", "معلومات الخدمة")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{t("Location", "Localisation", "الموقع")}</span>
                        <span className="font-medium">{provider.location}</span>
                      </div>
                      {provider.serviceArea && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{t("Service Area", "Zone de service", "منطقة الخدمة")}</span>
                          <span className="font-medium">{provider.serviceArea}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{t("Price Range", "Fourchette de prix", "نطاق الأسعار")}</span>
                        <span className="font-medium">{provider.priceRange || t("Not specified", "Non spécifié", "غير محدد")}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{t("Availability", "Disponibilité", "التوفر")}</span>
                        <span className="font-medium text-xs">{provider.availability || t("Not specified", "Non spécifié", "غير محدد")}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("Reviews", "Évaluations", "التقييمات")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{t("Average rating", "Note moyenne", "متوسط التقييم")}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-current text-yellow-500" />
                          <span className="font-medium">{provider.rating || 0}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{t("Number of reviews", "Nombre d'avis", "عدد التقييمات")}</span>
                        <span className="font-medium">{provider.reviewCount || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{t("Client satisfaction", "Satisfaction client", "رضا العميل")}</span>
                        <span className="font-medium">85%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ProviderDashboard;