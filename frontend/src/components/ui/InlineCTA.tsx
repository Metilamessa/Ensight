import { Text } from "@mantine/core";
import { SharedButton } from "@/components/ui/SharedButton";

export function InlineCTA() {
  return (
    <div className="my-6 text-center">
      <Text className="text-secondary mb-4">Want more insights like this?</Text>
      <SharedButton className="bg-primary-accent text-light">
        Subscribe Now
      </SharedButton>
    </div>
  );
}
