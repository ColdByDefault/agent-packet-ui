/**
 * ChatContainer Component - Main chat feature component
 * Combines ChatWindow and ChatInput with useChat hook
 */

"use client";

import { useChat } from "@/lib/hooks/useChat";
import { ChatWindow } from "./ChatWindow";
import { ChatInput } from "./ChatInput";
import { ConnectionStatus } from "./ConnectionStatus";

interface ChatContainerProps {
  onMessageSent?: () => void;
}

export function ChatContainer({ onMessageSent }: ChatContainerProps) {
  const {
    messages,
    isLoading,
    error,
    isConnected,
    sendMessage,
    clearMessages,
    retryLastMessage,
  } = useChat({ onMessageSent });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            AI Assistant
          </h2>
          <ConnectionStatus isConnected={isConnected} />
          {messages.length > 0 && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              {messages.length} in memory
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="px-3 py-1.5 text-sm text-zinc-600 
                       transition-colors duration-200"
            >
              Clear Chat
            </button>
          )}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-6 mt-4 px-4 py-3 bg-red-50  border rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-red-600 dark:text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-red-800 dark:text-red-200">
              {error}
            </span>
          </div>
          {error.includes("Failed to send message") && (
            <button
              onClick={retryLastMessage}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* Chat Window */}
      <ChatWindow messages={messages} isLoading={isLoading} />

      {/* Input */}
      <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
        <ChatInput
          onSend={sendMessage}
          disabled={!isConnected || isLoading}
          placeholder={
            !isConnected
              ? "Connecting to backend..."
              : "Type your message... (Shift+Enter for new line)"
          }
        />
      </div>
    </div>
  );
}
