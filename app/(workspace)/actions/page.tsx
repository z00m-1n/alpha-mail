"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { actionItems } from "@/lib/data";

const filters = ["전체", "오늘 마감", "회신 필요", "검토 필요", "승인 필요", "일정 관련"] as const;

export default function ActionCenterPage() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("전체");

  const filteredItems = useMemo(() => {
    return actionItems.filter((item) => {
      if (activeFilter === "전체") return true;
      if (activeFilter === "오늘 마감") return item.filterTag === "today" || item.dueDate.includes("오늘");
      if (activeFilter === "회신 필요") return item.filterTag === "reply";
      if (activeFilter === "검토 필요") return item.filterTag === "review";
      if (activeFilter === "승인 필요") return item.filterTag === "approval";
      return item.filterTag === "schedule";
    });
  }, [activeFilter]);

  return (
    <div className="space-y-6">
      <Card className="rounded-[30px] bg-gradient-to-br from-slate-50 via-white to-brand-50 p-6 text-slate-950">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-700">Action Center</p>
            <h2 className="mt-3 font-display text-3xl font-semibold">메일을 읽는 화면이 아니라 실제 업무를 처리하는 작업 보드</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              AlphaMail은 메일 본문을 할 일 단위로 재구성해 요청자, 마감일, 우선순위, 상태를 함께 보여줍니다.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-[22px] border border-slate-200 bg-white px-4 py-4">
              <p className="text-sm text-slate-500">Open</p>
              <p className="mt-2 text-2xl font-semibold">4</p>
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-white px-4 py-4">
              <p className="text-sm text-slate-500">In Progress</p>
              <p className="mt-2 text-2xl font-semibold">1</p>
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-white px-4 py-4">
              <p className="text-sm text-slate-500">Done</p>
              <p className="mt-2 text-2xl font-semibold">1</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="rounded-[30px] p-6">
        <CardHeader>
          <div>
            <CardTitle>필터</CardTitle>
            <CardDescription>오늘 처리해야 할 요청만 빠르게 좁혀 볼 수 있습니다.</CardDescription>
          </div>
        </CardHeader>
        <div className="mt-5 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={activeFilter === filter ? "rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white" : "rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600"}
            >
              {filter}
            </button>
          ))}
        </div>
      </Card>

      <section className="grid gap-4 xl:grid-cols-2">
        {filteredItems.map((item) => (
          <Card key={item.id} className="rounded-[28px] p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={item.priority === "critical" ? "rose" : item.priority === "high" ? "amber" : "blue"}>{item.priority}</Badge>
                  <Badge variant={item.status === "Done" ? "mint" : item.status === "In Progress" ? "blue" : "neutral"}>{item.status}</Badge>
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500">출처 메일 · {item.emailTitle}</p>
              </div>
              <div className="rounded-[22px] bg-slate-50 px-4 py-3 text-sm text-slate-500">
                <p>마감일</p>
                <p className="mt-1 font-semibold text-slate-950">{item.dueDate}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[22px] border border-slate-200 p-4">
                <p className="text-sm text-slate-500">요청자</p>
                <p className="mt-2 font-semibold text-slate-950">{item.requester}</p>
              </div>
              <div className="rounded-[22px] border border-slate-200 p-4">
                <p className="text-sm text-slate-500">우선순위</p>
                <p className="mt-2 font-semibold text-slate-950">{item.priority}</p>
              </div>
              <div className="rounded-[22px] border border-slate-200 p-4">
                <p className="text-sm text-slate-500">현재 상태</p>
                <p className="mt-2 font-semibold text-slate-950">{item.status}</p>
              </div>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
