/**
 * StatusPanel Component - Displays agent status and system information
 */

"use client";

import { useAgentStatus } from "@/lib/hooks/useAgentStatus";
import { useEffect } from "react";

interface StatusPanelProps {
  refreshTrigger?: number;
}

export function StatusPanel({ refreshTrigger }: StatusPanelProps) {
  const { health, status, isLoading, error, isConnected, refresh } =
    useAgentStatus({
      enablePolling: true,
      pollingInterval: 180000, // 3 minutes
    });

  // Refresh when trigger changes (e.g., after sending a message)
  useEffect(() => {
    if (refreshTrigger) {
      refresh();
    }
  }, [refreshTrigger, refresh]);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          System Status
        </h2>
        <button
          onClick={refresh}
          disabled={isLoading}
          className="px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 
                   hover:text-zinc-900 dark:hover:text-zinc-200
                   hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md
                   transition-colors duration-200 disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Connection Status */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span
            className={`font-medium ${
              isConnected
                ? "text-green-700 dark:text-green-400"
                : "text-red-700 dark:text-red-400"
            }`}
          >
            {isConnected ? "Backend Connected" : "Backend Disconnected"}
          </span>
        </div>

        {/* Health Information */}
        {health && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Status:</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {health.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">
                Agent Initialized:
              </span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {health.agent_initialized ? "Yes" : "No"}
              </span>
            </div>
            {health.agent_name && (
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Agent Name:
                </span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {health.agent_name}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">
                MCP Enabled:
              </span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {health.mcp_enabled ? "Yes" : "No"}
              </span>
            </div>
          </div>
        )}

        {/* Detailed Status */}
        {status && (
          <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-2 text-sm">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Agent Details
            </h3>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">
                LLM Model:
              </span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {status.llm_model}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">
                Ollama URL:
              </span>
              <span className="font-mono text-xs text-zinc-900 dark:text-zinc-100">
                {status.ollama_url}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">
                RAG Enabled:
              </span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {status.rag_enabled ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">
                Conversation Length:
              </span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {status.conversation_length} messages
              </span>
            </div>

            {/* MCP Tools Section */}
            {status.mcp_enabled && (
              <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                    MCP Tools:
                  </span>
                  <span className="text-xs text-green-600 dark:text-green-400">
                    Enabled
                  </span>
                </div>
                {status.mcp_tools && status.mcp_tools.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {status.mcp_tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 
                                 text-green-700 dark:text-green-300 rounded border 
                                 border-green-200 dark:border-green-800"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                    No tools available
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
