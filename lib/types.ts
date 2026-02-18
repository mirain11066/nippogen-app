export type ReportTemplate = "daily" | "weekly" | "client";

export type ReportTone = "formal" | "standard" | "casual";

export interface GenerateReportRequest {
  bullets: string;
  template: ReportTemplate;
  tone: ReportTone;
}

export interface GenerateReportResponse {
  report: string;
  tokens_used: number;
  template: ReportTemplate;
  tone: ReportTone;
}

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "trialing"
  | "none";

export type UserPlan = "free" | "pro";

export interface ApiErrorResponse {
  error: string;
  code: string;
  details?: string;
}
