"use client";

import React, { use, useState, useEffect } from "react";
import { Article } from "../../../../lib/types";
import Image from "next/image";
import { BreadcrumbsNav } from "@/components/ui/BreadcrumbsNav";
import Link from "next/link";
import { Loader } from "@mantine/core";

export default function ReadingPage({
  params: paramsPromise,
}: {
  params: Promise<{ category: string; subcategory: string; slug: string }>;
}) {
  const { category, subcategory, slug } = use(paramsPromise);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  //eslint-disable-next-line
  const [authorProfile, setAuthorProfile] = useState<any>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      const url = `/api/article/${category}/${subcategory}/${slug}`;
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        if (!response.ok) {
          setError(`API responded with status: ${response.status}`);
          setLoading(false);
          return;
        }

        const data: Article = await response.json();
        if (!data || Object.keys(data).length === 0) {
          setError("No article data found");
          setLoading(false);
          return;
        }

        setArticle(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch article.");
        console.error(err);
        setLoading(false);
      }
    };

    fetchArticle();
  }, [category, subcategory, slug]);

  useEffect(() => {
    const fetchAuthorProfile = async (authorId: string) => {
      const url = `/api/profile/${authorId}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        if (!response.ok) {
          console.error(`Failed to fetch author profile: ${response.status}`);
          return null;
        }

        return await response.json();
      } catch (err) {
        console.error("Error fetching author profile:", err);
        return null;
      }
    };

    if (article && article.author) {
      const authorId = article.author;
      fetchAuthorProfile(authorId);
    }
  }, [article]);

  const breadcrumbItems = article
    ? [
        { label: "Home", href: "/" },
        { label: category, href: `` },
        { label: subcategory, href: `/${category}/${subcategory}` },
        { label: article.title, href: `/${category}/${subcategory}/${slug}` },
      ]
    : [
        { label: "Home", href: "/" },
        { label: category, href: `` },
        { label: subcategory, href: `/${category}/${subcategory}` },
        { label: slug, href: `/${category}/${subcategory}/${slug}` },
      ];

  return (
    <div className="min-h-screen pt-10">
      <BreadcrumbsNav items={breadcrumbItems} className="font-semibold" />
      <main className="max-w-5xl px-6 py-6 mx-auto">
        <article className="p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader size="xl" color="#D93A3A" />
            </div>
          ) : error ? (
            <div className="text-center text-red-600">
              <h1 className="mb-6 font-serif text-4xl font-bold text-center md:text-5xl">
                Error Loading Article
              </h1>
              <p className="mb-8 text-lg">{error}</p>
              <Link
                href="/"
                className="font-semibold text-blue-600 hover:underline"
              >
                Return to Home
              </Link>
            </div>
          ) : article ? (
            <>
              <h1 className="mb-6 font-serif text-4xl font-bold text-center md:text-5xl text-blueblack-white">
                {article.title}
              </h1>
              <div className="flex items-center justify-center gap-4 mb-8 text-sm text-primary">
                <span>
                  By{" "}
                  <span className="font-semibold underline text-blueblack-white">
                    {authorProfile
                      ? authorProfile?.firstName + " " + authorProfile?.lastName
                      : "No Author"}
                  </span>
                </span>
                <span>•</span>
                <span>{article.readTime}</span>
                {article.date && (
                  <>
                    <span>•</span>
                    <span>
                      {new Date(article.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </>
                )}
              </div>
              <div className="relative w-full mb-8 h-96">
                <Image
                  src={
                    typeof article.image === "string"
                      ? article.image
                      : "/placeholder-image.jpg"
                  }
                  alt={article.title}
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
              <div className="mb-8 font-serif leading-relaxed prose prose-lg max-w-none text-primary">
                {article.description && (
                  <p className="mb-6 text-xl italic text-primary">
                    {article.description}
                  </p>
                )}
                {article.content ? (
                  article.content
                    .split("\n")
                    .map((paragraph: string, index: number) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))
                ) : (
                  <p>{article.description}</p>
                )}
              </div>
              {article.isPremium && (
                <div className="p-4 mb-8 text-yellow-800 bg-yellow-100 rounded-md">
                  <p className="font-semibold">
                    This is a premium article. Subscribe to access exclusive
                    content.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <h1 className="mb-6 font-serif text-4xl font-bold text-center md:text-5xl text-blueblack-white">
                Article Not Found
              </h1>
              <p className="mb-8 text-lg text-primary">
                Sorry, we couldn&apos;t find the article you&apos;re looking
                for. It may have been moved or deleted.
              </p>
              <Link
                href="/"
                className="font-semibold text-blue-600 hover:underline"
              >
                Return to Home
              </Link>
            </div>
          )}
        </article>
        <section className="mt-12 text-center">
          <h2 className="mb-4 font-serif text-2xl font-semibold text-blueblack-white">
            Stay Updated with Our Newsletter
          </h2>
          <p className="mb-6 text-primary">
            Be the first to know about our latest news! Sign up below to
            register your interest:
          </p>
          <form className="flex justify-center max-w-md gap-4 mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-primary"
              required
            />
            <button
              type="submit"
              className="bg-[#D93A3A] text-white px-6 py-3 rounded-lg hover:bg-[#B32F2F] cursor-pointer transition font-serif"
            >
              Subscribe
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
