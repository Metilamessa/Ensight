"use client";

import { SubscriptionPlans } from "@/components/ui/SubscriptionPlans";
import { BreadcrumbsNav } from "@/components/ui/BreadcrumbsNav";

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Subscribe", href: "/subscribe" },
];

export default function SubscribePage() {
  return (
    <div className="w-full">
      <section className="py-12">
        <div className="max-w-[1200px] mx-auto px-4">
          <BreadcrumbsNav items={breadcrumbItems} className="mb-8" />
          <SubscriptionPlans />
        </div>
      </section>
    </div>
  );
}
