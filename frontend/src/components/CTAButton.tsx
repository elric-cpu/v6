import Link from "next/link";

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function CTAButton({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
}: CTAButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-medium transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-benson-maroon focus-visible:ring-offset-2 active:translate-y-px";

  const variantStyles = {
    primary:
      "bg-benson-maroon text-benson-offwhite shadow-sm hover:bg-benson-maroon-dark hover:shadow-md",
    secondary:
      "border border-benson-maroon bg-benson-cream text-benson-charcoal hover:bg-benson-offwhite hover:shadow-sm",
  };

  const sizeStyles = {
    sm: "min-h-8 px-3 py-2 text-sm",
    md: "min-h-10 px-4 py-2",
    lg: "min-h-12 px-6 py-3 text-base sm:text-lg",
  };

  return (
    <Link
      href={href}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
