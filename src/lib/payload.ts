import "server-only";
import { getPayload as getPayloadInstance } from "payload";
import config from "@/payload.config";

/**
 * Safe accessor for the Payload server instance from server components,
 * route handlers, and server actions. Wraps the boot in a try/catch so the
 * frontend can still render placeholder content if the database is
 * unreachable during initial setup (brief allows for staged provisioning).
 */
export async function getPayloadSafe() {
  try {
    const payload = await getPayloadInstance({ config });
    return payload;
  } catch (err) {
    console.warn(
      "[payload] init failed — falling back to placeholder content.",
      err instanceof Error ? err.message : err,
    );
    return null;
  }
}
