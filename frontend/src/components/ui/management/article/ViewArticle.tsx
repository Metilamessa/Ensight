import React from "react";
import { Badge, Image, Text, Title } from "@mantine/core";
import { Article } from "@/lib/types";

const statusColors: Record<"DRAFT" | "PUBLISHED", string> = {
  DRAFT: "red",
  PUBLISHED: "green",
};

interface ViewArticleProps {
  selectedArticle: Article | null;
}

const ViewArticle: React.FC<ViewArticleProps> = ({ selectedArticle }) => {
  if (!selectedArticle) {
    return <Text>No article selected.</Text>;
  }

  return (
    <div className="space-y-4">
      {selectedArticle.image && typeof selectedArticle.image === "string" && (
        <div>
          <Title order={4}>Image</Title>
          <Image
            src={selectedArticle.image}
            alt={selectedArticle.title}
            radius="md"
            height={200}
            fit="contain"
            className="w-full max-w-md"
          />
        </div>
      )}
      <div>
        <Title order={4}>Title</Title>
        <Text>{selectedArticle.title}</Text>
      </div>
      <div>
        <Title order={4}>Category</Title>
        <Text>{selectedArticle.category || "None"}</Text>
      </div>
      <div>
        <Title order={4}>Subcategory</Title>
        <Text>{selectedArticle.subcategory || "-"}</Text>
      </div>
      <div>
        <Title order={4}>Author</Title>
        <Text>{selectedArticle.author}</Text>
      </div>
      <div>
        <Title order={4}>Status</Title>
        <Badge
          color={statusColors[selectedArticle.status as "DRAFT" | "PUBLISHED"]}
          size="sm"
        >
          {selectedArticle.status}
        </Badge>
      </div>
      <div>
        <Title order={4}>Publication Date</Title>
        <Text>
          {selectedArticle.date
            ? new Date(selectedArticle.date).toLocaleDateString()
            : "-"}
        </Text>
      </div>
      <div>
        <Title order={4}>Description</Title>
        <Text>{selectedArticle.description || "-"}</Text>
      </div>
      <div>
        <Title order={4}>Content</Title>
        <Text>{selectedArticle.content || "-"}</Text>
      </div>
      <div>
        <Title order={4}>Read Time</Title>
        <Text>{selectedArticle.readTime || "-"}</Text>
      </div>
    </div>
  );
};

export default ViewArticle;
