import React, { useState } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Bot, Sparkles, Send, X, ArrowUpRight, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getN8nConfig, sendChatMessageToN8n } from "@/services/n8n-tutor";

export function AiTutorFloatingBot() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [quickAnswer, setQuickAnswer] = useState<{ text: string; isFromAgent: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Don't render floating launcher if user is already on the dedicated AI tutor page
  if (pathname === "/tutor" || pathname.startsWith("/tutor/")) {
    return null;
  }

  const config = getN8nConfig();

  const handleQuickAsk = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = query.trim();
    if (!text) return;

    setIsLoading(true);
    setQuickAnswer(null);

    try {
      if (config.mode !== "offline-only") {
        const res = await sendChatMessageToN8n(text, { timeoutMs: 12000 });
        if (res.success) {
          setQuickAnswer({ text: res.text, isFromAgent: true });
          setIsLoading(false);
          return;
        }
      }

      // Quick fallback if n8n is offline
      setQuickAnswer({
        text: `Concept Hint for "${text}": In science and mathematics, breaking down the problem into smaller parts and checking conservation helps find the answer! Open the full AI Tutor for step-by-step guidance.`,
        isFromAgent: false,
      });
    } catch {
      setQuickAnswer({
        text: `Open the full AI Tutor page for comprehensive step-by-step explanations and village analogies.`,
        isFromAgent: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openFullTutorWithQuery = (prefill?: string) => {
    const q = (prefill || query).trim();
    setIsOpen(false);
    setQuickAnswer(null);
    setQuery("");
    if (q) {
      void navigate({
        to: "/tutor",
        search: { q },
      });
    } else {
      void navigate({
        to: "/tutor",
      });
    }
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 select-none">
      {/* Floating Card Popup */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-border bg-card/95 backdrop-blur-xl p-4 shadow-2xl text-card-foreground transition-all duration-200 animate-in fade-in slide-in-from-bottom-5">
          {/* Card Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border/70">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-[#EAE7FF] flex items-center justify-center text-[#6541F5] shadow-xs">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-foreground flex items-center gap-1.5">
                  AI Tutor Assistant
                  <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] px-1.5 py-0 font-bold">
                    <Zap className="h-2.5 w-2.5 mr-0.5 fill-current" />
                    GPT-5 Mini
                  </Badge>
                </h4>
                <p className="text-[10px] text-muted-foreground">n8n Agent Workflow Connected</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              aria-label="Close floating AI tutor"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Chat Body */}
          <div className="py-3 space-y-2.5">
            {quickAnswer ? (
              <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span className="font-bold text-[#6541F5] flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    {quickAnswer.isFromAgent ? "n8n AI Agent Response" : "Quick Tutor Hint"}
                  </span>
                </div>
                <p className="text-xs text-foreground leading-relaxed line-clamp-4">
                  {quickAnswer.text}
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openFullTutorWithQuery(query)}
                    className="h-7 text-[11px] font-bold text-[#6541F5] hover:bg-[#6541F5]/10 border-[#6541F5]/30 cursor-pointer"
                  >
                    Continue in AI Studio <ArrowUpRight className="h-3 w-3 ml-1" />
                  </Button>
                  <button
                    onClick={() => setQuickAnswer(null)}
                    className="text-[10px] text-muted-foreground hover:underline cursor-pointer"
                  >
                    Ask another
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs text-muted-foreground leading-snug">
                  Got a doubt in science, math, or circuits? Ask the n8n-powered tutor bot:
                </p>

                <form onSubmit={handleQuickAsk} className="flex gap-1.5">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="E.g. Why is 1/2 + 1/3 not 2/5?"
                    className="h-9 text-xs"
                    disabled={isLoading}
                    autoFocus
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isLoading || !query.trim()}
                    className="h-9 w-9 shrink-0 p-0 rounded-xl bg-[#6541F5] hover:bg-[#5230E8] text-white shadow-xs cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </form>

                {/* Quick Suggestion Chips */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {[
                    "Why 1/2 + 1/3 ≠ 2/5?",
                    "How does switch work?",
                    "What is Ohm's law?",
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => {
                        setQuery(chip);
                        void openFullTutorWithQuery(chip);
                      }}
                      className="rounded-lg border border-border bg-muted/30 px-2 py-0.5 text-[10px] font-medium text-foreground hover:border-[#6541F5] hover:text-[#6541F5] transition-colors cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Card Footer: Link to Full Studio */}
          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-[#19B99A]" /> NCERT Grounded
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => openFullTutorWithQuery()}
              className="h-7 text-xs font-bold text-[#6541F5] hover:text-[#5230E8] p-0 hover:bg-transparent cursor-pointer"
            >
              Open Full AI Studio <ArrowUpRight className="h-3.5 w-3.5 ml-0.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="group relative flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6541F5] via-[#7C5CFA] to-[#42A5E8] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer ring-4 ring-[#6541F5]/20"
        title="Open AI Tutor (n8n Agent · GPT-5 Mini)"
        aria-label="Toggle AI Tutor Assistant"
      >
        {/* Pulsing Aura Dot */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#19B99A] opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#19B99A] border-2 border-background" />
        </span>

        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Bot className="h-6 w-6 text-white group-hover:rotate-12 transition-transform" />
        )}
      </button>
    </div>
  );
}
