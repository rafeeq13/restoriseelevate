import Image from "next/image";
import Link from "next/link";

const BrandNav = () => (
  <Link href="/admin" className="restorise-nav-brand" aria-label="Restorise admin home">
    <Image
      src="/brand/logo-primary.webp"
      alt="Restorise Business Solutions"
      width={1200}
      height={340}
      priority
    />
  </Link>
);

export default BrandNav;
