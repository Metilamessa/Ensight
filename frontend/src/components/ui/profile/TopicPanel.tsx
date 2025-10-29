import React from "react";
import { Title, Text, Badge, Group } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

const allTopics = ["Business", "Economy", "Technology", "Finance"];

interface TopicsPanelProps {
  selectedTopics: string[];
  handleTopicToggle: (topic: string) => void;
}

const TopicsPanel: React.FC<TopicsPanelProps> = ({
  selectedTopics,
  handleTopicToggle,
}) => (
  <div className="p-6 border rounded-lg shadow-sm bg-surface border-border">
    <Title order={3} className="mb-4 text-blue">
      Topic Preferences
    </Title>
    <Text className="mb-6 text-muted">
      Select topics you&apos;re interested in
    </Text>

    <Group gap="xs" className="flex flex-wrap gap-2 my-6">
      {allTopics.map((topic) => {
        const isSelected = selectedTopics.includes(topic);
        return (
          <Badge
            key={topic}
            variant={isSelected ? "filled" : "light"}
            color={isSelected ? "blue" : "gray"}
            onClick={() => handleTopicToggle(topic)}
            className="px-3 py-1 cursor-pointer"
            leftSection={isSelected ? <IconCheck size={14} /> : null}
          >
            {topic}
          </Badge>
        );
      })}
    </Group>

    <Text className="mt-5 text-sm text-muted">
      Click topics to add or remove them from your interests
    </Text>
  </div>
);

export default TopicsPanel;
