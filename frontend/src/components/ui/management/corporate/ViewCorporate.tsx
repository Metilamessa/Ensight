import React from "react";
import { Text, Title, Image } from "@mantine/core";
import { Corporate } from "@/lib/types";

interface ViewCorporateProps {
  selectedCorporate: Corporate | null;
}

const ViewCorporate: React.FC<ViewCorporateProps> = ({ selectedCorporate }) => {
  if (!selectedCorporate) {
    return <Text>No corporate entry selected.</Text>;
  }

  return (
    <div className="space-y-4">
      <div>
        <Title order={4}>Title</Title>
        <Text>{selectedCorporate.title || "-"}</Text>
      </div>
      <div>
        <Title order={4}>Description</Title>
        <Text>{selectedCorporate.description || "-"}</Text>
      </div>
      <div>
        <Title order={4}>Content</Title>
        <Text>{selectedCorporate.content || "-"}</Text>
      </div>
      <div>
        <Title order={4}>Image</Title>
        {selectedCorporate.image ? (
          <Image
            src={selectedCorporate.image}
            alt={selectedCorporate.title || "Corporate image"}
            radius="md"
            height={200}
            fit="contain"
            className="w-full max-w-md"
          />
        ) : (
          <Text>-</Text>
        )}
      </div>
      <div>
        <Title order={4}>Profile Image</Title>
        {selectedCorporate.profileImage ? (
          <Image
            src={selectedCorporate.profileImage}
            alt={selectedCorporate.name || "Profile image"}
            radius="md"
            height={200}
            fit="contain"
            className="w-full max-w-md"
          />
        ) : (
          <Text>-</Text>
        )}
      </div>
      <div>
        <Title order={4}>Quote</Title>
        <Text>{selectedCorporate.quote || "-"}</Text>
      </div>
      <div>
        <Title order={4}>Name</Title>
        <Text>{selectedCorporate.name || "-"}</Text>
      </div>
      <div>
        <Title order={4}>Role</Title>
        <Text>{selectedCorporate.role || "-"}</Text>
      </div>
      <div>
        <Title order={4}>Born</Title>
        <Text>{selectedCorporate.born || "-"}</Text>
      </div>
      <div>
        <Title order={4}>Education</Title>
        <Text>{selectedCorporate.education || "-"}</Text>
      </div>
      <div>
        <Title order={4}>Mission</Title>
        <Text>{selectedCorporate.mission || "-"}</Text>
      </div>
      <div>
        <Title order={4}>Specialties</Title>
        <Text>{selectedCorporate.specialties || "-"}</Text>
      </div>
      <div>
        <Title order={4}>Certifications</Title>
        <Text>{selectedCorporate.certifications || "-"}</Text>
      </div>
      <div>
        <Title order={4}>Motto</Title>
        <Text>{selectedCorporate.motto || "-"}</Text>
      </div>
      <div>
        <Title order={4}>Founded</Title>
        <Text>{selectedCorporate.founded || "-"}</Text>
      </div>
    </div>
  );
};

export default ViewCorporate;
