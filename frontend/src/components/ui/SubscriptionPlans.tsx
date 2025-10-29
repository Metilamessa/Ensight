import { Title } from "@mantine/core";
import { SharedButton } from "@/components/ui/SharedButton";
import { plans } from "@/lib/data";
import { Plan } from "@/lib/types";

export function SubscriptionPlans() {
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
          {plans.map((plan: Plan) => (
            <div
              key={plan.name}
              className={`border border-border shadow-md rounded-2xl p-6 flex flex-col ${
                plan.isHighlighted
                  ? "bg-surface-emphasis border-primary-accent"
                  : "bg-surface"
              }`}
            >
              <p className="mb-2 text-xl font-semibold text-primary">
                {plan.name}
              </p>
              <p className="mb-4 text-2xl font-bold text-secondary">
                {plan.price}
              </p>
              <p className="flex-1 mb-6 text-muted">{plan.description}</p>
              <ul className="mb-6 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start text-secondary">
                    <span className="mr-2 text-primary-accent">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <SharedButton
                className={`${
                  plan.isHighlighted
                    ? "bg-primary-accent text-light"
                    : "bg-surface-alt text-primary"
                } hover:bg-primary-accent hover:text-light`}
                rounded
                variant="filled"
              >
                Select Plan
              </SharedButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
