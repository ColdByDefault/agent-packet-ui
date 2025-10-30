/**
 * KnowledgeViewer Component - Displays RAG, Memory, and Chat History
 */

"use client";

import { useEffect, useState } from "react";
import { useKnowledge } from "@/lib/hooks/useKnowledge";
import { useChat } from "@/lib/hooks/useChat";

interface KnowledgeViewerProps {
  refreshTrigger?: number;
}

export function KnowledgeViewer({ refreshTrigger }: KnowledgeViewerProps) {
  const {
    knowledgeStats,
    memoryStats,
    searchResults,
    isLoading,
    error,
    fetchKnowledgeStats,
    fetchMemoryStats,
    searchKnowledge,
    refreshAll,
    clearSearchResults,
  } = useKnowledge();

  const { messages } = useChat();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"memory" | "rag" | "history">(
    "memory"
  );

  useEffect(() => {
    refreshAll();
  }, [refreshAll, refreshTrigger]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await searchKnowledge(searchQuery);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Knowledge & Memory
        </h2>
        <button
          onClick={refreshAll}
          disabled={isLoading}
          className="px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 
                   hover:text-zinc-900 dark:hover:text-zinc-200
                   hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md
                   transition-colors duration-200 disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mx-6 mt-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab("memory")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "memory"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          💾 Memory
        </button>
        <button
          onClick={() => setActiveTab("rag")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "rag"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          📚 Knowledge Base
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "history"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          💬 Chat History
        </button>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[600px] overflow-y-auto">
        {/* Memory Tab */}
        {activeTab === "memory" && memoryStats && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  Messages
                </div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {memoryStats.conversation_length}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-500">
                  Max: {memoryStats.max_conversation_length}
                </div>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  Est. Tokens
                </div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {memoryStats.estimated_tokens}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-500">
                  Approximate
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Persistence:
                </span>
                <span
                  className={`font-medium ${
                    memoryStats.persistence_enabled
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {memoryStats.persistence_enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">
                  System Prompt:
                </span>
                <span
                  className={`font-medium ${
                    memoryStats.system_prompt_set
                      ? "text-green-600 dark:text-green-400"
                      : "text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  {memoryStats.system_prompt_set ? "Set" : "Not Set"}
                </span>
              </div>
            </div>

            {memoryStats.persistence_enabled && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  💡 Your conversations are automatically saved to disk and will
                  persist across server restarts.
                </div>
              </div>
            )}
          </div>
        )}

        {/* RAG Tab */}
        {activeTab === "rag" && (
          <div className="space-y-4">
            {knowledgeStats && (
              <>
                {knowledgeStats.enabled ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">
                          Knowledge Chunks
                        </div>
                        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                          {knowledgeStats.chunk_count}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-500">
                          In vector database
                        </div>
                      </div>

                      <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">
                          Chunk Size
                        </div>
                        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                          {knowledgeStats.chunk_size || "N/A"}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-500">
                          Characters
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">
                          Embedding Model:
                        </span>
                        <span className="font-mono text-xs text-zinc-900 dark:text-zinc-100">
                          {knowledgeStats.embedding_model}
                        </span>
                      </div>
                      {knowledgeStats.similarity_threshold && (
                        <div className="flex justify-between">
                          <span className="text-zinc-600 dark:text-zinc-400">
                            Similarity Threshold:
                          </span>
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {knowledgeStats.similarity_threshold}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Search Knowledge */}
                    <div className="mt-6">
                      <form onSubmit={handleSearch} className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Search Knowledge Base
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Enter search query..."
                              className="flex-1 px-3 py-2 text-sm rounded-md border border-zinc-300 dark:border-zinc-700 
                                       bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                                       focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              type="submit"
                              disabled={!searchQuery.trim() || isLoading}
                              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 
                                       disabled:bg-zinc-300 dark:disabled:bg-zinc-700 
                                       text-white rounded-md font-medium transition-colors 
                                       disabled:cursor-not-allowed"
                            >
                              Search
                            </button>
                          </div>
                        </div>
                      </form>

                      {/* Search Results */}
                      {searchResults && (
                        <div className="mt-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                              Results ({searchResults.result_count})
                            </h3>
                            <button
                              onClick={clearSearchResults}
                              className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                            >
                              Clear
                            </button>
                          </div>

                          {searchResults.results.length === 0 ? (
                            <div className="text-sm text-zinc-500 dark:text-zinc-500 italic">
                              No results found for &ldquo;{searchResults.query}
                              &rdquo;
                            </div>
                          ) : (
                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                              {searchResults.results.map((result, index) => (
                                <div
                                  key={index}
                                  className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700"
                                >
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                      Score: {result.score.toFixed(3)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-3">
                                    {result.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-zinc-500 dark:text-zinc-500">
                    <div className="text-4xl mb-2">📚</div>
                    <p>Knowledge Base (RAG) is not enabled</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Chat History Tab */}
        {activeTab === "history" && (
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 dark:text-zinc-500">
                <div className="text-4xl mb-2">💬</div>
                <p>No chat history yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                        : "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold uppercase text-zinc-600 dark:text-zinc-400">
                        {msg.role}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-500">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                      {msg.content}
                    </p>
                    {msg.metadata && (
                      <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                        {msg.metadata.model && `Model: ${msg.metadata.model}`}
                        {msg.metadata.tokens_used &&
                          ` • Tokens: ${msg.metadata.tokens_used}`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
