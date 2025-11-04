"use client";

import { useEffect, useState } from "react";
import {
  Title,
  Text,
  Box,
  Skeleton,
  SimpleGrid,
  Container,
  Stack,
  Grid,
} from "@mantine/core";
import { BreadcrumbsNav } from "./BreadcrumbsNav";
import Sidebar from "./Sidebar";
import { RelatedArticles } from "./RelatedArticles";
import { ArticleCard } from "./ArticleCard";
import { Article } from "@/lib/types";

interface ArticleSectionProps {
  category: string;
  subcategory: string;
  breadcrumbItems: { label: string; href: string }[];
}

export function ArticleSection({
  category,
  subcategory,
  breadcrumbItems,
}: ArticleSectionProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/article/${encodeURIComponent(
            category.toLowerCase()
          )}/${encodeURIComponent(subcategory.toLowerCase())}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );

        console.log("Category:", category);
        console.log("Subcategory:", subcategory);

        console.log("Fetch response status:", res.status);

        // if result is come
        

        if (!res.ok) {
          throw new Error(`Error fetching articles: ${res.statusText}`);
        }

        const data: Article[] = await res.json();
        setArticles(data);
        //eslint-disable-next-line
      } catch (err: any) {
        setError(err.message || "Failed to fetch articles");
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [category, subcategory]);

  return (
    <Box component="section" py={{ base: 24, md: 20 }}>
      <Container size="xl">
        <Grid gutter={50}>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="md">
              <BreadcrumbsNav items={breadcrumbItems} />

              <Title order={1} fw={500} size={28} c="blueblack-white">
                {category} - {subcategory}
              </Title>

              {loading && (
                <SimpleGrid
                  cols={{ base: 1, sm: 2, md: 3 }}
                  spacing="lg"
                  mt="md"
                >
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} height={150} radius="md" animate />
                  ))}
                </SimpleGrid>
              )}

              {error && (
                <Text c="red" mt="md">
                  {error}
                </Text>
              )}

              {!loading && !error && (
                <>
                  <Text size="lg" c="dimmed">
                    Showing {articles.length} articles
                  </Text>
                  <SimpleGrid cols={{ base: 1, sm: 2, md: 2 }} spacing="lg">
                    {articles.map((article) => {
                      const mainCategory = article.category.toLowerCase();
                      const subCategory =
                        article.subcategory?.toLowerCase() || "";
                      const slug = article.slug || "";

                      const linkPath = `/${mainCategory}/${subCategory}/${slug}`;

                      return (
                        <ArticleCard
                          key={article.slug || article.id}
                          article={article}
                          linkPath={linkPath}
                        />
                      );
                    })}
                  </SimpleGrid>
                </>
              )}
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="lg">
              <Sidebar />
              <RelatedArticles />
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
