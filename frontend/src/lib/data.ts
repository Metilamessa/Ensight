import { SubscriptionPlan, Plan } from "./types";

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "free",
    title: "Free Access",
    description:
      "Stay informed with our publicly available articles and weekly highlights.",
    price: "Always Free",
    features: [
      "Read selected free articles weekly",
      "Access public topic pages",
      "Receive general newsletter (optional)",
      "Limited archive access",
    ],
    buttonText: "Continue Free",
    buttonLink: "#main-content",
  },
];

export const plans: Plan[] = [
  {
    name: "Free",
    price: "$0/month",
    description: "Get started with basic access to Ensight’s insights.",
    features: [
      "Access to weekly newsletters",
      "Limited article access",
      "Community forum access",
    ],
  },
  {
    name: "Standard",
    price: "$15/month",
    description: "Unlock more insights for professionals.",
    features: [
      "Full article access",
      "Weekly newsletters",
      "Exclusive reports",
      "Priority support",
    ],
    isHighlighted: true,
  },
  {
    name: "Premium",
    price: "$30/month",
    description: "Comprehensive access for industry leaders.",
    features: [
      "All Standard features",
      "Real-time data dashboards",
      "Personalized insights",
      "Dedicated account manager",
    ],
  },
];

export const recentAnalysis = [
  {
    id: "1",
    category: "TECH AND SCIENCE | DIGITAL",
    title: "Digital Transformation in Ethiopia: Progress and Potential",
    description: "Examining Ethiopia's journey towards a digital economy.",
    image: "/images/gerd-placeholder.jpg",
    href: "/tech-and-science/digital/transformation-progress",
    author: "Mesfin Belay",
    date: "May 15, 2025",
    readTime: "9 min",
    isPremium: false,
    slug: "digital-transformation-in-ethiopia-progress-and-potential",
    content: "",
    caption: "Digital Transformation in Ethiopia",
  },
  {
    id: "2",
    category: "TECH AND SCIENCE | DIGITAL",
    title: "E-Commerce Boom in Ethiopia: Opportunities for Growth",
    description: "How e-commerce is reshaping Ethiopia's business landscape.",
    image: "/images/frehiwot.jpg",
    href: "/tech-and-science/digital/ecommerce-growth",
    author: "Kalkidan Yohannes",
    date: "May 8, 2025",
    readTime: "7 min",
    isPremium: true,
    slug: "e-commerce-boom-in-ethiopia-opportunities-for-growth",
    content: "",
    caption: "E-Commerce Boom in Ethiopia",
  },
  {
    id: "3",
    category: "TECH AND SCIENCE | INNOVATION",
    title: "Ethiopia's Innovation Ecosystem: Startups and Beyond",
    description:
      "A look at how Ethiopia is fostering innovation through startups and tech hubs.",
    image: "/images/author-placeholder.jpg",
    href: "/tech-and-science/innovation/startup-ecosystem",
    author: "Tsegaye Girma",
    date: "May 1, 2025",
    isPremium: false,
    readTime: "7 min",
    slug: "ethiopias-innovation-ecosystem-startups-and-beyond",
    content: "",
    caption: "Ethiopia's Innovation Ecosystem",
  },
];

export const trustedPartners = [
  {
    name: "Global Corp",
    logo: "/images/global-corp-logo.png",
  },
  {
    name: "Africa Insights",
    logo: "/images/africa-insights-logo.png",
  },
  {
    name: "Eco Solutions",
    logo: "/images/eco-solutions-logo.png",
  },
  {
    name: "Tech Innovators",
    logo: "/images/tech-innovators-logo.png",
  },
  {
    name: "Finance Group",
    logo: "/images/finance-group-logo.png",
  },
];

export const navItems = [
  {
    label: "Business",
    submenu: [
      { label: "Startups", href: "/business/startups" },
      { label: "Markets", href: "/business/markets" },
      { label: "Policy & Regulation", href: "/business/policy-regulation" },
    ],
  },
  {
    label: "Finance",
    submenu: [
      { label: "Banking", href: "/finance/banking" },
      { label: "Investment", href: "/finance/investment" },
      { label: "Fintech", href: "/finance/fintech" },
      { label: "Capital Markets", href: "/finance/capital-markets" },
    ],
  },
  {
    label: "Economy",
    submenu: [
      { label: "Policies", href: "/economy/policies" },
      { label: "Trade", href: "/economy/trade" },
      { label: "Development", href: "/economy/development" },
      { label: "Inflation", href: "/economy/inflation" },
      { label: "Growth", href: "/economy/growth" },
      { label: "Jobs", href: "/economy/jobs" },
    ],
  },
  {
    label: "Tech and Science",
    submenu: [
      { label: "Innovation", href: "/technology/innovation" },
      { label: "Digital", href: "/technology/digital" },
      { label: "Research", href: "/technology/research" },
    ],
  },
  {
    label: "Corporate",
    href: "/corporate",
    submenu: [],
  },
  {
    label: "Analysis",
    href: "/analysis",
    submenu: [],
    badge: "WEEKLY",
  },
  {
    label: "Resources",
    href: "/resources",
    submenu: [],
  },
];

export const Footermenus = [
  {
    title: "Explore",
    items: [
      { label: "Business", href: "/business/startups" },
      { label: "Finance", href: "/finance/banking" },
      { label: "Economy", href: "/economy/policies" },
      { label: "Tech and Science", href: "/technology/innovation" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "About Us", href: "/" },
      { label: "Contact", href: "/" },
      { label: "Privacy Policy", href: "/" },
    ],
  },
  {
    title: "Connect",
    items: [
      { label: "Twitter", href: "https://twitter.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
    ],
  },
];
