"use client";
import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import Header from "../components/Header";

export default function TerminalPage() {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      theme: {
        background: "#282A36",
        foreground: "#F8F8F2",
        cursor: "#BD93F9",
        black: "#21222C",
        red: "#FF5555",
        green: "#50FA7B",
        yellow: "#F1FA8C",
        blue: "#BD93F9",
        magenta: "#FF79C6",
        cyan: "#8BE9FD",
        white: "#F8F8F2",
      },
      fontFamily: "Courier New, monospace",
      fontSize: 14,
    });

    if (terminalRef.current) {
      term.open(terminalRef.current);
      term.write("Tech-Learn Terminal initializing...\r\n");
    }

    const ws = new WebSocket("ws://127.0.0.1:8000/ws/terminal/");
    ws.onopen = () => term.write("\x1b[32mConnected to Ubuntu Server\x1b[0m\r\n");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.output) term.write(data.output);
      if (data.error) term.write(`\x1b[31mError: ${data.error}\x1b[0m\r\n`);
    };
    ws.onclose = () => term.write("\x1b[31mDisconnected. Refresh to reconnect.\x1b[0m\r\n");
    ws.onerror = () => term.write("\x1b[31mWebSocket error occurred.\x1b[0m\r\n");

    term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ command: data }));
      }
    });

    return () => {
      ws.close();
      term.dispose();
    };
  }, []);

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-3xl font-bold mb-4">Interactive Terminal</h2>
        <div ref={terminalRef} className="w-full h-[calc(100vh-150px)]" />
      </div>
    </>
  );
}
