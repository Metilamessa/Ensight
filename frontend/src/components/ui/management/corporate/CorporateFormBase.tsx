"use client";

import { useForm } from "@mantine/form";
import {
  Button,
  TextInput,
  Textarea,
  FileInput,
  Group,
  Loader,
  Stack,
  Text,
} from "@mantine/core";
import Image from "next/image";
import { Corporate } from "@/lib/types";

interface CorporateFormBaseProps {
  initialValues: Corporate;
  onSubmit: (values: Corporate) => Promise<void>;
  loading: boolean;
  isEditMode: boolean;
}

export default function CorporateFormBase({
  initialValues,
  onSubmit,
  loading,
  isEditMode,
}: CorporateFormBaseProps) {
  const form = useForm<Corporate>({
    initialValues,
    validate: {
      title: (value) =>
        value.length < 3 ? "Title must be at least 3 characters" : null,
      description: (value) =>
        value.length < 10 ? "Description must be at least 10 characters" : null,
      content: (value) =>
        value.length < 10 ? "Content must be at least 10 characters" : null,
      image: (value) =>
        !isEditMode && !value ? "Image is required for new entries" : null,
      profileImage: (value) =>
        !isEditMode && !value
          ? "Profile image is required for new entries"
          : null,
      name: (value) =>
        value.length < 2 ? "Name must be at least 2 characters" : null,
      role: (value) =>
        value.length < 2 ? "Role must be at least 2 characters" : null,
      born: (value) =>
        value.length < 2 ? "Born must be at least 2 characters" : null,
      education: (value) =>
        value.length < 5 ? "Education must be at least 5 characters" : null,
      mission: (value) =>
        value.length < 10 ? "Mission must be at least 10 characters" : null,
      specialties: (value) =>
        value.length < 5 ? "Specialties must be at least 5 characters" : null,
      certifications: (value) =>
        value.length < 5
          ? "Certifications must be at least 5 characters"
          : null,
      motto: (value) =>
        value.length < 5 ? "Motto must be at least 5 characters" : null,
      founded: (value) =>
        value.length < 2 ? "Founded must be at least 2 characters" : null,
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
      <Textarea
        label="Content"
        placeholder="Enter content"
        minRows={6}
        {...form.getInputProps("content")}
        mb="md"
      />
      <Group justify="space-between" align="flex-start" wrap="nowrap" mb="md">
        {isEditMode &&
          form.values.image &&
          typeof form.values.image === "string" && (
            <Stack align="center" gap="xs" style={{ flexShrink: 0 }}>
              <Image
                src={form.values.image}
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
      <Group justify="space-between" align="flex-start" wrap="nowrap" mb="md">
        {isEditMode &&
          form.values.profileImage &&
          typeof form.values.profileImage === "string" && (
            <Stack align="center" gap="xs" style={{ flexShrink: 0 }}>
              <Image
                src={form.values.profileImage}
                alt={form.values.name || "Uploaded profile image"}
                width={100}
                height={100}
                style={{ objectFit: "cover" }}
              />
              <Text size="sm" color="dimmed">
                Current Profile Image
              </Text>
            </Stack>
          )}
        <FileInput
          label="Select a Profile Image"
          placeholder="Upload profile image"
          accept="image/*"
          {...form.getInputProps("profileImage")}
          style={{
            flex: 1,
            maxWidth: `${isEditMode ? "calc(100% - 120px)" : "100%"}`,
          }}
        />
      </Group>
      <TextInput
        label="Quote (Optional)"
        placeholder="Enter quote"
        {...form.getInputProps("quote")}
        mb="md"
      />
      <TextInput
        label="Name"
        placeholder="Enter name"
        {...form.getInputProps("name")}
        mb="md"
      />
      <TextInput
        label="Role"
        placeholder="Enter role"
        {...form.getInputProps("role")}
        mb="md"
      />
      <TextInput
        label="Born"
        placeholder="Enter birth details"
        {...form.getInputProps("born")}
        mb="md"
      />
      <TextInput
        label="Education"
        placeholder="Enter education details"
        {...form.getInputProps("education")}
        mb="md"
      />
      <Textarea
        label="Mission"
        placeholder="Enter mission statement"
        minRows={4}
        {...form.getInputProps("mission")}
        mb="md"
      />
      <TextInput
        label="Specialties"
        placeholder="Enter specialties"
        {...form.getInputProps("specialties")}
        mb="md"
      />
      <TextInput
        label="Certifications"
        placeholder="Enter certifications"
        {...form.getInputProps("certifications")}
        mb="md"
      />
      <TextInput
        label="Motto"
        placeholder="Enter motto"
        {...form.getInputProps("motto")}
        mb="md"
      />
      <TextInput
        label="Founded"
        placeholder="Enter founding details"
        {...form.getInputProps("founded")}
        mb="md"
      />
      <Group justify="flex-end" mt="lg">
        <Button
          type="submit"
          disabled={loading || !form.isDirty()}
          color="blue"
        >
          {isEditMode ? "Update Corporate" : "Create Corporate"}
        </Button>
      </Group>
    </form>
  );
}
