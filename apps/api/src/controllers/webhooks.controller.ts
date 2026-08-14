import type { Request, Response } from "express";
import { parseWebhookPayload } from "../lib/hubtelPayments.js";
import { markInvoicePaidByReference } from "../services/invoice.service.js";

/**
 * Always responds 200 once the payload has been parsed and handled (or
 * recognized as not applicable) -- Hubtel retries webhooks that don't get a
 * 200, so a non-200 here would just cause repeat deliveries for no benefit.
 */
export async function hubtel(req: Request, res: Response) {
  const outcome = parseWebhookPayload(req.body);
  if (!outcome) {
    res.status(200).json({ received: true, handled: false });
    return;
  }

  if (outcome.paid) {
    await markInvoicePaidByReference(outcome.clientReference, outcome.transactionId);
  }

  res.status(200).json({ received: true, handled: true });
}
