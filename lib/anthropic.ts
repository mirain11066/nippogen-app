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

export async function generateReport(params: {
  bullets: string;
  template: ReportTemplate;
  tone: ReportTone;
}): Promise<GenerationResult> {
  const systemPrompt = REPORT_SYSTEM_PROMPTS[params.template];
  const toneInstruction = TONE_INSTRUCTIONS[params.tone];

  const userMessage = `${toneInstruction}

以下の箇条書きメモから報告書を作成してください：

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
