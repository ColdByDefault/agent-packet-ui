/**
 * useAgentStatus Hook - Monitor agent status and health
 */

import { useState, useEffect, useCallback } from "react";
import { apiService } from "@/lib/services/api.service";
import type { HealthStatus, AgentStatus } from "@/lib/types/chat.types";

interface UseAgentStatusOptions {
  pollingInterval?: number; // in milliseconds
  enablePolling?: boolean;
}

export function useAgentStatus(options: UseAgentStatusOptions = {}) {
  const {
    pollingInterval = 180000, // 3 minutes default
    enablePolling = true,
  } = options;

  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [status, setStatus] = useState<AgentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch health status
   */
  const fetchHealth = useCallback(async () => {
    try {
      const data = await apiService.checkHealth();
      setHealth(data);
      setError(null);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      setHealth(null);
      return null;
    }
  }, []);

  /**
   * Fetch detailed status
   */
  const fetchStatus = useCallback(async () => {
    try {
      const data = await apiService.getStatus();
      setStatus(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      setStatus(null);
      return null;
    }
  }, []);

  /**
   * Fetch both health and status
   */
  const refresh = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchHealth(), fetchStatus()]);
    setIsLoading(false);
  }, [fetchHealth, fetchStatus]);

  // Initial fetch
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Polling
  useEffect(() => {
    if (!enablePolling) {
      return;
    }

    const interval = setInterval(() => {
      fetchHealth();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [enablePolling, pollingInterval, fetchHealth]);

  return {
    health,
    status,
    isLoading,
    error,
    isConnected:
      health?.status === "healthy" && health?.agent_initialized === true,
    refresh,
    fetchHealth,
    fetchStatus,
  };
}
