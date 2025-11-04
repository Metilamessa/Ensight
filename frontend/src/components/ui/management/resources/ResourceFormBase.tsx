"use client";

import { useForm } from "@mantine/form";
import {
  Button,
  TextInput,
  Textarea,
  Select,
  Group,
  Loader,
} from "@mantine/core";

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

interface ResourceFormBaseProps {
  initialValues: Resource;
  onSubmit: (values: Resource) => Promise<void>;
  loading: boolean;
  isEditMode: boolean;
}

const categories = [
  { label: "Featured Insight", value: "Featured Insight" },
  { label: "Our Latest Reports", value: "Our Latest Reports" },
  { label: "Data & Ensights", value: "Data & Ensights" },
  { label: "Date Hub & Archive", value: "Date Hub & Archive" },
];

export default function ResourceFormBase({
  initialValues,
  onSubmit,
  loading,
  isEditMode,
}: ResourceFormBaseProps) {
  const form = useForm<Resource>({
    initialValues,
    validate: {
      title: (value) =>
        value.length < 3 ? "Title must be at least 3 characters" : null,
      description: (value) =>
        value.length < 10 ? "Description must be at least 10 characters" : null,
      category: (value) => (!value ? "Category is required" : null),
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
        label="Title"
        placeholder="Enter title"
        {...form.getInputProps("title")}
        mb="md"
      />
      <Textarea
        label="Description"
        placeholder="Enter description"
        minRows={4}
        {...form.getInputProps("description")}
        mb="md"
      />
      <Select
        label="Category"
        placeholder="Select category"
        data={categories}
        {...form.getInputProps("category")}
        mb="md"
      />
      <Group justify="flex-end" mt="lg">
        <Button
          type="submit"
          disabled={loading || !form.isDirty()}
          color="blue"
        >
          {isEditMode ? "Update Resource" : "Create Resource"}
        </Button>
      </Group>
    </form>
  );
}
