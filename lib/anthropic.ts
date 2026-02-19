import Anthropic from "@anthropic-ai/sdk";
import { REPORT_SYSTEM_PROMPTS, TONE_INSTRUCTIONS } from "./constants";
import type { ReportTemplate, ReportTone } from "./types";

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  throw new Error("Missing ANTHROPIC_API_KEY environment variable");
}

const anthropic = new Anthropic({
  apiKey,
  timeout: 30_000,
  maxRetries: 3,
});

interface GenerationResult {
  report: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
}

const USER_MESSAGE_PREFIX: Record<string, string> = {
  ja: "以下の箇条書きメモから報告書を作成してください：",
  en: "Please create a report from the following bullet-point notes:",
  zh: "请根据以下要点笔记撰写报告：",
  ko: "다음 메모를 바탕으로 보고서를 작성해 주세요:",
  es: "Por favor, crea un informe a partir de las siguientes notas:",
  fr: "Veuillez créer un rapport à partir des notes suivantes :",
};

export async function generateReport(params: {
  bullets: string;
  template: ReportTemplate;
  tone: ReportTone;
  language?: string;
}): Promise<GenerationResult> {
  const lang = params.language || "ja";
  const langPrompts = REPORT_SYSTEM_PROMPTS[lang] || REPORT_SYSTEM_PROMPTS["ja"];
  const langTones = TONE_INSTRUCTIONS[lang] || TONE_INSTRUCTIONS["ja"];

  const systemPrompt = langPrompts[params.template];
  const toneInstruction = langTones[params.tone];
  const prefix = USER_MESSAGE_PREFIX[lang] || USER_MESSAGE_PREFIX["ja"];

  const userMessage = `${toneInstruction}

${prefix}

${params.bullets}`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text content in Claude response");
  }

  const inputTokens = response.usage.input_tokens;
  const outputTokens = response.usage.output_tokens;
  const costUsd =
    (inputTokens / 1_000_000) * 1.0 + (outputTokens / 1_000_000) * 5.0;

  return { report: textBlock.text, inputTokens, outputTokens, costUsd };
}
