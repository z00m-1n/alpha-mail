import { ActionItem, SampleEmail } from "@/types";

export const sampleEmails: SampleEmail[] = [
  {
    id: "mail-incident",
    sender: "김도윤",
    senderRole: "Platform Ops Lead",
    title: "[긴급] 결제 API 장애 원인 확인 및 고객 공지 초안 필요",
    preview: "오후 3시 전까지 고객 커뮤니케이션 방향과 내부 원인 정리가 필요합니다.",
    receivedAt: "2026-03-26T08:45:00+09:00",
    body: "안녕하세요. 금일 오전 7시 20분부터 결제 API 응답 지연이 발생했고, 일부 고객사에서 결제 실패 문의가 접수되었습니다. 현재 인프라팀이 1차 원인으로 캐시 레이어 설정 변경을 의심하고 있으며, 오후 1시까지 기술 원인 공유가 가능할 예정입니다.\n\n비즈니스 관점에서 고객 공지 초안과 CS 대응 문구가 필요합니다. Alpha 결제 프로젝트 담당 관점에서 오후 3시 전까지 초안 검토 가능할지 회신 부탁드립니다.\n\n관련자: 인프라팀 김도윤, CS팀 박선영, PM 이지후",
    category: "urgent",
    priority: "critical",
    replyNeeded: true,
    tags: ["Incident", "Customer Impact", "Reply Needed"],
    project: "Alpha Pay",
    hasAttachment: false,
    deadline: "오늘 15:00",
    relatedPeople: ["김도윤", "박선영", "이지후"],
    threadStage: ["장애 접수", "원인 분석 진행", "대외 공지 초안 필요"],
  },
  {
    id: "mail-review",
    sender: "이수민",
    senderRole: "Product Manager",
    title: "Q2 리텐션 캠페인 기획안 검토 요청",
    preview: "금주 금요일 운영위원회 전에 메시지 구조와 리스크 코멘트가 필요합니다.",
    receivedAt: "2026-03-25T17:10:00+09:00",
    body: "안녕하세요. 첨부드린 Q2 리텐션 캠페인 기획안에 대해 메일 자동화 시나리오와 고객 세그먼트 분류 기준을 검토 부탁드립니다.\n\n특히 1) VIP 고객군 알림 타이밍, 2) 마케팅 문구의 법무 리스크, 3) 운영팀 리소스 이슈에 대한 의견을 부탁드립니다. 금요일 오전 운영위원회에서 공유 예정이라 목요일 오후까지 코멘트를 받으면 좋겠습니다.\n\n첨부: Q2_retention_plan_v3.pdf",
    category: "review",
    priority: "high",
    replyNeeded: true,
    tags: ["Review", "Attachment", "Campaign"],
    project: "CRM Growth",
    hasAttachment: true,
    deadline: "목요일 16:00",
    relatedPeople: ["이수민", "정세라", "법무팀"],
    threadStage: ["기획안 공유", "부서별 검토 요청", "운영위원회 보고 예정"],
  },
  {
    id: "mail-schedule",
    sender: "한예진",
    senderRole: "Business Operations",
    title: "다음 주 파트너 정기 미팅 일정 조율",
    preview: "세 개 후보 시간 중 가능한 시간대를 회신해 주세요.",
    receivedAt: "2026-03-25T11:00:00+09:00",
    body: "안녕하세요. 다음 주 월간 파트너 정기 미팅 일정을 확정하려고 합니다. 현재 후보 시간은 화요일 10시, 수요일 14시, 목요일 16시입니다.\n\n이번 미팅에서는 신규 SLA 조정안과 4월 공동 프로모션 일정이 논의될 예정이어서 참석자 확정이 중요합니다. 가능하신 시간대를 오늘 중으로 알려주시면 캘린더 초대를 발송하겠습니다.",
    category: "schedule",
    priority: "medium",
    replyNeeded: true,
    tags: ["Schedule", "Partner", "Meeting"],
    project: "Partner Success",
    hasAttachment: false,
    deadline: "오늘 18:00",
    relatedPeople: ["한예진", "파트너사 담당자"],
    threadStage: ["일정 후보 제안", "참석 가능 여부 수집", "캘린더 초대 예정"],
  },
  {
    id: "mail-fyi",
    sender: "People Team",
    senderRole: "Internal Communications",
    title: "4월 사내 교육 프로그램 오픈 안내",
    preview: "데이터 활용, 리더십, 생성형 AI 교육 과정 신청이 시작되었습니다.",
    receivedAt: "2026-03-24T09:20:00+09:00",
    body: "안녕하세요. 4월 사내 교육 프로그램이 오픈되어 안내드립니다. 이번 달에는 데이터 기반 의사결정, 리더십 코칭, 생성형 AI 실무 활용 등 12개 과정이 운영됩니다. 관심 있는 과정은 교육 포털에서 신청 가능합니다.\n\n필수 응답 사항은 없으며, 팀별 추천 과정은 별도 문서에서 확인하실 수 있습니다.",
    category: "fyi",
    priority: "low",
    replyNeeded: false,
    tags: ["FYI", "People", "Training"],
    project: "Company-wide",
    hasAttachment: false,
    relatedPeople: ["People Team"],
    threadStage: ["공지 발송", "자율 신청 진행"],
  },
  {
    id: "mail-attachment",
    sender: "박지훈",
    senderRole: "Finance Manager",
    title: "첨부 견적서 확인 부탁드립니다",
    preview: "벤더 비용 조정안이 반영된 견적서 검토 후 승인 여부를 알려주세요.",
    receivedAt: "2026-03-26T07:55:00+09:00",
    body: "안녕하세요. 신규 메시징 벤더 견적서 수정본을 전달드립니다. 지난 회의에서 요청하신 월간 발송량 기준 단가와 장애 대응 SLA 옵션이 반영되어 있습니다.\n\n벤더와 이번 주 안에 조건을 확정해야 해서, 첨부파일 확인 후 승인 가능 여부 또는 추가 협상 포인트를 회신 부탁드립니다. 가능하면 오늘 저녁까지 방향을 주시면 내일 오전 협상 미팅에 반영하겠습니다.\n\n첨부: Vendor_Quote_Revision2.xlsx",
    category: "attachment",
    priority: "high",
    replyNeeded: true,
    tags: ["Approval", "Finance", "Attachment"],
    project: "Messaging Infra",
    hasAttachment: true,
    deadline: "오늘 20:00",
    relatedPeople: ["박지훈", "구매팀", "벤더 담당자"],
    threadStage: ["견적 수정본 전달", "승인 여부 대기", "협상 반영 예정"],
  },
];

export const actionItems: ActionItem[] = [
  {
    id: "action-1",
    title: "고객 공지 초안 검토 및 회신",
    emailId: "mail-incident",
    emailTitle: "[긴급] 결제 API 장애 원인 확인 및 고객 공지 초안 필요",
    requester: "김도윤",
    dueDate: "오늘 15:00",
    priority: "critical",
    status: "In Progress",
    filterTag: "reply",
  },
  {
    id: "action-2",
    title: "Q2 캠페인 기획안 코멘트 정리",
    emailId: "mail-review",
    emailTitle: "Q2 리텐션 캠페인 기획안 검토 요청",
    requester: "이수민",
    dueDate: "목요일 16:00",
    priority: "high",
    status: "To Do",
    filterTag: "review",
  },
  {
    id: "action-3",
    title: "파트너 정기 미팅 가능 시간 회신",
    emailId: "mail-schedule",
    emailTitle: "다음 주 파트너 정기 미팅 일정 조율",
    requester: "한예진",
    dueDate: "오늘 18:00",
    priority: "medium",
    status: "To Do",
    filterTag: "schedule",
  },
  {
    id: "action-4",
    title: "벤더 견적서 승인 여부 결정",
    emailId: "mail-attachment",
    emailTitle: "첨부 견적서 확인 부탁드립니다",
    requester: "박지훈",
    dueDate: "오늘 20:00",
    priority: "high",
    status: "To Do",
    filterTag: "approval",
  },
  {
    id: "action-5",
    title: "교육 프로그램 중 팀 추천 코스 공유",
    emailId: "mail-fyi",
    emailTitle: "4월 사내 교육 프로그램 오픈 안내",
    requester: "People Team",
    dueDate: "이번 주",
    priority: "low",
    status: "Done",
    filterTag: "today",
  },
];

export const weeklyBrief = [
  "이번 주 Critical 메일은 1건이며 모두 고객 영향 이슈와 연결되어 있습니다.",
  "검토 요청 2건 중 1건은 첨부파일 기반 의사결정이 필요합니다.",
  "일정 관련 메일은 1건으로 오늘 중 회신이 필요합니다.",
];

export const projectChangeSummary = [
  { name: "Alpha Pay", change: "+3 high-risk threads", trend: "up" },
  { name: "CRM Growth", change: "2 reviews pending", trend: "steady" },
  { name: "Messaging Infra", change: "Vendor approval this evening", trend: "up" },
  { name: "Partner Success", change: "Meeting locked by tonight", trend: "steady" },
];

export const dateRangePresets = [
  { label: "최근 3일", value: "3d", from: "2026-03-24", to: "2026-03-26" },
  { label: "최근 7일", value: "7d", from: "2026-03-20", to: "2026-03-26" },
  { label: "이번 주", value: "week", from: "2026-03-23", to: "2026-03-26" },
];

export function getEmailsByIds(emailIds: string[]) {
  return sampleEmails.filter((email) => emailIds.includes(email.id));
}

export function getEmailsByProject(projectName: string) {
  return sampleEmails.filter((email) => email.project === projectName);
}

export function getOpenActionEmailIds() {
  return Array.from(new Set(actionItems.filter((item) => item.status !== "Done").map((item) => item.emailId)));
}

export function getUrgentEmailIds() {
  return sampleEmails
    .filter((email) => email.priority === "critical" || email.priority === "high")
    .map((email) => email.id);
}
