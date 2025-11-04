"use client";

import { useEffect, useState } from "react";
import { Loader } from "@mantine/core";
import toast from "react-hot-toast";
import UserFormBase from "./UserFormBase";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface EditUserFormProps {
  user: Partial<User>;
  onClose: () => void;
}

export default function EditUserForm({ user, onClose }: EditUserFormProps) {
  const [token, setToken] = useState<string | null>(null);
  const [fetchedUser, setFetchedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    const fetchUserById = async () => {
      if (!user?.id || !token) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/profile/${user.id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          toast.error("Failed to fetch user");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setFetchedUser(data);
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };
    fetchUserById();
  }, [user?.id, token]);

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
      };

      const response = await fetch(`/api/profile/${values.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Failed to update user");
        return;
      }

      toast.success("User updated successfully");
      onClose();
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to update user");
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

  if (!fetchedUser) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <p>User not found</p>
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
    <UserFormBase
      initialValues={fetchedUser}
      onSubmit={handleSubmit}
      loading={loading}
      isEditMode={true}
    />
  );
}
