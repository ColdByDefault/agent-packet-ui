"use client";

import { useEffect, useState } from "react";

interface HealthStatus {
  status: string;
  agent_initialized: boolean;
  agent_name: string | null;
  mcp_enabled?: boolean;
  mcp_tools?: string[] | null;
  timestamp: number;
}

export default function Home() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [healthData, setHealthData] = useState<HealthStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const response = await fetch("http://localhost:8001/health");

        if (response.ok) {
          const data = await response.json();
          console.log("Health data received:", data);
          setHealthData(data);
          setIsConnected(true);
          setError(null);
        } else {
          setIsConnected(false);
          setError(`Backend returned status: ${response.status}`);
        }
      } catch {
        setIsConnected(false);
        setError(
          "Cannot connect to backend. Make sure it's running on http://localhost:8001"
        );
      }
    };

    // Check connection immediately
    checkBackendConnection();

    // Check connection every 3 minutes
    const interval = setInterval(checkBackendConnection, 180000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="w-full space-y-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
            Agent Packet UI
          </h1>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
              Backend Connection Status
            </h2>

            {isConnected === null && (
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                <span className="text-zinc-600 dark:text-zinc-400">
                  Checking connection...
                </span>
              </div>
            )}

            {isConnected === true && (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-green-700 dark:text-green-400 font-medium">
                    Connected to backend
                  </span>
                </div>

                {healthData && (
                  <div className="ml-6 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <div>
                      <span className="font-medium">Status:</span>{" "}
                      {healthData.status}
                    </div>
                    <div>
                      <span className="font-medium">Agent Initialized:</span>{" "}
                      {healthData.agent_initialized ? "Yes" : "No"}
                    </div>
                    {healthData.agent_name && (
                      <div>
                        <span className="font-medium">Agent Name:</span>{" "}
                        {healthData.agent_name}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">MCP Tools:</span>{" "}
                      <span
                        className={
                          healthData.mcp_enabled
                            ? "text-green-600 dark:text-green-400"
                            : "text-orange-600 dark:text-orange-400"
                        }
                      >
                        {healthData.mcp_enabled !== undefined
                          ? healthData.mcp_enabled
                            ? "Enabled"
                            : "Disabled"
                          : "Unknown"}
                      </span>
                    </div>
                    {healthData.mcp_enabled &&
                      healthData.mcp_tools &&
                      healthData.mcp_tools.length > 0 && (
                        <div>
                          <span className="font-medium">Available Tools:</span>
                          <div className="ml-4 mt-1 flex flex-wrap gap-2">
                            {healthData.mcp_tools.map((tool) => (
                              <span
                                key={tool}
                                className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            )}

            {isConnected === false && (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-red-700 dark:text-red-400 font-medium">
                    Not connected to backend
                  </span>
                </div>

                {error && (
                  <div className="ml-6 text-sm text-zinc-600 dark:text-zinc-400">
                    {error}
                  </div>
                )}

                <div className="ml-6 text-sm text-zinc-500 dark:text-zinc-500">
                  To start the backend, run:
                  <code className="block mt-2 p-2 bg-zinc-100 dark:bg-zinc-900 rounded">
                    cd llm_local_agent && python api_server.py
                  </code>
                  <div className="mt-2 text-xs text-zinc-400">
                    Or for a simpler server without MCP tools:
                  </div>
                  <code className="block mt-1 p-2 bg-zinc-100 dark:bg-zinc-900 rounded">
                    cd llm_local_agent && python api_server_simple.py
                  </code>
                </div>
              </div>
            )}
          </div>

          <div className="text-sm text-zinc-500 dark:text-zinc-600 flex space-y-2 flex-col">
            Backend:{" "}
            <a
              href="https://github.com/ColdByDefault/agent-packet"
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              agent-packet
            </a>
            Frontend:{" "}
            <a
              href="https://github.com/ColdByDefault/agent-packet-ui"
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              agent-packet-ui
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
