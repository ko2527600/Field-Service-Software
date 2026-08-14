import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { ServiceLogInput } from "@firearmour/shared";

export type QueuedServiceLog = {
  id?: number;
  unitId: string;
  payload: ServiceLogInput;
  createdAt: string;
  attempts: number;
  lastError?: string;
};

interface FireArmourOfflineDB extends DBSchema {
  syncQueue: {
    key: number;
    value: QueuedServiceLog;
  };
}

let dbPromise: Promise<IDBPDatabase<FireArmourOfflineDB>> | null = null;

export function getOfflineDb() {
  if (!dbPromise) {
    dbPromise = openDB<FireArmourOfflineDB>("firearmour-offline", 1, {
      upgrade(db) {
        db.createObjectStore("syncQueue", { keyPath: "id", autoIncrement: true });
      },
    });
  }
  return dbPromise;
}
