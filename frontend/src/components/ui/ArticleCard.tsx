import {
  Card,
  Title,
  Text,
  Image,
  Group,
  Badge,
  Skeleton,
} from "@mantine/core";
import { Article } from "@/lib/types";
import Link from "next/link";

interface ArticleCardProps {
  article?: Article;
  linkPath?: string;
  loading?: boolean;
}

export function ArticleCard({
  article,
  linkPath,
  loading = false,
}: ArticleCardProps) {
  if (loading) {
    return (
      <div className="flex flex-col w-full gap-6 mt-8">
        {Array.from({ length: 1 }).map((_, i) => (
          <Skeleton
            key={i}
            height={150}
            radius="md"
            animate
            className="w-full"
          />
        ))}
      </div>
    );
  }

  if (!article) return null;

  return (
    <Link href={linkPath ? linkPath : ``} passHref>
      <Card
        key={article.slug || article.id}
        withBorder
        className="flex flex-col w-full transition-shadow duration-200 cursor-pointer bg-none rounded-xl hover:shadow-lg"
        radius="md"
        style={{
          backgroundColor: "var(--background)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow-card)",
        }}
        p={0}
      >
        <div className="relative">
          <Image
            src={article.image}
            alt={article.title}
            className="w-full h-[160px] sm:h-[180px] lg:h-[200px] object-cover rounded-t-md"
            fallbackSrc="/images/logo-red.png"
          />
          {article.isPremium ? (
            <Badge
              className="absolute font-bold bg-blue-800 top-2 right-2 text-blueblack-white"
              color="blue"
              variant="filled"
            >
              PREMIUM
            </Badge>
          ) : (
            <Badge
              className="absolute font-bold bg-blue-800 top-2 right-2 text-blueblack-white"
              color="gray"
              variant="filled"
            >
              FREE
            </Badge>
          )}
        </div>
        <div className="flex flex-col flex-1 p-4">
          <Badge
            variant="outline"
            color="blue"
            className="mb-2 font-serif text-blueblack-white"
            style={{ borderColor: "#1e40af" }}
          >
            {article.category.split(" | ")[0] || "Uncategorized"}
          </Badge>
          <Title
            order={4}
            className="mb-2 font-serif font-bold line-clamp-2 text-blueblack-white"
          >
            {article.title?.slice(0, 40) || "Untitled Article"}
          </Title>
          <Text
            className="flex-1 mb-4 font-serif text-sm text-primary line-clamp-2"
            c="dimmed"
          >
            {article.description ||
              article.content?.slice(0, 100) ||
              "No description available"}
          </Text>
          <Group gap="xs" className="mt-auto">
            <Text className="font-serif text-md text-blueblack-white">
              {article.noOfReaders || 0} Readers |{" "}
              {article.readTime || "Unknown"}
            </Text>
          </Group>
        </div>
      </Card>
    </Link>
  );
}
