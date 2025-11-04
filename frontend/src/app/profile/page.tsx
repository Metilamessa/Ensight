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
import ResetPasswordForm from "@/components/ui/auth/ResetPasswordForm";
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
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [resetPasswordOpened, setResetPasswordOpened] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          router.push("/login");
          return;
        }

        // First, get the current user to get their ID
        let userId: string | null = null;
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            userId = user?.id || user?.user_id || null;
          } catch (e) {
            console.error("Failed to parse stored user", e);
          }
        }

        // If no userId from localStorage, try to get it from /auth/me
        if (!userId) {
          try {
            const meResponse = await fetch("/api/auth/me", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            
            if (meResponse.ok) {
              const meData = await meResponse.json();
              userId = meData?.id || meData?.user_id || null;
              // Update localStorage with the user data
              if (meData) {
                localStorage.setItem("user", JSON.stringify(meData));
              }
            }
          } catch (e) {
            console.error("Failed to fetch current user", e);
          }
        }

        if (!userId) {
          setLoading(false);
          setProfile(null);
          return;
        }

        // Store userId in state for later use
        setUserId(userId);

        // Now fetch the profile using the userId
        const res = await fetch(`/api/profile/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        
        const data = await res.json();
        if (!res.ok) {
          setProfile(null);
          console.error("Failed to fetch profile:", data.message || "Profile not found");
          return;
        }
        
        setProfile(data);
        setSettings({
          enablePersonalization: data?.enable_personalization || data?.enablePersonalization || false,
          trackReadingProgress: data?.track_reading_progress || data?.trackReadingProgress || false,
          contentUpdateNotifications: data?.content_update_notifications || data?.contentUpdateNotifications || false,
        });
        setSelectedTopics(Array.isArray(data?.topics) ? data.topics : (typeof data?.topics === 'string' ? JSON.parse(data.topics) : []));
        setProfileImagePreview(data?.profile_image || data?.profileImage || null);
      } catch (error) {
        setProfile(null);
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSettingChange = (setting: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    if (!userId) {
      setUpdateError("User ID not found");
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const formData = new FormData();
      
      // Add settings
      if (settings.enablePersonalization !== undefined) {
        formData.append("enable_personalization", String(settings.enablePersonalization));
      }
      if (settings.trackReadingProgress !== undefined) {
        formData.append("track_reading_progress", String(settings.trackReadingProgress));
      }
      if (settings.contentUpdateNotifications !== undefined) {
        formData.append("content_update_notifications", String(settings.contentUpdateNotifications));
      }
      
      // Add topics as JSON string
      if (selectedTopics.length > 0) {
        formData.append("topics", JSON.stringify(selectedTopics));
      }
      
      // Add profile image if selected
      if (profileImage) {
        formData.append("profile_image", profileImage);
      }

      const response = await fetch(`/api/profile/${userId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.detail || "Failed to update profile");
      }

      const updatedData = await response.json();
      setProfile(updatedData);
      setSelectedTopics(updatedData?.topics || []);
      setProfileImagePreview(updatedData?.profileImage || null);
      setProfileImage(null); // Clear file input
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
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
            Welcome, {profile?.firstName || profile?.firstName || ""} {profile?.lastName || profile?.lastName || ""}{" "}
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
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-blue">
                  Profile Image
                </label>
                <div className="flex items-center gap-4">
                  {profileImagePreview && (
                    <img
                      src={profileImagePreview}
                      alt="Profile preview"
                      className="object-cover w-20 h-20 rounded-full border-2 border-border"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-accent file:text-white hover:file:bg-primary-accent/80"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <SettingsPanel
                  settings={settings}
                  handleSettingChange={handleSettingChange}
                  onPasswordReset={() => setResetPasswordOpened(true)}
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
              <SavedArticlesPanel profile={profile} userId={userId} />
            </Tabs.Panel>
            <Tabs.Panel value="history" className="mt-6">
              <ReadingHistoryPanel profile={profile} />
            </Tabs.Panel>
          </Tabs>
          <ResetPasswordForm
            opened={resetPasswordOpened}
            onClose={() => setResetPasswordOpened(false)}
          />
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
