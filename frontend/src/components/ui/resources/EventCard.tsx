//eslint-disable-next-line

import React from "react";

interface Event {
  date?: string;
  title: string;
}

const EventCard = ({ event }: { event: Event }) => {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-lg shadow-md"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div>
        <span
          className="inline-block px-3 py-1 mr-2 rounded"
          style={{
            backgroundColor: "var(--color-background)",
            color: "var(--color-blueblack-white)",
          }}
        >
          {event.date || "Archive"}
        </span>
        <span style={{ color: "var(--color-blueblack-white)" }}>
          {event.title}
        </span>
      </div>
      <button
        style={{
          color: "var(--color-blue)",
          textDecoration: "underline",
        }}
      >
        {event.date ? "Register" : "Browse Archive"}
      </button>
    </div>
  );
};

export default EventCard;
