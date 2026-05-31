import "server-only";
import { cookies, headers } from "next/headers";
import { getPayloadSafe } from "@/lib/payload";

export type CurrentCustomer = {
  id: string | number;
  email: string;
  firstName?: string;
  lastName?: string;
  businessName?: string;
} | null;

/**
 * Server-side accessor for the logged-in customer. Reads the Payload auth
 * cookie and validates it via payload.auth(). Returns null when there is
 * no valid session, leaving the caller to redirect.
 */
export async function getCurrentCustomer(): Promise<CurrentCustomer> {
  const payload = await getPayloadSafe();
  if (!payload) return null;

  try {
    const cookieStore = await cookies();
    const headerList = await headers();
    const headersIn = new Headers();
    headerList.forEach((v, k) => headersIn.append(k, v));
    // Forward the cookie header explicitly in case the framework didn't.
    const cookieHeader = cookieStore.toString();
    if (cookieHeader) headersIn.set("cookie", cookieHeader);

    const result = await payload.auth({ headers: headersIn });
    const user = result.user as unknown as CurrentCustomer & {
      collection?: string;
    };
    if (!user) return null;
    if (user.collection && user.collection !== "customers") return null;
    return user;
  } catch {
    return null;
  }
}
