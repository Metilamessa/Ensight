import React from "react";

interface Insight {
  title: string;
  description: string;
  date: string;
  isPremium?: boolean;
}

const DataInsightCard = ({ insight }: { insight: Insight }) => {
  const icons: Record<string, string> = {
    "Weekly Market Snapshot": "📈",
    "Understanding Forex Liberalization": "💡",
    "Inflation Tracker": "📜",
  };
  return (
    <div
      className="p-6 rounded-lg"
      style={{ backgroundColor: "var(--color-surface-alt)" }}
    >
      <div className="mb-2 text-2xl">{icons[insight?.title] || "📊"}</div>
      <h3
        className="text-lg font-semibold"
        style={{ color: "var(--color-blueblack-white)" }}
      >
        {insight.title}
      </h3>
      <p className="mt-2" style={{ color: "var(--color-muted)" }}>
        {insight.description}
      </p>
      <p className="mt-2 text-sm" style={{ color: "var(--color-secondary)" }}>
        Updated: {insight.date}
      </p>
      <button
        className="mt-4"
        style={{
          color: "var(--color-blue)",
          textDecoration: "underline",
        }}
      >
        {insight.isPremium ? "View Premium Insight" : "View Data"}
      </button>
    </div>
  );
};

export default DataInsightCard;
