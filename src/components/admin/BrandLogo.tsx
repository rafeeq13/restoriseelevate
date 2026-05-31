import Image from "next/image";

const BrandLogo = () => (
  <div className="restorise-admin-logo">
    <Image
      src="/brand/logo-primary.webp"
      alt="Restorise Business Solutions"
      width={1200}
      height={340}
      priority
    />
  </div>
);

export default BrandLogo;
