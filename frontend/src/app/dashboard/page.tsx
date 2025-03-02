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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
      <div className="flex min-h-screen">
        <div
          className={`fixed inset-y-0 left-0 w-64 bg-dracula-comment transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out z-50`}
        >
          <div className="p-4 flex justify-between items-center md:justify-start">
            <h3 className="text-xl font-bold">Menu</h3>
            <button onClick={toggleSidebar} className="md:hidden text-dracula-fg">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveSection("welcome")}
                  className="w-full text-left px-4 py-2 hover:bg-dracula-purple rounded"
                >
                  Welcome
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection("terminal")}
                  className="w-full text-left px-4 py-2 hover:bg-dracula-purple rounded"
                >
                  Terminal
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex-grow p-4">
          <button onClick={toggleSidebar} className="md:hidden mb-4 text-dracula-fg">
            <Bars3Icon className="h-6 w-6" />
          </button>
          {renderContent()}
        </div>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}
      </div>
    </>
  );
}
