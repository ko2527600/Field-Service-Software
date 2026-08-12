import { useOnlineStatus } from "../hooks/useOnlineStatus.js";

export function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;

  return (
    <div className="bg-amber-100 text-amber-900 text-sm px-4 py-2 text-center">
      You're offline — showing previously loaded data. Reconnect to save changes.
    </div>
  );
}
