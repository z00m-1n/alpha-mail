import { NextResponse } from "next/server";
import { getEmailsByIds } from "@/lib/data";
import { analyzeEmailClusterWithFallback } from "@/lib/remote-ai";
import { AnalyzeEmailsRequest } from "@/types";

export async function POST(request: Request) {
  const body = (await request.json()) as AnalyzeEmailsRequest;
  const emails = getEmailsByIds(body.emailIds ?? []);

  if (emails.length === 0) {
    return NextResponse.json({ message: "분석할 이메일이 선택되지 않았습니다." }, { status: 400 });
  }

  const result = await analyzeEmailClusterWithFallback(emails, body.contextLabel);
  return NextResponse.json(result);
}
