import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { SERVICE_CATEGORIES, Provider } from "@/lib/constants";
import { adminApi, providerApi } from "@/lib/api";
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Eye,
  FileText,
  BarChart3,
  Shield,
  Star,
  Crown,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";


interface PendingProvider extends Omit<Provider, 'rating' | 'reviewCount' | 'isAvailable' | 'priceRange' | 'availability' | 'whatsapp'> {
  documents?: { name: string; size: number; type: string }[];
  status: "pending" | "verified" | "rejected";
  createdAt: string;
}

const AdminDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedProvider, setSelectedProvider] = useState<PendingProvider | null>(null);

  // Check admin authentication on mount
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");
    
    console.log("AdminDashboard auth check - Role:", userRole, "Token:", token ? "exists" : "missing");
    
    if (userRole !== "admin" || !token) {
      console.warn("Admin not authenticated. Redirecting to login...");
      toast.error("Veuillez vous connecter en tant qu'administrateur");
      navigate("/provider-login");
      return;
    }
    
    console.log("Admin authenticated successfully");
  }, [navigate]);

  // Fetch pending providers
  const { data: pendingProviders = [], refetch: refetchPending, error: pendingError, isLoading: pendingLoading } = useQuery({
    queryKey: ["pending-providers"],
    queryFn: async () => {
      try {
        const response = await adminApi.getPendingProviders();
        console.log("Pending providers response:", response.data);
        return response.data;
      } catch (error: any) {
        console.error("Error fetching pending providers:", error);
        console.error("Error response:", error.response?.data);
        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error("Veuillez vous connecter en tant qu'administrateur");
        } else {
          toast.error("Erreur lors du chargement des demandes");
        }
        throw error;
      }
    },
    refetchInterval: 5000, // Refetch every 5 seconds
    refetchOnWindowFocus: true,
    retry: false, // Don't retry on auth errors
  });

  // Fetch all verified providers
  const { data: verifiedProviders = [] } = useQuery({
    queryKey: ["all-providers"],
    queryFn: () => providerApi.getProviders().then(res => res.data),
  });

  // Mutation for verifying provider
  const verifyProviderMutation = useMutation({
    mutationFn: (id: string) => adminApi.verifyProvider(id),
    onSuccess: () => {
      toast.success("Prestataire vérifié avec succès !");
      queryClient.invalidateQueries({ queryKey: ["pending-providers"] });
      queryClient.invalidateQueries({ queryKey: ["all-providers"] });
      refetchPending(); // Manually refetch pending providers
    },
  });

  // Mutation for rejecting provider
  const rejectProviderMutation = useMutation({
    mutationFn: (id: string) => adminApi.rejectProvider(id),
    onSuccess: () => {
      toast.success("Prestataire rejeté");
      queryClient.invalidateQueries({ queryKey: ["pending-providers"] });
      queryClient.invalidateQueries({ queryKey: ["all-providers"] });
      refetchPending(); // Manually refetch pending providers
    },
  });

  // Update stats when data changes
  const currentStats = {
    totalProviders: verifiedProviders.length,
    pendingVerifications: pendingProviders.length,
    totalRevenue: verifiedProviders.length * 150 + pendingProviders.length * 50, // Revenue from ads per provider
    monthlyGrowth: verifiedProviders.length > 0 ? "15.2" : "0",
    activeProviders: verifiedProviders.filter(p => p.isAvailable).length,
    premiumProviders: verifiedProviders.filter(p => p.isPremium).length,
    totalReviews: verifiedProviders.reduce((sum, p) => sum + p.reviewCount, 0),
    averageRating: verifiedProviders.length > 0
      ? (verifiedProviders.reduce((sum, p) => sum + p.rating, 0) / verifiedProviders.length).toFixed(1)
      : 0,
  };

  const handleVerifyProvider = (provider: PendingProvider) => {
    verifyProviderMutation.mutate(provider._id);
  };

  const handleRejectProvider = (provider: PendingProvider) => {
    rejectProviderMutation.mutate(provider._id);
  };

  const stats = currentStats;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t("Tableau de Bord Admin", "لوحة تحكم الإدارة")}
          </h1>
          <p className="text-muted-foreground">
            {t("Gérez les prestataires et consultez les statistiques", "إدارة المزودين وعرض الإحصائيات")}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("Prestataires Vérifiés", "المزودون المعتمدون")}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProviders}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.monthlyGrowth}% ce mois
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("En Attente", "في الانتظار")}
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingVerifications}</div>
              <p className="text-xs text-muted-foreground">
                {t("À vérifier", "للتحقق")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("Revenus Publicitaires", "إيرادات الإعلانات")}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue} DT</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeProviders} {t("prestataires actifs", "مزود نشط")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("Note Moyenne", "متوسط التقييم")}
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalReviews} {t("avis totaux", "إجمالي التقييمات")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("Prestataires Actifs", "المزودون النشطون")}
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeProviders}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.activeProviders / Math.max(stats.totalProviders, 1)) * 100).toFixed(0)}% {t("du total", "من المجموع")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("Prestataires Premium", "المزودون المميزون")}
              </CardTitle>
              <Crown className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.premiumProviders}</div>
              <p className="text-xs text-muted-foreground">
                {t("Revenus supplémentaires", "إيرادات إضافية")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("Croissance Mensuelle", "النمو الشهري")}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{stats.monthlyGrowth}%</div>
              <p className="text-xs text-muted-foreground">
                {t("Nouveaux prestataires", "مزودون جدد")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              <Clock className="h-4 w-4 mr-2" />
              {t("En Attente", "في الانتظار")}
            </TabsTrigger>
            <TabsTrigger value="verified">
              <CheckCircle className="h-4 w-4 mr-2" />
              {t("Vérifiés", "معتمدون")}
            </TabsTrigger>
            <TabsTrigger value="stats">
              <BarChart3 className="h-4 w-4 mr-2" />
              {t("Statistiques", "إحصائيات")}
            </TabsTrigger>
          </TabsList>

          {/* Pending Providers */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>{t("Demandes en Attente de Vérification", "طلبات في انتظار التحقق")}</CardTitle>
                <CardDescription>
                  {t("Vérifiez les documents et approuvez les nouveaux prestataires", "تحقق من الوثائق ووافق على المزودين الجدد")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">
                      {t("Chargement...", "جاري التحميل...")}
                    </p>
                  </div>
                ) : pendingError ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <p className="text-destructive">
                      {t("Erreur lors du chargement", "خطأ في التحميل")}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {pendingError instanceof Error ? pendingError.message : "Erreur inconnue"}
                    </p>
                    <Button onClick={() => refetchPending()} variant="outline" className="mt-4">
                      {t("Réessayer", "إعادة المحاولة")}
                    </Button>
                  </div>
                ) : pendingProviders.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {t("Aucune demande en attente", "لا توجد طلبات في الانتظار")}
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("Prestataire", "المزود")}</TableHead>
                        <TableHead>{t("Catégorie", "الفئة")}</TableHead>
                        <TableHead>{t("Localisation", "الموقع")}</TableHead>
                        <TableHead>{t("Documents", "الوثائق")}</TableHead>
                        <TableHead>{t("Date", "التاريخ")}</TableHead>
                        <TableHead>{t("Actions", "الإجراءات")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingProviders.map((provider) => (
                        <TableRow key={provider._id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{provider.name}</p>
                              <p className="text-sm text-muted-foreground">{provider.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {SERVICE_CATEGORIES.find(c => c.id === provider.category)?.name}
                            </Badge>
                          </TableCell>
                          <TableCell>{provider.location}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {provider.documents?.length || 0} {t("fichiers", "ملفات")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(provider.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedProvider(provider)}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    {t("Voir", "عرض")}
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>{t("Détails du Prestataire", "تفاصيل المزود")}</DialogTitle>
                                    <DialogDescription>
                                      {t("Vérifiez les informations avant d'approuver", "تحقق من المعلومات قبل الموافقة")}
                                    </DialogDescription>
                                  </DialogHeader>

                                  {selectedProvider && (
                                    <div className="space-y-6">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <h3 className="font-semibold mb-2">{t("Informations Personnelles", "المعلومات الشخصية")}</h3>
                                          <div className="flex items-center gap-4 mb-4">
                                            <img
                                              src={selectedProvider.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"}
                                              alt={selectedProvider.name}
                                              className="w-16 h-16 rounded-full object-cover"
                                            />
                                            <div>
                                              <p className="font-medium">{selectedProvider.name}</p>
                                              <p className="text-sm text-muted-foreground">{selectedProvider.email}</p>
                                            </div>
                                          </div>
                                          <p><strong>{t("Téléphone:", "الهاتف:")}</strong> {selectedProvider.phone}</p>
                                          <p><strong>{t("Localisation:", "الموقع:")}</strong> {selectedProvider.location}</p>
                                        </div>
                                        <div>
                                          <h3 className="font-semibold mb-2">{t("Informations Professionnelles", "المعلومات المهنية")}</h3>
                                          <p><strong>{t("Catégorie:", "الفئة:")}</strong> {SERVICE_CATEGORIES.find(c => c.id === selectedProvider.category)?.name}</p>
                                          <p><strong>{t("Zone de service:", "منطقة الخدمة:")}</strong> {selectedProvider.serviceArea}</p>
                                          {selectedProvider.certifications && (
                                            <p><strong>{t("Certifications:", "الشهادات:")}</strong> {selectedProvider.certifications}</p>
                                          )}
                                          <p><strong>{t("Type de compte:", "نوع الحساب:")}</strong> {selectedProvider.isPremium ? "Premium" : "Standard"}</p>
                                        </div>
                                      </div>

                                      <div>
                                        <h3 className="font-semibold mb-2">{t("Description", "الوصف")}</h3>
                                        <p className="text-sm text-muted-foreground">{selectedProvider.description}</p>
                                      </div>

                                      <div>
                                        <h3 className="font-semibold mb-2">{t("Services Proposés", "الخدمات المقدمة")}</h3>
                                        <div className="p-3 bg-muted/50 rounded-lg">
                                          <p className="text-sm text-foreground whitespace-pre-line">
                                            {selectedProvider.services}
                                          </p>
                                        </div>
                                      </div>

                                      <div>
                                        <h3 className="font-semibold mb-2">{t("Documents Justificatifs", "الوثائق المبررة")}</h3>
                                        <div className="space-y-2">
                                          {selectedProvider.documents && selectedProvider.documents.length > 0 ? (
                                            selectedProvider.documents.map((doc, index) => (
                                              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                                <div className="flex items-center gap-3">
                                                  <FileText className="h-5 w-5 text-muted-foreground" />
                                                  <div>
                                                    <p className="text-sm font-medium">{doc.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                      {doc.type} • {(doc.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                  </div>
                                                </div>
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => {
                                                    // In a real app, this would open/download the file
                                                    toast.info(`Visualisation de ${doc.name} - Fonctionnalité à implémenter`);
                                                  }}
                                                >
                                                  <Eye className="h-4 w-4 mr-1" />
                                                  {t("Voir", "عرض")}
                                                </Button>
                                              </div>
                                            ))
                                          ) : (
                                            <p className="text-sm text-muted-foreground py-4 text-center">
                                              {t("Aucun document fourni", "لم يتم تقديم أي وثائق")}
                                            </p>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex gap-3 pt-4">
                                        <Button
                                          onClick={() => handleVerifyProvider(selectedProvider)}
                                          className="flex-1"
                                        >
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          {t("Approuver", "موافقة")}
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          onClick={() => handleRejectProvider(selectedProvider)}
                                          className="flex-1"
                                        >
                                          <XCircle className="h-4 w-4 mr-2" />
                                          {t("Rejeter", "رفض")}
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>

                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleVerifyProvider(provider)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                {t("Approuver", "موافقة")}
                              </Button>

                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRejectProvider(provider)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                {t("Rejeter", "رفض")}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verified Providers */}
          <TabsContent value="verified">
            <Card>
              <CardHeader>
                <CardTitle>{t("Prestataires Vérifiés", "المزودون المعتمدون")}</CardTitle>
                <CardDescription>
                  {t("Liste de tous les prestataires actifs sur la plateforme", "قائمة جميع المزودين النشطين على المنصة")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("Prestataire", "المزود")}</TableHead>
                      <TableHead>{t("Catégorie", "الفئة")}</TableHead>
                      <TableHead>{t("Localisation", "الموقع")}</TableHead>
                      <TableHead>{t("Statut", "الحالة")}</TableHead>
                      <TableHead>{t("Note", "التقييم")}</TableHead>
                      <TableHead>{t("Actions", "الإجراءات")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {verifiedProviders.map((provider) => (
                      <TableRow key={provider._id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{provider.name}</p>
                            <p className="text-sm text-muted-foreground">{provider.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {SERVICE_CATEGORIES.find(c => c.id === provider.category)?.name}
                          </Badge>
                        </TableCell>
                        <TableCell>{provider.location}</TableCell>
                        <TableCell>
                          <Badge variant={provider.isAvailable ? "default" : "secondary"}>
                            {provider.isAvailable ? t("Disponible", "متاح") : t("Indisponible", "غير متاح")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span>{provider.rating}</span>
                            <span className="text-sm text-muted-foreground">
                              ({provider.reviewCount})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              {t("Voir", "عرض")}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics */}
          <TabsContent value="stats">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("Revenus Publicitaires", "إيرادات الإعلانات")}</CardTitle>
                  <CardDescription>
                    {t("Revenus générés par les prestataires vérifiés", "الإيرادات المولدة من المزودين المعتمدين")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{t("Revenus par prestataire", "الإيرادات لكل مزود")}</p>
                        <p className="text-xs text-muted-foreground">150 DT/mois</p>
                      </div>
                      <span className="text-2xl font-bold text-primary">
                        {stats.totalProviders * 150} DT
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{t("Bonus prestataires premium", "مكافآت المزودين المميزين")}</p>
                        <p className="text-xs text-muted-foreground">50 DT/mois chacun</p>
                      </div>
                      <span className="text-2xl font-bold text-amber-600">
                        {stats.premiumProviders * 50} DT
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg border border-success/20">
                      <div>
                        <p className="text-sm font-medium">{t("Total des revenus", "إجمالي الإيرادات")}</p>
                        <p className="text-xs text-muted-foreground">Ce mois</p>
                      </div>
                      <span className="text-2xl font-bold text-success">
                        {stats.totalRevenue} DT
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("Répartition par Catégorie", "التوزيع حسب الفئة")}</CardTitle>
                  <CardDescription>
                    {t("Nombre de prestataires par secteur d'activité", "عدد المزودين حسب قطاع النشاط")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {SERVICE_CATEGORIES.map((category) => {
                      const count = verifiedProviders.filter(p => p.category === category.id).length;
                      const percentage = stats.totalProviders > 0 ? ((count / stats.totalProviders) * 100).toFixed(1) : 0;
                      return (
                        <div key={category.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: category.color.split(' ')[1] }}
                            />
                            <span className="text-sm">{category.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">{count}</span>
                            <span className="text-xs text-muted-foreground ml-2">({percentage}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("Performance Globale", "الأداء العام")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t("Taux de satisfaction client", "معدل رضا العميل")}</span>
                      <span className="font-medium">94.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t("Temps de réponse moyen", "متوسط وقت الرد")}</span>
                      <span className="font-medium">2.3h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t("Taux de conversion", "معدل التحويل")}</span>
                      <span className="font-medium">67.8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("Activité du Mois", "نشاط الشهر")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t("Nouveaux prestataires", "مزودون جدد")}</span>
                      <span className="font-medium">+{stats.totalProviders}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t("Demandes traitées", "الطلبات المعالجة")}</span>
                      <span className="font-medium">{stats.pendingVerifications + stats.totalProviders}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t("Revenus générés", "الإيرادات المولدة")}</span>
                      <span className="font-medium">{stats.totalRevenue} DT</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("Prévisions", "التوقعات")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t("Croissance prévue", "النمو المتوقع")}</span>
                      <span className="font-medium text-success">+{stats.monthlyGrowth}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t("Revenus projetés", "الإيرادات المتوقعة")}</span>
                      <span className="font-medium">{Math.round(stats.totalRevenue * 1.15)} DT</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t("Objectif mensuel", "الهدف الشهري")}</span>
                      <span className="font-medium">25,000 DT</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;