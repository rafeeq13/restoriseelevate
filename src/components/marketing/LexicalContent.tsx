import {
  RichText,
  type JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { Link as LocalisedLink } from "@/i18n/navigation";

/**
 * Renders a Payload Lexical document to HTML/JSX with Restorise's typography
 * conventions and locale-aware internal links.
 *
 * The default converters are extended with our own link converter that
 * routes internal `/foo` URLs through next-intl's Link so they pick up the
 * active locale prefix.
 */

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  link: ({ node, nodesToJSX, converters }) => {
    const fields =
      (node as unknown as { fields?: { url?: string; newTab?: boolean } })
        .fields ?? {};
    const url = fields.url ?? "#";
    const isExternal =
      /^(https?:)?\/\//i.test(url) ||
      url.startsWith("mailto:") ||
      url.startsWith("tel:");
    const children = nodesToJSX({ converters, nodes: node.children });
    if (isExternal) {
      return (
        <a
          href={url}
          target={fields.newTab ? "_blank" : undefined}
          rel={fields.newTab ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    }
    return <LocalisedLink href={url}>{children}</LocalisedLink>;
  },
});

export function LexicalContent({
  data,
  className,
}: {
  data: SerializedEditorState | null | undefined;
  className?: string;
}) {
  if (!data) return null;
  return (
    <div
      className={
        className ??
        "prose prose-headings:font-display prose-headings:text-ink prose-p:text-ink-muted prose-a:text-ink prose-strong:text-ink max-w-2xl text-ink"
      }
    >
      <RichText data={data} converters={jsxConverters} />
    </div>
  );
}
