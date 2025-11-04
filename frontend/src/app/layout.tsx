import "./globals.css";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/core/styles.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Ensight - Business Intelligence",
  description:
    "Your premier source for actionable business intelligence focused on Africa.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-mantine-color-scheme="dark">
      <head>
        <ColorSchemeScript  />
      </head>
      <body className="overflow-x-hidden bg-surface">
        <MantineProvider defaultColorScheme="dark">
          <a href="#main-content" className="sr-only focus:not-sr-only">
            Skip to Main Content
          </a>
          <Header />
          <main id="main-content" className="bg-surface">
            <div className="md:px-20">
              {children}{" "}
              <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
            </div>
          </main>
          <Footer />
        </MantineProvider>
      </body>
    </html>
  );
}
