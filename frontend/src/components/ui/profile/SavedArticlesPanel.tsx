"use client";
import React, { useEffect, useState } from "react";
import { Text, Loader, Button, Card, Group, Image, Stack } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { Article } from "@/lib/types";

interface Profile {
  id?: string;
  //eslint-disable-next-line
  savedArticles?: any[];
}

interface SavedArticlesPanelProps {
  profile: Profile | null;
  userId?: string | null;
}

const SavedArticlesPanel: React.FC<SavedArticlesPanelProps> = ({ profile, userId: propUserId }) => {
  const router = useRouter();
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Get userId from prop, profile, or localStorage
  const getUserFromStorage = () => {
    if (typeof window === "undefined") return null;
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  };
  
  const storedUser = getUserFromStorage();
  const userId = propUserId || storedUser?.id || storedUser?.user_id;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchSavedArticles = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to view saved articles");
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/profile/${userId}/saved_articles`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch saved articles");
        }

        const data = await response.json();
        setSavedArticles(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load saved articles");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedArticles();
  }, [userId]);

  const handleRemove = async (articleId: string) => {
    if (!userId) return;

    setRemovingId(articleId);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to remove articles");
      }

      const response = await fetch(
        `/api/profile/${userId}/saved_articles/${articleId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove article");
      }

      // Remove from local state
      setSavedArticles((prev) => prev.filter((article) => article.id !== articleId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove article");
      setTimeout(() => setError(null), 3000);
    } finally {
      setRemovingId(null);
    }
  };

  const handleArticleClick = (article: Article) => {
    const href = article.href || `/${article.category}/${article.subcategory}/${article.slug}`;
    router.push(href);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 rounded-lg bg-red-50">
        <Text className="text-red-600">{error}</Text>
      </div>
    );
  }

  if (savedArticles.length === 0) {
    return (
      <div className="p-8 text-center border rounded-lg bg-surface border-border">
        <Text className="mb-2 text-lg font-medium text-secondary">
          No saved articles yet
        </Text>
        <Text className="text-muted">
          Articles you save will appear here for easy access later.
        </Text>
      </div>
    );
  }

  return (
    <Stack gap="md">
      {savedArticles.map((article) => (
        <Card
          key={article.id}
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          className="cursor-pointer hover:shadow-md transition-shadow"
        >
          <Group gap="md" align="flex-start">
            {article.image && (
              <Image
                src={typeof article.image === "string" ? article.image : URL.createObjectURL(article.image)}
                alt={article.title}
                width={120}
                height={80}
                fit="cover"
                radius="sm"
                onClick={() => handleArticleClick(article)}
              />
            )}
            <Stack gap="xs" style={{ flex: 1 }}>
              <Text
                fw={600}
                size="lg"
                onClick={() => handleArticleClick(article)}
                className="cursor-pointer hover:text-primary-accent transition-colors"
              >
                {article.title}
              </Text>
              {article.description && (
                <Text size="sm" c="dimmed" lineClamp={2}>
                  {article.description}
                </Text>
              )}
              <Group gap="sm" mt="xs">
                <Text size="xs" c="dimmed">
                  {article.category}
                  {article.subcategory && ` • ${article.subcategory}`}
                </Text>
                {article.readTime && (
                  <Text size="xs" c="dimmed">
                    {article.readTime}
                  </Text>
                )}
              </Group>
            </Stack>
            <Button
              variant="subtle"
              color="red"
              size="sm"
              onClick={() => handleRemove(article.id)}
              loading={removingId === article.id}
              leftSection={<IconTrash size={16} />}
            >
              Remove
            </Button>
          </Group>
        </Card>
      ))}
    </Stack>
  );
};

export default SavedArticlesPanel;
