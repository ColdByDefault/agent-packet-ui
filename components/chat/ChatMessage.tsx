/**
 * ChatMessage Component - Displays a single chat message
 */

import type { Message } from "@/lib/types/chat.types";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";
  const isError = message.metadata?.error;

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } mb-4 animate-fade-in`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser
            ? "bg-blue-600 text-white"
            : isError
            ? "bg-red-100 dark:bg-red-900/20 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800"
            : isSystem
            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 italic"
            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
        }`}
      >
        {/* Message content */}
        <div className="whitespace-pre-wrap wrap-break-word">
          {message.content}
        </div>

        {/* Metadata footer */}
        {message.metadata && !isError && (
          <div
            className={`mt-2 pt-2 border-t text-xs opacity-70 ${
              isUser
                ? "border-blue-500"
                : "border-zinc-300 dark:border-zinc-600"
            }`}
          >
            {message.metadata.model && (
              <div>Model: {message.metadata.model}</div>
            )}
            {message.metadata.tokens_used && (
              <div>Tokens: {message.metadata.tokens_used}</div>
            )}
            {message.metadata.rag_context_used && (
              <div>🔍 Used knowledge base</div>
            )}
            {message.metadata.tools_used &&
              message.metadata.tools_used.length > 0 && (
                <div>🛠️ Tools: {message.metadata.tools_used.join(", ")}</div>
              )}
          </div>
        )}

        {/* Timestamp */}
        <div
          className={`mt-1 text-xs opacity-60 ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
