"use client";

import { useForm } from "@mantine/form";
import { Button, TextInput, Select, Group, Loader, PasswordInput } from "@mantine/core";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: string;
}

interface UserFormBaseProps {
  initialValues: User;
  onSubmit: (values: User) => Promise<void>;
  loading: boolean;
  isEditMode: boolean;
}

const roles = [
  { label: "Admin", value: "ADMIN" },
  { label: "Editor", value: "EDITOR" },
  { label: "Writer", value: "WRITER" },
];

export default function UserFormBase({
  initialValues,
  onSubmit,
  loading,
  isEditMode,
}: UserFormBaseProps) {
  const form = useForm<User>({
    initialValues,
    validate: {
      firstName: (value) =>
        value.length < 2 ? "First name must be at least 2 characters" : null,
      lastName: (value) =>
        value.length < 2 ? "Last name must be at least 2 characters" : null,
      email: (value) =>
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Invalid email address"
          : null,
      password: (value, values) =>
        !isEditMode && (!value || value.length < 6)
          ? "Password must be at least 6 characters"
          : null,
      role: (value) => (!value ? "Role is required" : null),
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader />
      </div>
    );
  }

  return (
    <form onSubmit={form.onSubmit(onSubmit)} className="p-4">
      <TextInput
        label="First Name"
        placeholder="Enter first name"
        {...form.getInputProps("firstName")}
        mb="md"
      />
      <TextInput
        label="Last Name"
        placeholder="Enter last name"
        {...form.getInputProps("lastName")}
        mb="md"
      />
      <TextInput
        label="Email"
        placeholder="Enter email"
        {...form.getInputProps("email")}
        mb="md"
      />
      {!isEditMode && (
        <PasswordInput
          label="Password"
          placeholder="Enter password"
          {...form.getInputProps("password")}
          mb="md"
          required
        />
      )}
      <Select
        label="Role"
        placeholder="Select role"
        data={roles}
        {...form.getInputProps("role")}
        mb="md"
      />
      <Group justify="flex-end" mt="lg">
        <Button
          type="submit"
          disabled={loading || !form.isDirty()}
          color="blue"
        >
          {isEditMode ? "Update User" : "Create User"}
        </Button>
      </Group>
    </form>
  );
}
