"use client";

import { useState, useEffect } from "react";
import { Button, TextInput, Select, Group, Modal } from "@mantine/core";
import { IconPlus, IconSearch, IconRefresh } from "@tabler/icons-react";
import ResourcesTableView from "./ResourceTableView";
import AddResourceForm from "./AddResourceForm";
import EditResourceForm from "./EditResourceForm";
import ViewResource from "./ViewResource";
import toast from "react-hot-toast";

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

interface ResourcesTableProps {
  data: Resource[];
}

export default function ResourcesTable({
  data: initialData,
}: ResourcesTableProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("All");
  const [addOpened, setAddOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);
  const [viewOpened, setViewOpened] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [resources, setResources] = useState<Resource[]>(initialData);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/resources", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!response.ok) {
        toast.error(`Failed to fetch resources: ${response.statusText}`);
        setResources([]);
      }
      // const data = await response.json();
      // setResources(data);
      const data = await response.json();
      setResources(Array.isArray(data) ? data : data.resources || []);

    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load resources. Please try again later."
      );
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadResources();
  }, [token]);

  const handleRefresh = () => {
    loadResources();
  };

  const handleDelete = async (resourceId: string) => {
    try {
      const response = await fetch(`/api/resources/${resourceId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || `HTTP error! status: ${response.status}`);
        return;
      }
      await loadResources();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete resource. Please try again later."
      );
    }
  };

  const handleView = (resource: Resource) => {
    setSelectedResource(resource);
    setViewOpened(true);
  };

  const handleEdit = (resource: Resource) => {
    setSelectedResource(resource);
    setEditOpened(true);
  };

  const filteredData = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(search.toLowerCase()) ||
      resource.description.toLowerCase().includes(search.toLowerCase()) ||
      resource.category.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "All" ||
      resource.category.toLowerCase() === filter.toLowerCase();
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
            data={[
              "All",
              "Featured Insight",
              "Our Latest Reports",
              "Data & Ensights",
              "Date Hub & Archive",
            ]}
            value={filter}
            onChange={(value) => setFilter(value || "All")}
            size="sm"
          />
        </Group>
      </div>
      <ResourcesTableView
        resources={filteredData}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Modal
        opened={addOpened}
        onClose={() => setAddOpened(false)}
        title="Add New Resource"
        size="xl"
        closeOnEscape={false}
        closeOnClickOutside={false}
      >
        <AddResourceForm
          onClose={() => {
            setAddOpened(false);
            handleRefresh();
          }}
        />
      </Modal>
      <Modal
        opened={editOpened}
        onClose={() => setEditOpened(false)}
        title="Edit Resource"
        size="xl"
        closeOnEscape={false}
        closeOnClickOutside={false}
      >
        {selectedResource && (
          <EditResourceForm
            resource={selectedResource}
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
        title="View Resource"
        size="xl"
        closeOnEscape={false}
        closeOnClickOutside={false}
      >
        {selectedResource && (
          <ViewResource selectedResource={selectedResource} />
        )}
      </Modal>
    </div>
  );
}
