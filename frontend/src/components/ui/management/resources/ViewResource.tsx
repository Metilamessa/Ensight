import React from "react";
import { Text, Title, Badge } from "@mantine/core";

interface Resource {
  id: string;
  title: string;
  description: string;
  category:
    | "Featured Insight"
    | "Our Latest Reports"
    | "Data & Ensights"
    | "Date Hub & Archive";
}

interface ViewResourceProps {
  selectedResource: Resource | null;
}

const categoryColors: Record<Resource["category"], string> = {
  "Featured Insight": "blue",
  "Our Latest Reports": "green",
  "Data & Ensights": "orange",
  "Date Hub & Archive": "purple",
};

const ViewResource: React.FC<ViewResourceProps> = ({ selectedResource }) => {
  if (!selectedResource) {
    return <Text>No resource selected.</Text>;
  }

  return (
    <div className="space-y-4">
      <div>
        <Title order={4}>Title</Title>
        <Text>{selectedResource.title || "-"}</Text>
      </div>
      <div>
        <Title order={4}>Description</Title>
        <Text>{selectedResource.description || "-"}</Text>
      </div>
      <div>
        <Title order={4}>Category</Title>
        <Badge color={categoryColors[selectedResource.category]} size="sm">
          {selectedResource.category || "-"}
        </Badge>
      </div>
    </div>
  );
};

export default ViewResource;
