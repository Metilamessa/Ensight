"use client";
import React, { useEffect, useState } from "react";
import {
  Tabs,
  Container,
  Loader,
  Title,
  Button,
  Notification,
  Box,
} from "@mantine/core";
import { IconSettings, IconBookmark, IconHistory } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import SettingsPanel from "@/components/ui/profile/SettingsPanel";
import TopicsPanel from "@/components/ui/profile/TopicPanel";
import SavedArticlesPanel from "@/components/ui/profile/SavedArticlesPanel";
import ReadingHistoryPanel from "@/components/ui/profile/ReadingHistoryPanel";
import { Profile } from "@/lib/types";

const tabItems = [
  {
    value: "preferences",
    label: "Preferences",
    icon: <IconSettings size={16} className="inline-block mr-2 -mt-1" />,
  },
  {
    value: "saved",
    label: "Saved Articles",
    icon: <IconBookmark size={16} className="inline-block mr-2 -mt-1" />,
  },
  {
    value: "history",
    label: "Reading History",
    icon: <IconHistory size={16} className="inline-block mr-2 -mt-1" />,
  },
];

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    enablePersonalization: false,
    trackReadingProgress: false,
    contentUpdateNotifications: false,
  });
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profile/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          setProfile(null);
          throw new Error(data.message || "Failed to fetch profile");
        }
        setProfile(data);
        setSettings({
          enablePersonalization: data?.enablePersonalization || false,
          trackReadingProgress: data?.trackReadingProgress || false,
          contentUpdateNotifications: data?.contentUpdateNotifications || false,
        });
        setSelectedTopics(data?.topics || []);
      } catch (error) {
        setProfile(null);
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleSettingChange = (setting: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const response = await fetch(`/api/profile/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...settings,
          topics: selectedTopics,
        }),
      });

      if (!response.ok) {
        setProfile(null);
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedData = await response.json();
      setProfile(updatedData);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      setProfile(null);
      setUpdateError(
        error instanceof Error ? error.message : "Failed to update profile"
      );
      setTimeout(() => setUpdateError(null), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setLoggedIn(false);
    router.push("/login");
  };

  if (loading) {
    return (
      <Container className="flex items-center justify-center min-h-screen p-6">
        <Loader />
      </Container>
    );
  }

  return (
    <Container className="min-h-screen p-6">
      {profile ? (
        <>
          <Title order={1} className="mb-2 text-blue">
            Welcome, {profile?.firstName} {profile?.lastName}{" "}
            <span className="mb-6 text-sm text-muted"> ({profile?.email})</span>
          </Title>

          {updateSuccess && (
            <Notification
              title="Success"
              color="green"
              onClose={() => setUpdateSuccess(false)}
              className="mb-4"
            >
              Profile updated successfully!
            </Notification>
          )}
          {updateError && (
            <Notification
              title="Error"
              color="red"
              onClose={() => setUpdateError(null)}
              className="mb-4"
            >
              {updateError}
            </Notification>
          )}

          <Tabs
            defaultValue="preferences"
            classNames={{ list: "flex gap-3 mb-6 border-b border-border" }}
          >
            <Tabs.List>
              {tabItems.map((tab) => (
                <Tabs.Tab
                  key={tab.value}
                  value={tab.value}
                  leftSection={tab.icon}
                  className="custom-tab-style"
                >
                  {tab.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
            <Tabs.Panel value="preferences" className="mt-6">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <SettingsPanel
                  settings={settings}
                  handleSettingChange={handleSettingChange}
                />
                <TopicsPanel
                  selectedTopics={selectedTopics}
                  handleTopicToggle={handleTopicToggle}
                />
              </div>
              <div className="flex mt-6 space-x-7">
                <Button
                  onClick={handleUpdate}
                  loading={isUpdating}
                  color="blue"
                  size="md"
                >
                  Update Preferences
                </Button>
                <Button
                  color="red"
                  variant="outline"
                  onClick={handleLogout}
                  size="md"
                >
                  Logout
                </Button>
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="saved" className="mt-6">
              <SavedArticlesPanel profile={profile} />
            </Tabs.Panel>
            <Tabs.Panel value="history" className="mt-6">
              <ReadingHistoryPanel profile={profile} />
            </Tabs.Panel>
          </Tabs>
        </>
      ) : (
        <Box className="flex flex-col items-center justify-center p-6">
          <Title order={2} className="text-red-600">
            Profile not found
          </Title>
          <Button
            variant="outline"
            color="blue"
            className="mt-4"
            onClick={() => router.push("/")}
          >
            Go to Home
          </Button>
          <Button
            color="red"
            variant="outline"
            onClick={handleLogout}
            size="md"
            mt={10}
          >
            Logout
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default ProfilePage;
