import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("surface rounded-[28px] shadow-soft", className)}>{children}</div>;
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex items-start justify-between gap-4", className)}>{children}</div>;
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h3 className={cn("font-display text-xl font-semibold text-slate-950", className)}>{children}</h3>;
}

export function CardDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn("text-sm leading-6 text-slate-500", className)}>{children}</p>;
}
