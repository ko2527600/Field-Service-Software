import { useEffect, useState } from "react";
import { getQueueCount, subscribeQueueChange } from "../offline/syncQueue.js";

export function SyncQueueBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const refresh = () => {
      getQueueCount().then((c) => {
        if (!cancelled) setCount(c);
      });
    };
    refresh();
    const unsubscribe = subscribeQueueChange(refresh);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  if (count === 0) return null;

  return (
    <div className="px-4 pt-2 flex justify-center md:justify-start md:px-6">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
        {count} visit{count === 1 ? "" : "s"} pending sync
      </span>
    </div>
  );
}
