import { useState } from "react";
import { Article } from "@/lib/types";
import {
  Badge,
  Menu,
  ActionIcon,
  Table,
  Loader,
  Pagination,
} from "@mantine/core";
import { IconDots, IconEye, IconPencil, IconTrash, IconCheck } from "@tabler/icons-react";

const statusColors: Record<"DRAFT" | "REVIEW" | "PUBLISHED", string> = {
  DRAFT: "red",
  REVIEW: "yellow",
  PUBLISHED: "green",
};

const canApprove = (role?: string) => {
  return role && ["EDITOR", "ADMIN", "SUPERADMIN"].includes(role);
};

interface ArticlesTableViewProps {
  articles: Article[];
  loading: boolean;
  onView: (article: Article) => void;
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
  onApprove?: (id: string) => void;
  itemsPerPage?: number;
  userRole?: string;
}

export default function ArticlesTableView({
  articles,
  loading,
  onView,
  onEdit,
  onDelete,
  onApprove,
  itemsPerPage = 5,
  userRole,
}: ArticlesTableViewProps) {
  const [activePage, setPage] = useState(1);

  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const paginatedArticles = articles.slice(
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
            <Table.Th>Title</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Subcategory</Table.Th>
            <Table.Th>Author</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Publication Date</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {paginatedArticles.map((article) => (
            <Table.Tr key={article.id} className="text-left">
              <Table.Td>{article.title}</Table.Td>
              <Table.Td>{article.category || "None"}</Table.Td>
              <Table.Td>{article.subcategory || "-"}</Table.Td>
              <Table.Td>{article.author}</Table.Td>
              <Table.Td>
                <Badge color={statusColors[article.status]} size="sm">
                  {article.status}
                </Badge>
              </Table.Td>
              <Table.Td>
                {article.date
                  ? new Date(article.date).toLocaleDateString()
                  : "-"}
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
                      onClick={() => onView(article)}
                    >
                      View
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconPencil size={14} />}
                      onClick={() => onEdit(article)}
                    >
                      Edit
                    </Menu.Item>
                    {canApprove(userRole) &&
                      onApprove &&
                      (article.status === "DRAFT" || article.status === "REVIEW") && (
                        <Menu.Item
                          leftSection={<IconCheck size={14} />}
                          onClick={() => onApprove(article.id)}
                          color="green"
                        >
                          Approve
                        </Menu.Item>
                      )}
                    <Menu.Item
                      leftSection={<IconTrash size={14} />}
                      onClick={() => onDelete(article.id)}
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
            Total Articles: ({articles.length})
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
