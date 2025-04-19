'use client';

import { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

export default function TerminalComponent() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const terminalInstanceRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const initializeTerminal = () => {
    if (!terminalRef.current) return;

    terminalInstanceRef.current = new Terminal({
      cursorBlink: true,
      theme: { background: '#1a1a1a', foreground: '#ffffff' },
    });
    fitAddonRef.current = new FitAddon();
    terminalInstanceRef.current.loadAddon(fitAddonRef.current);
    terminalInstanceRef.current.open(terminalRef.current);
    fitAddonRef.current.fit();

    terminalInstanceRef.current.writeln('Terminal ready\r');

    terminalInstanceRef.current.onData((data) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(data);
      }
    });
  };

  const connectWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    wsRef.current = new WebSocket('ws://localhost:3001/');

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      if (terminalInstanceRef.current) {
        terminalInstanceRef.current.clear();
        terminalInstanceRef.current.writeln('Connected to terminal\r');
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    wsRef.current.onmessage = (event) => {
      if (terminalInstanceRef.current) {
        terminalInstanceRef.current.write(event.data);
      }
    };

    wsRef.current.onclose = (event) => {
      console.log('WebSocket closed, code:', event.code);
      setIsConnected(false);
      if (terminalInstanceRef.current) {
        terminalInstanceRef.current.writeln(`\rDisconnected (code: ${event.code}). Reconnecting...\r`);
      }
      if (!reconnectTimeoutRef.current) {
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
      wsRef.current?.close();
    };
  };

  useEffect(() => {
    initializeTerminal();
    connectWebSocket();

    const resizeObserver = new ResizeObserver(() => {
      if (fitAddonRef.current && terminalRef.current?.offsetWidth && terminalRef.current?.offsetHeight) {
        try {
          fitAddonRef.current.fit();
        } catch (e) {
          console.error('Fit addon error:', e);
        }
      }
    });

    if (terminalRef.current) {
      resizeObserver.observe(terminalRef.current);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (terminalInstanceRef.current) {
        terminalInstanceRef.current.dispose();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '400px', background: '#1a1a1a' }}>
      <div ref={terminalRef} style={{ width: '100%', height: '100%' }} />
      {!isConnected && <p style={{ color: 'red' }}>Reconnecting...</p>}
    </div>
  );
}
