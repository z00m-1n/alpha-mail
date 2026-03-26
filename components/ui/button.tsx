import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-slate-950 text-white hover:bg-slate-800",
  secondary: "bg-white text-slate-800 border border-slate-200 hover:border-brand-200 hover:text-brand-700",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
};

export function Button({
  children,
  className,
  variant = "primary",
  href,
  type = "button",
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof variants;
  href?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition duration-200",
    variants[variant],
    disabled && "cursor-not-allowed opacity-60",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
