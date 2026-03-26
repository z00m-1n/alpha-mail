export type EmailCategory = "schedule" | "review" | "urgent" | "fyi" | "attachment";
export type EmailPriority = "critical" | "high" | "medium" | "low";
export type ActionStatus = "To Do" | "In Progress" | "Done";
export type ReplyTone = "formal" | "concise" | "collaborative";

export interface SampleEmail {
  id: string;
  sender: string;
  senderRole: string;
  title: string;
  preview: string;
  receivedAt: string;
  body: string;
  category: EmailCategory;
  priority: EmailPriority;
  replyNeeded: boolean;
  tags: string[];
  project: string;
  hasAttachment: boolean;
  deadline?: string;
  relatedPeople: string[];
  threadStage: string[];
}

export interface ActionItem {
  id: string;
  title: string;
  emailId: string;
  emailTitle: string;
  requester: string;
  dueDate: string;
  priority: EmailPriority;
  status: ActionStatus;
  filterTag: "today" | "reply" | "review" | "approval" | "schedule";
}

export interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  whyItMatters: string;
  actions: string[];
  deadline: string | null;
  relatedPeople: string[];
  threadFlow: string[];
  suggestedSubject: string;
  importanceScore: number;
  suggestedReply: Record<ReplyTone, string>;
}

export interface EmailDraftInput {
  title: string;
  sender: string;
  receivedAt: string;
  body: string;
}

export interface SelectedDateRange {
  from: string;
  to: string;
  label: string;
}

export interface MultiEmailAction {
  title: string;
  owner: string;
  due: string;
  sourceEmailIds: string[];
}

export interface MultiEmailDeadline {
  label: string;
  due: string;
  sourceEmailId: string;
}

export interface DraftBlock {
  subject: string;
  body: string;
}

export interface MultiEmailAnalysisResult {
  headline: string;
  overview: string;
  keyPoints: string[];
  whyItMatters: string;
  actions: MultiEmailAction[];
  deadlines: MultiEmailDeadline[];
  relatedPeople: string[];
  threadFlow: string[];
  projectSignals: string[];
  selectedEmailIds: string[];
  selectedProjects: string[];
  replyDrafts: Record<ReplyTone, DraftBlock>;
}

export interface AnalyzeEmailsRequest {
  emailIds: string[];
  contextLabel?: string;
}

export interface ReplyDraftRequest {
  emailIds: string[];
  tone: ReplyTone;
  contextLabel?: string;
}
