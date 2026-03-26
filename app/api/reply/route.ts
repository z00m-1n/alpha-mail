import { NextResponse } from "next/server";
import { getEmailsByIds } from "@/lib/data";
import { generateClusterReplyDraftWithFallback } from "@/lib/remote-ai";
import { ReplyDraftRequest } from "@/types";

export async function POST(request: Request) {
  const body = (await request.json()) as ReplyDraftRequest;
  const emails = getEmailsByIds(body.emailIds ?? []);

  if (emails.length === 0) {
    return NextResponse.json({ message: "초안을 만들 이메일이 선택되지 않았습니다." }, { status: 400 });
  }

  const result = await generateClusterReplyDraftWithFallback(emails, body.tone, body.contextLabel);
  return NextResponse.json(result);
}
