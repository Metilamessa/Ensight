"use client";

import { useEffect, useState } from "react";
import { Loader } from "@mantine/core";
import toast from "react-hot-toast";
import CorporateFormBase from "./CorporateFormBase";
import { Corporate } from "@/lib/types";

interface EditCorporateFormProps {
  corporate: Partial<Corporate>;
  onClose: () => void;
}

export default function EditCorporateForm({
  corporate,
  onClose,
}: EditCorporateFormProps) {
  const [token, setToken] = useState<string | null>(null);
  const [fetchedCorporate, setFetchedCorporate] = useState<Corporate | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    const fetchCorporateById = async () => {
      if (!corporate?.id || !token) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/corporate/${corporate.id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          toast.error("Failed to fetch corporate entry");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setFetchedCorporate(data);
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch corporate entry");
      } finally {
        setLoading(false);
      }
    };
    fetchCorporateById();
  }, [corporate?.id, token]);

  const handleSubmit = async (values: Corporate) => {
    if (!token) {
      toast.error("Authentication token missing");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      if (values.title) formData.append("title", values.title);
      if (values.description) formData.append("description", values.description);
      if (values.content) formData.append("content", values.content);
      if (values.quote) formData.append("quote", values.quote);
      if (values.name) formData.append("name", values.name);
      if (values.role) formData.append("role", values.role);
      if (values.born) formData.append("born", values.born);
      if (values.education) formData.append("education", values.education);
      if (values.mission) formData.append("mission", values.mission);
      if (values.specialties) formData.append("specialties", values.specialties);
      if (values.certifications) formData.append("certifications", values.certifications);
      if (values.motto) formData.append("motto", values.motto);
      if (values.founded) formData.append("founded", values.founded);
      if (values.image instanceof File) {
        formData.append("image", values.image);
      }
      if (values.profileImage instanceof File) {
        formData.append("profile_image", values.profileImage);
      }

      const response = await fetch(`/api/corporate/${values.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Failed to update corporate entry");
        return;
      }

      toast.success("Corporate entry updated successfully");
      onClose();
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to update corporate entry");
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

  if (!fetchedCorporate) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <p>Corporate entry not found</p>
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
    <CorporateFormBase
      initialValues={fetchedCorporate}
      onSubmit={handleSubmit}
      loading={loading}
      isEditMode={true}
    />
  );
}
