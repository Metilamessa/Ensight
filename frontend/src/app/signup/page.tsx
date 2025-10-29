"use client";

import AuthPage from "@/components/ui/AuthPage";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function SignupPage() {
  const setLoggedIn = useAuthStore(
    (state: { setLoggedIn: (value: boolean) => void }) => state.setLoggedIn
  );
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (user && token) {
        router.push("/");
      }
    }
  }, [router]);

  const handleSubmit = async (credentials: {
    email: string;
    password: string;
  }) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Signup failed");
      }

      const data = await res.json();

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setLoggedIn(true);
      router.push("/");

      //eslint-disable-next-line
    } catch (err: string | any) {
      setError(err.message);
    }
  };

  return (
    <div className="py-20 mx-auto">
      {error && (
        <p className="mt-2 mb-4 text-sm text-center text-red-500">{error}</p>
      )}
      <AuthPage isLogin={false} onSubmit={handleSubmit} />
    </div>
  );
}
