"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import ResourceFormBase from "./ResourceFormBase";

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

interface AddResourceFormProps {
  onClose: () => void;
}

export default function AddResourceForm({ onClose }: AddResourceFormProps) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const initialValues: Resource = {
    id: uuidv4(),
    title: "",
    description: "",
    category: "Featured Insight",
  };

  const handleSubmit = async (values: Resource) => {
    if (!token) {
      toast.error("Authentication token missing");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      // Backend expects featured_insight_id, but form doesn't have it
      // Using empty string for now - this should be updated when form is enhanced
      formData.append("featured_insight_id", "");
      formData.append("report_ids", "");
      formData.append("data_insight_ids", "");
      formData.append("event_ids", "");

      const response = await fetch("/api/resources", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Failed to create resource");
        return;
      }

      toast.success("Resource created successfully");
      onClose();
      //eslint-disable-next-line
    } catch (error: any) {
      toast.error(error.message || "Failed to create resource");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResourceFormBase
      initialValues={initialValues}
      onSubmit={handleSubmit}
      loading={loading}
      isEditMode={false}
    />
  );
}
