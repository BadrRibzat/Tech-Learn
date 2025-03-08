import Header from "./components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-4 text-tech-fg">
        <h2 className="text-3xl font-bold mb-4">Welcome to Tech-Learn</h2>
        <p className="mb-4">
          Tech-Learn is your platform to master programming and system administration through hands-on practice.
          Sign in to access your personalized learning dashboard!
        </p>
        <a href="/sign-in" className="bg-tech-primary text-tech-fg px-4 py-2 rounded hover:bg-tech-secondary transition-colors">
          Sign In
        </a>
      </div>
    </>
  );
}
