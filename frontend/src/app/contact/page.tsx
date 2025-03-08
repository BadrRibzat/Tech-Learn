// frontend/src/app/contact/page.tsx
import Header from "../components/Header";

export default function Contact() {
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-4 text-tech-fg">
        <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
        <p>Email: badrribzat@gmail.com</p>
      </div>
    </>
  );
}
