// "use client";

// import { useState, useEffect } from "react";
// import { Tabs } from "@mantine/core";
// import ArticlesTable from "../../components/ui/management/article/ArticlesTable";
// import UserTable from "../../components/ui/management/user/UsersTable";
// import { Article } from "@/lib/types";
// import ResourceTable from "@/components/ui/management/resources/ResourceTable";
// import CorporateTable from "@/components/ui/management/corporate/CorporateTable";

// export default function ManagementPage() {
//   const [articles, setArticles] = useState<Article[]>([]);

//   useEffect(() => {
//     const fetchedArticles: Article[] = [];
//     setArticles(fetchedArticles);
//   }, []);

//   return (
//     <div>
//       <Tabs defaultValue="Articles" className="pt-5">
//         <Tabs.List>
//           <Tabs.Tab value="User">User</Tabs.Tab>
//           <Tabs.Tab value="Articles">Articles</Tabs.Tab>
//           <Tabs.Tab value="Resources">Resources</Tabs.Tab>
//           <Tabs.Tab value="Corporate">Corporate</Tabs.Tab>
//         </Tabs.List>

//         <Tabs.Panel value="Articles" pt="xs">
//           <ArticlesTable data={articles} />
//         </Tabs.Panel>
//         <Tabs.Panel value="User" pt="xs">
//           <UserTable data={[]} />
//         </Tabs.Panel>
//         <Tabs.Panel value="Resources" pt="xs">
//           <ResourceTable data={[]} />
//         </Tabs.Panel>
//         <Tabs.Panel value="Corporate" pt="xs">
//           <CorporateTable data={[]} />
//         </Tabs.Panel>
//       </Tabs>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { Tabs } from "@mantine/core";
import ArticlesTable from "../../components/ui/management/article/ArticlesTable";
import UserTable from "../../components/ui/management/user/UsersTable";
import ResourceTable from "@/components/ui/management/resources/ResourceTable";
import CorporateTable from "@/components/ui/management/corporate/CorporateTable";
import { Article } from "@/lib/types";

export default function ManagementPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch("/api/article", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message || "Failed to fetch articles");
        }

        const data = await response.json();
        setArticles(data);
      } catch (err: any) {
        console.error("Error fetching articles:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  return (
    <div>
      <Tabs defaultValue="Articles" className="pt-5">
        <Tabs.List>
          <Tabs.Tab value="User">User</Tabs.Tab>
          <Tabs.Tab value="Articles">Articles</Tabs.Tab>
          <Tabs.Tab value="Resources">Resources</Tabs.Tab>
          <Tabs.Tab value="Corporate">Corporate</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="Articles" pt="xs">
          {loading ? (
            <p>Loading articles...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <ArticlesTable data={articles} />
          )}
        </Tabs.Panel>

        <Tabs.Panel value="User" pt="xs">
          <UserTable data={[]} />
        </Tabs.Panel>

        <Tabs.Panel value="Resources" pt="xs">
          <ResourceTable data={[]} />
        </Tabs.Panel>

        <Tabs.Panel value="Corporate" pt="xs">
          <CorporateTable data={[]} />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
