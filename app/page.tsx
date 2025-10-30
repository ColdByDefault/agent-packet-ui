"use client";

import { ChatContainer } from "@/components/chat";
import { StatusPanel } from "@/components/StatusPanel";
import { KnowledgeViewer } from "@/components/KnowledgeViewer";
import { useState } from "react";

export default function Home() {
  const [statusRefreshTrigger, setStatusRefreshTrigger] = useState(0);

  const handleMessageSent = () => {
    // Trigger status refresh after message is sent
    setStatusRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
            Agent Packet UI
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Chat with your local LLM agent powered by Ollama
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Section - Takes up 2/3 on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <div className="h-[calc(100vh-300px)] min-h-[600px]">
              <ChatContainer onMessageSent={handleMessageSent} />
            </div>

            {/* Knowledge Viewer - Full width below chat */}
            <KnowledgeViewer refreshTrigger={statusRefreshTrigger} />
          </div>

          {/* Status Panel - Takes up 1/3 on large screens */}
          <div className="lg:col-span-1">
            <StatusPanel refreshTrigger={statusRefreshTrigger} />

            {/* Quick Info */}
            <div className="mt-6 p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                Quick Info
              </h3>
              <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-2">
                <div>
                  <span className="font-medium">Shortcuts:</span>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Enter to send</li>
                    <li>• Shift+Enter for new line</li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <span className="font-medium">Features:</span>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• RAG-powered responses</li>
                    <li>• Conversation history</li>
                    <li>• Token usage tracking</li>
                    <li>• MCP tools (if enabled)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="mt-6 text-xs text-zinc-500 dark:text-zinc-600 space-y-1">
              <div>
                <span className="font-medium">Backend:</span>{" "}
                <a
                  href="https://github.com/ColdByDefault/agent-packet"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  agent-packet
                </a>
              </div>
              <div>
                <span className="font-medium">Frontend:</span>{" "}
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
          </div>
        </div>
      </div>
    </div>
  );
}
