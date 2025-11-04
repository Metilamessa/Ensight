"use client";
import { useState, useEffect } from "react";
import { Article } from "@/lib/types";
import AnalysisArticleContent from "@/components/ui/AnalysisArticleContent";
import RecentArticles from "@/components/ui/RecentArticles";
import {
  IconBookmark,
  IconShare,
  IconClock,
  IconUsers,
  IconBook,
  IconCalendar,
} from "@tabler/icons-react";
import { Loader } from "@mantine/core";

export default function WeeklyAnalysis() {
  const [article, setArticle] = useState<Article>({} as Article);
  const [recentAnalysis, setRecentAnalysis] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  //eslint-disable-next-line
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const currentUser = localStorage.getItem("user");
    if (currentUser) {
      try {
        setUser(JSON.parse(currentUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleSaveArticle = async () => {
    if (!user?.id || !article?.id) return;
    const url = `/api/profile/${user.id}`;
    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          savedArticles: [article.id],
        }),
      });

      if (!response.ok) {
        console.error(`Failed to update profile: ${response.status}`);
      } else {
        console.log("Article saved successfully");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/article/analysis", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch article");
        }
        const data = await response.json();
        if (data.length > 0) {
          setArticle(data[0]);
          setRecentAnalysis(data.slice(1, 3));
        } else {
          setError("No articles found");
        }
        //eslint-disable-next-line
      } catch (err: any) {
        console.error("Error fetching article:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, []);

  const badges = [
    { label: article.category || "ANALYSIS | WEEKLY SESSIONS" },
    { label: article.isPremium ? "PREMIUM" : "FREE" },
    {
      label: article?.date
        ? new Date(article.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "May 10, 2025",
      icon: <IconCalendar size={14} className="inline-block mr-2 -mt-1" />,
    },
    {
      label: article.readTime || "5 min read",
      icon: <IconClock size={14} className="inline-block mr-2 -mt-1" />,
    },
    {
      label: article?.noOfReaders
        ? `${article.noOfReaders} readers`
        : "No readers",
      icon: <IconUsers size={14} className="inline-block mr-2 -mt-1" />,
    },
    {
      label: article.isPremium ? "Premium" : "Free",
      icon: <IconBook size={14} className="inline-block mr-2 -mt-1" />,
    },
  ];

  const buttons = [
    {
      label: "Save",
      icon: <IconBookmark size={16} className="inline-block mr-2 -mt-1" />,
      onClick: handleSaveArticle,
    },
    {
      label: "Share",
      icon: <IconShare size={16} className="inline-block mr-2 -mt-1" />,
      onClick: () => {
        console.log("Article shared");
      },
    },
  ];

  const handleArticleSelect = (article: Article) => {
    setArticle(article);
  };

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader size="xl" color="blue" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-500">{error}</div>
        </div>
      ) : (
        <div
          className="min-h-screen"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <div className="flex flex-col gap-6 px-2 py-6 sm:px-3 lg:px-4 lg:flex-row">
            <div className="lg:w-3/4">
              <AnalysisArticleContent
                selectedArticle={article}
                badges={badges}
                buttons={buttons}
              />
            </div>
            <div className="lg:w-1/4">
              <RecentArticles
                recentAnalysis={recentAnalysis}
                onArticleSelect={handleArticleSelect}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
