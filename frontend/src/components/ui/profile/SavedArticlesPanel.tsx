import React from "react";
import { Text } from "@mantine/core";

interface Profile {
  //eslint-disable-next-line
  savedArticles?: any[];
}

interface SavedArticlesPanelProps {
  profile: Profile | null;
}

const SavedArticlesPanel: React.FC<SavedArticlesPanelProps> = ({ profile }) => (
  <Text className="text-muted">
    {profile?.savedArticles?.length
      ? "Saved articles here."
      : "No saved articles yet."}
  </Text>
);

export default SavedArticlesPanel;
