"use client";

import { useEffect, useState } from "react";
import { Article } from "@/lib/types";
import ArticleFormBase from "./ArticleFormBase";
import toast from "react-hot-toast";
import { Loader } from "@mantine/core";

interface EditArticleFormProps {
  article: Partial<Article>;
  onClose: () => void;
}

export default function EditArticleForm({
  article,
  onClose,
}: EditArticleFormProps) {
  const [token, setToken] = useState<string | null>(null);
  const [fetchedArticle, setFetchedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    const fetchArticleById = async () => {
      if (!article?.id || !token) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/article/id/${article.id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          toast.error("Failed to fetch article");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setFetchedArticle(data);
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch article");
      } finally {
        setLoading(false);
      }
    };
    fetchArticleById();
  }, [article?.id, token]);

  const handleSubmit = async (values: Article) => {
    if (!token) {
      toast.error("Authentication token missing");
      return;
    }
    setLoading(true);
    try {
      const articleData = {
        title: values.title,
        status: values.status,
        category: values.category,
        subcategory: values.subcategory || null,
        date: values.date || null,
        read_time: values.readTime,
        content: values.content,
        description: values.description,
        is_premium: values.isPremium,
        caption: values.caption || null,
        quote: values.quote || null,
        quote_author: values.quoteAuthor || null,
        tag: values.tag || null,
        author: values.author || "d8a6d106-016d-4faa-9bed-5e223cd6536b",
      };

      const formData = new FormData();
      formData.append("article_data", JSON.stringify(articleData));
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (values.image && (values.image as any) instanceof File) {
        formData.append("image", values.image);
      }

      const response = await fetch(`/api/article/id/${values.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Failed to update article");
        return;
      }

      toast.success("Article updated successfully");
      onClose();
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to update article");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader />
      </div>
    );
  }

  if (!fetchedArticle) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <p>Article not found</p>
        <button
          onClick={onClose}
          className="px-4 py-2 text-white bg-red-500 rounded-md cursor-pointer"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <ArticleFormBase
      initialValues={fetchedArticle}
      onSubmit={handleSubmit}
      loading={loading}
      isEditMode={true}
    />
  );
}
