import "./globals.css";
import { Toaster } from "sonner";
import { LoadingProvider } from "@/components/providers/LoadingProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LoadingProvider>
          {children}
          <Toaster richColors position="top-center" />
        </LoadingProvider>
      </body>
    </html>
  );
}
