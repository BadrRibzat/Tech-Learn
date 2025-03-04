"use client";
import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

export default function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<XTerm | null>(null);

  useEffect(() => {
    termRef.current = new XTerm({
      cursorBlink: true,
      theme: { background: "#282a36" },
    });

    if (terminalRef.current) {
      termRef.current.open(terminalRef.current);
      termRef.current.focus();

      const ws = new WebSocket("ws://localhost:3001");
      ws.onopen = () => {
        console.log("WebSocket opened");
        termRef.current.write("Connected to Ubuntu Terminal\r\n");
      };
      ws.onmessage = (event) => termRef.current.write(event.data);
      ws.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
        termRef.current.write(`\r\nDisconnected (Code: ${event.code})\r\n`);
      };
      ws.onerror = (event) => {
        console.error("WebSocket error:", event);
        termRef.current.write("\r\nWebSocket error occurred\r\n");
      };

      termRef.current.onData((data) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(data);
        }
      });
    }

    return () => {
      if (termRef.current) termRef.current.dispose();
    };
  }, []);

  return <div ref={terminalRef} className="w-full h-96" />;
}
