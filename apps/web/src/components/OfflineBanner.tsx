import { useOnlineStatus } from "../hooks/useOnlineStatus.js";
import { SyncQueueBadge } from "./SyncQueueBadge.js";

export function OfflineBanner() {
  const online = useOnlineStatus();

  return (
    <>
      {!online && (
        <div className="bg-amber-100 text-amber-900 text-sm px-4 py-2 text-center">
          You're offline — showing previously loaded data. Service visits you log will be saved on your
          device and synced automatically.
        </div>
      )}
      <SyncQueueBadge />
    </>
  );
}
