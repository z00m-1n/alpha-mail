"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleEmails } from "@/lib/data";
import { formatDisplayDate } from "@/lib/utils";
import { SampleEmail } from "@/types";

const tabs = ["All", "Urgent", "Reply Needed", "Schedule", "Review", "FYI"] as const;

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("All");
  const [selectedEmail, setSelectedEmail] = useState<SampleEmail>(sampleEmails[0]);
  const [selectedEmailIds, setSelectedEmailIds] = useState<string[]>([sampleEmails[0].id, sampleEmails[1].id]);

  const filteredEmails = useMemo(() => {
    return sampleEmails.filter((email) => {
      if (activeTab === "All") return true;
      if (activeTab === "Urgent") return email.priority === "critical" || email.priority === "high";
      if (activeTab === "Reply Needed") return email.replyNeeded;
      if (activeTab === "Schedule") return email.category === "schedule";
      if (activeTab === "Review") return email.category === "review" || email.category === "attachment";
      return email.category === "fyi";
    });
  }, [activeTab]);

  const analyzerHref = useMemo(() => {
    const params = new URLSearchParams({ emails: selectedEmailIds.join(","), context: "Inbox에서 선택한 메일 묶음" });
    return `/analyzer?${params.toString()}`;
  }, [selectedEmailIds]);

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

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="rounded-[30px] p-6">
        <CardHeader>
          <div>
            <CardTitle>Inbox View</CardTitle>
            <CardDescription>메일 목록을 실무형 작업 큐처럼 정리했습니다.</CardDescription>
          </div>
        </CardHeader>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 lg:min-w-[320px]">
            <Search className="h-4 w-4" />
            프로젝트, 발신자, 제목 검색
          </div>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={activeTab === tab ? "rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white" : "rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600"}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {filteredEmails.map((email) => (
            <div
              key={email.id}
              className={selectedEmail.id === email.id ? "w-full rounded-[24px] border border-brand-200 bg-brand-50/70 p-4 text-left shadow-panel" : "w-full rounded-[24px] border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300"}
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex gap-3">
                  <input
                    type="checkbox"
                    checked={selectedEmailIds.includes(email.id)}
                    onChange={() => toggleSelectedEmail(email.id)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-500"
                  />
                  <button onClick={() => setSelectedEmail(email)} className="text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-950">{email.sender}</p>
                    <Badge variant={email.priority === "critical" ? "rose" : email.priority === "high" ? "amber" : "blue"}>{email.priority}</Badge>
                    {email.replyNeeded ? <Badge variant="mint">Reply needed</Badge> : null}
                  </div>
                  <p className="mt-2 text-base font-semibold text-slate-900">{email.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{email.preview}</p>
                  </button>
                </div>
                <div className="text-right text-sm text-slate-500">
                  <p>{formatDisplayDate(email.receivedAt)}</p>
                  <div className="mt-2 flex flex-wrap justify-end gap-2">
                    {email.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link href={analyzerHref} className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
          선택한 이메일 묶음 분석하기
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Card>

      <Card className="rounded-[30px] p-6">
        <CardHeader>
          <div>
            <CardTitle>Mail Detail</CardTitle>
            <CardDescription>리스트에서 선택한 메일을 빠르게 파악하고 분석으로 넘깁니다.</CardDescription>
          </div>
        </CardHeader>

        <div className="mt-6 rounded-[28px] bg-gradient-to-br from-slate-50 via-white to-brand-50 p-6 text-slate-950">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="blue">{selectedEmail.project}</Badge>
            <Badge variant="neutral">{selectedEmail.senderRole}</Badge>
          </div>
          <h3 className="mt-4 font-display text-2xl font-semibold">{selectedEmail.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-700">{selectedEmail.body}</p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200 p-4">
            <p className="text-sm text-slate-500">수신 시각</p>
            <p className="mt-2 font-semibold text-slate-950">{formatDisplayDate(selectedEmail.receivedAt)}</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 p-4">
            <p className="text-sm text-slate-500">마감 정보</p>
            <p className="mt-2 font-semibold text-slate-950">{selectedEmail.deadline ?? "명시되지 않음"}</p>
          </div>
        </div>

        <div className="mt-5 rounded-[24px] border border-slate-200 p-4">
          <p className="text-sm text-slate-500">왜 이 메일이 중요한가</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {selectedEmail.replyNeeded
              ? "이 메일은 다른 팀 진행이나 외부 일정에 직접 연결되어 있어, 복귀 직후 빠르게 우선순위에 올려야 합니다."
              : "즉시 회신은 필요 없지만 문맥 복구와 내부 공지 확인에 도움이 되는 정보성 메일입니다."}
          </p>
        </div>

        <Link href={`/analyzer?emails=${selectedEmail.id}&context=${encodeURIComponent(`${selectedEmail.project} 개별 선택 브리핑`)}`} className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
          이 메일 기준 브리핑 보기
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Card>
    </div>
  );
}
