"use client";

import React, { useEffect, useState } from "react";
import { Container, Loader } from "@mantine/core";
import { ArticleDetail } from "@/components/ui/ArticleDetail";
import { HeroSection } from "@/components/ui/HeroSection";
import { Article } from "@/lib/types";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [LatestArticles, setLatestArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/article/latest`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch profile");
        }
        setLatestArticles(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch articles", error);
        setLatestArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestArticles();
  }, [setLatestArticles, setLoading]);

  return (
    <Container fluid className="w-full px-0">
      <HeroSection article={LatestArticles[0]} isLoading={loading} />
      {loading ? (
        <Container size="lg" className="py-10">
          <div className="text-center text-gray-500">
            <Loader size="xl" color="blue" />
          </div>
        </Container>
      ) : LatestArticles.length === 0 ? (
        <Container size="lg" className="py-10">
          <div className="text-center text-gray-500">No articles found</div>
        </Container>
      ) : (
        <ArticleDetail article={LatestArticles[0]} />
      )}
    </Container>
  );
}
