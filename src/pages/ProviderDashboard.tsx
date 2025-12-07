import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { SERVICE_CATEGORIES } from "@/lib/constants";
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

const ProviderDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<any>(null);

  useEffect(() => {
    // Check authentication
    const userRole = localStorage.getItem("userRole");
    const providerData = localStorage.getItem("providerData");

    if (userRole !== "provider" || !providerData) {
      navigate("/provider-login");
      return;
    }

    setProvider(JSON.parse(providerData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("providerData");
    toast.success("Déconnexion réussie");
    navigate("/");
  };

  if (!provider) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t("Chargement...", "جاري التحميل...")}</p>
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
                {t("Mon Espace Prestataire", "مساحة المزود الخاصة بي")}
              </h1>
              <p className="text-muted-foreground">
                {t("Bienvenue,", "مرحباً,")} {provider.name}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              {t("Déconnexion", "خروج")}
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Note Moyenne", "متوسط التقييم")}
                </CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{provider.rating || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {provider.reviewCount || 0} {t("avis", "تقييمات")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Revenus", "الإيرادات")}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,450 DT</div>
                <p className="text-xs text-muted-foreground">
                  +12% ce mois
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Demandes", "الطلبات")}
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">
                  5 en attente
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Statut", "الحالة")}
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Badge variant={provider.isAvailable ? "default" : "secondary"}>
                  {provider.isAvailable ? t("Disponible", "متاح") : t("Indisponible", "غير متاح")}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                {t("Profil", "الملف الشخصي")}
              </TabsTrigger>
              <TabsTrigger value="services">
                <Settings className="h-4 w-4 mr-2" />
                {t("Services", "الخدمات")}
              </TabsTrigger>
              <TabsTrigger value="requests">
                <MessageSquare className="h-4 w-4 mr-2" />
                {t("Demandes", "الطلبات")}
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <Calendar className="h-4 w-4 mr-2" />
                {t("Statistiques", "الإحصائيات")}
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
                          src={provider.photo}
                          alt={provider.name}
                          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                        />
                        <h3 className="text-xl font-semibold">{provider.name}</h3>
                        <Badge variant="secondary" className="mt-2">
                          {category?.name}
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
                      <CardTitle>{t("Informations Détaillées", "المعلومات التفصيلية")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">{t("Description", "الوصف")}</h4>
                        <p className="text-sm text-muted-foreground">{provider.description}</p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">{t("Services Proposés", "الخدمات المقدمة")}</h4>
                        <div className="flex flex-wrap gap-2">
                          {provider.services?.map((service: string, index: number) => (
                            <Badge key={index} variant="outline">{service}</Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">{t("Zone de Service", "منطقة الخدمة")}</h4>
                        <p className="text-sm text-muted-foreground">{provider.serviceArea}</p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">{t("Disponibilité", "التوفر")}</h4>
                        <p className="text-sm text-muted-foreground">{provider.availability}</p>
                      </div>

                      {provider.certifications && (
                        <div>
                          <h4 className="font-medium mb-2">{t("Certifications", "الشهادات")}</h4>
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
                  <CardTitle>{t("Gestion des Services", "إدارة الخدمات")}</CardTitle>
                  <CardDescription>
                    {t("Modifiez vos services et tarifs", "عدل خدماتك وأسعارك")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          {t("Prix par défaut", "السعر الافتراضي")}
                        </label>
                        <p className="text-sm text-muted-foreground">{provider.priceRange}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          {t("Statut de disponibilité", "حالة التوفر")}
                        </label>
                        <Badge variant={provider.isAvailable ? "default" : "secondary"}>
                          {provider.isAvailable ? t("Disponible", "متاح") : t("Indisponible", "غير متاح")}
                        </Badge>
                      </div>
                    </div>

                    <Button className="w-full md:w-auto">
                      {t("Modifier mes services", "تعديل خدماتي")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Requests Tab */}
            <TabsContent value="requests">
              <Card>
                <CardHeader>
                  <CardTitle>{t("Demandes Clients", "طلبات العملاء")}</CardTitle>
                  <CardDescription>
                    {t("Gérez vos demandes de service", "إدارة طلبات الخدمة")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {t("Aucune demande pour le moment", "لا توجد طلبات في الوقت الحالي")}
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
                    <CardTitle>{t("Activité Mensuelle", "النشاط الشهري")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{t("Demandes reçues", "الطلبات المستلمة")}</span>
                        <span className="font-medium">23</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{t("Demandes acceptées", "الطلبات المقبولة")}</span>
                        <span className="font-medium">18</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{t("Taux d'acceptation", "معدل القبول")}</span>
                        <span className="font-medium">78%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("Évaluations", "التقييمات")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{t("Note moyenne", "متوسط التقييم")}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-current text-yellow-500" />
                          <span className="font-medium">{provider.rating || 0}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{t("Nombre d'avis", "عدد التقييمات")}</span>
                        <span className="font-medium">{provider.reviewCount || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{t("Satisfaction client", "رضا العميل")}</span>
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