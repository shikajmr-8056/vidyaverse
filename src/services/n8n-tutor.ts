/**
 * VidyaVerse - n8n AI Tutor Agent Client Integration
 * 
 * Integrates n8n LangChain Agent workflow:
 * - Webhook ID: 2025e060-0d48-4bd3-9bce-3f418ce83a7d
 * - Model: gpt-5-mini (OpenAI Chat Model)
 * - Agent: @n8n/n8n-nodes-langchain.agent v3.1
 * - Trigger: @n8n/n8n-nodes-langchain.chatTrigger v1.5
 */

export interface N8nWorkflowConfig {
  webhookId: string;
  webhookUrl: string;
  model: string;
  systemPrompt: string;
  isCustomUrl: boolean;
  mode: "n8n-live" | "hybrid" | "offline-only";
}

export interface N8nChatResponse {
  success: boolean;
  text: string;
  sessionId: string;
  model: string;
  isFallback?: boolean;
  error?: string;
}

const STORAGE_KEY_WEBHOOK = "vv_n8n_tutor_webhook_url";
const STORAGE_KEY_MODE = "vv_n8n_tutor_mode";
const STORAGE_KEY_SESSION = "vv_n8n_tutor_session_id";

export const DEFAULT_WEBHOOK_ID = "2025e060-0d48-4bd3-9bce-3f418ce83a7d";
export const DEFAULT_SYSTEM_PROMPT =
  "You are a friendly, knowledgeable assistant. Answer each user request clearly, accurately, and concisely. Ask a brief clarifying question when a request is ambiguous. Use the conversation history for context. If you do not know something, say so instead of guessing. Reply in the language the user writes in. Decline harmful or unsafe requests politely.";

/**
 * Default fallback base URL. Users can customize this with their live n8n instance
 * (e.g. https://your-name.app.n8n.cloud or http://localhost:5678)
 */
export function getDefaultWebhookUrl(webhookId = DEFAULT_WEBHOOK_ID): string {
  // Check Vite environment variable first if provided
  const envUrl = (import.meta as any).env?.VITE_N8N_TUTOR_WEBHOOK_URL;
  if (envUrl && typeof envUrl === "string" && envUrl.trim()) {
    return envUrl.trim();
  }
  // Standard n8n chatTrigger webhook path
  return `http://localhost:5678/webhook/${webhookId}/chat`;
}

export function getN8nConfig(): N8nWorkflowConfig {
  let savedUrl = "";
  let savedMode: "n8n-live" | "hybrid" | "offline-only" = "hybrid";

  if (typeof window !== "undefined") {
    try {
      savedUrl = localStorage.getItem(STORAGE_KEY_WEBHOOK) || "";
      const m = localStorage.getItem(STORAGE_KEY_MODE);
      if (m === "n8n-live" || m === "hybrid" || m === "offline-only") {
        savedMode = m;
      }
    } catch {
      // Storage unavailable
    }
  }

  const activeUrl = savedUrl.trim() || getDefaultWebhookUrl();

  return {
    webhookId: DEFAULT_WEBHOOK_ID,
    webhookUrl: activeUrl,
    model: "gpt-5-mini",
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    isCustomUrl: Boolean(savedUrl.trim()),
    mode: savedMode,
  };
}

export function saveN8nConfig(config: Partial<{ webhookUrl: string; mode: "n8n-live" | "hybrid" | "offline-only" }>) {
  if (typeof window === "undefined") return;
  try {
    if (config.webhookUrl !== undefined) {
      if (config.webhookUrl.trim()) {
        localStorage.setItem(STORAGE_KEY_WEBHOOK, config.webhookUrl.trim());
      } else {
        localStorage.removeItem(STORAGE_KEY_WEBHOOK);
      }
    }
    if (config.mode !== undefined) {
      localStorage.setItem(STORAGE_KEY_MODE, config.mode);
    }
  } catch {
    // Storage unavailable
  }
}

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return `sess-${Date.now()}`;
  try {
    let sid = sessionStorage.getItem(STORAGE_KEY_SESSION);
    if (!sid) {
      sid = `vv-${Math.random().toString(36).substring(2, 9)}-${Date.now().toString(36)}`;
      sessionStorage.setItem(STORAGE_KEY_SESSION, sid);
    }
    return sid;
  } catch {
    return `sess-${Date.now()}`;
  }
}

export function resetN8nSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY_SESSION);
  } catch {
    // Storage unavailable
  }
}

/**
 * Sends a chat message to the configured n8n LangChain Agent workflow.
 */
export async function sendChatMessageToN8n(
  message: string,
  options?: {
    webhookUrl?: string;
    sessionId?: string;
    timeoutMs?: number;
  }
): Promise<N8nChatResponse> {
  const config = getN8nConfig();
  const targetUrl = options?.webhookUrl || config.webhookUrl;
  const sessionId = options?.sessionId || getOrCreateSessionId();
  const timeoutMs = options?.timeoutMs ?? 20000;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Standard n8n LangChain chatTrigger request body
    const payload = {
      action: "sendMessage",
      chatInput: message,
      message: message, // compat with webhook triggers
      sessionId: sessionId,
      metadata: {
        source: "VidyaVerse Web App",
        modelRequested: "gpt-5-mini",
        systemPrompt: DEFAULT_SYSTEM_PROMPT,
      },
    };

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      return {
        success: false,
        text: `n8n webhook responded with status ${response.status}: ${errText.slice(0, 150)}`,
        sessionId,
        model: "gpt-5-mini",
        error: `HTTP ${response.status}`,
      };
    }

    const contentType = response.headers.get("content-type") || "";
    let replyText = "";

    if (contentType.includes("application/json")) {
      const data = await response.json();
      // Inspect known n8n chat output keys
      replyText =
        data.output ??
        data.response ??
        data.text ??
        data.message ??
        (Array.isArray(data) && data[0]?.output) ??
        (typeof data === "string" ? data : JSON.stringify(data));
    } else {
      replyText = await response.text();
    }

    if (!replyText || typeof replyText !== "string") {
      replyText = "Received empty response from n8n AI Agent.";
    }

    return {
      success: true,
      text: replyText.trim(),
      sessionId,
      model: "gpt-5-mini",
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    const isTimeout = err?.name === "AbortError";
    const errorMessage = isTimeout
      ? "Connection timed out waiting for n8n AI Agent response."
      : `Failed to reach n8n webhook: ${err?.message || "Make sure your n8n workflow is active and CORS is permitted."}`;

    return {
      success: false,
      text: errorMessage,
      sessionId,
      model: "gpt-5-mini",
      error: errorMessage,
    };
  }
}

/**
 * Pings / tests an n8n webhook endpoint with a test prompt.
 */
export async function testN8nConnection(webhookUrl: string): Promise<{ ok: boolean; message: string; latencyMs: number }> {
  const startTime = Date.now();
  const testResponse = await sendChatMessageToN8n("Hello! Test connection.", {
    webhookUrl,
    timeoutMs: 10000,
  });
  const latencyMs = Date.now() - startTime;

  if (testResponse.success) {
    return {
      ok: true,
      message: `Connected successfully! (Responded in ${latencyMs}ms)`,
      latencyMs,
    };
  }

  return {
    ok: false,
    message: testResponse.error || "Could not connect to n8n webhook.",
    latencyMs,
  };
}
