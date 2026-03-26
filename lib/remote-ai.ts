import { generateClusterReplyDraft, analyzeEmailCluster } from "@/lib/ai";
import { SampleEmail, ReplyTone, MultiEmailAnalysisResult, DraftBlock } from "@/types";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

function getConfig() {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
  return { apiKey, model };
}

async function callOpenAI<T>(systemPrompt: string, userPrompt: string): Promise<T | null> {
  const { apiKey, model } = getConfig();
  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.4,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return null;
    }

    return JSON.parse(content) as T;
  } catch (error) {
    console.warn("OpenAI request failed. Falling back to local analysis.", error);
    return null;
  }
}

function serializeEmails(emails: SampleEmail[]) {
  return emails.map((email) => ({
    id: email.id,
    sender: email.sender,
    title: email.title,
    project: email.project,
    preview: email.preview,
    body: email.body,
    priority: email.priority,
    deadline: email.deadline ?? null,
    relatedPeople: email.relatedPeople,
    threadStage: email.threadStage,
  }));
}

export async function analyzeEmailClusterWithFallback(
  emails: SampleEmail[],
  contextLabel?: string
): Promise<MultiEmailAnalysisResult> {
  const remote = await callOpenAI<MultiEmailAnalysisResult>(
    "You are an enterprise email triage assistant. Return only valid JSON. Summarize multiple work emails into one operational briefing. Keep Korean output concise and businesslike.",
    JSON.stringify({
      task: "Analyze this cluster of emails for a returning office worker.",
      contextLabel,
      requiredShape: {
        headline: "string",
        overview: "string",
        keyPoints: ["string", "string", "string"],
        whyItMatters: "string",
        actions: [{ title: "string", owner: "string", due: "string", sourceEmailIds: ["string"] }],
        deadlines: [{ label: "string", due: "string", sourceEmailId: "string" }],
        relatedPeople: ["string"],
        threadFlow: ["string"],
        projectSignals: ["string"],
        selectedEmailIds: ["string"],
        selectedProjects: ["string"],
        replyDrafts: {
          formal: { subject: "string", body: "string" },
          concise: { subject: "string", body: "string" },
          collaborative: { subject: "string", body: "string" }
        }
      },
      emails: serializeEmails(emails),
    })
  );

  if (remote) {
    return remote;
  }

  return analyzeEmailCluster(emails, contextLabel);
}

export async function generateClusterReplyDraftWithFallback(
  emails: SampleEmail[],
  tone: ReplyTone,
  contextLabel?: string
): Promise<DraftBlock> {
  const remote = await callOpenAI<DraftBlock>(
    "You are an enterprise email assistant. Return only valid JSON with subject and body. Write Korean business email copy based on multiple selected emails.",
    JSON.stringify({
      task: "Draft one concise status or reply message for the selected email cluster.",
      tone,
      contextLabel,
      requiredShape: { subject: "string", body: "string" },
      emails: serializeEmails(emails),
    })
  );

  if (remote) {
    return remote;
  }

  return generateClusterReplyDraft(emails, tone, contextLabel);
}
