"use client";

import { Title, Text, Skeleton } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { SharedButton } from "@/components/ui/SharedButton";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

interface ArticleDetailProps {
  article?: {
    title: string;
    description: string;
    image: string | File | null;
  };
  isLoading?: boolean;
}


export function HeroSection({
  article,
  isLoading = false,
}: ArticleDetailProps) {
  const handleScroll = () => {
    const detailSection = document.getElementById("article-detail");
    if (detailSection) {
      detailSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 text-left border-b bg-surface border-border">
      <div className="container grid items-center grid-cols-1 gap-8 px-4 mx-auto md:grid-cols-2">
        <div>
          {isLoading ? (
            <>
              <Skeleton height={32} width={150} radius="xl" mb={24} />
              <Skeleton height={48} width="80%" mb={24} />
              <Skeleton height={16} width="90%" mb={20} />
              <Skeleton height={40} width={120} radius="md" />
            </>
          ) : (
            <>
              <span className="inline-block px-5 py-2 mb-6 font-serif text-sm font-bold rounded-full bg-primary-accent text-light">
                Featured Article
              </span>
              <Title
                order={1}
                className="max-w-3xl mb-6 font-serif text-5xl font-bold text-blueblack-white"
              >
                {article?.title || ""}
              </Title>
              <Text
                className="font-serif text-primary"
                size="md"
                my={20}
                // Use inline styles for a safe CSS line-clamp fallback (no plugin required)
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {article?.description || ""}
              </Text>
              <SharedButton
                variant="filled"
                className="my-5 font-serif bg-primary-accent text-light md:mb-0"
                rounded={true}
                onClick={handleScroll}
              >
                Read More ↓
              </SharedButton>
            </>
          )}
        </div>

        <div className="w-full h-full">
          {isLoading ? (
            <Skeleton height={400} width="100%" radius="xl" />
          ) : (
            <Carousel
              withIndicators
              loop
              height={400}
              plugins={[Autoplay({ delay: 2000 })]}
            >
             {[typeof article?.image === "string" ? article.image : "/images/logo-red.png"].map((src, index) => (
   <Carousel.Slide key={index}>
                  <Image
                    src={src}
                    alt="article images"
                    width={600}
                    height={400}
                    className="object-cover w-full h-full rounded-xl"
                  />
                </Carousel.Slide>
              ))}
            </Carousel>
          )}
        </div>
      </div>
    </section>
  );
}
