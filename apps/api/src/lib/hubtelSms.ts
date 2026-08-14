import { normalizePhoneNumber, type SendSmsResult } from "./smsGateway.js";

/**
 * Hubtel SMS ("Quick Send") gateway -- a second SMS option alongside the
 * default capcom6 gateway (see smsGateway.ts). Requires
 * HUBTEL_SMS_CLIENT_ID/HUBTEL_SMS_CLIENT_SECRET/HUBTEL_SMS_SENDER_ID.
 *
 * Built from Hubtel's publicly documented SMS Quick Send API
 * (https://developers.hubtel.com/ -- GET /v1/messages/send). This
 * environment could not reach Hubtel's reference docs to confirm the exact
 * success/failure response body shape, so any 2xx HTTP response is treated
 * as sent. Verify against a live account before relying on this in production.
 */

const HUBTEL_SMS_URL = "https://api.hubtel.com/v1/messages/send";

export async function sendSms(rawPhoneNumber: string, text: string): Promise<SendSmsResult> {
  const clientId = process.env.HUBTEL_SMS_CLIENT_ID;
  const clientSecret = process.env.HUBTEL_SMS_CLIENT_SECRET;
  const senderId = process.env.HUBTEL_SMS_SENDER_ID;
  if (!clientId || !clientSecret || !senderId) {
    return {
      ok: false,
      error: "Hubtel SMS gateway not configured (missing HUBTEL_SMS_CLIENT_ID/HUBTEL_SMS_CLIENT_SECRET/HUBTEL_SMS_SENDER_ID)",
    };
  }

  const phoneNumber = normalizePhoneNumber(rawPhoneNumber);
  if (!phoneNumber) {
    return { ok: false, error: "No phone number on file" };
  }

  const url = new URL(HUBTEL_SMS_URL);
  url.searchParams.set("From", senderId);
  url.searchParams.set("To", phoneNumber);
  url.searchParams.set("Content", text);
  url.searchParams.set("ClientId", clientId);
  url.searchParams.set("ClientSecret", clientSecret);

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, error: `Hubtel responded ${res.status}: ${body.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
