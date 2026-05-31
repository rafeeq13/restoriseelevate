import "server-only";

/**
 * Fulfillment provider abstraction. Each provider implements the same
 * minimal contract so the routing engine can call any of them
 * interchangeably. Provider-specific SDKs land in src/lib/fulfillment/<provider>/
 * as they're wired against real sandbox accounts.
 */

export type FulfillmentLineItem = {
  productId: string | number;
  sku?: string;
  quantity: number;
  artworkUrls?: string[];
  optionValues?: Record<string, string | undefined>;
};

export type FulfillmentShipTo = {
  fullName: string;
  company?: string;
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  postalCode: string;
  country: string;
  phone?: string;
  email?: string;
};

export type SubmitOrderArgs = {
  orderNumber: string;
  items: FulfillmentLineItem[];
  shipTo: FulfillmentShipTo;
  currency: string;
};

export type SubmitOrderResult = {
  partnerOrderId: string;
  status: "submitted" | "queued" | "manual";
  raw?: unknown;
};

export interface FulfillmentProvider {
  name: string;
  submitOrder(args: SubmitOrderArgs): Promise<SubmitOrderResult>;
  fetchStatus(partnerOrderId: string): Promise<{
    status: string;
    trackingCarrier?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    raw?: unknown;
  }>;
}

/* ------------------------------------------------------------------------
 * Provider stubs. Each connects to a real API when credentials are present;
 * otherwise it returns a `manual` status so the order lands in the admin
 * for human handling.
 * ----------------------------------------------------------------------*/

class GelatoProvider implements FulfillmentProvider {
  name = "gelato";
  async submitOrder(args: SubmitOrderArgs): Promise<SubmitOrderResult> {
    const key = process.env.GELATO_API_KEY;
    if (!key) return manualFallback(args);
    // TODO: real Gelato Orders v4 API call.
    return {
      partnerOrderId: `gelato-${args.orderNumber}`,
      status: "submitted",
    };
  }
  async fetchStatus(partnerOrderId: string) {
    return { status: "unknown", raw: { partnerOrderId } };
  }
}

class PrintfulProvider implements FulfillmentProvider {
  name = "printful";
  async submitOrder(args: SubmitOrderArgs): Promise<SubmitOrderResult> {
    const key = process.env.PRINTFUL_API_KEY;
    if (!key) return manualFallback(args);
    return {
      partnerOrderId: `printful-${args.orderNumber}`,
      status: "submitted",
    };
  }
  async fetchStatus(partnerOrderId: string) {
    return { status: "unknown", raw: { partnerOrderId } };
  }
}

class PackhelpProvider implements FulfillmentProvider {
  name = "packhelp";
  async submitOrder(args: SubmitOrderArgs): Promise<SubmitOrderResult> {
    const key = process.env.PACKHELP_API_KEY;
    if (!key) return manualFallback(args);
    return {
      partnerOrderId: `packhelp-${args.orderNumber}`,
      status: "submitted",
    };
  }
  async fetchStatus(partnerOrderId: string) {
    return { status: "unknown", raw: { partnerOrderId } };
  }
}

class ManualProvider implements FulfillmentProvider {
  name = "manual-lahore";
  async submitOrder(args: SubmitOrderArgs): Promise<SubmitOrderResult> {
    return manualFallback(args);
  }
  async fetchStatus(partnerOrderId: string) {
    return { status: "manual", raw: { partnerOrderId } };
  }
}

function manualFallback(args: SubmitOrderArgs): SubmitOrderResult {
  return {
    partnerOrderId: `manual-${args.orderNumber}`,
    status: "manual",
  };
}

const REGISTRY: Record<string, FulfillmentProvider> = {
  gelato: new GelatoProvider(),
  printful: new PrintfulProvider(),
  packhelp: new PackhelpProvider(),
  "manual-lahore": new ManualProvider(),
  custom: new ManualProvider(),
};

export function getProvider(name: string): FulfillmentProvider {
  return REGISTRY[name] ?? new ManualProvider();
}
