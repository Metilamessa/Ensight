"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Article } from "@/lib/types";
import ArticleFormBase from "./ArticleFormBase";
import toast from "react-hot-toast";

interface AddArticleFormProps {
  onClose: () => void;
}

export default function AddArticleForm({ onClose }: AddArticleFormProps) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedToken = localStorage.getItem("token");
    if (storedToken){ 
      console.log("Token loaded:", storedToken);
      setToken(storedToken);
    }
  }, []);

  const initialValues: Article = {
    id: uuidv4(),
    slug: "",
    title: "",
    status: "DRAFT",
    category: "",
    subcategory: "",
    author: "",
    date: new Date(),
    readTime: "",
    image: "",
    href: null,
    content: "",
    description: "",
    isPremium: false,
    caption: "",
    quote: "",
    quoteAuthor: "",
    tag: "",
    noOfReaders: 0,
  };

  const handleSubmit = async (values: Article) => {
    if (!token) {
      toast.error("Authentication token missing");
      return;
    }
    // Ensure an image File is provided; backend requires it and will fail to parse without it
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const imageFile = values.image && (values.image as any) instanceof File ? (values.image as File) : null;
    if (!imageFile) {
      toast.error("Image is required");
      return;
    }
    setLoading(true);
    try {
      const articleData = {
        title: values.title,
        status: values.status,
        category: values.category,
        author: values.author || "d8a6d106-016d-4faa-9bed-5e223cd6536b",
        subcategory: values.subcategory || null,
        date: values.date instanceof Date ? values.date.toISOString() : null,
        read_time: values.readTime,
        content: values.content,
        description: values.description,
        is_premium: values.isPremium,
        caption: values.caption || null,
        quote: values.quote || null,
        quote_author: values.quoteAuthor || null,
        tag: values.tag || null,
      };

      const formData = new FormData();
      formData.append("article_data", JSON.stringify(articleData));
      formData.append("image", imageFile, imageFile.name || "upload.jpg");

      const response = await fetch("/api/article", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Failed to create article");
        return;
      }

      toast.success("Article created successfully");
      onClose();
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to create article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ArticleFormBase
      initialValues={initialValues}
      onSubmit={handleSubmit}
      loading={loading}
      isEditMode={false}
    />
  );
}
