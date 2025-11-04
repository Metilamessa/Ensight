import React from "react";
import { Text, Title } from "@mantine/core";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface ViewUserProps {
  selectedUser: User | null;
}

const ViewUser: React.FC<ViewUserProps> = ({ selectedUser }) => {
  if (!selectedUser) {
    return <Text>No user selected.</Text>;
  }

  return (
    <div className="space-y-4">
      <div>
        <Title order={4}>First Name</Title>
        <Text>{selectedUser.firstName || "-"}</Text>
      </div>
      <div>
        <Title order={4}>Last Name</Title>
        <Text>{selectedUser.lastName || "-"}</Text>
      </div>
      <div>
        <Title order={4}>Email</Title>
        <Text>{selectedUser.email || "-"}</Text>
      </div>
      <div>
        <Title order={4}>Role</Title>
        <Text>{selectedUser.role || "-"}</Text>
      </div>
    </div>
  );
};

export default ViewUser;
