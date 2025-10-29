"use client";

import React, { useEffect, useState } from "react";
import AuthPage from "@/components/ui/AuthPage";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function LoginPage() {
  const setLoggedIn = useAuthStore(
    (state: { setLoggedIn: (value: boolean) => void }) => state.setLoggedIn
  );
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      // CHANGE
      // if (user && token) {
      //   router.push("/");
      // }
    }
  }, [router]);

  const handleSubmit = async (credentials: {
    email: string;
    password: string;
  }) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Login failed");
      }

      const data = await res.json();

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setLoggedIn(true);
      router.push("/management");
      //eslint-disable-next-line
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="py-20 mx-auto">
      {error && (
        <p className="mt-2 mb-4 text-sm text-center text-red-500">{error}</p>
      )}
      <AuthPage isLogin={true} onSubmit={handleSubmit} />
    </div>
  );
}
