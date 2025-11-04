"use client";

import { useState, useEffect } from "react";
import { Article } from "@/lib/types";
import { Title, Text, Badge, Group, Button } from "@mantine/core";
import Image from "next/image";
import { JSX } from "react";

interface AnalysisArticleContentProps {
  selectedArticle: Article;
  badges: {
    label: string;
    icon?: JSX.Element | "";
  }[];
  buttons: {
    label: string;
    icon?: JSX.Element | "";
    onClick: () => void;
  }[];
}

export default function AnalysisArticleContent({
  selectedArticle,
  badges,
  buttons,
}: AnalysisArticleContentProps) {
  //eslint-disable-next-line
  const [authorProfile, setAuthorProfile] = useState<any>(null);
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

    if (selectedArticle && selectedArticle.author) {
      const authorId = selectedArticle.author;
      fetchAuthorProfile(authorId);
    }
  }, [selectedArticle]);

  return (
    <div className="flex gap-8 lg:gap-12">
      <div className="w-3/4 pl-0">
        <Group gap="xs" className="flex flex-wrap mb-2">
          {badges.slice(0, 2).map((badge, index) => (
            <Badge
              key={index}
              variant={index === 0 ? "light" : "filled"}
              size="sm"
              radius="md"
              className={`text-sm rounded-xl ${
                badge.label === "PREMIUM"
                  ? "text-[var(--color-light)] bg-[var(--color-blue)] px-3 ml-3"
                  : "text-[var(--color-blueblack-white)]"
              }`}
            >
              {badge.label}
            </Badge>
          ))}
        </Group>

        <Title
          order={1}
          className="mb-2 text-3xl font-bold leading-tight"
          style={{ color: "var(--color-primary-accent)" }}
        >
          {selectedArticle.title}
        </Title>

        <Text
          className="mb-4 text-base"
          style={{ color: "var(--color-muted)" }}
        >
          {selectedArticle.description ||
            "Expert analysis of the latest inflation data and its implications for Ethiopian businesses."}
        </Text>

        <Group className="flex items-start my-7">
          <Image
             src={
                    typeof authorProfile?.avatar === "string"
                      ? authorProfile?.avatar
                      : "/placeholder-image.jpg"
                  }
                  alt={authorProfile?.title}
            width={authorProfile?.avatar ? 48 : 100}
            height={48}
            className="object-cover my-auto rounded-full"
          />
          <div className="flex flex-col ml-4">
            <h1
              className="mb-1 text-sm font-semibold"
              style={{ color: "var(--color-blueblack-white)" }}
            >
              {authorProfile
                ? `${authorProfile.firstName} ${authorProfile.lastName}`
                : "Author Unknown"}
            </h1>
            <div
              className="flex items-center gap-3 text-sm"
              style={{ color: "var(--color-blueblack-white)" }}
            >
              <span>
              {selectedArticle.date
  ? new Date(selectedArticle.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  : "Unknown date"}

              </span>
              <span>• {selectedArticle.readTime || "15 min read"}</span>
            </div>
          </div>
        </Group>

        <Group gap="xs" className="flex flex-wrap my-10">
          {badges.slice(2).map((badge, index) => (
            <Badge
              key={index}
              variant="outline"
              className={`border text-[var(--color-blueblack-white)] hover:bg-[var(--color-surface-alt)] cursor-pointer rounded-xl mr-2 px-3 ${
                badge.label === "Premium"
                  ? "border-[var(--color-primary-accent)] text-[var(--color-primary-accent)]"
                  : "border-[var(--color-border)]"
              }`}
            >
              {badge.icon && badge.icon}
              {badge.label}
            </Badge>
          ))}
        </Group>

        <Group gap="xs" className="flex flex-wrap mb-6">
          {buttons.map((button, index) => (
            <Button
              key={index}
              leftSection={button.icon}
              variant="outline"
              onClick={button.onClick}
              className="border text-[var(--color-blueblack-white)] hover:bg-[var(--color-surface-alt)] cursor-pointer rounded-sm mr-2 px-3 py-1"
              style={{ borderColor: "var(--color-border)" }}
            >
              {button.label}
            </Button>
          ))}
        </Group>

        <div className="relative mb-4 overflow-hidden rounded-lg">
          <Image
             src={
                    typeof selectedArticle.image === "string"
                      ? selectedArticle.image
                      : "/placeholder-image.jpg"
                  }
                  alt={selectedArticle.title}
            width={400}
            height={150}
            className="object-cover w-full rounded-lg h-100"
          />
        </div>
        <Text
          className="mb-6 text-sm italic"
          style={{ color: "var(--color-blueblack-white)" }}
        >
          {selectedArticle.description ||
            "No description available for this article."}
        </Text>

        <div className="w-full mb-10 prose max-w-none">
          {selectedArticle?.content ? (
            selectedArticle.content
              .split("\n")
              .map((paragraph: string, index: number) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))
          ) : (
            <>No content available for this article.</>
          )}
        </div>
      </div>
    </div>
  );
}
