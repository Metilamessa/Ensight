import { Title, Text, Image, Paper } from "@mantine/core";
import { trustedPartners } from "@/lib/data";

export function TrustedBy() {
  return (
    <section className="bg-background py-18">
      <div className="max-w-[1200px] mx-auto px-4">
        <Title
          order={2}
          className="text-primary text-center text-3xl font-bold mb-4 animate-fade-in-up"
        >
          Trusted By
        </Title>
        <Text className="text-secondary text-center text-lg mb-12 max-w-xl mx-auto">
          We’re proud to partner with leading organizations driving impact
          across Africa and beyond.
        </Text>
        <div className="flex flex-row space-x-4 overflow-x-auto pb-4">
          {trustedPartners.map((partner) => (
            <Paper
              key={partner.name}
              className="bg-surface border border-border shadow-card p-6 flex items-center justify-center w-[200px] flex-shrink-0"
              radius="md"
            >
              <Image
                src={partner.logo}
                alt={`${partner.name} logo`}
                className="max-w-[150px] h-auto opacity-80 hover:opacity-100 transition-opacity"
                fallbackSrc="/images/placeholder-logo.png"
              />
            </Paper>
          ))}
        </div>
      </div>
    </section>
  );
}
