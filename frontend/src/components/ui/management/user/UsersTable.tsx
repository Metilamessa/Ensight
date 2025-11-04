"use client";

import { useState, useEffect } from "react";
import { Button, TextInput, Select, Group, Modal } from "@mantine/core";
import { IconPlus, IconSearch, IconRefresh } from "@tabler/icons-react";
import UsersTableView from "./UsersTableView";
import AddUserForm from "./AddUserForm";
import EditUserForm from "./EditUserForm";
import ViewUser from "./ViewUser";
import toast from "react-hot-toast";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface UsersTableProps {
  data: User[];
}

export default function UsersTable({ data: initialData }: UsersTableProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("All");
  const [addOpened, setAddOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);
  const [viewOpened, setViewOpened] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialData);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!response.ok) {
        toast.error(`Failed to fetch users: ${response.statusText}`);
        setUsers([]);
      }
      // const data = await response.json();
      // setUsers(data);

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : data.users || []);

    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load users. Please try again later."
      );
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadUsers();
  }, [token]);

  const handleRefresh = () => {
    loadUsers();
  };

  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(`/api/profile/${userId}`, {
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
      await loadUsers();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete user. Please try again later."
      );
    }
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setViewOpened(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditOpened(true);
  };

  const filteredData = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "All" || user.role.toLowerCase() === filter.toLowerCase();
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
            data={["All", "Admin", "User", "Editor"]}
            value={filter}
            onChange={(value) => setFilter(value || "All")}
            size="sm"
          />
        </Group>
      </div>
      <UsersTableView
        users={filteredData}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Modal
        opened={addOpened}
        onClose={() => setAddOpened(false)}
        title="Add New User"
        size="xl"
        closeOnEscape={false}
        closeOnClickOutside={false}
      >
        <AddUserForm
          onClose={() => {
            setAddOpened(false);
            handleRefresh();
          }}
        />
      </Modal>
      <Modal
        opened={editOpened}
        onClose={() => setEditOpened(false)}
        title="Edit User"
        size="xl"
        closeOnEscape={false}
        closeOnClickOutside={false}
      >
        {selectedUser && (
          <EditUserForm
            user={selectedUser}
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
        title="View User"
        size="xl"
        closeOnEscape={false}
        closeOnClickOutside={false}
      >
        {selectedUser && <ViewUser selectedUser={selectedUser} />}
      </Modal>
    </div>
  );
}
