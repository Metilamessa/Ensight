"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader } from "@mantine/core";

type AuthPageProps = {
  isLogin: boolean;
  onSubmit: (credentials: { email: string; password: string }) => void;
};

export default function AuthPage({ isLogin, onSubmit }: AuthPageProps) {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!/^\S+@\S+$/.test(values.email)) {
      newErrors.email = "Invalid email";
      valid = false;
    }

    if (values.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      try {
        await onSubmit({
          email: values.email,
          password: values.password,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-md p-6 border rounded-md shadow-lg">
        <h2 className="mb-6 text-2xl font-semibold text-center text-blueblack-white">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="block mb-1 font-medium text-blueblack-white"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              required
              value={values.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md border-blueblack-white text-gray-800"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-primary-accent">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1 font-medium text-blueblack-white"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Your password"
              required
              value={values.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md border-blueblack-white text-gray-800"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-primary-accent">
                {errors.password}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm">
              {isLogin ? "Need an account?" : "Already have an account? "}
              <Link
                href={isLogin ? "/signup" : "/login"}
                className="text-blue-light hover:underline"
              >
                {isLogin ? " Sign Up" : " Login"}
              </Link>
            </p>
            <button
              type="submit"
              className="flex items-center justify-center px-4 py-2 rounded-md cursor-pointer text-surface bg-blueblack-white hover:bg-surface hover:text-blueblack-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader size="sm" className="mr-2" />
                  Loading...
                </>
              ) : isLogin ? (
                "Login"
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
