import { useState } from "react";
import { Badge, Menu, ActionIcon, Table, Loader, Pagination } from "@mantine/core";
import { IconDots, IconEye, IconPencil, IconTrash } from "@tabler/icons-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  category: "Featured Insight" | "Our Latest Reports" | "Data & Ensights" | "Date Hub & Archive";
}

interface ResourcesTableViewProps {
  resources: Resource[];
  loading: boolean;
  onView: (resource: Resource) => void;
  onEdit: (resource: Resource) => void;
  onDelete: (id: string) => void;
  itemsPerPage?: number;
}

const categoryColors: Record<Resource["category"], string> = {
  "Featured Insight": "blue",
  "Our Latest Reports": "green",
  "Data & Ensights": "orange",
  "Date Hub & Archive": "purple",
};

const columns = [
  { header: "Title", accessor: "title" },
  { header: "Description", accessor: "description" },
  { header: "Category", accessor: "category" },
  { header: "Actions", accessor: "actions" },
];

export default function ResourcesTableView({
  resources,
  loading,
  onView,
  onEdit,
  onDelete,
  itemsPerPage = 5,
}: ResourcesTableViewProps) {
  const [activePage, setPage] = useState(1);

  const totalPages = Math.ceil(resources.length / itemsPerPage);
  const paginatedResources = resources.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <Table
        highlightOnHover
        verticalSpacing="sm"
        className="border border-gray-300"
      >
        <Table.Thead className="text-center text-gray-700 bg-gray-400">
          <Table.Tr>
            {columns.map((column) => (
              <Table.Th key={column.accessor}>{column.header}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {paginatedResources.map((resource) => (
            <Table.Tr key={resource.id} className="text-left">
              <Table.Td>{resource.title}</Table.Td>
              <Table.Td>{resource.description || "-"}</Table.Td>
              <Table.Td>
                <Badge color={categoryColors[resource.category]} size="sm">
                  {resource.category}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Menu shadow="md" width={200} position="bottom-end">
                  <Menu.Target>
                    <ActionIcon color="blue" title="Actions" size="sm">
                      <IconDots size={14} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<IconEye size={14} />}
                      onClick={() => onView(resource)}
                    >
                      View
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconPencil size={14} />}
                      onClick={() => onEdit(resource)}
                    >
                      Edit
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconTrash size={14} />}
                      onClick={() => onDelete(resource.id)}
                      color="red"
                    >
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <span className="mt-2 mr-2 text-xs text-gray-300">
            Total Resources: ({resources.length})
          </span>
          <Pagination
            total={totalPages}
            value={activePage}
            onChange={setPage}
            size="sm"
            radius="md"
            withEdges
          />
        </div>
      )}
    </div>
  );
}