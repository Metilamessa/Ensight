"use client";

import { useState, useEffect } from "react";
import { Button, TextInput, Select, Group, Modal } from "@mantine/core";
import { IconPlus, IconSearch, IconRefresh } from "@tabler/icons-react";
import { Article } from "@/lib/types";
import ArticlesTableView from "./ArticlesTableView";
import AddArticleForm from "./AddArticleForm";
import EditArticleForm from "./EditArticleForm";
import ViewArticle from "./ViewArticle";
import toast from "react-hot-toast";

interface ArticlesTableProps {
  data: Article[];
}

export default function ArticlesTable({
  data: initialData,
}: ArticlesTableProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("All");
  const [addOpened, setAddOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);
  const [viewOpened, setViewOpened] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>(initialData);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
    
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserRole(user.role || null);
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/article", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!response.ok) {
        toast.error(`Failed to fetch articles: ${response.statusText}`);
        setArticles([]);
      }
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load articles. Please try again later."
      );
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadArticles();
  }, [token]);

  const handleRefresh = () => {
    loadArticles();
  };

  const handleDelete = async (articleId: string) => {
    try {
      const response = await fetch(`/api/article/id/${articleId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!response.ok) {
        const error = await response.json();
        toast.error(`Failed to delete article: ${error.message}`);
        return;
      }
      toast.success("Article deleted successfully");
      await loadArticles();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete article. Please try again later."
      );
    }
  };

  const handleApprove = async (articleId: string) => {
    try {
      const response = await fetch(`/api/article/id/${articleId}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!response.ok) {
        const error = await response.json();
        toast.error(`Failed to approve article: ${error.message || error.detail}`);
        return;
      }
      toast.success("Article approved successfully");
      await loadArticles();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to approve article. Please try again later."
      );
    }
  };

  const handleView = (article: Article) => {
    setSelectedArticle(article);
    setViewOpened(true);
  };

  const handleEdit = (article: Article) => {
    setSelectedArticle(article);
    setEditOpened(true);
  };

  const filteredData = articles.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const articleCategory = article.category || "None";
    const matchesFilter =
      filter === "All" ||
      articleCategory.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-full p-4 overflow-x-auto sm:p-6 md:p-8">
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-center">
        <Group gap="xs" wrap="wrap">
          <Button
            leftSection={<IconPlus size={16} />}
            variant="filled"
            color="blue"
            onClick={() => setAddOpened(true)}
            size="compact-md"
            className="w-full sm:w-auto"
          >
            Add new
          </Button>
          <Button
            leftSection={<IconRefresh size={16} />}
            variant="outline"
            color="blue"
            onClick={handleRefresh}
            size="compact-md"
            className="w-full sm:w-auto"
          >
            Refresh
          </Button>
        </Group>
        <Group gap="xs" wrap="wrap">
          <TextInput
            placeholder="Search..."
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            rightSection={<IconSearch size={16} />}
            size="sm"
          />
          <Select
            placeholder="All"
            data={["All", "Tech and Science", "Finance", "Economy", "Business"]}
            value={filter}
            onChange={(value) => setFilter(value || "All")}
            size="sm"
          />
        </Group>
      </div>
      <ArticlesTableView
        articles={filteredData}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onApprove={handleApprove}
        userRole={userRole || undefined}
      />
      <Modal
        opened={addOpened}
        onClose={() => setAddOpened(false)}
        title="Add New Article"
        size="xl"
        closeOnEscape={false}
        closeOnClickOutside={false}
      >
        <AddArticleForm
          onClose={() => {
            setAddOpened(false);
            handleRefresh();
          }}
        />
      </Modal>
      <Modal
        opened={editOpened}
        onClose={() => setEditOpened(false)}
        title="Edit Article"
        size="xl"
        closeOnEscape={false}
        closeOnClickOutside={false}
      >
        {selectedArticle && (
          <EditArticleForm
            article={selectedArticle}
            onClose={() => {
              setEditOpened(false);
              handleRefresh();
            }}
          />
        )}
      </Modal>
      <Modal
        opened={viewOpened}
        onClose={() => setViewOpened(false)}
        title="View Article"
        size="xl"
        closeOnEscape={false}
        closeOnClickOutside={false}
      >
        {selectedArticle && <ViewArticle selectedArticle={selectedArticle} />}
      </Modal>
    </div>
  );
}
