"use client";
import { useState, useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

export default function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const term = new XTerm({
      cursorBlink: true,
      theme: { background: "#282a36" },
    });
    if (terminalRef.current) {
      term.open(terminalRef.current);
    }

    const websocket = new WebSocket("ws://127.0.0.1:8000/ws/terminal/");
    setWs(websocket);

    websocket.onopen = () => term.write("Connected to terminal\r\n");
    websocket.onmessage = (event) => term.write(event.data);
    websocket.onclose = () => term.write("\r\nDisconnected");

    term.onData((data) => websocket.send(data));

    return () => {
      websocket.close();
      term.dispose();
    };
  }, []);

  return <div ref={terminalRef} className="w-full h-96" />;
}
