"use client";

import { startTransition, useMemo, useState } from "react";
import { ChevronDown, LoaderCircle, MailOpen, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOpenActionEmailIds, getUrgentEmailIds, sampleEmails } from "@/lib/data";
import { DraftBlock, MultiEmailAnalysisResult, ReplyTone } from "@/types";

const toneOptions: { label: string; value: ReplyTone }[] = [
  { label: "공손한 업무 톤", value: "formal" },
  { label: "간결한 실무 톤", value: "concise" },
  { label: "협업자 대상 톤", value: "collaborative" },
];

const defaultSelectedIds = sampleEmails.slice(0, 3).map((email) => email.id);

export function AnalyzerWorkspace({
  initialEmailIds,
  contextLabel,
  rangeLabel,
}: {
  initialEmailIds?: string[];
  contextLabel?: string;
  rangeLabel?: string;
}) {
  const safeInitialIds = initialEmailIds && initialEmailIds.length > 0 ? initialEmailIds : defaultSelectedIds;
  const [selectedEmailIds, setSelectedEmailIds] = useState<string[]>(safeInitialIds);
  const [analysis, setAnalysis] = useState<MultiEmailAnalysisResult | null>(null);
  const [draft, setDraft] = useState<DraftBlock | null>(null);
  const [tone, setTone] = useState<ReplyTone>("formal");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedEmails = useMemo(() => {
    return sampleEmails.filter((email) => selectedEmailIds.includes(email.id));
  }, [selectedEmailIds]);

  const selectedProjects = useMemo(() => {
    return Array.from(new Set(selectedEmails.map((email) => email.project)));
  }, [selectedEmails]);

  function toggleSelectedEmail(emailId: string) {
    setSelectedEmailIds((current) => {
      if (current.includes(emailId)) {
        if (current.length === 1) {
          return current;
        }

        return current.filter((id) => id !== emailId);
      }

      return [...current, emailId];
    });
  }

  function setQuickSelection(nextIds: string[]) {
    setSelectedEmailIds(nextIds);
    setAnalysis(null);
    setDraft(null);
    setErrorMessage(null);
  }

  async function handleAnalyze() {
    setIsAnalyzing(true);
    setDraft(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailIds: selectedEmailIds,
          contextLabel: contextLabel ?? "선택 이메일 묶음 분석",
        }),
      });

      if (!response.ok) {
        const error = (await response.json()) as { message?: string };
        throw new Error(error.message ?? "분석 요청에 실패했습니다.");
      }

      const result = (await response.json()) as MultiEmailAnalysisResult;
      startTransition(() => {
        setAnalysis(result);
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "분석 요청에 실패했습니다.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleDraft() {
    setIsGeneratingDraft(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailIds: selectedEmailIds,
          tone,
          contextLabel: contextLabel ?? "선택 이메일 묶음 분석",
        }),
      });

      if (!response.ok) {
        const error = (await response.json()) as { message?: string };
        throw new Error(error.message ?? "초안 생성에 실패했습니다.");
      }

      const result = (await response.json()) as DraftBlock;
      startTransition(() => {
        setDraft(result);
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "초안 생성에 실패했습니다.");
    } finally {
      setIsGeneratingDraft(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <Card className="rounded-[30px] p-6">
        <CardHeader>
          <div>
            <CardTitle>이메일 묶음 선택</CardTitle>
            <CardDescription>개별 메일이 아니라 여러 메일을 묶어 현재 업무 흐름 전체를 분석합니다.</CardDescription>
          </div>
        </CardHeader>

        <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">빠른 선택</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setQuickSelection(getUrgentEmailIds())}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              긴급 메일 묶음
            </button>
            <button
              onClick={() => setQuickSelection(getOpenActionEmailIds())}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              오늘 처리할 일 묶음
            </button>
            <button
              onClick={() => setQuickSelection(defaultSelectedIds)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              기본 데모 묶음
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-700">선택된 이메일</p>
            <Badge variant="blue">{selectedEmailIds.length} selected</Badge>
          </div>
          <div className="mt-4 grid gap-3">
            {sampleEmails.map((email) => (
              <label key={email.id} className={selectedEmailIds.includes(email.id) ? "flex gap-3 rounded-[20px] border border-brand-200 bg-brand-50/70 p-4" : "flex gap-3 rounded-[20px] border border-slate-200 bg-white p-4"}>
                <input
                  type="checkbox"
                  checked={selectedEmailIds.includes(email.id)}
                  onChange={() => toggleSelectedEmail(email.id)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-500"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-950">{email.title}</p>
                    <Badge variant={email.priority === "critical" ? "rose" : email.priority === "high" ? "amber" : "blue"}>{email.priority}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{email.sender} · {email.project}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{email.preview}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">현재 분석 범위</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {contextLabel ?? "선택 이메일 묶음 분석"}
            {rangeLabel ? ` · ${rangeLabel}` : ""}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedProjects.map((project) => (
              <Badge key={project} variant="mint">{project}</Badge>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={handleAnalyze} disabled={selectedEmailIds.length === 0 || isAnalyzing} className="gap-2">
            {isAnalyzing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            분석해줘
          </Button>
          <Button variant="ghost" onClick={() => setQuickSelection(defaultSelectedIds)}>
            선택 초기화
          </Button>
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="rounded-[30px] p-6">
          <CardHeader>
            <div>
              <CardTitle>AI 브리핑</CardTitle>
              <CardDescription>여러 메일을 합쳐 지금 무엇이 중요한지와 어떤 순서로 처리할지를 정리합니다.</CardDescription>
            </div>
          </CardHeader>

          {!analysis && !isAnalyzing ? (
            <div className="mt-6 rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <MailOpen className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold text-slate-950">선택한 여러 이메일을 기준으로 브리핑을 만듭니다</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                한 줄 헤드라인, 핵심 포인트, 해야 할 일, 마감 일정, 프로젝트 신호, 대응 초안까지 한 번에 생성됩니다.
              </p>
            </div>
          ) : null}

          {isAnalyzing ? (
            <div className="mt-6 rounded-[28px] bg-slate-950 p-8 text-white">
              <div className="flex items-center gap-3">
                <LoaderCircle className="h-5 w-5 animate-spin" />
                <p className="text-lg font-semibold">선택된 이메일 흐름을 통합 브리핑으로 구조화하고 있습니다</p>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[22px] bg-white/8 px-4 py-4 text-sm text-white/70">우선순위 군집화</div>
                <div className="rounded-[22px] bg-white/8 px-4 py-4 text-sm text-white/70">프로젝트 변화 요약</div>
                <div className="rounded-[22px] bg-white/8 px-4 py-4 text-sm text-white/70">대응 초안 생성</div>
              </div>
            </div>
          ) : null}

          {errorMessage ? (
            <div className="mt-6 rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-4 text-sm font-medium text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          {analysis ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-[28px] bg-gradient-to-br from-slate-50 via-white to-brand-50 p-6 text-slate-950">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Badge variant="blue">{analysis.selectedEmailIds.length} emails grouped</Badge>
                  <p className="text-sm text-slate-500">AlphaMail cluster briefing</p>
                </div>
                <h3 className="mt-4 font-display text-3xl font-semibold leading-tight">{analysis.headline}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{analysis.overview}</p>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-[26px] border border-slate-200 p-5">
                  <p className="text-sm font-semibold text-slate-500">핵심 포인트 3개</p>
                  <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                    {analysis.keyPoints.map((point) => (
                      <li key={point} className="rounded-[18px] bg-slate-50 px-4 py-3">{point}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[26px] border border-slate-200 p-5">
                  <p className="text-sm font-semibold text-slate-500">왜 중요한지</p>
                  <p className="mt-4 text-sm leading-7 text-slate-700">{analysis.whyItMatters}</p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                <div className="rounded-[26px] border border-slate-200 p-5">
                  <p className="text-sm font-semibold text-slate-500">해야 할 일</p>
                  <div className="mt-4 space-y-3">
                    {analysis.actions.map((action) => (
                      <label key={`${action.title}-${action.owner}`} className="flex items-start gap-3 rounded-[18px] bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                        <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-500" />
                        <span>
                          <strong className="font-semibold text-slate-950">{action.title}</strong>
                          <span className="block text-slate-500">{action.owner} · {action.due}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[26px] border border-slate-200 p-5">
                    <p className="text-sm font-semibold text-slate-500">마감일</p>
                    <div className="mt-4 space-y-3">
                      {analysis.deadlines.length > 0 ? analysis.deadlines.map((deadline) => (
                        <div key={`${deadline.sourceEmailId}-${deadline.due}`} className="rounded-[18px] bg-amber-50 px-4 py-3 text-sm text-amber-700">
                          <p className="font-semibold">{deadline.due}</p>
                          <p className="mt-1 text-amber-700/80">{deadline.label}</p>
                        </div>
                      )) : <div className="rounded-[18px] bg-slate-50 px-4 py-3 text-sm text-slate-500">명시된 마감일 없음</div>}
                    </div>
                  </div>

                  <div className="rounded-[26px] border border-slate-200 p-5">
                    <p className="text-sm font-semibold text-slate-500">관련 인물</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {analysis.relatedPeople.map((person) => (
                        <Badge key={person} variant="blue">{person}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-[26px] border border-slate-200 p-5">
                  <p className="text-sm font-semibold text-slate-500">스레드 흐름</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {analysis.threadFlow.map((step) => (
                      <div key={step} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">{step}</div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[26px] border border-slate-200 p-5">
                  <p className="text-sm font-semibold text-slate-500">프로젝트 변화 신호</p>
                  <div className="mt-4 space-y-3">
                    {analysis.projectSignals.map((signal) => (
                      <div key={signal} className="rounded-[18px] bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">{signal}</div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[26px] border border-slate-200 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">대응 초안</p>
                    <p className="mt-2 text-sm text-slate-600">선택한 메일 묶음을 기준으로 하나의 대응 메시지를 준비합니다.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {toneOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setTone(option.value)}
                        className={tone === option.value ? "rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white" : "rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600"}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button onClick={handleDraft} disabled={isGeneratingDraft} className="gap-2">
                    {isGeneratingDraft ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                    대응 초안 생성
                  </Button>
                  <Button variant="secondary" onClick={() => setShowOriginal((current) => !current)} className="gap-2">
                    원문 메일 펼쳐보기
                    <ChevronDown className={showOriginal ? "h-4 w-4 rotate-180" : "h-4 w-4"} />
                  </Button>
                </div>

                {draft ? (
                  <div className="mt-5 rounded-[22px] bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">제목</p>
                    <p className="mt-2 font-semibold text-slate-950">{draft.subject}</p>
                    <p className="mt-4 text-sm text-slate-500">본문</p>
                    <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700">{draft.body}</p>
                  </div>
                ) : null}

                {!draft && analysis.replyDrafts[tone] ? (
                  <div className="mt-5 rounded-[22px] border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-500">
                    준비된 기본 초안이 있습니다. 버튼을 누르면 API 기준 최신 초안으로 다시 생성합니다.
                  </div>
                ) : null}

                {showOriginal ? (
                  <div className="mt-5 space-y-3">
                    {selectedEmails.map((email) => (
                      <div key={email.id} className="rounded-[22px] border border-slate-200 bg-white p-5">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-slate-950">{email.title}</p>
                          <Badge variant="neutral">{email.project}</Badge>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">{email.sender} · {email.deadline ?? "기한 없음"}</p>
                        <p className="mt-3 text-sm leading-7 text-slate-700">{email.body}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
