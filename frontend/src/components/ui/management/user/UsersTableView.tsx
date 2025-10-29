import { useState } from "react";
import { Menu, ActionIcon, Table, Loader, Pagination } from "@mantine/core";
import { IconDots, IconEye, IconPencil, IconTrash } from "@tabler/icons-react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface UsersTableViewProps {
  users: User[];
  loading: boolean;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  itemsPerPage?: number;
}

const columns = [
  { header: "First Name", accessor: "firstName" },
  { header: "Last Name", accessor: "lastName" },
  { header: "Email", accessor: "email" },
  { header: "Actions", accessor: "actions" },
];

export default function UsersTableView({
  users,
  loading,
  onView,
  onEdit,
  onDelete,
  itemsPerPage = 5,
}: UsersTableViewProps) {
  const [activePage, setPage] = useState(1);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice(
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
          {paginatedUsers.map((user) => (
            <Table.Tr key={user.id} className="text-left">
              <Table.Td>{user.firstName}</Table.Td>
              <Table.Td>{user.lastName}</Table.Td>
              <Table.Td>{user.email}</Table.Td>
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
                      onClick={() => onView(user)}
                    >
                      View
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconPencil size={14} />}
                      onClick={() => onEdit(user)}
                    >
                      Edit
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconTrash size={14} />}
                      onClick={() => onDelete(user.id)}
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
            Total Users: ({users.length})
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
