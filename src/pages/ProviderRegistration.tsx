import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const providerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  category: z.string().min(1, "Veuillez sélectionner une catégorie"),
  location: z.string().min(2, "Veuillez entrer une localisation"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  services: z.string().min(10, "Veuillez décrire vos services (au moins 10 caractères)"),
  certifications: z.string().optional(),
  serviceArea: z.string().min(2, "Veuillez entrer une zone de service"),
  priceRange: z.string().min(1, "Veuillez entrer une fourchette de prix"),
  availability: z.string().min(1, "Veuillez entrer vos horaires de disponibilité"),
});

type ProviderFormData = z.infer<typeof providerSchema>;

const ProviderRegistration = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<File[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [servicesText, setServicesText] = useState<string>("");
  const [isPremium, setIsPremium] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      services: "",
      priceRange: "",
      availability: "",
    },
  });

  const selectedCategory = watch("category");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file =>
      file.type === 'application/pdf' ||
      file.type.startsWith('image/')
    );

    if (validFiles.length !== files.length) {
      toast.error("Seuls les fichiers PDF et images sont acceptés");
    }

    setDocuments(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setProfilePhoto(file);
    } else {
      toast.error("Veuillez sélectionner une image valide");
    }
  };

  const removePhoto = () => {
    setProfilePhoto(null);
  };


  const onSubmit = async (data: ProviderFormData) => {
    if (documents.length === 0) {
      toast.error("Veuillez télécharger au moins un document justificatif");
      return;
    }

    setIsSubmitting(true);

    try {
      // Handle photo upload
      let photoUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face";
      if (profilePhoto) {
        photoUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(profilePhoto);
        });
      }

      // Simulate API call
      const providerData = {
        ...data,
        id: Date.now().toString(),
        whatsapp: data.phone, // Use phone as whatsapp for now
        documents: documents.map(doc => ({
          name: doc.name,
          size: doc.size,
          type: doc.type,
        })),
        status: "pending", // pending, verified, rejected
        createdAt: new Date().toISOString(),
        isPremium: isPremium,
        rating: 0,
        reviewCount: 0,
        isAvailable: true,
        priceRange: data.priceRange,
        availability: data.availability,
        photo: photoUrl,
      };

      // Save to localStorage for now
      const providerDataWithPassword = {
        ...providerData,
        password: data.password, // Save password for login
      };
      const existingProviders = JSON.parse(localStorage.getItem("pendingProviders") || "[]");
      localStorage.setItem("pendingProviders", JSON.stringify([...existingProviders, providerDataWithPassword]));

      toast.success("Votre demande d'inscription a été soumise avec succès !");
      navigate("/");
    } catch (error) {
      toast.error("Une erreur s'est produite lors de l'inscription");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t("Devenir Prestataire", "كن مزود خدمة")}
            </h1>
            <p className="text-muted-foreground">
              {t("Rejoignez notre plateforme et développez votre activité", "انضم إلى منصتنا وطور نشاطك")}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t("Informations Personnelles", "المعلومات الشخصية")}</CardTitle>
                <CardDescription>
                  {t("Renseignez vos informations de base", "أدخل معلوماتك الأساسية")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("Nom complet", "الاسم الكامل")}
                    </label>
                    <Input {...register("name")} placeholder="Ahmed Ben Salem" />
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("Email", "البريد الإلكتروني")}
                    </label>
                    <Input {...register("email")} type="email" placeholder="ahmed@example.com" />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("Téléphone", "الهاتف")}
                    </label>
                    <Input {...register("phone")} placeholder="+216 XX XXX XXX" />
                    {errors.phone && (
                      <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("Mot de passe", "كلمة المرور")}
                    </label>
                    <Input {...register("password")} type="password" />
                    {errors.password && (
                      <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  {/* Profile Photo */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("Photo de profil", "صورة الملف الشخصي")} (optionnel)
                    </label>
                    <div className="space-y-4">
                      {profilePhoto ? (
                        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                          <img
                            src={URL.createObjectURL(profilePhoto)}
                            alt="Profile preview"
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{profilePhoto.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(profilePhoto.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={removePhoto}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">
                            {t("Cliquez pour sélectionner une photo", "انقر لتحديد صورة")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            JPG, PNG (Max 5MB)
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                            id="photo-upload"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="mt-4"
                            onClick={() => document.getElementById("photo-upload")?.click()}
                          >
                            {t("Sélectionner une photo", "اختر صورة")}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t("Informations de Service", "معلومات الخدمة")}</CardTitle>
                <CardDescription>
                  {t("Décrivez vos services et votre zone d'activité", "صف خدماتك ومنطقة عملك")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t("Catégorie de service", "فئة الخدمة")}
                  </label>
                  <Select onValueChange={(value) => setValue("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Sélectionnez une catégorie", "اختر فئة")} />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_CATEGORIES.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {language === "fr" ? category.name : category.nameAr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t("Localisation", "الموقع")}
                  </label>
                  <Input {...register("location")} placeholder="Tunis, La Marsa" />
                  {errors.location && (
                    <p className="text-sm text-destructive mt-1">{errors.location.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t("Zone de service", "منطقة الخدمة")}
                  </label>
                  <Input {...register("serviceArea")} placeholder="Tunis et environs" />
                  {errors.serviceArea && (
                    <p className="text-sm text-destructive mt-1">{errors.serviceArea.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t("Description", "الوصف")}
                  </label>
                  <Textarea
                    {...register("description")}
                    placeholder={t("Décrivez vos services et votre expérience...", "صف خدماتك وخبرتك...")}
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t("Certifications (optionnel)", "الشهادات (اختياري)")}
                  </label>
                  <Input {...register("certifications")} placeholder="Diplôme, certificat..." />
                </div>

                {/* Services Description */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t("Services proposés", "الخدمات المقدمة")}
                  </label>
                  <Textarea
                    {...register("services")}
                    placeholder={t("Décrivez les services que vous proposez ", "صف الخدمات التي تقدمها)")}
                    rows={4}
                  />
                  {errors.services && (
                    <p className="text-sm text-destructive mt-1">{errors.services.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("Fourchette de prix", "نطاق الأسعار")}
                    </label>
                    <Input
                      {...register("priceRange")}
                      placeholder="50-150 DT"
                    />
                    {errors.priceRange && (
                      <p className="text-sm text-destructive mt-1">{errors.priceRange.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("Horaires de disponibilité", "أوقات التوفر")}
                    </label>
                    <Input
                      {...register("availability")}
                      placeholder="Lun-Sam 8h-18h , sur rendez-vous"
                    />
                    {errors.availability && (
                      <p className="text-sm text-destructive mt-1">{errors.availability.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle>{t("Documents Justificatifs", "الوثائق المبررة")}</CardTitle>
                <CardDescription>
                  {t("Téléchargez vos documents (CIN, diplôme, certificat...)", "قم بتحميل وثائقك (بطاقة الهوية، الشهادة...)")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      {t("Cliquez pour sélectionner ou glissez-déposez vos fichiers", "انقر للتحديد أو اسحب الملفات")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, JPG, PNG (Max 5 fichiers, 10MB chacun)
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="document-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4"
                      onClick={() => document.getElementById("document-upload")?.click()}
                    >
                      {t("Sélectionner des fichiers", "اختر الملفات")}
                    </Button>
                  </div>

                  {documents.length > 0 && (
                    <div className="space-y-2">
                      {documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-4 w-4 text-success" />
                            <div>
                              <p className="text-sm font-medium">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(doc.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDocument(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Premium Account Option */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {t("Compte Premium", "حساب مميز")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("Apparaissez en premier dans les résultats de recherche", "ظهر أولاً في نتائج البحث")}
                    </p>
                    <p className="text-sm font-medium text-primary mt-1">
                      50 DT/mois
                    </p>
                  </div>
                  <Switch
                    checked={isPremium}
                    onCheckedChange={setIsPremium}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-center">
              <Button type="submit" size="lg" disabled={isSubmitting} className="px-8">
                {isSubmitting ? t("Inscription en cours...", "جاري التسجيل...") : t("S'inscrire", "التسجيل")}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProviderRegistration;