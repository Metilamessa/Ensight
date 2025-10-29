"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import UserFormBase from "./UserFormBase";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AddUserFormProps {
  onClose: () => void;
}

export default function AddUserForm({ onClose }: AddUserFormProps) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const initialValues: User = {
    id: uuidv4(),
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  };

  const handleSubmit = async (values: User) => {
    if (!token) {
      toast.error("Authentication token missing");
      return;
    }
    setLoading(true);
    try {
      const userData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        role: values.role,
        avatar: null,
        enablePersonalization: false,
        trackReadingProgress: false,
        contentUpdateNotifications: false,
        topics: [],
      };

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Failed to create user");
        return;
      }

      toast.success("User created successfully");
      onClose();
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserFormBase
      initialValues={initialValues}
      onSubmit={handleSubmit}
      loading={loading}
      isEditMode={false}
    />
  );
}
