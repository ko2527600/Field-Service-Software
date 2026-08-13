const GATEWAY_URL = "https://api.sms-gate.app/3rdparty/v1/messages";

export type SendSmsResult = { ok: true } | { ok: false; error: string };

/** Normalizes a locally-formatted number to E.164 using SMS_DEFAULT_COUNTRY_CODE (e.g. "0244123456" -> "+233244123456"). Already-E.164 numbers pass through untouched. */
export function normalizePhoneNumber(raw: string): string | null {
  const digits = raw.trim().replace(/[^\d+]/g, "");
  if (!digits) return null;
  if (digits.startsWith("+")) return digits;

  const countryCode = process.env.SMS_DEFAULT_COUNTRY_CODE ?? "+233";
  return `${countryCode}${digits.replace(/^0+/, "")}`;
}

/** Sends an SMS via the cloud-relay mode of "SMS Gateway for Android" (capcom6). Requires SMS_GATEWAY_LOGIN/SMS_GATEWAY_PASSWORD, set once the phone is paired with the cloud service. See https://docs.sms-gate.app/ */
export async function sendSms(rawPhoneNumber: string, text: string): Promise<SendSmsResult> {
  const login = process.env.SMS_GATEWAY_LOGIN;
  const password = process.env.SMS_GATEWAY_PASSWORD;
  if (!login || !password) {
    return { ok: false, error: "SMS gateway not configured (missing SMS_GATEWAY_LOGIN/SMS_GATEWAY_PASSWORD)" };
  }

  const phoneNumber = normalizePhoneNumber(rawPhoneNumber);
  if (!phoneNumber) {
    return { ok: false, error: "No phone number on file" };
  }

  const auth = Buffer.from(`${login}:${password}`).toString("base64");

  try {
    const res = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        textMessage: { text },
        phoneNumbers: [phoneNumber],
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, error: `Gateway responded ${res.status}: ${body.slice(0, 200)}` };
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
