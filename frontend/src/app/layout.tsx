import type { Metadata } from "next";
import "./globals.css";
import Chatbot from "./components/Chatbot";
import Script from "next/script";

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
            <head>
                <Script src="https://apis.google.com/js/platform.js" strategy="beforeInteractive" />
            </head>
            <body className="bg-tech-bg text-tech-fg min-h-screen flex flex-col">
                <main className="flex-grow">{children}</main>
                <footer className="bg-tech-primary p-4 text-center relative text-tech-fg">
                    <p>© 2025 Tech-Learn by Badr Ribzat. All rights reserved.</p>
                    <Chatbot />
                </footer>
            </body>
        </html>
    );
}
