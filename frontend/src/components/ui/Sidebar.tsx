"use client";

import { useEffect, useState } from "react";
import { Text, Divider, Loader, Center } from "@mantine/core";
import { Article } from "@/lib/types";
import { ArticleCard } from "./ArticleCard";

export default function Sidebar() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        setError(null);
        const res = await fetch("/api/article/popular");

        if (!res.ok) {
          throw new Error(
            `Failed to fetch articles: ${res.status} ${res.statusText}`
          );
        }

        const data = await res.json();
        setArticles(data);
        //eslint-disable-next-line
      } catch (err: any) {
        console.error(err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);
  const article = articles[0];

  return (
    <aside>
      <div
        style={{
          backgroundColor: "var(--background)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow-card)",
        }}
        className="w-full mx-auto my-4"
      >
        <Text
          mb="md"
          w={700}
          className="font-serif text-xl text-blueblack-white"
          style={{ fontFamily: "serif" }}
        >
          Popular This Week
        </Text>

        <Divider mb="md" style={{ borderTopColor: "rgba(156, 163, 175, 1)" }} />

        {loading ? (
          <Center h={100}>
            <Loader color="blue" />
          </Center>
        ) : error ? (
          <Center h={100}>
            <Text
              c="red"
              className="font-serif"
              style={{ fontFamily: "serif" }}
            >
              {error}
            </Text>
          </Center>
        ) : articles.length === 0 ? (
          <Center h={100}>
            <Text
              c="dimmed"
              className="font-serif"
              style={{ fontFamily: "serif" }}
            >
              No articles found
            </Text>
          </Center>
        ) : (
          <div key={article.slug}>
            <ArticleCard
              key={article.slug || article.id}
              article={article}
              linkPath={`/${article.category}/${article.subcategory}/${article.slug}`}
            />
          </div>
        )}
      </div>
    </aside>
  );
}
