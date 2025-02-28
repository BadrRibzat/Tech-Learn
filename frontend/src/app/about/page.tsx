import Header from "../components/Header";

export default function About() {
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-3xl font-bold mb-4">About Tech-Learn</h2>
        <p>
          Tech-Learn is a final-year project by Badr Ribzat, designed to teach programming and system administration through interactive tools and tutorials.
        </p>
      </div>
    </>
  );
}
