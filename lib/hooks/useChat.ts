/**
 * useChat Hook - Main state management for chat functionality
 * This is the controller layer in our architecture
 */

import { useReducer, useCallback, useEffect, useRef } from "react";
import { apiService, ApiError } from "@/lib/services/api.service";
import type { Message, ChatState, ChatAction } from "@/lib/types/chat.types";

/**
 * Chat state reducer
 */
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "SET_CONNECTED":
      return {
        ...state,
        isConnected: action.payload,
      };

    case "CLEAR_MESSAGES":
      return {
        ...state,
        messages: [],
      };

    case "UPDATE_LAST_MESSAGE":
      const messages = [...state.messages];
      const lastIndex = messages.length - 1;
      if (lastIndex >= 0) {
        messages[lastIndex] = { ...messages[lastIndex], ...action.payload };
      }
      return {
        ...state,
        messages,
      };

    default:
      return state;
  }
}

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  isConnected: false,
};

interface UseChatOptions {
  onMessageSent?: () => void;
}

/**
 * Custom hook for chat functionality
 */
export function useChat(options: UseChatOptions = {}) {
  const { onMessageSent } = options;
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const messageIdCounter = useRef(0);

  /**
   * Generate unique message ID
   */
  const generateMessageId = useCallback(() => {
    return `msg-${Date.now()}-${messageIdCounter.current++}`;
  }, []);

  /**
   * Add a message to the chat
   */
  const addMessage = useCallback(
    (
      role: Message["role"],
      content: string,
      metadata?: Message["metadata"]
    ) => {
      const message: Message = {
        id: generateMessageId(),
        role,
        content,
        timestamp: new Date(),
        metadata,
      };

      dispatch({ type: "ADD_MESSAGE", payload: message });
      return message;
    },
    [generateMessageId]
  );

  /**
   * Send a message to the agent
   */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) {
        return;
      }

      // Add user message
      addMessage("user", content);

      // Set loading state
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        // Send to backend
        const response = await apiService.sendMessage(content);

        // Add assistant response
        addMessage("assistant", response.response, response.metadata);

        // Trigger callback after successful message
        if (onMessageSent) {
          onMessageSent();
        }
      } catch (error) {
        const errorMessage =
          error instanceof ApiError ? error.message : "Failed to send message";

        dispatch({ type: "SET_ERROR", payload: errorMessage });

        // Add error message to chat
        addMessage("assistant", `Error: ${errorMessage}`, {
          error: errorMessage,
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [addMessage, onMessageSent]
  );

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(async () => {
    try {
      // Clear on backend first
      await apiService.clearConversation();
      // Then clear frontend
      dispatch({ type: "CLEAR_MESSAGES" });
    } catch (error) {
      // If backend fails, still clear frontend
      dispatch({ type: "CLEAR_MESSAGES" });
    }
  }, []);

  /**
   * Load conversation history from backend
   */
  const loadConversation = useCallback(async () => {
    try {
      const { messages: backendMessages } = await apiService.getConversation();

      // Convert backend messages to frontend format
      const convertedMessages: Message[] = backendMessages.map(
        (msg, index) => ({
          id: `backend-${index}-${Date.now()}`,
          role: msg.role as Message["role"],
          content: msg.content,
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
        })
      );

      // Replace current messages with backend messages
      dispatch({ type: "CLEAR_MESSAGES" });
      convertedMessages.forEach((msg) => {
        dispatch({ type: "ADD_MESSAGE", payload: msg });
      });

      return true;
    } catch (error) {
      console.error("Failed to load conversation:", error);
      return false;
    }
  }, []);

  /**
   * Check backend connection
   */
  const checkConnection = useCallback(async () => {
    try {
      const health = await apiService.checkHealth();
      dispatch({
        type: "SET_CONNECTED",
        payload: health.status === "healthy" && health.agent_initialized,
      });
      return true;
    } catch (error) {
      dispatch({ type: "SET_CONNECTED", payload: false });
      return false;
    }
  }, []);

  /**
   * Retry last message if there was an error
   */
  const retryLastMessage = useCallback(() => {
    const lastUserMessage = [...state.messages]
      .reverse()
      .find((msg) => msg.role === "user");

    if (lastUserMessage) {
      sendMessage(lastUserMessage.content);
    }
  }, [state.messages, sendMessage]);

  /**
   * Start a new conversation
   */
  const startNewConversation = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      await apiService.startNewConversation();

      // Clear local messages
      dispatch({ type: "CLEAR_MESSAGES" });

      // Notify parent if callback provided
      if (onMessageSent) {
        onMessageSent();
      }
    } catch (error) {
      const errorMessage =
        error instanceof ApiError
          ? error.message
          : "Failed to start new conversation";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [onMessageSent]);

  // Check connection on mount
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Load conversation history on mount
  useEffect(() => {
    const init = async () => {
      const connected = await checkConnection();
      if (connected) {
        await loadConversation();
      }
    };
    init();
  }, [checkConnection, loadConversation]);

  return {
    // State
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    isConnected: state.isConnected,

    // Actions
    sendMessage,
    clearMessages,
    checkConnection,
    retryLastMessage,
    addMessage,
    loadConversation,
    startNewConversation,
  };
}
