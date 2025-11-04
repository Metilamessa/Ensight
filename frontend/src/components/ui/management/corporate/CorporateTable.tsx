"use client";

import { useState, useEffect } from "react";
import { Button, TextInput, Group, Modal } from "@mantine/core";
import { IconPlus, IconSearch, IconRefresh } from "@tabler/icons-react";
import CorporateTableView from "./CorporateTableView";
import AddCorporateForm from "./AddCorporateForm";
import EditCorporateForm from "./EditCorporateForm";
import ViewCorporate from "./ViewCorporate";
import { Corporate } from "@/lib/types";
import toast from "react-hot-toast";

interface CorporateTableProps {
  data: Corporate[];
}

export default function CorporateTable({
  data: initialData,
}: CorporateTableProps) {
  const [search, setSearch] = useState("");
  const [addOpened, setAddOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);
  const [viewOpened, setViewOpened] = useState(false);
  const [selectedCorporate, setSelectedCorporate] = useState<Corporate | null>(
    null
  );
  const [corporates, setCorporates] = useState<Corporate[]>(initialData);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const loadCorporates = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/corporate", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!response.ok) {
        toast.error(
          `Failed to fetch corporate entries: ${response.statusText}`
        );
        setCorporates([]);
      }

      
      // const data = await response.json();
      // setCorporates(data);
      const data = await response.json();
      setCorporates(Array.isArray(data) ? data : data?.corporates || data?.data || []);

    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load corporate entries. Please try again later."
      );
      setCorporates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadCorporates();
  }, [token]);

  const handleRefresh = () => {
    loadCorporates();
  };

  const handleDelete = async (corporateId: string | undefined) => {
    try {
      const response = await fetch(`/api/corporate/${corporateId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!response.ok) {
        const error = await response.json();
        toast.error(
          error.message ||
            `Failed to delete corporate entry: ${response.statusText}`
        );
        return;
      }
      await loadCorporates();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete corporate entry. Please try again later."
      );
    }
  };

  const handleView = (corporate: Corporate) => {
    setSelectedCorporate(corporate);
    setViewOpened(true);
  };

  const handleEdit = (corporate: Corporate) => {
    setSelectedCorporate(corporate);
    setEditOpened(true);
  };

  const filteredData = corporates.filter(
    (corporate) =>
      corporate.title.toLowerCase().includes(search.toLowerCase()) ||
      corporate.description.toLowerCase().includes(search.toLowerCase()) ||
      corporate.name.toLowerCase().includes(search.toLowerCase()) ||
      corporate.role.toLowerCase().includes(search.toLowerCase())
  );

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
        </Group>
      </div>
      <CorporateTableView
        corporates={filteredData}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Modal
        opened={addOpened}
        onClose={() => setAddOpened(false)}
        title="Add New Corporate"
        size="xl"
        closeOnEscape={false}
        closeOnClickOutside={false}
      >
        <AddCorporateForm
          onClose={() => {
            setAddOpened(false);
            handleRefresh();
          }}
        />
      </Modal>
      <Modal
        opened={editOpened}
        onClose={() => setEditOpened(false)}
        title="Edit Corporate"
        size="xl"
        closeOnEscape={false}
        closeOnClickOutside={false}
      >
        {selectedCorporate && (
          <EditCorporateForm
            corporate={selectedCorporate}
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
        title="View Corporate"
        size="xl"
        closeOnEscape={false}
        closeOnClickOutside={false}
      >
        {selectedCorporate && (
          <ViewCorporate selectedCorporate={selectedCorporate} />
        )}
      </Modal>
    </div>
  );
}
