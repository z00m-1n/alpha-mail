"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChartNoAxesCombined, LayoutGrid, ListTodo, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/analyzer", label: "Mail Analyzer", icon: Sparkles },
  { href: "/inbox", label: "Inbox View", icon: Search },
  { href: "/actions", label: "Action Center", icon: ListTodo },
];

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1600px] grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="surface panel-grid rounded-[32px] px-5 py-6 shadow-soft">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-5">
            <div>
              <p className="font-display text-2xl font-semibold text-slate-950">AlphaMail</p>
              <p className="mt-1 text-sm text-slate-500">Inbox recovery workspace</p>
            </div>
            <div className="rounded-2xl bg-brand-500/10 p-3 text-brand-600">
              <ChartNoAxesCombined className="h-5 w-5" />
            </div>
          </div>

          <nav className="mt-6 space-y-2">
            {navigation.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    active ? "bg-slate-950 text-white shadow-panel" : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-[28px] bg-slate-950 p-5 text-white shadow-panel">
            <p className="text-xs uppercase tracking-[0.25em] text-white/50">Today focus</p>
            <p className="mt-3 text-xl font-semibold">5개 메일이 바로 대응 대기 중</p>
            <p className="mt-2 text-sm leading-6 text-white/70">장애 대응, 검토 요청, 일정 조율이 동시에 열려 있습니다.</p>
          </div>
        </aside>

        <div className="surface rounded-[32px] px-5 py-5 shadow-soft sm:px-6 lg:px-8">
          <header className="mb-6 flex flex-col gap-4 border-b border-slate-200/70 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-700">Welcome back</p>
              <h1 className="font-display text-3xl font-semibold text-slate-950">복귀 직후 메일 흐름을 바로 업무 흐름으로 전환하세요</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                <Search className="h-4 w-4" />
                Search emails, actions, people
              </div>
              <button className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 transition hover:border-brand-200 hover:text-brand-600">
                <Bell className="h-4 w-4" />
              </button>
            </div>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
