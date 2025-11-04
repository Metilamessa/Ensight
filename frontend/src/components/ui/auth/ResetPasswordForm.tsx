"use client";
import React, { useState } from "react";
import {
  Modal,
  TextInput,
  Button,
  Group,
  PasswordInput,
  Notification,
} from "@mantine/core";

interface ResetPasswordFormProps {
  opened: boolean;
  onClose: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  opened,
  onClose,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to reset password");
      }

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.detail || "Failed to reset password");
      }

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Close modal after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Reset Password"
      centered
      size="md"
    >
      {error && (
        <Notification
          color="red"
          title="Error"
          onClose={() => setError(null)}
          className="mb-4"
        >
          {error}
        </Notification>
      )}
      {success && (
        <Notification
          color="green"
          title="Success"
          className="mb-4"
        >
          Password reset successfully!
        </Notification>
      )}
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Current Password"
          type="password"
          placeholder="Enter your current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.currentTarget.value)}
          required
          mb="md"
          disabled={loading}
        />
        <PasswordInput
          label="New Password"
          placeholder="Enter your new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.currentTarget.value)}
          required
          mb="md"
          disabled={loading}
          minLength={6}
        />
        <PasswordInput
          label="Confirm New Password"
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.currentTarget.value)}
          required
          mb="md"
          disabled={loading}
          minLength={6}
        />
        <Group justify="flex-end" mt="xl">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={success}>
            Reset Password
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default ResetPasswordForm;

