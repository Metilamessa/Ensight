"use client";
import { Title, Loader, Text } from "@mantine/core";
import { SharedButton } from "@/components/ui/SharedButton";
import { SubscriptionPlan } from "@/lib/types";
import { useEffect, useState } from "react";

export function SubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch("/api/subscribe", {
          method: "GET",
          headers,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch subscription plans");
        }

        const data = await response.json();
        setPlans(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load subscription plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const formatPrice = (price: string | { monthly?: string; annual?: string }): string => {
    if (typeof price === "string") {
      return price;
    }
    if (price.monthly && price.annual) {
      return `${price.monthly}/month or ${price.annual}/year`;
    }
    return price.monthly || price.annual || "Contact us";
  };

  if (loading) {
    return (
      <section className="py-6">
        <div className="px-4 mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader size="lg" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-6">
        <div className="px-4 mx-auto">
          <div className="p-4 text-center border border-red-300 rounded-lg bg-red-50">
            <Text className="text-red-600">{error}</Text>
          </div>
        </div>
      </section>
    );
  }

  if (plans.length === 0) {
    return (
      <section className="py-6">
        <div className="px-4 mx-auto">
          <div className="p-8 text-center border rounded-lg bg-surface border-border">
            <Text className="mb-2 text-lg font-medium text-secondary">
              No subscription plans available
            </Text>
            <Text className="text-muted">
              Please check back later.
            </Text>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 ">
      <div className="px-4 mx-auto">
        <Title
          order={2}
          className="mb-4 text-3xl font-semibold text-center text-primary animate-fade-in-up"
        >
          Choose Your Plan
        </Title>
        <p className="max-w-2xl mx-auto mb-12 text-lg text-center text-secondary">
          Select the plan that best suits your needs and start exploring
          actionable business intelligence today.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border border-border shadow-md rounded-2xl p-6 flex flex-col ${
                plan.highlighted
                  ? "bg-surface-emphasis border-primary-accent"
                  : "bg-surface"
              }`}
            >
              <p className="mb-2 text-xl font-semibold text-primary">
                {plan.title}
              </p>
              <p className="mb-4 text-2xl font-bold text-secondary">
                {formatPrice(plan.price)}
              </p>
              <p className="flex-1 mb-6 text-muted">{plan.description}</p>
              <ul className="mb-6 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-secondary">
                    <span className="mr-2 text-primary-accent">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <SharedButton
                className={`${
                  plan.highlighted
                    ? "bg-primary-accent text-light"
                    : "bg-surface-alt text-primary"
                } hover:bg-primary-accent hover:text-light`}
                rounded
                variant="filled"
                onClick={() => {
                  if (plan.buttonLink) {
                    window.location.href = plan.buttonLink;
                  }
                }}
              >
                {plan.buttonText || "Select Plan"}
              </SharedButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
