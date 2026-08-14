/**
 * Hubtel Online Checkout integration (MoMo/card payment links for invoices).
 * Requires HUBTEL_CLIENT_ID/HUBTEL_CLIENT_SECRET/HUBTEL_MERCHANT_ACCOUNT_NUMBER --
 * unconfigured deployments just get a clear "not configured" error instead of
 * a broken request, matching the existing capcom6 SMS gateway's pattern.
 *
 * Built from Hubtel's publicly documented Online Checkout conventions
 * (https://developers.hubtel.com/ -- Online Checkout / Receive Money APIs).
 * This environment could not reach Hubtel's reference docs to confirm exact
 * response/webhook field casing, so parsing below is deliberately lenient
 * (it checks common PascalCase/camelCase variants and both a flat and a
 * nested "data" shape). Verify against a live Hubtel sandbox transaction
 * before relying on this in production.
 */

const HUBTEL_CHECKOUT_URL = "https://payproxyapi.hubtel.com/items/initiate";

export type CreatePaymentLinkResult = { ok: true; checkoutUrl: string } | { ok: false; error: string };

export async function createPaymentLink(params: {
  clientReference: string;
  totalAmount: number;
  description: string;
  callbackUrl: string;
  returnUrl: string;
}): Promise<CreatePaymentLinkResult> {
  const clientId = process.env.HUBTEL_CLIENT_ID;
  const clientSecret = process.env.HUBTEL_CLIENT_SECRET;
  const merchantAccountNumber = process.env.HUBTEL_MERCHANT_ACCOUNT_NUMBER;
  if (!clientId || !clientSecret || !merchantAccountNumber) {
    return {
      ok: false,
      error:
        "Hubtel payments not configured (missing HUBTEL_CLIENT_ID/HUBTEL_CLIENT_SECRET/HUBTEL_MERCHANT_ACCOUNT_NUMBER)",
    };
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const res = await fetch(HUBTEL_CHECKOUT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        totalAmount: params.totalAmount,
        description: params.description,
        callbackUrl: params.callbackUrl,
        returnUrl: params.returnUrl,
        merchantAccountNumber,
        clientReference: params.clientReference,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, error: `Hubtel responded ${res.status}: ${body.slice(0, 200)}` };
    }

    const body: unknown = await res.json();
    const checkoutUrl = extractCheckoutUrl(body);
    if (!checkoutUrl) {
      return { ok: false, error: "Hubtel response did not include a checkout URL" };
    }
    return { ok: true, checkoutUrl };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

function extractCheckoutUrl(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const root = body as Record<string, unknown>;
  const data = (root.data ?? root.Data ?? root) as Record<string, unknown>;
  const url = data.checkoutUrl ?? data.CheckoutUrl ?? data.checkoutDirectUrl ?? data.CheckoutDirectUrl;
  return typeof url === "string" ? url : null;
}

export type WebhookOutcome = { clientReference: string; paid: boolean; transactionId?: string };

/** Parses a Hubtel checkout webhook body. Returns null if the body doesn't look like a Hubtel payload at all. */
export function parseWebhookPayload(body: unknown): WebhookOutcome | null {
  if (!body || typeof body !== "object") return null;
  const root = body as Record<string, unknown>;
  const data = (root.data ?? root.Data ?? root) as Record<string, unknown>;

  const status = firstString(root.status, root.Status, data.status, data.Status);
  const clientReference = firstString(
    data.clientReference,
    data.ClientReference,
    root.clientReference,
    root.ClientReference,
  );
  const transactionId = firstString(
    data.transactionId,
    data.TransactionId,
    data.checkoutId,
    data.CheckoutId,
  );

  if (!clientReference || !status) return null;
  return { clientReference, paid: /success/i.test(status), transactionId: transactionId ?? undefined };
}

function firstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.length > 0) return value;
  }
  return undefined;
}
