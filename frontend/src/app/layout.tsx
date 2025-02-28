import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tech-Learn",
  description: "A platform to learn programming and system administration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-dracula-bg text-dracula-fg min-h-screen flex flex-col">
        <main className="flex-grow">{children}</main>
        <footer className="bg-dracula-comment p-4 text-center">
          <p>© 2025 Tech-Learn by Badr Ribzat. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
