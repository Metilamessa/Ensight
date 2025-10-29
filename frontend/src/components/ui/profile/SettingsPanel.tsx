import React from "react";
import { Title, Text, Switch } from "@mantine/core";

interface SettingsPanelProps {
  settings: {
    enablePersonalization: boolean;
    trackReadingProgress: boolean;
    contentUpdateNotifications: boolean;
  };
  //eslint-disable-next-line
  handleSettingChange: (setting: any) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  handleSettingChange,
}) => (
  <div className="p-6 border rounded-lg shadow-sm bg-surface border-border">
    <Title order={3} className="mb-4 text-blue">
      Personalization Settings
    </Title>
    <Text className="mb-6 text-muted">
      Adjust how we personalize your content
    </Text>
    {[
      {
        title: "Enable Personalization",
        description: "Use your reading history to recommend relevant content",
        value: settings.enablePersonalization,
        key: "enablePersonalization",
      },
      {
        title: "Track Reading Progress",
        description: "Save article progress to resume later",
        value: settings.trackReadingProgress,
        key: "trackReadingProgress",
      },
      {
        title: "Content Update Notifications",
        description: "Notify you when new relevant content is published",
        value: settings.contentUpdateNotifications,
        key: "contentUpdateNotifications",
      },
    ].map((setting) => (
      <div
        key={setting.key}
        className="flex items-center justify-between mb-5 last:mb-0"
      >
        <div className="flex-1 pr-4">
          <Text className="font-medium text-blue">{setting.title}</Text>
          <Text className="text-sm text-muted">{setting.description}</Text>
        </div>
        <Switch
          checked={setting.value}
          onChange={() =>
            handleSettingChange(setting.key as keyof typeof settings)
          }
          color="var(--color-blue)"
          size="md"
        />
      </div>
    ))}
  </div>
);

export default SettingsPanel;
