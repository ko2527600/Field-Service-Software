import { api } from "./client.js";

export type ReminderRunResult = {
  checked: number;
  sent: number;
  failed: number;
  errors: string[];
};

export function runReminders() {
  return api.post<ReminderRunResult>("/reminders/run", {});
}
