/**
 * ConnectionStatus Component - Shows backend connection status
 */

interface ConnectionStatusProps {
  isConnected: boolean;
}

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${
          isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
        }`}
      />
      <span
        className={`text-xs font-medium ${
          isConnected
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }`}
      >
        {isConnected ? "Connected" : "Disconnected"}
      </span>
    </div>
  );
}
