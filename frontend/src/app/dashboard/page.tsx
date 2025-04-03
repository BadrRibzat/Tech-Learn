"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Terminal from "../components/Terminal";
import HtmlEditor from "../components/HtmlEditor";
import Exercises from "../components/Exercises";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

export default function Dashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("welcome");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [labs, setLabs] = useState([]);
  const [progress, setProgress] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedLab, setSelectedLab] = useState(null);
  const termRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/sign-in");
      return;
    }
    fetchLessons(token);
    fetchLabs(token);
    fetchProgress(token);
  }, [router]);

  const fetchLessons = async (token) => {
    const res = await fetch("http://127.0.0.1:8000/learning/lessons/", {
      headers: { "Authorization": `Token ${token}` },
    });
    const data = await res.json();
    setLessons(data.filter((lesson) => !lesson.lab_instructions));
  };

  const fetchLabs = async (token) => {
    const res = await fetch("http://127.0.0.1:8000/learning/lessons/", {
      headers: { "Authorization": `Token ${token}` },
    });
    const data = await res.json();
    console.log("Fetched Labs:", data); // Debug log
    setLabs(data.filter((lesson) => lesson.lab_instructions));
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

  const handleTaskSubmit = (code: string) => {
    console.log("Submitted HTML:", code);
    alert("Task submitted! Save this in /frontend/html_task.html in the terminal.");
  };

  const startLab = (lab) => {
    setSelectedLab(lab);
    setActiveSection("labs");
    if (termRef.current) {
      termRef.current.write(`\x1b[32mStarting Lab: ${lab.title}\x1b[0m\r\n`);
      termRef.current.write(`mkdir -p ~/labs/lab_${lab.id}\r\n`);
    }
  };

  const verifyLab = async () => {
    if (!selectedLab) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`http://127.0.0.1:8000/learning/labs/verify/${selectedLab.id}/`, {
      method: "POST",
      headers: {
        "Authorization": `Token ${token}`,
      },
    });
    const result = await res.json();
    if (result.completed) {
      termRef.current?.write("\x1b[32m✔ Lab completed!\x1b[0m\r\n");
      setProgress([...progress, { lesson_id: selectedLab.id, completed: true }]);
    } else {
      termRef.current?.write("\x1b[31m✘ Lab incomplete. Check requirements:\x1b[0m\r\n");
      if (result.missing_files?.length) {
        termRef.current?.write(`- Missing files: ${result.missing_files.join(", ")}\r\n`);
      }
      if (result.missing_commands?.length) {
        termRef.current?.write(`- Missing commands: ${result.missing_commands.join(", ")}\r\n`);
      }
    }
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const renderContent = () => {
    switch (activeSection) {
      case "welcome":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-4 text-tech-fg">User Dashboard</h2>
            <p className="text-tech-fg">Welcome to your learning journey! Use the sidebar to explore.</p>
          </div>
        );
      case "terminal":
        return <Terminal ref={termRef} />;
      case "lessons":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-4 text-tech-fg">Lessons</h2>
            {selectedLesson ? (
              <div className="bg-tech-primary p-4 rounded-lg text-tech-fg">
                <h3 className="text-2xl font-bold mb-2">{selectedLesson.title}</h3>
                <p className="mb-4 whitespace-pre-wrap">{selectedLesson.content}</p>
                <h4 className="text-xl font-semibold mb-2 text-tech-muted">Example:</h4>
                <pre className="bg-tech-bg p-2 rounded mb-4">{selectedLesson.example_file}</pre>
                <h4 className="text-xl font-semibold mb-2 text-tech-muted">Task:</h4>
                <p className="mb-4">{selectedLesson.task_description}</p>
                {selectedLesson.title === "HTML: Tags and Structure" && (
                  <div className="flex gap-4">
                    <HtmlEditor onSubmit={handleTaskSubmit} />
                    <Exercises lessonId={selectedLesson.id} />
                  </div>
                )}
                <button
                  onClick={() => checkTask(selectedLesson.id)}
                  className="bg-tech-primary text-tech-fg px-4 py-2 rounded hover:bg-tech-secondary mt-4 mr-4 transition-colors"
                >
                  Check Task
                </button>
                <button
                  onClick={() => setSelectedLesson(null)}
                  className="bg-tech-muted text-tech-fg px-4 py-2 rounded hover:bg-tech-secondary transition-colors"
                >
                  Back to Lessons
                </button>
              </div>
            ) : (
              <ul className="space-y-4">
                {lessons.map((lesson, index) => (
                  <li
                    key={lesson.id ?? `lesson-${index}`}
                    className="bg-tech-primary p-4 rounded-lg text-tech-fg"
                  >
                    <h3 className="text-xl font-bold">{lesson.title}</h3>
                    <p className="text-tech-muted">
                      Status: {progress.find((p) => p.lesson_id === lesson.id)?.completed ? "Completed" : "Not Started"}
                    </p>
                    <button
                      onClick={() => setSelectedLesson(lesson)}
                      className="mt-2 bg-tech-primary text-tech-fg px-4 py-2 rounded hover:bg-tech-secondary transition-colors"
                    >
                      Start Lesson
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      case "labs":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-4 text-tech-fg">Labs</h2>
            {selectedLab ? (
              <div className="lab-terminal-container">
                <div className="lab-instructions text-tech-fg">
                  <h3 className="text-2xl font-bold mb-2">{selectedLab.title}</h3>
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold text-tech-muted">Instructions:</h4>
                    <p className="whitespace-pre-wrap">{selectedLab.lab_instructions}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold text-tech-muted">Required Files:</h4>
                    <ul className="list-disc pl-6">
                      {selectedLab.required_files?.map((file, index) => (
                        <li key={index}>{file}</li>
                      )) || <li>No files required</li>}
                    </ul>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold text-tech-muted">Expected Commands:</h4>
                    <ul className="list-disc pl-6">
                      {selectedLab.expected_commands?.map((cmd, index) => (
                        <li key={index}>{cmd}</li>
                      )) || <li>No commands expected</li>}
                    </ul>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold text-tech-muted">Example Solution:</h4>
                    <pre className="bg-tech-bg p-2 rounded">{selectedLab.example_file || "No example provided"}</pre>
                  </div>
                  <button
                    onClick={verifyLab}
                    className="bg-tech-primary text-tech-fg px-4 py-2 rounded hover:bg-tech-secondary mr-4 transition-colors"
                  >
                    Verify Lab
                  </button>
                  <button
                    onClick={() => setSelectedLab(null)}
                    className="bg-tech-muted text-tech-fg px-4 py-2 rounded hover:bg-tech-secondary transition-colors"
                  >
                    Back to Labs
                  </button>
                </div>
                <Terminal ref={termRef} />
              </div>
            ) : (
              <ul className="space-y-4">
                {labs.map((lab, index) => (
                  <li
                    key={lab.id ?? `lab-${index}`}
                    className="bg-tech-primary p-4 rounded-lg text-tech-fg"
                  >
                    <h3 className="text-xl font-bold">{lab.title}</h3>
                    <p className="text-tech-muted">
                      Status: {progress.find((p) => p.lesson_id === lab.id)?.completed ? "Completed" : "Not Started"}
                    </p>
                    <button
                      onClick={() => startLab(lab)}
                      className="mt-2 bg-tech-primary text-tech-fg px-4 py-2 rounded hover:bg-tech-secondary transition-colors"
                    >
                      Start Lab
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      default:
        return <p className="text-tech-fg">Select an option from the sidebar.</p>;
    }
  };

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-tech-bg">
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-tech-primary transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-50 shadow-lg`}
        >
          <div className="p-4 flex justify-between items-center bg-tech-primary border-b border-tech-muted text-tech-fg">
            <h3 className="text-xl font-bold">Menu</h3>
            <button
              onClick={toggleSidebar}
              className="md:hidden text-tech-fg hover:text-tech-secondary focus:outline-none"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveSection("welcome")}
                  className="w-full text-left px-4 py-2 text-tech-fg hover:bg-tech-secondary hover:text-tech-fg rounded transition-colors"
                >
                  Welcome
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection("terminal")}
                  className="w-full text-left px-4 py-2 text-tech-fg hover:bg-tech-secondary hover:text-tech-fg rounded transition-colors"
                >
                  Terminal
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection("lessons")}
                  className="w-full text-left px-4 py-2 text-tech-fg hover:bg-tech-secondary hover:text-tech-fg rounded transition-colors"
                >
                  Lessons
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection("labs")}
                  className="w-full text-left px-4 py-2 text-tech-fg hover:bg-tech-secondary hover:text-tech-fg rounded transition-colors"
                >
                  Labs
                </button>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="flex-grow p-4 bg-tech-bg relative">
          <button
            onClick={toggleSidebar}
            className={`md:hidden p-2 bg-tech-primary text-tech-fg rounded hover:bg-tech-secondary fixed top-16 left-4 z-50 focus:outline-none ${
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
