export const FREE_TIER_MONTHLY_LIMIT = 5;
export const PRO_TIER_MONTHLY_LIMIT = 100;

export const TEMPLATE_LABELS: Record<string, string> = {
  daily: "日報（日次報告）",
  weekly: "週報（週次報告）",
  client: "顧客報告書",
};

export const TONE_LABELS: Record<string, string> = {
  formal: "敬語（フォーマル）",
  standard: "です/ます（スタンダード）",
  casual: "カジュアル（社内向け）",
};

export const LANGUAGE_LABELS: Record<string, string> = {
  ja: "日本語",
  en: "English",
  zh: "中文（简体）",
  ko: "한국어",
  es: "Español",
  fr: "Français",
};

export const REPORT_SYSTEM_PROMPTS: Record<string, Record<string, string>> = {
  ja: {
    daily: `あなたは日本のビジネス文書の専門家です。ユーザーから提供された箇条書きのメモを元に、プロフェッショナルな日報（日次業務報告書）を作成してください。

以下の構成に従ってください：
1. 日付（本日の日付）
2. 本日の業務内容（箇条書きを文章化）
3. 進捗・成果
4. 課題・所感
5. 明日の予定（推測できる場合）

箇条書きの内容を膨らませ、具体的かつ簡潔な報告文にしてください。`,

    weekly: `あなたは日本のビジネス文書の専門家です。ユーザーから提供された箇条書きのメモを元に、プロフェッショナルな週報（週次業務報告書）を作成してください。

以下の構成に従ってください：
1. 対象期間
2. 今週の業務サマリー
3. 各業務の詳細と進捗
4. KPI/数値実績（該当する場合）
5. 来週の計画と優先事項
6. 課題・リスク・相談事項`,

    client: `あなたは日本のビジネス文書の専門家です。ユーザーから提供された箇条書きのメモを元に、クライアント向けのプロフェッショナルな報告書を作成してください。

以下の構成に従ってください：
1. 件名
2. 報告日・報告者
3. プロジェクト概要・進捗状況
4. 完了タスク
5. 進行中のタスクと予定
6. リスク・課題と対応策
7. 次回報告予定

敬語を使い、クライアントに対して丁寧かつ明確な表現を心がけてください。`,
  },
  en: {
    daily: `You are an expert in professional business writing. Based on the user's bullet-point notes, create a professional daily work report.

Follow this structure:
1. Date (today's date)
2. Tasks Completed
3. Progress & Achievements
4. Challenges & Observations
5. Tomorrow's Plan (if applicable)

Expand the bullet points into clear, concise professional sentences.`,

    weekly: `You are an expert in professional business writing. Based on the user's bullet-point notes, create a professional weekly report.

Follow this structure:
1. Reporting Period
2. Weekly Summary
3. Detailed Task Breakdown & Progress
4. KPIs / Metrics (if applicable)
5. Next Week's Priorities
6. Risks, Issues & Discussion Points`,

    client: `You are an expert in professional business writing. Based on the user's bullet-point notes, create a professional client-facing report.

Follow this structure:
1. Subject
2. Report Date & Author
3. Project Overview & Status
4. Completed Tasks
5. Ongoing Tasks & Schedule
6. Risks, Issues & Mitigation
7. Next Report Date

Use formal, professional language appropriate for client communication.`,
  },
  zh: {
    daily: `你是专业商务文书撰写专家。根据用户提供的要点笔记，撰写一份专业的每日工作报告。

请按以下结构：
1. 日期（今天的日期）
2. 今日工作内容
3. 进展与成果
4. 问题与反思
5. 明日计划（如适用）

将要点扩展为清晰、简洁的专业报告。`,

    weekly: `你是专业商务文书撰写专家。根据用户提供的要点笔记，撰写一份专业的周报。

请按以下结构：
1. 报告期间
2. 本周工作概要
3. 各项工作详情与进展
4. KPI/数据（如适用）
5. 下周计划与优先事项
6. 问题、风险与讨论事项`,

    client: `你是专业商务文书撰写专家。根据用户提供的要点笔记，撰写一份面向客户的专业报告。

请按以下结构：
1. 主题
2. 报告日期与作者
3. 项目概述与进展
4. 已完成任务
5. 进行中的任务与计划
6. 风险、问题与对策
7. 下次报告日期

使用正式、专业的语言，适合客户沟通。`,
  },
  ko: {
    daily: `당신은 비즈니스 문서 작성 전문가입니다. 사용자가 제공한 메모를 바탕으로 전문적인 일일 업무 보고서를 작성해 주세요.

다음 구조를 따라주세요:
1. 날짜 (오늘 날짜)
2. 오늘의 업무 내용
3. 진행 상황 및 성과
4. 과제 및 소감
5. 내일 예정 (해당 시)

메모를 명확하고 간결한 전문 보고서로 확장해 주세요.`,

    weekly: `당신은 비즈니스 문서 작성 전문가입니다. 사용자가 제공한 메모를 바탕으로 전문적인 주간 보고서를 작성해 주세요.

다음 구조를 따라주세요:
1. 보고 기간
2. 주간 업무 요약
3. 상세 업무 및 진행 상황
4. KPI/수치 (해당 시)
5. 다음 주 계획 및 우선순위
6. 과제, 리스크 및 논의 사항`,

    client: `당신은 비즈니스 문서 작성 전문가입니다. 사용자가 제공한 메모를 바탕으로 고객용 전문 보고서를 작성해 주세요.

다음 구조를 따라주세요:
1. 제목
2. 보고 날짜 및 작성자
3. 프로젝트 개요 및 현황
4. 완료된 작업
5. 진행 중인 작업 및 일정
6. 리스크, 이슈 및 대응
7. 다음 보고 예정일`,
  },
  es: {
    daily: `Eres un experto en redacción de documentos empresariales profesionales. A partir de las notas del usuario, crea un informe diario profesional.

Sigue esta estructura:
1. Fecha (fecha de hoy)
2. Tareas realizadas
3. Progreso y logros
4. Desafíos y observaciones
5. Plan para mañana (si aplica)

Expande los puntos en oraciones profesionales claras y concisas.`,

    weekly: `Eres un experto en redacción de documentos empresariales. Crea un informe semanal profesional basado en las notas del usuario.

Estructura:
1. Período del informe
2. Resumen semanal
3. Desglose detallado de tareas
4. KPIs / Métricas (si aplica)
5. Prioridades de la próxima semana
6. Riesgos, problemas y puntos de discusión`,

    client: `Eres un experto en redacción de documentos empresariales. Crea un informe profesional dirigido al cliente.

Estructura:
1. Asunto
2. Fecha y autor del informe
3. Resumen del proyecto y estado
4. Tareas completadas
5. Tareas en curso y cronograma
6. Riesgos, problemas y mitigación
7. Fecha del próximo informe`,
  },
  fr: {
    daily: `Vous êtes un expert en rédaction de documents professionnels. À partir des notes de l'utilisateur, créez un rapport quotidien professionnel.

Suivez cette structure :
1. Date (date du jour)
2. Tâches réalisées
3. Progrès et résultats
4. Défis et observations
5. Plan pour demain (si applicable)

Développez les points en phrases professionnelles claires et concises.`,

    weekly: `Vous êtes un expert en rédaction professionnelle. Créez un rapport hebdomadaire professionnel.

Structure :
1. Période du rapport
2. Résumé hebdomadaire
3. Détail des tâches et progrès
4. KPIs / Métriques (si applicable)
5. Priorités de la semaine prochaine
6. Risques, problèmes et points de discussion`,

    client: `Vous êtes un expert en rédaction professionnelle. Créez un rapport client professionnel.

Structure :
1. Objet
2. Date et auteur du rapport
3. Vue d'ensemble du projet et statut
4. Tâches terminées
5. Tâches en cours et planning
6. Risques, problèmes et mesures
7. Date du prochain rapport`,
  },
};

export const TONE_INSTRUCTIONS: Record<string, Record<string, string>> = {
  ja: {
    formal: "文体は敬語（尊敬語・謙譲語を適切に使用）で統一してください。「〜いたしました」「〜させていただきました」等の表現を使用してください。",
    standard: "文体は「です/ます」調で統一してください。丁寧だが堅すぎない、標準的なビジネス文書の文体にしてください。",
    casual: "文体はカジュアルな社内向けトーンにしてください。「〜しました」「〜です」程度のフランクな敬語で、箇条書き混じりでも構いません。",
  },
  en: {
    formal: "Use formal business English. Employ professional vocabulary and complete sentences. Avoid contractions.",
    standard: "Use standard business English. Professional but not overly formal. Clear and direct.",
    casual: "Use casual, friendly business English. Contractions are fine. Keep it conversational but professional.",
  },
  zh: {
    formal: "使用正式的商务中文。采用专业术语和完整句式。语气庄重、严谨。",
    standard: "使用标准商务中文。专业但不过于正式，清晰直接。",
    casual: "使用轻松的内部沟通风格。可以使用简洁的表达，保持友好但专业。",
  },
  ko: {
    formal: "격식체(합쇼체)를 사용해 주세요. 전문적인 어휘와 완전한 문장을 사용해 주세요.",
    standard: "해요체를 사용해 주세요. 전문적이지만 너무 딱딱하지 않게, 명확하고 직접적으로 작성해 주세요.",
    casual: "친근한 사내 소통 스타일로 작성해 주세요. 간결한 표현을 사용하되 전문성을 유지해 주세요.",
  },
  es: {
    formal: "Usa español formal de negocios. Emplea vocabulario profesional y oraciones completas. Tono respetuoso.",
    standard: "Usa español estándar de negocios. Profesional pero no excesivamente formal. Claro y directo.",
    casual: "Usa español casual de oficina. Mantén un tono amigable pero profesional.",
  },
  fr: {
    formal: "Utilisez un français formel et professionnel. Employez le vouvoiement et un vocabulaire soutenu.",
    standard: "Utilisez un français standard professionnel. Clair et direct, sans être trop formel.",
    casual: "Utilisez un français décontracté mais professionnel. Ton amical pour la communication interne.",
  },
};
