"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarRange, CheckCircle2, Sparkles, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { dateRangePresets } from "@/lib/data";

const onboardingSteps = [
  {
    title: "휴가 복귀 후 쌓인 이메일을 빠르게 정리",
    description:
      "받은편지함을 처음부터 끝까지 읽지 않아도, AlphaMail이 복귀 직후 꼭 확인해야 할 흐름부터 보여줍니다.",
    icon: CheckCircle2,
  },
  {
    title: "AI가 중요도와 해야 할 일을 구조화",
    description:
      "메일마다 업무 중요도, 요청 액션, 마감 시점, 관련 인물까지 정리해 우선순위 판단 시간을 줄입니다.",
    icon: Sparkles,
  },
  {
    title: "회신 초안까지 생성해 즉시 대응",
    description:
      "긴급 대응, 일정 조율, 검토 요청 메일에 대해 바로 보낼 수 있는 회신 초안을 톤별로 준비합니다.",
    icon: Workflow,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedPreset, setSelectedPreset] = useState(dateRangePresets[1].value);
  const [from, setFrom] = useState(dateRangePresets[1].from);
  const [to, setTo] = useState(dateRangePresets[1].to);

  const rangeLabel = useMemo(() => {
    return dateRangePresets.find((preset) => preset.value === selectedPreset)?.label ?? "직접 선택";
  }, [selectedPreset]);

  function moveToDashboard() {
    const params = new URLSearchParams({ from, to, range: rangeLabel });
    router.push(`/dashboard?${params.toString()}`);
  }

  return (
    <main className="relative overflow-hidden px-4 py-5 sm:px-6 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-[1480px] flex-col rounded-[36px] border border-white/60 bg-white/80 px-6 py-8 shadow-soft backdrop-blur-xl lg:px-10 lg:py-10">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-start">
          <section className="max-w-2xl pt-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
              <span className="h-2 w-2 rounded-full bg-brand-500" />
              AI Email Recovery Assistant
            </div>
            <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-[1.05] text-slate-950 sm:text-6xl">
              복귀한 첫 30분,
              <br />
              메일함이 아니라 업무 우선순위부터 보이게.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              AlphaMail은 휴가, 출장, 교육 이후 쌓인 업무 메일을 빠르게 구조화하고, 지금 중요한 것과 바로 해야 할 일을 보여주는 실무형 AI 메일 어시스턴트입니다.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button onClick={moveToDashboard} className="gap-2 px-6 py-3 text-base">
                대시보드로 이동하기
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/analyzer" variant="secondary" className="px-6 py-3 text-base">
                분석 데모 바로 보기
              </Button>
            </div>
          </section>

          <Card className="w-full max-w-[420px] overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-50 via-white to-brand-50 p-6 text-slate-950">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Recovery snapshot</p>
                <p className="mt-1 text-3xl font-semibold">8m 42s</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">AI assisted</div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Critical threads</p>
                <p className="mt-2 text-lg font-semibold">결제 장애 대응 + 고객 공지 초안</p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Action queue</p>
                <p className="mt-2 text-lg font-semibold">오늘 안에 회신해야 할 항목 3건</p>
              </div>
              <div className="rounded-[24px] border border-brand-100 bg-brand-50/70 p-4">
                <p className="text-sm text-brand-700">Draft readiness</p>
                <p className="mt-2 text-lg font-semibold">톤별 회신 초안 즉시 생성</p>
              </div>
            </div>
          </Card>
        </div>

        <section className="mt-12 grid gap-5 lg:grid-cols-3">
          {onboardingSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={step.title} className="relative overflow-hidden rounded-[30px] p-6">
                <div className="absolute right-5 top-5 text-6xl font-display text-slate-100">0{index + 1}</div>
                <div className="relative z-10 rounded-2xl bg-brand-50 p-3 text-brand-600 w-fit">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="relative z-10 mt-6 max-w-xs font-display text-2xl font-semibold text-slate-950">{step.title}</h2>
                <p className="relative z-10 mt-4 text-sm leading-7 text-slate-600">{step.description}</p>
              </Card>
            );
          })}
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="rounded-[30px] p-6 lg:p-7">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-brand-50 p-3 text-brand-600">
                <CalendarRange className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-600">Step before dashboard</p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-slate-950">어느 기간의 이메일을 기준으로 복귀 브리핑을 만들지 먼저 정합니다</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                  대시보드는 선택한 기간 안의 메일을 기준으로 전체 상황, 우선순위, 액션 아이템을 구성하는 흐름입니다.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {dateRangePresets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => {
                    setSelectedPreset(preset.value);
                    setFrom(preset.from);
                    setTo(preset.to);
                  }}
                  className={selectedPreset === preset.value ? "rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white" : "rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600"}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                시작일
                <input
                  type="date"
                  value={from}
                  onChange={(event) => {
                    setSelectedPreset("custom");
                    setFrom(event.target.value);
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                종료일
                <input
                  type="date"
                  value={to}
                  onChange={(event) => {
                    setSelectedPreset("custom");
                    setTo(event.target.value);
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>
            </div>
          </Card>

          <Card className="rounded-[30px] bg-gradient-to-br from-slate-50 to-brand-50 p-6 lg:p-7">
            <p className="text-sm font-semibold text-brand-600">선택된 범위</p>
            <h3 className="mt-3 font-display text-3xl font-semibold text-slate-950">{rangeLabel}</h3>
            <p className="mt-2 text-sm text-slate-600">{from} - {to}</p>
            <div className="mt-6 space-y-3">
              <div className="rounded-[24px] border border-white bg-white/80 px-4 py-4">
                <p className="text-sm text-slate-500">대시보드에 반영되는 것</p>
                <p className="mt-2 font-semibold text-slate-950">긴급 메일 군집, 오늘 처리할 일, 프로젝트 변화 요약</p>
              </div>
              <div className="rounded-[24px] border border-white bg-white/80 px-4 py-4">
                <p className="text-sm text-slate-500">분석 화면으로 이어지는 방식</p>
                <p className="mt-2 font-semibold text-slate-950">선택된 기간 안의 관련 메일 여러 개를 묶어 브리핑 분석</p>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
