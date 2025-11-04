import { Card, Title, Text, Image } from "@mantine/core";
import { SharedButton } from "./SharedButton";
import { Startup } from "@/lib/types";
import { startups } from "@/lib/data";

export function StartupSection() {
  return (
    <section className="py-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <Title order={2} className="mb-8 text-text-primary">
          Featured Startups
        </Title>
        <div className="flex flex-row gap-6 pb-4 overflow-x-auto">
          {startups.map((startup: Startup) => (
            <Card
              key={startup.id}
              className="flex flex-col items-center flex-shrink-0 p-4 border bg-surface border-border shadow-card"
              radius="md"
              style={{ width: "250px", height: "250px" }}
            >
              <Image
                src={startup.image}
                alt={`${startup.name} logo`}
                className="w-auto h-16 mb-2"
                fallbackSrc="/images/placeholder-logo.png"
              />
              <Title
                order={4}
                className="mb-2 text-center text-text-primary line-clamp-1"
              >
                {startup.name}
              </Title>
              <Text className="flex-1 mb-4 text-sm text-center text-text-muted line-clamp-2">
                {startup.description}
              </Text>
              <SharedButton
                variant="filled"
                color="primary-accent"
                onClick={() => {
                  window.location.href = startup.href;
                }}
              >
                Learn More
              </SharedButton>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
