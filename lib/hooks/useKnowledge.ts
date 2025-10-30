/**
 * useKnowledge Hook - Manage knowledge base and memory data
 */

import { useState, useCallback } from "react";
import { apiService } from "@/lib/services/api.service";
import type {
  KnowledgeStats,
  MemoryStats,
  KnowledgeSearchResponse,
} from "@/lib/types/chat.types";

export function useKnowledge() {
  const [knowledgeStats, setKnowledgeStats] = useState<KnowledgeStats | null>(
    null
  );
  const [memoryStats, setMemoryStats] = useState<MemoryStats | null>(null);
  const [searchResults, setSearchResults] =
    useState<KnowledgeSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch knowledge base statistics
   */
  const fetchKnowledgeStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const stats = await apiService.getKnowledgeStats();
      setKnowledgeStats(stats);
      return stats;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to fetch knowledge stats";
      setError(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch memory statistics
   */
  const fetchMemoryStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const stats = await apiService.getMemoryStats();
      setMemoryStats(stats);
      return stats;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to fetch memory stats";
      setError(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Search knowledge base
   */
  const searchKnowledge = useCallback(
    async (query: string, limit: number = 10) => {
      if (!query.trim()) {
        return null;
      }

      try {
        setIsLoading(true);
        setError(null);
        const results = await apiService.searchKnowledge(query, limit);
        setSearchResults(results);
        return results;
      } catch (err) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Failed to search knowledge base";
        setError(errorMsg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Refresh all data
   */
  const refreshAll = useCallback(async () => {
    await Promise.all([fetchKnowledgeStats(), fetchMemoryStats()]);
  }, [fetchKnowledgeStats, fetchMemoryStats]);

  /**
   * Clear search results
   */
  const clearSearchResults = useCallback(() => {
    setSearchResults(null);
  }, []);

  return {
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
  };
}
