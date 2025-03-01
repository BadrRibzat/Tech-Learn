"use client";
import { useState, useEffect, useRef } from "react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://127.0.0.1:8000/ws/chatbot/");
    ws.current.onopen = () => console.log("Chatbot connected");
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, { sender: "bot", text: data.message }]);
    };
    ws.current.onclose = () => console.log("Chatbot disconnected");

    return () => {
      ws.current?.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() && ws.current) {
      setMessages((prev) => [...prev, { sender: "user", text: input }]);
      ws.current.send(JSON.stringify({ message: input }));
      setInput("");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-dracula-purple text-dracula-bg p-3 rounded-full shadow-lg hover:bg-dracula-comment transition-colors"
      >
        <ChatBubbleLeftRightIcon className="h-6 w-6" />
      </button>
      {isOpen && (
        <div className="fixed bottom-16 right-4 w-80 h-96 bg-dracula-bg rounded-lg shadow-lg flex flex-col border border-dracula-purple">
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}
              >
                <span
                  className={`inline-block p-2 rounded-md ${
                    msg.sender === "user" ? "bg-dracula-purple text-dracula-bg" : "bg-dracula-comment text-dracula-fg"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-2 border-t border-dracula-purple">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="w-full p-2 bg-dracula-bg text-dracula-fg rounded-md border border-dracula-purple focus:outline-none focus:ring-1 focus:ring-dracula-purple"
              placeholder="Type a message..."
            />
          </div>
        </div>
      )}
    </>
  );
}
