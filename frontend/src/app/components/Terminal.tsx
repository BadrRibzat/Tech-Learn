"use client";
import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";

export default function TerminalComponent() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      theme: {
        background: "#1e1e1e",
        foreground: "#ffffff",
      },
    });

    if (terminalRef.current) {
      term.open(terminalRef.current);
      term.write("Connecting to terminal...\r\n");
    }

    const connectWebSocket = () => {
      wsRef.current = new WebSocket("ws://localhost:3001");

      wsRef.current.onopen = () => {
        console.log("WebSocket opened");
        term.clear();
        term.write("Connected to terminal\r\n");
      };

      wsRef.current.onmessage = (event) => {
        term.write(event.data);
      };

      wsRef.current.onclose = (event) => {
        console.log("WebSocket closed:", event.code);
        term.write(`\r\nConnection closed. Reconnecting...\r\n`);
        setTimeout(connectWebSocket, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        term.write(`\r\nError: Connection failed\r\n`);
      };

      term.onData((data) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(data);
        } else {
          term.write(`\r\nTerminal disconnected\r\n`);
        }
      });
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      term.dispose();
    };
  }, []);

  return <div ref={terminalRef} className="w-full h-[500px] p-4 bg-tech-bg" />;
}
