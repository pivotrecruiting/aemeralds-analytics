import Image from "next/image";

export function CompanyLogo({ className }: { className?: string }) {
  // TODO: Add real file path and alt text
  return (
    <Image
      src="/company-logo.png"
      alt="Company Logo"
      width={112}
      height={30}
      priority
      aria-hidden="false"
      role="img"
      className={className}
    />
  );
}
