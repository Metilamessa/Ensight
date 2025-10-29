import Image from "next/image";
import React from "react";

interface Report {
  title: string;
  description: string;
  date: string;
  image?: string;
  isPremium?: boolean;
}

const ReportCard = ({ report }: { report: Report }) => {
  return (
    <div
      className="overflow-hidden rounded-lg shadow-md"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Image
        src={
          report.image ||
          "https://via.placeholder.com/400x200?text=Report+Image"
        }
        alt={report.title}
        className="object-cover w-full h-48"
        width={400}
        height={200}
      />
      <div className="p-4">
        <h3
          className="text-lg font-semibold"
          style={{ color: "var(--color-blueblack-white)" }}
        >
          {report.title}
        </h3>
        <p className="mt-2" style={{ color: "var(--color-muted)" }}>
          {report.description}
        </p>
        <p className="mt-2 text-sm" style={{ color: "var(--color-secondary)" }}>
          Published: {report.date}
        </p>
        <button
          className="mt-4"
          style={{
            color: "var(--color-blue)",
            textDecoration: "underline",
          }}
        >
          {report.isPremium ? "View Premium Report" : "Download PDF"}
        </button>
      </div>
    </div>
  );
};

export default ReportCard;
