"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import CorporateFormBase from "./CorporateFormBase";
import { Corporate } from "@/lib/types";

interface AddCorporateFormProps {
  onClose: () => void;
}

export default function AddCorporateForm({ onClose }: AddCorporateFormProps) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const initialValues: Corporate = {
    id: uuidv4(),
    title: "",
    description: "",
    content: "",
    image: "",
    profileImage: "",
    quote: "",
    name: "",
    role: "",
    born: "",
    education: "",
    mission: "",
    specialties: "",
    certifications: "",
    motto: "",
    founded: "",
  };

  const handleSubmit = async (values: Corporate) => {
    if (!token) {
      toast.error("Authentication token missing");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
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

      const response = await fetch("/api/corporate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Failed to create corporate entry");
        return;
      }

      toast.success("Corporate entry created successfully");
      onClose();
      //eslint-disable-next-line
    } catch (error: any) {
      toast.error(error.message || "Failed to create corporate entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CorporateFormBase
      initialValues={initialValues}
      onSubmit={handleSubmit}
      loading={loading}
      isEditMode={false}
    />
  );
}
