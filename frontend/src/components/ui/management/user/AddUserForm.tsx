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
  password?: string; // optional, matches UserFormBase
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
    password: "", // optional but initialized
    role: "",
  };

  const handleSubmit = async (values: User) => {
    if (!token) {
      toast.error("Authentication token missing");
      return;
    }

    setLoading(true);

    try {
      // Ensure password is provided when creating a user
      if (!values.password || values.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("first_name", values.firstName);
      formData.append("last_name", values.lastName);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("role", values.role);

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.detail || error.message || "Failed to create user");
        return;
      }

      toast.success("User created successfully");
      onClose();
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
