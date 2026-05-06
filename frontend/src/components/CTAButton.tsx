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
  const baseStyles = "inline-block rounded transition-colors font-medium";

  const variantStyles = {
    primary: "bg-benson-maroon hover:bg-benson-maroon-dark text-white",
    secondary:
      "bg-benson-cream hover:bg-benson-offwhite text-benson-charcoal border border-benson-maroon",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
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
