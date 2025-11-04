export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  subcategory: string;
  author: string;
  date: Date | null;
  readTime: string;
  image: string | File | null;
  href: null;
  content: string;
  description: string;
  isPremium: boolean;
  status: "DRAFT" | "REVIEW" | "PUBLISHED";
  caption: string;
  quote: string;
  quoteAuthor: string;
  tag: string;
  noOfReaders: number;
}

export interface SubscriptionPlan {
  id: string;
  title: string;
  description: string;
  price: string | { monthly: string; annual: string };
  features: string[];
  buttonText: string;
  buttonLink: string;
  highlighted?: boolean;
}

export interface Startup {
  id: string;
  name: string;
  description: string;
  image: string;
  href: string;
}

export interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
  isHighlighted?: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "Admin" | "User";
}

export interface Profile {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role: "Admin" | "User";
  enablePersonalization?: boolean;
  trackReadingProgress?: boolean;
  contentUpdateNotifications?: boolean;
  topics?: string[];
  //eslint-disable-next-line
  savedArticles?: any[];
  //eslint-disable-next-line
  readingHistory?: any[];
}

export interface Resource {
  title: string;
  description: string;
  category:
    | "Featured Insight"
    | "Our Latest Reports"
    | "Data & Ensights"
    | "Date Hub & Archive";
}
export interface Corporate {
  id?: string;
  title: string;
  description: string;
  content: string;
  image: string | File | null;
  profileImage: string | File | null;
  quote?: string;
  name: string;
  role: string;
  born: string;
  education: string;
  mission: string;
  specialties: string;
  certifications: string;
  motto: string;
  founded: string;
}
