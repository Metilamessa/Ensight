import { useEffect, useState } from "react";
import { Title, Text, Group, Badge } from "@mantine/core";
import Sidebar from "@/components/ui/Sidebar";
import { SocialShare } from "@/components/ui/SocialShare";
import { RelatedArticles } from "@/components/ui/RelatedArticles";
import { Article } from "@/lib/types";
import Image from "next/image";

interface ArticleDetailProps {
  article?: Article;
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  const [imageSrc, setImageSrc] = useState<string>("/images/logo-red.png");

  useEffect(() => {
    if (!article?.image) return;

    if (article.image instanceof File) {
      const url = URL.createObjectURL(article.image);
      setImageSrc(url);

      return () => URL.revokeObjectURL(url);
    } else {
      setImageSrc(article.image);
    }
  }, [article?.image]);

  return (
    <section id="article-detail" className="w-full px-4 py-12">
      <div className="flex flex-col mx-auto sm:flex-row sm:items-start sm:space-x-8">
        <div className="w-full sm:flex-1 sm:max-w-[680px] min-w-0">
          <Title
            order={1}
            className="mb-6 font-serif text-3xl font-bold leading-tight tracking-wide sm:text-4xl text-blueblack-white"
          >
            {article?.title}
          </Title>

          <Group className="flex flex-wrap gap-3 my-6 font-serif text-sm text-muted sm:text-base">
            <Badge color="red" size="sm">
              {article?.category}
            </Badge>
            <Text className="whitespace-nowrap">By {article?.author}</Text>
            <Text className="whitespace-nowrap">
              {article?.date
                ? new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(new Date(article.date))
                : ""}
            </Text>
            <Text className="whitespace-nowrap">{article?.readTime}</Text>
          </Group>

          <SocialShare />

          <div className="relative my-6 w-full h-[240px] sm:h-[400px]">
            <Image
              src={imageSrc}
              alt="Article Image"
              className="object-cover rounded-lg"
              fill
              sizes="(max-width: 640px) 100vw, 680px"
            />

            <div className="absolute top-4 left-4">
              <Image
                src="/images/logo-red.png"
                alt="Ensight Logo"
                height={32}
                width={100}
              />
            </div>

            <div
              className="absolute bottom-0 left-0 w-full h-1/3"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
              }}
            />

            <div className="absolute bottom-4 left-4 max-w-[90%]">
              <Text
                className="font-serif text-xl font-extrabold sm:text-2xl md:text-3xl"
                style={{ color: "#fff" }}
                lineClamp={2}
              >
                {article?.title}
              </Text>
            </div>
          </div>

          <div className="font-serif prose prose-lg prose-invert text-primary max-w-none">
            {article?.content ||
              article?.description ||
              "No content available for this article. Please check back later."}
          </div>
        </div>

        <aside className="w-full sm:w-[480px] mt-10 sm:mt-0 sm:ml-auto flex-shrink-0">
          <Sidebar />
          <RelatedArticles />
        </aside>
      </div>
    </section>
  );
}
