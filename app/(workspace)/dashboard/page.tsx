import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarClock, CheckCheck, Clock3, MailWarning, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { actionItems, getEmailsByProject, getOpenActionEmailIds, getUrgentEmailIds, projectChangeSummary, sampleEmails, weeklyBrief } from "@/lib/data";

const metricCards = [
  {
    label: "안 읽은 중요 메일",
    value: "12",
    detail: "어제 대비 +4",
    icon: MailWarning,
  },
  {
    label: "오늘 회신 필요",
    value: "3",
    detail: "긴급 1건 포함",
    icon: Clock3,
  },
  {
    label: "AI 추출 액션",
    value: `${actionItems.length}`,
    detail: "실행 단위로 정리 완료",
    icon: CheckCheck,
  },
  {
    label: "일정 포함 메일",
    value: "4",
    detail: "이번 주 캘린더 반영 필요",
    icon: CalendarClock,
  },
];

function buildAnalyzerHref(emailIds: string[], context: string, rangeLabel?: string) {
  const params = new URLSearchParams({ emails: emailIds.join(","), context });
  if (rangeLabel) {
    params.set("range", rangeLabel);
  }
  return `/analyzer?${params.toString()}`;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; range?: string }>;
}) {
  const params = await searchParams;
  const urgentEmails = sampleEmails.filter((email) => email.priority === "critical" || email.priority === "high");
  const todayActions = actionItems.filter((item) => item.status !== "Done");
  const selectedRangeLabel = params.range ?? "최근 7일";
  const openActionIds = getOpenActionEmailIds();
  const urgentEmailIds = getUrgentEmailIds();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="overflow-hidden rounded-[30px] bg-gradient-to-br from-slate-50 via-white to-brand-50 p-7 text-slate-950">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Badge className="border-brand-100 bg-brand-50 text-brand-700" variant="neutral">
                Recovery pulse · {selectedRangeLabel}
              </Badge>
              <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight">
                복귀 후 1시간 내, 중요한 메일과 실제 해야 할 일이 분리되어 보이도록 설계된 업무 허브
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                기준 기간: {params.from ?? "2026-03-20"} - {params.to ?? "2026-03-26"}
              </p>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-white px-5 py-4">
              <p className="text-sm text-slate-500">Response readiness</p>
              <p className="mt-1 text-4xl font-semibold">87%</p>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Link href={buildAnalyzerHref(urgentEmailIds, "긴급 메일 브리핑", selectedRangeLabel)} className="rounded-[24px] border border-slate-200 bg-white p-4 transition hover:border-brand-200 hover:shadow-panel">
              <p className="text-sm text-slate-500">Critical mail cluster</p>
              <p className="mt-2 text-lg font-semibold">장애 대응, 벤더 승인, 일정 조율 동시 진행</p>
            </Link>
            <Link href={buildAnalyzerHref(openActionIds, "오늘 처리할 일 브리핑", selectedRangeLabel)} className="rounded-[24px] border border-slate-200 bg-white p-4 transition hover:border-brand-200 hover:shadow-panel">
              <p className="text-sm text-slate-500">AI recommendation</p>
              <p className="mt-2 text-lg font-semibold">고객 영향 메일부터 확인 후 검토 메일로 이동</p>
            </Link>
            <Link href={buildAnalyzerHref(openActionIds, "대응 초안 준비", selectedRangeLabel)} className="rounded-[24px] border border-brand-100 bg-brand-50/70 p-4 transition hover:shadow-panel">
              <p className="text-sm text-brand-700">Draft queue</p>
              <p className="mt-2 text-lg font-semibold">바로 보낼 수 있는 회신 초안 4건 준비</p>
            </Link>
          </div>
        </Card>

        <Card className="rounded-[30px] p-6">
          <CardHeader>
            <div>
              <CardTitle>최근 일주일 업무 브리핑</CardTitle>
              <CardDescription>놓치면 병목이 생길 변화만 추렸습니다.</CardDescription>
            </div>
            <Sparkles className="h-5 w-5 text-brand-500" />
          </CardHeader>
          <div className="mt-6 space-y-4">
            {weeklyBrief.map((item) => (
              <div key={item} className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600">
                {item}
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="rounded-[28px] p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{metric.label}</p>
                  <p className="mt-3 font-display text-4xl font-semibold text-slate-950">{metric.value}</p>
                  <p className="mt-2 text-sm text-slate-500">{metric.detail}</p>
                </div>
                <div className="rounded-2xl bg-brand-50 p-3 text-brand-600">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="rounded-[30px] p-6">
          <CardHeader>
            <div>
              <CardTitle>긴급 메일 Top 5</CardTitle>
              <CardDescription>고객 영향과 마감 압박이 높은 순서입니다.</CardDescription>
            </div>
            <ArrowUpRight className="h-5 w-5 text-slate-400" />
          </CardHeader>
          <div className="mt-6 space-y-3">
            {urgentEmails.map((email) => (
              <Link key={email.id} href={buildAnalyzerHref(urgentEmailIds, `${email.project} 긴급 브리핑`, selectedRangeLabel)} className="flex flex-col gap-3 rounded-[24px] border border-slate-200 p-4 transition hover:border-brand-200 hover:shadow-panel md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-950">{email.title}</p>
                    <Badge variant={email.priority === "critical" ? "rose" : "amber"}>{email.priority}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{email.sender} · {email.project} · {email.deadline ?? "기한 없음"}</p>
                </div>
                <p className="max-w-sm text-sm leading-6 text-slate-600">{email.preview}</p>
              </Link>
            ))}
          </div>
        </Card>

        <div className="grid gap-4">
          <Card className="rounded-[30px] p-6">
            <CardHeader>
              <div>
                <CardTitle>오늘 바로 처리할 일 Top 5</CardTitle>
                <CardDescription>메일 기반 액션을 실행 단위로 정리했습니다.</CardDescription>
              </div>
            </CardHeader>
            <div className="mt-6 space-y-3">
              {todayActions.map((item) => (
                <Link key={item.id} href={buildAnalyzerHref(openActionIds, "오늘 처리할 일 브리핑", selectedRangeLabel)} className="block rounded-[22px] border border-slate-200 p-4 transition hover:border-brand-200 hover:shadow-panel">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-950">{item.title}</p>
                    <Badge variant={item.priority === "critical" ? "rose" : item.priority === "high" ? "amber" : "blue"}>{item.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{item.requester} 요청 · {item.dueDate}</p>
                </Link>
              ))}
            </div>
            <Link href={buildAnalyzerHref(openActionIds, "오늘 처리할 일 브리핑", selectedRangeLabel)} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
              여러 이메일 기반 분석 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>

          <Card className="rounded-[30px] p-6">
            <CardHeader>
              <div>
                <CardTitle>프로젝트별 변화 요약</CardTitle>
                <CardDescription>메일 흐름을 프로젝트 단위로 묶어 봅니다.</CardDescription>
              </div>
            </CardHeader>
            <div className="mt-5 space-y-3">
              {projectChangeSummary.map((project) => (
                <Link key={project.name} href={buildAnalyzerHref(getEmailsByProject(project.name).map((email) => email.id), `${project.name} 변화 요약`, selectedRangeLabel)} className="flex items-center justify-between rounded-[22px] bg-slate-50 px-4 py-4 transition hover:bg-brand-50">
                  <div>
                    <p className="font-semibold text-slate-950">{project.name}</p>
                    <p className="text-sm text-slate-500">{project.change}</p>
                  </div>
                  <Badge variant={project.trend === "up" ? "rose" : "mint"}>{project.trend === "up" ? "Escalating" : "Stable"}</Badge>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
