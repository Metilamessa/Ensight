"use client";

import Head from "next/head";
import { useEffect, useState } from "react";
import FeaturedInsight from "@/components/ui/resources/FeaturedInsight";
import ReportCard from "@/components/ui/resources/ReportCard";
import DataInsightCard from "@/components/ui/resources/DataInsightCard";
import EventCard from "@/components/ui/resources/EventCard";
import { Loader } from "@mantine/core";

export default function Resources() {
  const [data, setData] = useState({
    title: "",
    description: "",
    featured_insight: null,
    reports: [],
    data_insights: [],
    events: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/resources", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch resources");
        const result = await res.json();
        setData(result);
        //eslint-disable-next-line
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching resources:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <Head>
        <title>{data.title}</title>
        <meta name="description" content={data.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {loading ? (
        <div className="flex items-center justify-center min-h-screen pt-20">
          <Loader
            size="xl"
            color="blue"
            className="flex items-center justify-center min-h-screen"
          />
        </div>
      ) : (
        <>
          <section className="px-6 py-12">
            <div className="mx-auto max-w-7xl">
              {error && (
                <p style={{ color: "var(--color-muted)" }}>Error: {error}</p>
              )}
              {!loading && !error && (
                <>
                  <h1
                    className="text-4xl font-bold"
                    style={{ color: "var(--color-blueblack-white)" }}
                  >
                    {data.title}
                  </h1>
                  <p className="mt-2" style={{ color: "var(--color-muted)" }}>
                    {data.description}
                  </p>
                  {data.featured_insight && (
                    <FeaturedInsight insight={data.featured_insight} />
                  )}
                </>
              )}
            </div>
          </section>

          <section className="px-6 py-12">
            <div className="mx-auto max-w-7xl">
              <h2
                className="mb-6 text-2xl font-semibold"
                style={{ color: "var(--color-blueblack-white)" }}
              >
                Our Latest Reports
              </h2>
              {loading && (
                <p style={{ color: "var(--color-muted)" }}>Loading...</p>
              )}
              {error && (
                <p style={{ color: "var(--color-muted)" }}>Error: {error}</p>
              )}
              {!loading && !error && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {data.reports && data.reports.length > 0 ? (
                    data.reports.map((report, index) => (
                      <ReportCard key={index} report={report} />
                    ))
                  ) : (
                    <p style={{ color: "var(--color-muted)" }}>
                      No reports available.
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>

          <section className="px-6 py-12">
            <div className="mx-auto max-w-7xl">
              <h2
                className="mb-6 text-2xl font-semibold"
                style={{ color: "var(--color-blueblack-white)" }}
              >
                Data & Ensights
              </h2>
              {loading && (
                <p style={{ color: "var(--color-muted)" }}>Loading...</p>
              )}
              {error && (
                <p style={{ color: "var(--color-muted)" }}>Error: {error}</p>
              )}
              {!loading && !error && (
                <>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {data.data_insights && data.data_insights.length > 0 ? (
                      data.data_insights.map((insight, index) => (
                        <DataInsightCard key={index} insight={insight} />
                      ))
                    ) : (
                      <p style={{ color: "var(--color-muted)" }}>
                        No data insights available.
                      </p>
                    )}
                  </div>
                  <div className="mt-8">
                    <h2
                      className="mb-4 text-2xl font-semibold"
                      style={{ color: "var(--color-blueblack-white)" }}
                    >
                      Date Hub & Archive
                    </h2>
                    <p className="mb-4" style={{ color: "var(--color-muted)" }}>
                      Key upcoming dates and access to archived materials.
                    </p>
                    <div className="space-y-4">
                      {data.events && data.events.length > 0 ? (
                        data.events.map((event, index) => (
                          <EventCard key={index} event={event} />
                        ))
                      ) : (
                        <p style={{ color: "var(--color-muted)" }}>
                          No events available.
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
