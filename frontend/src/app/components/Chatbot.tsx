"use client";
import { useState, useEffect } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

export default function Chatbot() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket("ws://127.0.0.1:8000/ws/chatbot/");
    
    websocket.onopen = () => {
      console.log("Chatbot WebSocket connected");
      setMessages((prev) => [...prev, { sender: "system", text: "Chatbot connected" }]);
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.message) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.message }]);
      } else if (data.error) {
        setMessages((prev) => [...prev, { sender: "system", text: `Error: ${data.error}` }]);
      }
    };

    websocket.onclose = () => {
      console.log("Chatbot disconnected");
      setMessages((prev) => [...prev, { sender: "system", text: "Chatbot disconnected" }]);
      setTimeout(() => {
        setWs(new WebSocket("ws://127.0.0.1:8000/ws/chatbot/"));
      }, 3000);
    };

    websocket.onerror = (error) => {
      console.error("Chatbot WebSocket error:", error);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() && ws?.readyState === WebSocket.OPEN) {
      setMessages((prev) => [...prev, { sender: "user", text: input }]);
      ws.send(JSON.stringify({ message: input }));
      setInput("");
    } else {
      console.log("WebSocket is not open");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-tech-primary rounded-lg shadow-lg p-4">
      <div className="h-64 overflow-y-auto mb-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.sender === "user" ? "text-right text-tech-secondary" : "text-tech-fg"
            }`}
          >
            <span className="inline-block bg-tech-bg p-2 rounded">{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          className="flex-grow p-2 bg-tech-bg text-tech-fg rounded-l-md border border-tech-muted focus:outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-tech-secondary text-tech-fg p-2 rounded-r-md hover:bg-tech-accent"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
