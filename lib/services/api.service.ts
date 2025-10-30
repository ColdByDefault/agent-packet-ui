/**
 * API Service - Handles all HTTP communication with the backend
 * This is the data layer in our architecture
 */

import type {
  ChatRequest,
  ChatResponse,
  HealthStatus,
  AgentStatus,
  KnowledgeStats,
  MemoryStats,
  KnowledgeSearchResponse,
} from "@/lib/types/chat.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

class ApiError extends Error {
  constructor(message: string, public status?: number, public data?: any) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * API Service for backend communication
 */
export class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Generic fetch wrapper with error handling
   */
  private async fetchWithErrorHandling<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.detail || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Network or parsing errors
      throw new ApiError(
        error instanceof Error ? error.message : "Unknown error occurred",
        undefined,
        error
      );
    }
  }

  /**
   * Check backend health status
   */
  async checkHealth(): Promise<HealthStatus> {
    return this.fetchWithErrorHandling<HealthStatus>("/health");
  }

  /**
   * Get detailed agent status
   */
  async getStatus(): Promise<AgentStatus> {
    return this.fetchWithErrorHandling<AgentStatus>("/status");
  }

  /**
   * Send a chat message to the agent
   */
  async sendMessage(message: string): Promise<ChatResponse> {
    const request: ChatRequest = { message };

    return this.fetchWithErrorHandling<ChatResponse>("/chat", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  /**
   * Send a chat message with streaming response (future enhancement)
   */
  async sendMessageStream(
    message: string,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    const request: ChatRequest = { message };

    const response = await fetch(`${this.baseUrl}/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new ApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new ApiError("No response body");
    }

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        onChunk(chunk);
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Get root endpoint info
   */
  async getRoot(): Promise<any> {
    return this.fetchWithErrorHandling<any>("/");
  }

  /**
   * Get conversation history from backend
   */
  async getConversation(): Promise<{
    messages: Array<{
      role: string;
      content: string;
      timestamp: string | null;
    }>;
    conversation_length: number;
  }> {
    return this.fetchWithErrorHandling("/conversation");
  }

  /**
   * Clear conversation history on backend
   */
  async clearConversation(): Promise<{
    message: string;
    conversation_length: number;
  }> {
    return this.fetchWithErrorHandling("/conversation", {
      method: "DELETE",
    });
  }

  /**
   * Get knowledge base statistics
   */
  async getKnowledgeStats(): Promise<KnowledgeStats> {
    return this.fetchWithErrorHandling<KnowledgeStats>("/knowledge/stats");
  }

  /**
   * Search knowledge base
   */
  async searchKnowledge(
    query: string,
    limit: number = 10
  ): Promise<KnowledgeSearchResponse> {
    return this.fetchWithErrorHandling<KnowledgeSearchResponse>(
      `/knowledge/search?query=${encodeURIComponent(query)}&limit=${limit}`
    );
  }

  /**
   * Get memory statistics
   */
  async getMemoryStats(): Promise<MemoryStats> {
    return this.fetchWithErrorHandling<MemoryStats>("/memory/stats");
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export error class for use in components
export { ApiError };
