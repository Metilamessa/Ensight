"use client";

import { Table, Loader, Modal, Title, Text, Image, Badge } from "@mantine/core";
import React, { useState } from "react";

interface EntityTableProps<T> {
  columns: { header: string; accessor: keyof T }[];
  data: T[];
  isLoading?: boolean;
  renderRow: (item: T, openViewModal: (item: T) => void) => React.ReactNode;
}

export default function EntityTable<T>({
  columns,
  data,
  isLoading = false,
  renderRow,
}: EntityTableProps<T>) {
  const [viewOpened, setViewOpened] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const openViewModal = (item: T) => {
    setSelectedItem(item);
    setViewOpened(true);
  };

  const statusColors = {
    DRAFT: "orange",
    PUBLISHED: "green",
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderValue = (value: any, accessor: keyof T | string) => {
    if (typeof value === "undefined" || value === null) {
      return "-";
    }
    if (accessor === "status" && (value === "DRAFT" || value === "PUBLISHED")) {
      return (
        <Badge color={statusColors[value as "DRAFT" | "PUBLISHED"]} size="sm">
          {value}
        </Badge>
      );
    }
    if (accessor === "image" && typeof value === "string") {
      return (
        <Image
          src={value}
          alt="Item image"
          radius="md"
          height={200}
          fit="contain"
          className="w-full max-w-md"
        />
      );
    }
    if (accessor === "date" && typeof value === "string") {
      return new Date(value).toLocaleDateString();
    }
    return String(value);
  };

  return (
    <div className="overflow-x-auto">
      <Table
        highlightOnHover
        withTableBorder
        withColumnBorders
        className="min-w-full"
      >
        <Table.Thead>
          <Table.Tr>
            {columns.map((col) => (
              <Table.Th key={String(col.accessor)}>{col.header}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {isLoading ? (
            <Table.Tr>
              <Table.Td colSpan={columns.length}>
                <div className="flex items-center justify-center py-6">
                  <Loader color="blue" />
                </div>
              </Table.Td>
            </Table.Tr>
          ) : data.length > 0 ? (
            data.map((item) => renderRow(item, openViewModal))
          ) : (
            <Table.Tr>
              <Table.Td colSpan={columns.length}>
                <div className="py-4 text-center text-gray-500">
                  No records found.
                </div>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>

      <Modal
        opened={viewOpened}
        onClose={() => setViewOpened(false)}
        title="View Item"
        size="xl"
        closeOnEscape={true}
      >
        {selectedItem && (
          <div className="space-y-4">
            {columns.map((col) => (
              <div key={String(col.accessor)}>
                <Title order={4}>{col.header}</Title>
                <Text>
                  {renderValue(selectedItem[col.accessor], col.accessor)}
                </Text>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
