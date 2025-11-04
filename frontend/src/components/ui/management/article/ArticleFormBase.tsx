"use client";

import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import {
  Button,
  TextInput,
  Textarea,
  Select,
  Group,
  Switch,
  FileInput,
  Loader,
  Text,
  Stack,
  NumberInput,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { Article } from "@/lib/types";
import Image from "next/image";

const categories = [
  {
    label: "Business",
    value: "business",
    subcategories: ["startup", "markets"],
  },
  {
    label: "Finance",
    value: "finance",
    subcategories: ["banking", "investment"],
  },
  { label: "Economy", value: "economy", subcategories: ["policies", "trade"] },
  {
    label: "Tech and Science",
    value: "tech and science",
    subcategories: ["Innovation", "Digital"],
  },
];

interface ArticleFormBaseProps {
  initialValues: Article;
  onSubmit: (values: Article) => Promise<void>;
  loading: boolean;
  isEditMode: boolean;
}

export default function ArticleFormBase({
  initialValues,
  onSubmit,
  loading,
  isEditMode,
}: ArticleFormBaseProps) {
  const [subcategories, setSubcategories] = useState<string[]>([]);

  const form = useForm<Article>({
    initialValues,
    validate: {
      title: (value) =>
        value.length < 3 ? "Title must be at least 3 characters" : null,
      category: (value) => (!value ? "Category is required" : null),
      date: (value) => (!value ? "Publication date is required" : null),
      readTime: (value) => (!value ? "Read time is required" : null),
      content: (value) =>
        value.length < 10 ? "Content must be at least 10 characters" : null,
      description: (value) =>
        value.length < 10 ? "Description must be at least 10 characters" : null,
      image: (value) =>
        isEditMode && !value ? "Image is required for new articles" : null,
    },
  });

  useEffect(() => {
    if (form.values.category) {
      const selectedCategory = categories.find(
        (cat) => cat.value === form.values.category
      );
      const newSubcategories = selectedCategory?.subcategories || [];
      setSubcategories((prev) => {
        const isSame =
          prev.length === newSubcategories.length &&
          prev.every((val, index) => val === newSubcategories[index]);
        return isSame ? prev : newSubcategories;
      });
      if (
        form.values.subcategory &&
        !newSubcategories.includes(form.values.subcategory)
      ) {
        form.setFieldValue("subcategory", "");
      }
    } else {
      setSubcategories([]);
      form.setFieldValue("subcategory", "");
    }
  }, [form.values.category]);

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
        placeholder="Enter article title"
        {...form.getInputProps("title")}
        mb="md"
      />
      {!isEditMode && (
        <Select
          label="Status"
          placeholder="Select status"
          data={[
            { label: "Draft", value: "DRAFT" },
            { label: "Published", value: "PUBLISHED" },
          ]}
          {...form.getInputProps("status")}
          mb="md"
        />
      )}
      <Select
        label="Category"
        placeholder="Select category"
        data={categories.map((cat) => ({
          label: cat.label,
          value: cat.value,
        }))}
        {...form.getInputProps("category")}
        mb="md"
      />
      <Select
        label="Subcategory (First select category)"
        placeholder="Select subcategory"
        data={subcategories.map((sub) => ({ label: sub, value: sub }))}
        {...form.getInputProps("subcategory")}
        disabled={!form.values.category}
        mb="md"
      />
      <DateTimePicker
        label="Publication Date"
        placeholder="Select publication date"
        value={form.values.date}
        onChange={(value: string | null) => {
          const date = value ? new Date(value) : null;
          form.setFieldValue("date", date);
        }}
        error={form.errors.date}
        mb="md"
      />
      <NumberInput
        label="Read Time"
        placeholder="Enter read time (e.g., 5 min)"
        {...form.getInputProps("readTime")}
        mb="md"
      />
      <Group justify="space-between" align="flex-start" wrap="nowrap" mb="md">
        {isEditMode && form.values.image && (
          <Stack align="center" gap="xs" style={{ flexShrink: 0 }}>
            <Image
              src={
                form.values.image instanceof File
                  ? URL.createObjectURL(form.values.image)
                  : typeof form.values.image === "string"
                  ? form.values.image
                  : ""
              }
              alt={form.values.title || "Uploaded image"}
              width={100}
              height={100}
              style={{ objectFit: "cover" }}
            />
            <Text size="sm" color="dimmed">
              Current Image
            </Text>
          </Stack>
        )}
        <FileInput
          label="Select an Image"
          placeholder="Upload image"
          accept="image/*"
          {...form.getInputProps("image")}
          style={{
            flex: 1,
            maxWidth: `${isEditMode ? "calc(100% - 120px)" : "100%"}`,
          }}
        />
      </Group>
      <Textarea
        label="Content"
        placeholder="Enter article content"
        minRows={6}
        {...form.getInputProps("content")}
        mb="md"
      />
      <Textarea
        label="Description"
        placeholder="Enter article description"
        minRows={4}
        {...form.getInputProps("description")}
        mb="md"
      />
      <Switch
        label="Premium Content"
        checked={form.values.isPremium}
        onChange={(event) =>
          form.setFieldValue("isPremium", event.currentTarget.checked)
        }
        mb="md"
      />
      <TextInput
        label="Image Caption"
        placeholder="Image caption (optional)"
        {...form.getInputProps("caption")}
        mb="md"
      />
      <TextInput
        label="Quote"
        placeholder="Enter quote (optional)"
        {...form.getInputProps("quote")}
        mb="md"
      />
      <TextInput
        label="Quote Author"
        placeholder="Enter quote author (optional)"
        {...form.getInputProps("quoteAuthor")}
        mb="md"
      />
      <TextInput
        label="Tag"
        placeholder="Enter tag (optional)"
        {...form.getInputProps("tag")}
        mb="md"
      />
      <Group justify="flex-end" mt="lg">
        <Button type="submit" disabled={loading || !form.isDirty} color="blue">
          {isEditMode ? "Update Article" : "Create Article"}
        </Button>
      </Group>
    </form>
  );
}
