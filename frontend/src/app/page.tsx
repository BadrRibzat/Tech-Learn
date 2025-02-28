import Header from "./components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-3xl font-bold mb-4">Welcome to Tech-Learn</h2>
        <p className="mb-4">
          Tech-Learn is your platform to master programming and system administration through hands-on practice.
          Explore our interactive terminal, dive into tutorials, and track your progress.
        </p>
        <a href="/terminal" className="bg-dracula-purple text-dracula-bg px-4 py-2 rounded hover:bg-dracula-comment">
          Try the Terminal
        </a>
      </div>
    </>
  );
}
