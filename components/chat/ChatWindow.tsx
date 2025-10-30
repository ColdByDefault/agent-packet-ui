/**
 * ChatWindow Component - Main chat interface container
 */

import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import type { Message } from "@/lib/types/chat.types";

interface ChatWindowProps {
  messages: Message[];
  isLoading?: boolean;
}

export function ChatWindow({ messages, isLoading = false }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Auto-scroll to bottom when new messages arrive
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scroll-smooth"
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="text-6xl">💬</div>
            <h3 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">
              Start a conversation
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
              Ask me anything! I can help you with questions, provide
              information, and assist with various tasks.
            </p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg px-4 py-3">
                <div className="flex space-x-2">
                  <div
                    className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
