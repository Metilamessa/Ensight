"use client";

import { useState, useEffect } from "react";
import { Title, Text, Center } from "@mantine/core";
import { Article } from "@/lib/types";
import { ArticleCard } from "./ArticleCard";

export function RelatedArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/article/popular");
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        console.error("Error fetching related articles:", err);
        setError("Failed to load related articles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="w-full mt-8">
      <Title
        order={3}
        className="mb-4 font-serif text-xl font-semibold text-blueblack-white"
      >
        Related Articles
      </Title>
      <hr className="mb-6 border-t border-blueblack-white" />

      {error && (
        <Center className="w-full mt-8">
          <Text c="red" size="lg" className="font-serif">
            {error}
          </Text>
        </Center>
      )}

      {!error && loading && (
        <div className="flex flex-col w-full gap-6">
          {[1, 2].map((key) => (
            <ArticleCard key={key} loading />
          ))}
        </div>
      )}

      {!error && !loading && articles.length === 0 && (
        <Center className="w-full mt-8">
          <Text c="dimmed" size="lg" className="font-serif">
            No related articles found.
          </Text>
        </Center>
      )}

      {!error && !loading && articles.length > 0 && (
        <div className="flex flex-col w-full gap-6">
          {articles.slice(0, 2).map((article: Article) => (
            <ArticleCard
              key={article.id}
              article={article}
              linkPath={`/${article.category}/${article.subcategory}/${article.slug}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
