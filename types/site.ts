export type SiteType =
  | 'cv'
  | 'portfolio'
  | 'watch_store'
  | 'restaurant'
  | 'boutique'
  | 'wedding_card'
  | 'tuition'
  | 'bakery'
  | 'salon'
  | 'electronics'
  | 'ecommerce'
  | 'single_product';

export type SiteStatus = 'draft' | 'published' | 'deploying' | 'live' | 'failed';

export interface BannerSlide {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  price: string;
  currency?: string;
  description: string;
  imageUrl: string;
  badge?: string; // e.g., 'Best Seller', 'New Arrival', 'Sale'
  inStock?: boolean;
}

export interface WatchItem {
  id: string;
  brand: string;
  model: string;
  price: string;
  mrp?: string;
  dialColor?: string;
  caseDiameter?: string;
  movement?: string;
  waterResistance?: string;
  strapMaterial?: string;
  imageUrl: string;
  badge?: string;
  inStock?: boolean;
}

export interface WeddingCardEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
}

export interface WeddingCardDetails {
  themeId: string; // 1 to 10
  groomName: string;
  brideName: string;
  groomParents?: string;
  brideParents?: string;
  weddingDate: string;
  venueName: string;
  venueAddress: string;
  venueMapUrl?: string;
  rsvpPhone: string;
  events: WeddingCardEvent[];
  couplePhotoUrl?: string;
  weddingHashtag?: string;
}

export interface TuitionBatch {
  id: string;
  className: string;
  subjects: string;
  timing: string;
  monthlyFee: string;
  annualFee?: string;
}

export interface TuitionDetails {
  academyName: string;
  tagline?: string;
  standardsCovered?: string;
  batches: TuitionBatch[];
  resultsHighlight?: string;
  admissionHelpline: string;
}

export interface RestaurantMenuItem {
  id: string;
  name: string;
  category: string;
  price: string;
  description?: string;
  imageUrl?: string;
  isVeg?: boolean;
  badge?: string;
}

export interface CvCustomCategoryItem {
  id: string;
  title: string;
  subtitle?: string;
  period?: string;
  description?: string;
  link?: string;
  isLinkClickable?: boolean;
}

export interface CvCustomCategory {
  id: string;
  name: string;
  items: CvCustomCategoryItem[];
  visible?: boolean;
}

export interface CvExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  location?: string;
  description: string;
  companyUrl?: string;
  isCompanyUrlClickable?: boolean;
}

export interface CvEducation {
  id: string;
  institution: string;
  degree: string;
  year: string;
  honors?: string;
}

export interface CvProject {
  id: string;
  title: string;
  description: string;
  link?: string;
  isLinkClickable?: boolean;
  techStack?: string;
}

export interface CvCertification {
  id: string;
  name: string;
  issuer: string;
  year?: string;
  url?: string;
  isUrlClickable?: boolean;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags?: string[];
  link?: string;
}

export interface PortfolioSkill {
  id: string;
  name: string;
  level?: string; // e.g. 'Advanced', 'Expert' or percentage
  category?: string;
}

export interface SingleProductDetails {
  productName: string;
  tagline: string;
  regularPrice: string;
  salePrice: string;
  currency: string;
  description: string;
  images: string[];
  features: string[];
  specifications: Array<{ label: string; value: string }>;
  reviews?: Array<{ reviewerName: string; rating: number; comment: string }>;
  guaranteeText?: string;
}

export interface DeploymentLogEntry {
  step: 'github' | 'vercel' | 'cloudflare' | 'poll' | 'general';
  status: 'pending' | 'success' | 'failed' | 'in_progress';
  message: string;
  timestamp: string;
  details?: any;
}

export interface TrustBadgeItem {
  id: string;
  icon: 'truck' | 'shield' | 'clock' | 'refresh' | 'star' | 'heart';
  title: string;
  subtitle: string;
}

export interface ReviewItem {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  location?: string;
  verifiedBuyer?: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface SiteData {
  id: string;
  name: string;
  slug: string;
  type: SiteType;
  status: SiteStatus;
  whatsappNumber: string; // e.g. '919876543210' without '+'
  defaultWhatsappMessage?: string;
  logoUrl?: string;
  themeColor: string; // hex e.g. '#2563eb'
  fontFamily: 'Inter' | 'Plus Jakarta Sans' | 'Outfit' | 'Roboto' | 'Poppins';

  // Header customization
  headerCtaText?: string;

  // Announcement Ticker
  announcementEnabled?: boolean;
  announcementBarEnabled?: boolean;
  announcementText?: string;
  announcementBgColor?: string;
  announcementTextColor?: string;

  // Banner slider
  bannerSlider: BannerSlide[];
  sliderAutoRotateSeconds?: number;

  // E-commerce specific
  products?: ProductItem[];

  // Single product specific
  singleProduct?: SingleProductDetails;

  // Portfolio & Executive CV specific
  portfolioAbout?: string;
  portfolioSkills?: PortfolioSkill[];
  portfolioProjects?: PortfolioProject[];
  portfolioRoleTitle?: string;
  portfolioAvatarUrl?: string;

  // Dedicated ATS Executive CV Fields
  cvTitle?: string;
  cvHeadline?: string;
  cvLocation?: string;
  cvEmail?: string;
  cvPhone?: string;
  cvLinkedin?: string;
  cvLinkedinClickable?: boolean;
  cvGithub?: string;
  cvGithubClickable?: boolean;
  cvWebsite?: string;
  cvWebsiteClickable?: boolean;
  cvSummary?: string;
  cvExperiences?: CvExperience[];
  cvEducations?: CvEducation[];
  cvProjects?: CvProject[];
  cvSkills?: string[];
  cvCertifications?: CvCertification[];
  cvCustomCategories?: CvCustomCategory[];

  // Dedicated Category Specific Data
  watchItems?: WatchItem[];
  weddingCard?: WeddingCardDetails;
  tuition?: TuitionDetails;
  restaurantMenu?: RestaurantMenuItem[];
  restaurantLoadingAnimation?: boolean;
  boutiqueLookbook?: ProductItem[];

  // CV Section Display Toggles & Layout Formats
  cvShowSummary?: boolean;
  cvShowExperience?: boolean;
  cvShowEducation?: boolean;
  cvShowSkills?: boolean;
  cvShowProjects?: boolean;
  cvShowCertifications?: boolean;
  cvFormat?: 'classic' | 'modern' | 'compact';

  // Trust Badges
  trustBadgesEnabled?: boolean;
  trustBadges?: TrustBadgeItem[];

  // Reviews & Testimonials
  reviewsEnabled?: boolean;
  reviewsTitle?: string;
  reviewsSubtitle?: string;
  reviews?: ReviewItem[];

  // FAQ
  faqEnabled?: boolean;
  faqTitle?: string;
  faqs?: FaqItem[];

  // About Us / Brand Story
  aboutEnabled?: boolean;
  aboutTitle?: string;
  aboutText?: string;
  aboutImageUrl?: string;

  // Footer & Social
  footerBlurb?: string;
  footerCopyright?: string;
  footerInstagramUrl?: string;
  footerAddress?: string;
  footerEmail?: string;

  // Deployment metadata
  liveUrl?: string; // e.g. 'https://myshop.linkal.in'
  githubRepoUrl?: string;
  vercelProjectId?: string;
  vercelDeploymentId?: string;
  cloudflareDnsId?: string;
  deploymentLogs?: DeploymentLogEntry[];
  lastDeployedAt?: string;
  lastError?: string;

  // Subscription & Free Trial
  planStatus?: 'trial' | 'active' | 'expired';
  planType?: 'free_cv' | 'monthly_299' | 'quarterly_799' | 'halfyearly_1499' | 'yearly_2699';
  isFreeLifetime?: boolean;
  trialEndsAt?: string;
  userEmail?: string;
  userName?: string;
  contactEmail?: string;
  userGoogleId?: string;
  visitsCount?: number;
  clicksCount?: number;
  templateId?: string;

  createdAt: string;
  updatedAt: string;
}
