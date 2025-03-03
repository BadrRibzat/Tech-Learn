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
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/sign-in");
      return;
    }
    fetchLessons(token);
    fetchProgress(token);
  }, [router]);

  const fetchLessons = async (token) => {
    const res = await fetch("http://127.0.0.1:8000/learning/lessons/", {
      headers: { "Authorization": `Token ${token}` },
    });
    const data = await res.json();
    setLessons(data);
  };

  const fetchProgress = async (token) => {
    const res = await fetch("http://127.0.0.1:8000/learning/progress/", {
      headers: { "Authorization": `Token ${token}` },
    });
    const data = await res.json();
    setProgress(data);
  };

  const checkTask = async (lessonId) => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://127.0.0.1:8000/learning/progress/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
      body: JSON.stringify({ lesson_id: lessonId }),
    });
    const result = await res.json();
    if (result.completed) {
      setProgress([...progress, { lesson_id: lessonId, completed: true, output: result.output }]);
      alert("Task completed successfully!\nOutput: " + result.output);
    } else {
      alert("Task check failed.\nOutput: " + (result.output || "No output"));
    }
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const renderContent = () => {
    switch (activeSection) {
      case "welcome":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-4 text-dracula-fg">User Dashboard</h2>
            <p className="text-dracula-fg">Welcome to your learning journey! Use the sidebar to explore.</p>
          </div>
        );
      case "terminal":
        return <Terminal />;
      case "lessons":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-4 text-dracula-fg">Lessons</h2>
            {selectedLesson ? (
              <div className="bg-dracula-comment p-4 rounded-lg">
                <h3 className="text-2xl font-bold mb-2 text-dracula-fg">{selectedLesson.title}</h3>
                <p className="mb-4 text-dracula-fg whitespace-pre-wrap">{selectedLesson.content}</p>
                <h4 className="text-xl font-semibold mb-2 text-dracula-fg">Example:</h4>
                <pre className="bg-dracula-bg p-2 rounded mb-4 text-dracula-fg">{selectedLesson.example_file}</pre>
                <h4 className="text-xl font-semibold mb-2 text-dracula-fg">Task:</h4>
                <p className="mb-4 text-dracula-fg">{selectedLesson.task_description}</p>
                <button
                  onClick={() => checkTask(selectedLesson.id)}
                  className="bg-dracula-purple text-dracula-bg px-4 py-2 rounded hover:bg-dracula-comment"
                >
                  Check Task
                </button>
                <button
                  onClick={() => setSelectedLesson(null)}
                  className="ml-4 bg-dracula-comment text-dracula-fg px-4 py-2 rounded hover:bg-dracula-purple"
                >
                  Back to Lessons
                </button>
              </div>
            ) : (
              <ul className="space-y-4">
                {lessons.map((lesson) => (
                  <li key={lesson.id} className="bg-dracula-comment p-4 rounded-lg">
                    <h3 className="text-xl font-bold text-dracula-fg">{lesson.title}</h3>
                    <p className="text-dracula-fg">
                      Status: {progress.find(p => p.lesson_id === lesson.id)?.completed ? "Completed" : "Not Started"}
                    </p>
                    <button
                      onClick={() => setSelectedLesson(lesson)}
                      className="mt-2 bg-dracula-purple text-dracula-bg px-4 py-2 rounded hover:bg-dracula-comment"
                    >
                      Start Lesson
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      default:
        return <p className="text-dracula-fg">Select an option from the sidebar.</p>;
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
              <li>
                <button
                  onClick={() => setActiveSection("lessons")}
                  className="w-full text-left px-4 py-2 text-dracula-fg hover:bg-dracula-purple hover:text-dracula-bg rounded transition-colors"
                >
                  Lessons
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-4 bg-dracula-bg relative">
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
