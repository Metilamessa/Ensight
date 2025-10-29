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
      const corporateData = {
        title: values.title,
        description: values.description,
        content: values.content,
        quote: values.quote || null,
        name: values.name,
        role: values.role,
        born: values.born,
        education: values.education,
        mission: values.mission,
        specialties: values.specialties,
        certifications: values.certifications,
        motto: values.motto,
        founded: values.founded,
      };

      const formData = new FormData();
      formData.append("corporate_data", JSON.stringify(corporateData));
      if (values.image instanceof File) {
        formData.append("image", values.image);
      }
      if (values.profileImage instanceof File) {
        formData.append("profileImage", values.profileImage);
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
