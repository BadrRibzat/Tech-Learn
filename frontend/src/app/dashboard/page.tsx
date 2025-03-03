"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Terminal from "../components/Terminal";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

export default function Dashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("welcome");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/sign-in");
    }
  }, [router]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    console.log("Sidebar toggled, now:", !isSidebarOpen); // Debug toggle
  };

  const renderContent = () => {
    switch (activeSection) {
      case "welcome":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-4">User Dashboard</h2>
            <p>Welcome to your learning journey! Use the sidebar to explore.</p>
          </div>
        );
      case "terminal":
        return <Terminal />;
      default:
        return <p>Select an option from the sidebar.</p>;
    }
  };

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-dracula-bg">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-dracula-comment transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-50 shadow-lg`}
        >
          <div className="p-4 flex justify-between items-center bg-dracula-comment border-b border-dracula-purple">
            <h3 className="text-xl font-bold text-dracula-fg">Menu</h3>
            <button
              onClick={toggleSidebar}
              className="md:hidden text-dracula-fg hover:text-dracula-purple focus:outline-none"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveSection("welcome")}
                  className="w-full text-left px-4 py-2 text-dracula-fg hover:bg-dracula-purple hover:text-dracula-bg rounded transition-colors"
                >
                  Welcome
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection("terminal")}
                  className="w-full text-left px-4 py-2 text-dracula-fg hover:bg-dracula-purple hover:text-dracula-bg rounded transition-colors"
                >
                  Terminal
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-4 bg-dracula-bg relative">
          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className={`md:hidden p-2 bg-dracula-purple text-dracula-bg rounded hover:bg-dracula-comment fixed top-16 left-4 z-50 focus:outline-none ${
              isSidebarOpen ? "hidden" : "block"
            }`}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="mt-12 md:mt-0">{renderContent()}</div>
        </main>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 md:hidden z-40"
            onClick={toggleSidebar}
          ></div>
        )}
      </div>
    </>
  );
}
