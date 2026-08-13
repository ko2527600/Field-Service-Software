import { createApp } from "./app.js";
import { sendDueRenewalReminders } from "./services/reminders.service.js";

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
const app = createApp();

app.listen(port, "0.0.0.0", () => {
  console.log(`Fire Armour API listening on http://0.0.0.0:${port}`);
});

const REMINDER_CHECK_INTERVAL_MS = 60 * 60 * 1000;

async function runReminderCheck() {
  try {
    const result = await sendDueRenewalReminders();
    if (result.sent > 0 || result.failed > 0) {
      console.log(`SMS reminders: checked ${result.checked}, sent ${result.sent}, failed ${result.failed}`);
      for (const error of result.errors) console.error(`SMS reminder error: ${error}`);
    }
  } catch (err) {
    console.error("SMS reminder check failed:", err);
  }
}

setInterval(runReminderCheck, REMINDER_CHECK_INTERVAL_MS);
runReminderCheck();
