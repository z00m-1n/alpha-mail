import {
  DraftBlock,
  EmailDraftInput,
  AnalysisResult,
  MultiEmailAction,
  MultiEmailAnalysisResult,
  ReplyTone,
  SampleEmail,
} from "@/types";

function detectDeadline(text: string) {
  const patterns = ["오늘", "내일", "목요일", "금요일", "오후", "오전", "이번 주"];
  const found = patterns.find((pattern) => text.includes(pattern));
  return found ? `${found} 기준 확인 필요` : null;
}

function buildKeyPoints(body: string) {
  const sentences = body
    .split(/\n|\./)
    .map((item) => item.trim())
    .filter(Boolean);

  return [
    sentences[0] ?? "핵심 요청이 메일 초반에 명시되어 있습니다.",
    sentences[1] ?? "업무 진행을 위해 추가 확인이 필요합니다.",
    sentences.find((sentence) => /회신|검토|확인|공유/.test(sentence)) ?? "후속 액션이 포함되어 있습니다.",
  ].slice(0, 3);
}

function buildActions(text: string) {
  const rules = [
    { match: /회신|알려주시면|가능한 시간대/, action: "필요한 답변 포인트를 정리해 회신 초안을 보낸다." },
    { match: /검토|코멘트|의견/, action: "문서 또는 요청안의 주요 리스크와 수정 의견을 남긴다." },
    { match: /승인|확정/, action: "의사결정이 필요한 항목을 확인하고 승인 여부를 결정한다." },
    { match: /공지|고객/, action: "대외 커뮤니케이션 영향 범위를 확인하고 메시지를 맞춘다." },
  ];

  const actions = rules.filter((rule) => rule.match.test(text)).map((rule) => rule.action);
  return actions.length > 0 ? Array.from(new Set(actions)) : ["핵심 요청을 확인하고 우선순위를 판단한다."];
}

function buildThreadFlow(text: string) {
  if (/장애|원인/.test(text)) {
    return ["요청 접수", "원인 분석 진행", "외부 커뮤니케이션 준비", "회신 대기"];
  }

  if (/일정|미팅/.test(text)) {
    return ["일정 제안", "참석 가능 여부 수집", "시간 확정", "캘린더 발송"];
  }

  if (/검토|첨부/.test(text)) {
    return ["자료 공유", "검토 요청", "의견 취합", "의사결정 대기"];
  }

  return ["공지 수신", "정보 확인", "후속 필요 여부 판단"];
}

function buildImportanceReason(title: string, body: string) {
  if (/긴급|장애|고객/.test(`${title} ${body}`)) {
    return "고객 영향과 외부 커뮤니케이션 가능성이 있어 복귀 직후 가장 먼저 확인해야 하는 메일입니다.";
  }

  if (/오늘|내일|목요일|금요일/.test(body)) {
    return "명확한 일정 제약이 포함되어 있어 늦게 확인할수록 다른 팀 일정이나 의사결정이 지연됩니다.";
  }

  if (/검토|승인|코멘트/.test(body)) {
    return "다른 팀의 진행이 사용자의 판단이나 피드백에 의존하고 있어 병목이 되기 쉬운 요청입니다.";
  }

  return "참고성 메일이지만 업무 문맥을 빠르게 회복하는 데 도움이 되는 정보가 포함되어 있습니다.";
}

function buildSummary(title: string, body: string) {
  if (/일정|미팅/.test(`${title} ${body}`)) {
    return "오늘 안에 가능한 미팅 시간을 회신해야 하는 일정 조율 메일입니다.";
  }

  if (/검토/.test(`${title} ${body}`)) {
    return "문서를 검토하고 구체적인 피드백을 전달해야 하는 요청 메일입니다.";
  }

  if (/장애|긴급/.test(`${title} ${body}`)) {
    return "고객 영향이 있는 장애 상황으로, 빠른 판단과 회신이 필요한 긴급 메일입니다.";
  }

  if (/첨부|견적서/.test(`${title} ${body}`)) {
    return "첨부 자료를 확인한 뒤 승인 여부를 정해야 하는 의사결정 메일입니다.";
  }

  return "바로 대응이 필요하지는 않지만 복귀 후 문맥 파악에 도움이 되는 공지 메일입니다.";
}

function buildReply(title: string, sender: string, tone: ReplyTone) {
  const common = {
    formal: `${sender}님, 공유해주신 내용 확인했습니다. 요청 주신 사항 기준으로 우선 검토를 진행하고, 필요한 판단 포인트를 정리해 기한 내 회신드리겠습니다. 추가로 확인이 필요한 부분이 있으면 함께 말씀드리겠습니다.`,
    concise: `내용 확인했습니다. 핵심 요청 기준으로 정리해서 기한 내 회신드리겠습니다. 추가 확인 필요 사항은 별도로 짧게 공유드리겠습니다.`,
    collaborative: `공유 감사합니다. 관련 팀과 필요한 포인트를 빠르게 맞춘 뒤 바로 다음 액션이 진행될 수 있도록 회신드리겠습니다. 중간에 막히는 부분이 있으면 바로 연결하겠습니다.`,
  };

  return {
    subject: `Re: ${title}`,
    body: common[tone],
  };
}

export async function analyzeEmail(input: EmailDraftInput): Promise<AnalysisResult> {
  const combined = `${input.title} ${input.body}`;

  return {
    summary: buildSummary(input.title, input.body),
    keyPoints: buildKeyPoints(input.body),
    whyItMatters: buildImportanceReason(input.title, input.body),
    actions: buildActions(combined),
    deadline: detectDeadline(input.body) ?? detectDeadline(input.title),
    relatedPeople: Array.from(
      new Set(
        combined
          .split(/[,\n]/)
          .map((token) => token.trim())
          .filter((token) => token.length > 1)
          .filter((token) => /팀|님|PM|Lead|Manager|Ops|법무/.test(token))
      )
    ).slice(0, 4),
    threadFlow: buildThreadFlow(combined),
    suggestedSubject: buildReply(input.title, input.sender, "formal").subject,
    importanceScore: /긴급|장애|고객/.test(combined) ? 96 : /오늘|내일|목요일|금요일/.test(combined) ? 84 : 68,
    suggestedReply: {
      formal: buildReply(input.title, input.sender, "formal").body,
      concise: buildReply(input.title, input.sender, "concise").body,
      collaborative: buildReply(input.title, input.sender, "collaborative").body,
    },
  };
}

export async function generateReplyDraft(input: EmailDraftInput, tone: ReplyTone) {
  return buildReply(input.title, input.sender, tone);
}

function priorityRank(priority: SampleEmail["priority"]) {
  return { critical: 4, high: 3, medium: 2, low: 1 }[priority];
}

function buildClusterHeadline(emails: SampleEmail[]) {
  const urgentCount = emails.filter((email) => email.priority === "critical" || email.priority === "high").length;
  const replyCount = emails.filter((email) => email.replyNeeded).length;

  if (urgentCount > 0) {
    return `선택한 ${emails.length}개 메일 중 ${urgentCount}건이 즉시 판단이 필요한 우선순위 메일입니다.`;
  }

  if (replyCount > 0) {
    return `선택한 메일에서 회신 또는 피드백이 필요한 흐름이 ${replyCount}건 잡혔습니다.`;
  }

  return `선택한 ${emails.length}개 메일을 기준으로 복귀 후 업무 흐름을 한 번에 정리했습니다.`;
}

function buildClusterOverview(emails: SampleEmail[], contextLabel?: string) {
  const projects = Array.from(new Set(emails.map((email) => email.project)));
  const prefix = contextLabel ? `${contextLabel} 기준으로 ` : "";
  return `${prefix}${projects.join(", ")} 관련 메일을 묶어 보면 고객 영향 대응, 검토 요청, 일정 확정처럼 서로 다른 업무 흐름이 동시에 열려 있습니다.`;
}

function buildClusterKeyPoints(emails: SampleEmail[]) {
  return emails
    .slice()
    .sort((left, right) => priorityRank(right.priority) - priorityRank(left.priority))
    .slice(0, 3)
    .map((email) => `${email.title} · ${email.deadline ?? "기한 미표기"}`);
}

function buildClusterWhy(emails: SampleEmail[]) {
  if (emails.some((email) => email.priority === "critical")) {
    return "선택한 메일 안에 고객 영향 또는 대외 커뮤니케이션 리스크가 포함되어 있어, 개별 메일 단위가 아니라 묶음 단위로 먼저 판단하는 편이 효율적입니다.";
  }

  if (emails.some((email) => email.replyNeeded)) {
    return "여러 메일이 각각 회신, 검토, 승인에 연결되어 있어 하나씩 읽기보다 병목이 생길 흐름을 먼저 묶어 보는 것이 맞습니다.";
  }

  return "당장 긴급도는 낮아도 프로젝트와 일정 문맥을 빠르게 복구하기 위해 한 번에 보는 편이 좋습니다.";
}

function buildClusterActions(emails: SampleEmail[]): MultiEmailAction[] {
  return emails
    .slice()
    .sort((left, right) => priorityRank(right.priority) - priorityRank(left.priority))
    .map((email) => ({
      title:
        email.category === "urgent"
          ? "고객 영향 여부와 외부 커뮤니케이션 방향을 먼저 확정"
          : email.category === "review"
            ? "검토 포인트와 리스크 코멘트를 정리"
            : email.category === "schedule"
              ? "가능한 시간대와 참석 여부를 빠르게 회신"
              : email.category === "attachment"
                ? "첨부파일 확인 후 승인 또는 추가 협상 방향 결정"
                : "정보성 메일은 참고 항목으로 분리",
      owner: email.sender,
      due: email.deadline ?? "명시되지 않음",
      sourceEmailIds: [email.id],
    }))
    .slice(0, 5);
}

function buildProjectSignals(emails: SampleEmail[]) {
  return Array.from(new Set(emails.map((email) => `${email.project}: ${email.preview}`))).slice(0, 4);
}

function buildGroupThreadFlow(emails: SampleEmail[]) {
  const stages = emails.flatMap((email) => email.threadStage);
  return Array.from(new Set(stages)).slice(0, 6);
}

function buildPeople(emails: SampleEmail[]) {
  return Array.from(new Set(emails.flatMap((email) => email.relatedPeople))).slice(0, 8);
}

function buildDeadlines(emails: SampleEmail[]) {
  return emails
    .filter((email) => email.deadline)
    .map((email) => ({
      label: email.title,
      due: email.deadline ?? "명시되지 않음",
      sourceEmailId: email.id,
    }))
    .slice(0, 5);
}

function buildPortfolioReplyDraft(emails: SampleEmail[], tone: ReplyTone, contextLabel?: string): DraftBlock {
  const projects = Array.from(new Set(emails.map((email) => email.project)));
  const subjectBase = contextLabel ? `${contextLabel} 대응 계획 공유` : `선택 메일 대응 계획 공유`;
  const opening =
    tone === "formal"
      ? "공유 주신 메일들을 모두 확인했고, 우선순위 기준으로 대응 순서를 정리했습니다."
      : tone === "concise"
        ? "선택된 메일 흐름을 확인했고 대응 순서를 정리했습니다."
        : "관련 메일들을 한 번에 검토했고, 팀이 바로 움직일 수 있도록 대응 계획을 묶었습니다.";

  const body = [
    opening,
    `${projects.join(", ")} 관련해서 우선 고객 영향 또는 승인 의사결정이 필요한 항목부터 처리하겠습니다.`,
    `이후 검토 요청과 일정 조율 건은 오늘 안에 회신 가능하도록 정리하겠습니다.`,
    `추가로 필요한 판단 포인트나 의존 사항이 확인되면 바로 업데이트드리겠습니다.`,
  ].join(" ");

  return {
    subject: `[AlphaMail] ${subjectBase}`,
    body,
  };
}

export async function analyzeEmailCluster(emails: SampleEmail[], contextLabel?: string): Promise<MultiEmailAnalysisResult> {
  return {
    headline: buildClusterHeadline(emails),
    overview: buildClusterOverview(emails, contextLabel),
    keyPoints: buildClusterKeyPoints(emails),
    whyItMatters: buildClusterWhy(emails),
    actions: buildClusterActions(emails),
    deadlines: buildDeadlines(emails),
    relatedPeople: buildPeople(emails),
    threadFlow: buildGroupThreadFlow(emails),
    projectSignals: buildProjectSignals(emails),
    selectedEmailIds: emails.map((email) => email.id),
    selectedProjects: Array.from(new Set(emails.map((email) => email.project))),
    replyDrafts: {
      formal: buildPortfolioReplyDraft(emails, "formal", contextLabel),
      concise: buildPortfolioReplyDraft(emails, "concise", contextLabel),
      collaborative: buildPortfolioReplyDraft(emails, "collaborative", contextLabel),
    },
  };
}

export async function generateClusterReplyDraft(emails: SampleEmail[], tone: ReplyTone, contextLabel?: string) {
  return buildPortfolioReplyDraft(emails, tone, contextLabel);
}
