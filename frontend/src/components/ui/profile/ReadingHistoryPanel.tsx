import React from "react";
import { Text } from "@mantine/core";

interface Profile {
  //eslint-disable-next-line
  readingHistory?: any[];
}

interface ReadingHistoryPanelProps {
  profile: Profile | null;
}

const ReadingHistoryPanel: React.FC<ReadingHistoryPanelProps> = ({
  profile,
}) => (
  <Text className="text-muted">
    {profile?.readingHistory?.length
      ? "Your reading history appears here."
      : "No reading history available."}
  </Text>
);

export default ReadingHistoryPanel;
