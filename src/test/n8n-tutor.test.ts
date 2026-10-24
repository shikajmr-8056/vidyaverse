import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  DEFAULT_WEBHOOK_ID,
  DEFAULT_SYSTEM_PROMPT,
  getDefaultWebhookUrl,
  getN8nConfig,
  saveN8nConfig,
  sendChatMessageToN8n,
  testN8nConnection,
  getOrCreateSessionId,
  resetN8nSession,
} from "@/services/n8n-tutor";

// In-memory WebStorage mock for Vitest Node environment
const createMockStorage = () => {
  const store = new Map<string, string>();
  return {
    getItem: vi.fn((k: string) => store.get(k) ?? null),
    setItem: vi.fn((k: string, v: string) => {
      store.set(k, String(v));
    }),
    removeItem: vi.fn((k: string) => {
      store.delete(k);
    }),
    clear: vi.fn(() => {
      store.clear();
    }),
    get length() {
      return store.size;
    },
    key: vi.fn((i: number) => Array.from(store.keys())[i] ?? null),
  };
};

const mockLocalStorage = createMockStorage();
const mockSessionStorage = createMockStorage();

Object.defineProperty(globalThis, "localStorage", {
  value: mockLocalStorage,
  writable: true,
  configurable: true,
});

Object.defineProperty(globalThis, "sessionStorage", {
  value: mockSessionStorage,
  writable: true,
  configurable: true,
});

describe("n8n AI Agent Workflow Integration", () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    mockSessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("exposes default webhook ID and system prompt matching user n8n workflow", () => {
    expect(DEFAULT_WEBHOOK_ID).toBe("2025e060-0d48-4bd3-9bce-3f418ce83a7d");
    expect(DEFAULT_SYSTEM_PROMPT).toContain("You are a friendly, knowledgeable assistant");
    expect(DEFAULT_SYSTEM_PROMPT).toContain("Decline harmful or unsafe requests politely");
    expect(getDefaultWebhookUrl()).toContain("2025e060-0d48-4bd3-9bce-3f418ce83a7d");
  });

  it("persists custom n8n configuration in localStorage", () => {
    saveN8nConfig({
      webhookUrl: "https://my-school-n8n.cloud/webhook/2025e060-0d48-4bd3-9bce-3f418ce83a7d/chat",
      mode: "n8n-live",
    });

    const config = getN8nConfig();
    expect(config.webhookUrl).toBe("https://my-school-n8n.cloud/webhook/2025e060-0d48-4bd3-9bce-3f418ce83a7d/chat");
    expect(config.mode).toBe("n8n-live");
    expect(config.model).toBe("gpt-5-mini");
  });

  it("creates and maintains a consistent session ID for conversation memory", () => {
    const s1 = getOrCreateSessionId();
    const s2 = getOrCreateSessionId();
    expect(s1).toBe(s2);
    expect(s1.length).toBeGreaterThan(5);

    resetN8nSession();
    const s3 = getOrCreateSessionId();
    expect(s3).not.toBe(s1);
  });

  it("sends chat message and parses n8n LangChain output payload", async () => {
    const mockOutput = "Fractions represent parts of a whole divided into equal slices.";
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: () => "application/json",
      },
      json: async () => ({
        output: mockOutput,
        sessionId: "test-sess-123",
      }),
    } as any);

    const res = await sendChatMessageToN8n("What is a fraction?", {
      sessionId: "test-sess-123",
      webhookUrl: "http://localhost:5678/webhook/2025e060-0d48-4bd3-9bce-3f418ce83a7d/chat",
    });

    expect(res.success).toBe(true);
    expect(res.text).toBe(mockOutput);
    expect(res.model).toBe("gpt-5-mini");
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:5678/webhook/2025e060-0d48-4bd3-9bce-3f418ce83a7d/chat",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("What is a fraction?"),
      })
    );
  });

  it("handles webhook offline or network error with diagnostic error return", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Failed to fetch"));

    const res = await sendChatMessageToN8n("Hello");
    expect(res.success).toBe(false);
    expect(res.error).toBeDefined();
    expect(res.text).toContain("Failed to reach n8n webhook");
  });

  it("tests connection latency and success status", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: () => "application/json",
      },
      json: async () => ({
        output: "Hello! Ready to help.",
      }),
    } as any);

    const testRes = await testN8nConnection("http://localhost:5678/webhook/test");
    expect(testRes.ok).toBe(true);
    expect(testRes.latencyMs).toBeGreaterThanOrEqual(0);
    expect(testRes.message).toContain("Connected successfully");
  });
});
