import { Article } from "@/lib/types";
import { IconBook } from "@tabler/icons-react";
import Image from "next/image";

interface RecentArticlesProps {
  recentAnalysis: Article[];
  onArticleSelect: (article: Article) => void;
}

export default function RecentArticles({
  recentAnalysis,
  onArticleSelect,
}: RecentArticlesProps) {
  return (
    <div className="w-full">
      <h3
        className="mb-4 text-2xl font-bold"
        style={{ color: "var(--color-blueblack-white)" }}
      >
        Recent Weekly Analysis
      </h3>
      <div className="space-y-4">
        {recentAnalysis && recentAnalysis.length > 0 ? (
          recentAnalysis.map((article) => (
            <div
              key={article?.id}
              className="border bg-[var(--color-surface)] hover:bg-[var(--color-surface-alt)] transition rounded-md shadow-sm p-4 cursor-pointer"
              style={{ borderColor: "var(--color-border)" }}
              onClick={() => onArticleSelect(article)}
            >
              <div className="mb-3">
                <Image
                  src={article.image}
                  alt={article.title}
                  width={80}
                  height={40}
                  className="object-cover w-full h-auto rounded-md"
                />
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span
                  className="inline-flex items-center px-2 py-1 text-sm rounded-md"
                  style={{
                    color: "var(--color-blueblack-white)",
                    backgroundColor: "var(--color-surface-emphasis)",
                  }}
                >
                  {article.category}
                </span>
                {article.isPremium && (
                  <span
                    className="inline-flex items-center px-3 py-1 text-sm rounded-md"
                    style={{
                      color: "var(--color-light)",
                      backgroundColor: "var(--color-blue)",
                    }}
                  >
                    <IconBook size={14} className="inline-block mr-1 -mt-0.5" />
                    Premium
                  </span>
                )}
              </div>
              <p
                className="text-base font-semibold mb-1 hover:text-[var(--color-primary-accent)]"
                style={{ color: "var(--color-blueblack-white)" }}
              >
                {article.title}
              </p>
              <p
                className="mb-2 text-sm"
                style={{ color: "var(--color-blueblack-white)" }}
              >
                {article.description}
              </p>
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: "var(--color-blueblack-white)" }}
              >
                <span>{article.author}</span>
                <span>•</span>
                <span>
                  {new Date(article.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span>•</span>
                <span>{article.readTime}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No recent articles available</div>
        )}
      </div>
    </div>
  );
}
