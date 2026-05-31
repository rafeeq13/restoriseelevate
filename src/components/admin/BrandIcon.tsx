import Image from "next/image";

/**
 * Compact brand mark rendered in the Payload admin breadcrumb / collapsed
 * sidebar. Sized small (24px) so it sits cleanly inline with admin text.
 * Uses the official icon-only logo asset shared with the site favicons.
 */
const BrandIcon = () => (
  <span className="restorise-admin-icon" aria-label="Restorise">
    <Image
      src="/brand/logo-icon.webp"
      alt="Restorise"
      width={96}
      height={96}
      priority
    />
  </span>
);

export default BrandIcon;
