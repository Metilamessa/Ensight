"use client";

import { useEffect, useState } from "react";
import { Loader } from "@mantine/core";
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

interface EditResourceFormProps {
  resource: Partial<Resource>;
  onClose: () => void;
}

export default function EditResourceForm({
  resource,
  onClose,
}: EditResourceFormProps) {
  const [token, setToken] = useState<string | null>(null);
  const [fetchedResource, setFetchedResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    const fetchResourceById = async () => {
      if (!resource?.id || !token) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/resources/${resource.id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          toast.error("Failed to fetch resource");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setFetchedResource(data);
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch resource");
      } finally {
        setLoading(false);
      }
    };
    fetchResourceById();
  }, [resource?.id, token]);

  const handleSubmit = async (values: Resource) => {
    if (!token) {
      toast.error("Authentication token missing");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      if (values.title) formData.append("title", values.title);
      if (values.description) formData.append("description", values.description);
      // Backend expects these fields for PATCH - using empty strings if not provided
      // Note: Form may need enhancement to include these fields
      formData.append("featured_insight_id", "");
      formData.append("report_ids", "");
      formData.append("data_insight_ids", "");
      formData.append("event_ids", "");

      const response = await fetch("/api/resources", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Failed to update resource");
        return;
      }

      toast.success("Resource updated successfully");
      onClose();
      //eslint-disable-next-line
    } catch (error: any) {
      toast.error(error.message || "Failed to update resource");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader />
      </div>
    );
  }

  if (!fetchedResource) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <p>Resource not found</p>
        <button
          onClick={onClose}
          className="px-4 py-2 text-white bg-red-500 rounded-md cursor-pointer"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <ResourceFormBase
      initialValues={fetchedResource}
      onSubmit={handleSubmit}
      loading={loading}
      isEditMode={true}
    />
  );
}
