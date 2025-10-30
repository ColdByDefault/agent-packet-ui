/**
 * Type definitions for the chat feature
 */

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  model?: string;
  tokens_used?: number;
  rag_context_used?: boolean;
  tools_used?: string[];
  error?: string;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  response: string;
  metadata?: MessageMetadata;
}

export interface HealthStatus {
  status: string;
  agent_initialized: boolean;
  agent_name: string | null;
  mcp_enabled?: boolean;
  timestamp: number;
}

export interface AgentStatus {
  status: string;
  agent_name: string;
  llm_model: string;
  ollama_url: string;
  rag_enabled: boolean;
  mcp_enabled: boolean;
  mcp_tools: string[] | null;
  conversation_length: number;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
}

export type ChatAction =
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_CONNECTED"; payload: boolean }
  | { type: "CLEAR_MESSAGES" }
  | { type: "UPDATE_LAST_MESSAGE"; payload: Partial<Message> };

export interface KnowledgeStats {
  enabled: boolean;
  chunk_count: number;
  embedding_model: string | null;
  vector_db_path?: string;
  chunk_size?: number;
  similarity_threshold?: number;
  error?: string;
}

export interface MemoryStats {
  conversation_length: number;
  max_conversation_length: number;
  estimated_tokens: number;
  persistence_enabled: boolean;
  system_prompt_set: boolean;
}

export interface KnowledgeSearchResult {
  content: string;
  score: number;
  metadata: Record<string, unknown>;
}

export interface KnowledgeSearchResponse {
  query: string;
  results: KnowledgeSearchResult[];
  result_count: number;
}
