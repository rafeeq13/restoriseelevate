/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import config from "@/payload.config";
import { RootLayout, handleServerFunctions } from "@payloadcms/next/layouts";
import type { ServerFunctionClient } from "payload";

// Pre-compiled Payload admin styles. Turbopack doesn't transitively bundle
// the SCSS imports that live inside @payloadcms/next/layouts/Root, so we
// pull in both bundles here:
//   - @payloadcms/next/css  : admin shell (.template-default, sidebar, header)
//   - @payloadcms/ui/styles.css : UI primitives (buttons, fields, tables, ...)
import "@payloadcms/next/css";
import "@payloadcms/ui/styles.css";
import "./custom.scss";
import { importMap } from "./admin/importMap.js";

type Args = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

const Layout = ({ children }: Args) => (
  <RootLayout
    config={config}
    importMap={importMap}
    serverFunction={serverFunction}
    htmlProps={{ suppressHydrationWarning: true }}
  >
    {children}
  </RootLayout>
);

export default Layout;
