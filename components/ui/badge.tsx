import { cn } from "@/lib/utils";

const variants = {
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
  blue: "bg-brand-50 text-brand-700 border-brand-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  rose: "bg-rose-50 text-rose-700 border-rose-100",
  mint: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

export function Badge({
  children,
  variant = "neutral",
  className,
}: {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-tight",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
