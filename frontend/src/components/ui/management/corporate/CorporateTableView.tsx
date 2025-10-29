import { useState } from "react";
import { Menu, ActionIcon, Table, Loader, Pagination } from "@mantine/core";
import { IconDots, IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import { Corporate } from "@/lib/types";

interface CorporateTableViewProps {
  corporates: Corporate[];
  loading: boolean;
  onView: (corporate: Corporate) => void;
  onEdit: (corporate: Corporate) => void;
  onDelete: (id: string | undefined) => void;
  itemsPerPage?: number;
}

const columns = [
  { header: "Title", accessor: "title" },
  { header: "Description", accessor: "description" },
  { header: "Name", accessor: "name" },
  { header: "Actions", accessor: "actions" },
];

export default function CorporateTableView({
  corporates,
  loading,
  onView,
  onEdit,
  onDelete,
  itemsPerPage = 5,
}: CorporateTableViewProps) {
  const [activePage, setPage] = useState(1);

  const totalPages = Math.ceil(corporates.length / itemsPerPage);
  const paginatedCorporates = corporates.slice(
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
          {paginatedCorporates.map((corporate) => (
            <Table.Tr key={corporate.id} className="text-left">
              <Table.Td>{corporate.title}</Table.Td>
              <Table.Td>{corporate.description || "-"}</Table.Td>
              <Table.Td>{corporate.name}</Table.Td>
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
                      onClick={() => onView(corporate)}
                    >
                      View
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconPencil size={14} />}
                      onClick={() => onEdit(corporate)}
                    >
                      Edit
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconTrash size={14} />}
                      onClick={() => onDelete(corporate?.id)}
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
            Total Entries: ({corporates.length})
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
