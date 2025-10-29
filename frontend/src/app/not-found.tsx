"use client";

import React from "react";
import { Container, Button, Title, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { IconAlertCircle } from "@tabler/icons-react";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

  return (
    <Container
      size="md"
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <IconAlertCircle size={48} color="red" />
      <Title order={1} style={{ marginTop: "1rem" }}>
        Page Not Found
      </Title>
      <Text size="lg" style={{ marginTop: "0.5rem" }}>
        The page you are looking for does not exist or has been moved.
      </Text>
      <Text size="sm" style={{ marginTop: "1rem" }}>
        Please check the URL or go back to the{" "}
        <Link href="/" onClick={() => router.push("/")}>
          homepage
        </Link>
        .
      </Text>
      <Button
        variant="outline"
        color="blue"
        style={{ marginTop: "1rem" }}
        onClick={() => router.push("/")}
      >
        Go to Homepage
      </Button>
    </Container>
  );
}
