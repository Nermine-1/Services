import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { PROVIDERS, SERVICE_CATEGORIES } from "@/lib/constants";
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
  Shield
} from "lucide-react";
import { toast } from "sonner";

interface PendingProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  location: string;
  description: string;
  services: string[];
  certifications?: string;
  serviceArea: string;
  documents: { name: string; size: number; type: string }[];
  status: "pending" | "verified" | "rejected";
  createdAt: string;
}

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [pendingProviders, setPendingProviders] = useState<PendingProvider[]>([]);
  const [verifiedProviders, setVerifiedProviders] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<PendingProvider | null>(null);

  useEffect(() => {
    // Load data from localStorage
    const pending = JSON.parse(localStorage.getItem("pendingProviders") || "[]");
    const verified = JSON.parse(localStorage.getItem("verifiedProviders") || "[]");

    setPendingProviders(pending);
    setVerifiedProviders([...PROVIDERS, ...verified]);
  }, []);

  // Update stats when data changes
  const currentStats = {
    totalProviders: verifiedProviders.length,
    pendingVerifications: pendingProviders.length,
    totalRevenue: 12500, // Mock data
    monthlyGrowth: 12.5,
  };

  const handleVerifyProvider = (provider: PendingProvider) => {
    const verifiedProvider = {
      ...provider,
      status: "verified" as const,
      verifiedAt: new Date().toISOString(),
      isPremium: false,
      rating: 0,
      reviewCount: 0,
      isAvailable: true,
      priceRange: "À définir",
      availability: "À définir",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    };

    // Remove from pending
    const updatedPending = pendingProviders.filter(p => p.id !== provider.id);
    setPendingProviders(updatedPending);
    localStorage.setItem("pendingProviders", JSON.stringify(updatedPending));

    // Add to verified
    const updatedVerified = [...verifiedProviders, verifiedProvider];
    setVerifiedProviders(updatedVerified);
    localStorage.setItem("verifiedProviders", JSON.stringify(updatedVerified));

    toast.success("Prestataire vérifié avec succès !");
  };

  const handleRejectProvider = (provider: PendingProvider) => {
    const updatedPending = pendingProviders.filter(p => p.id !== provider.id);
    setPendingProviders(updatedPending);
    localStorage.setItem("pendingProviders", JSON.stringify(updatedPending));

    toast.success("Demande rejetée");
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
                {t("Revenus Totaux", "إجمالي الإيرادات")}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue} DT</div>
              <p className="text-xs text-muted-foreground">
                +15% ce mois
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("Croissance", "النمو")}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{stats.monthlyGrowth}%</div>
              <p className="text-xs text-muted-foreground">
                {t("Par rapport au mois dernier", "مقارنة بالشهر الماضي")}
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
                {pendingProviders.length === 0 ? (
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
                        <TableRow key={provider.id}>
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
                              {provider.documents.length} {t("fichiers", "ملفات")}
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
                                          <p><strong>{t("Nom:", "الاسم:")}</strong> {selectedProvider.name}</p>
                                          <p><strong>{t("Email:", "البريد:")}</strong> {selectedProvider.email}</p>
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
                                        </div>
                                      </div>

                                      <div>
                                        <h3 className="font-semibold mb-2">{t("Description", "الوصف")}</h3>
                                        <p className="text-sm text-muted-foreground">{selectedProvider.description}</p>
                                      </div>

                                      <div>
                                        <h3 className="font-semibold mb-2">{t("Services Proposés", "الخدمات المقدمة")}</h3>
                                        <div className="flex flex-wrap gap-2">
                                          {selectedProvider.services.map((service, index) => (
                                            <Badge key={index} variant="secondary">{service}</Badge>
                                          ))}
                                        </div>
                                      </div>

                                      <div>
                                        <h3 className="font-semibold mb-2">{t("Documents", "الوثائق")}</h3>
                                        <div className="space-y-2">
                                          {selectedProvider.documents.map((doc, index) => (
                                            <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                              <FileText className="h-5 w-5 text-muted-foreground" />
                                              <div>
                                                <p className="text-sm font-medium">{doc.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                  {(doc.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                              </div>
                                            </div>
                                          ))}
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
                      <TableRow key={provider.id}>
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
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            {t("Voir", "عرض")}
                          </Button>
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
                  <CardTitle>{t("Revenus par Catégorie", "الإيرادات حسب الفئة")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {SERVICE_CATEGORIES.slice(0, 5).map((category) => (
                      <div key={category.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: category.color.split(' ')[1] }}
                          />
                          <span className="text-sm">{category.name}</span>
                        </div>
                        <span className="font-medium">
                          {Math.floor(Math.random() * 3000) + 500} DT
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("Activité Récente", "النشاط الأخير")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <div>
                        <p className="text-sm font-medium">Ahmed Ben Salem approuvé</p>
                        <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Nouveau prestataire inscrit</p>
                        <p className="text-xs text-muted-foreground">Il y a 4 heures</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-success" />
                      <div>
                        <p className="text-sm font-medium">Paiement reçu: 150 DT</p>
                        <p className="text-xs text-muted-foreground">Il y a 6 heures</p>
                      </div>
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