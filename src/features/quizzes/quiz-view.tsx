import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Meter, Panel } from "@/components/vv/primitives";
import { useDemo } from "@/lib/demo-store";
import { cn } from "@/lib/utils";
import { scoreQuiz } from "@/lib/quiz";
import type { Quiz as QuizType, QuizQuestion } from "@/data/demo";

interface QuizViewProps {
  quiz: QuizType;
  quizId: string;
}

export function QuizView({ quiz, quizId }: QuizViewProps) {
  const d = useDemo();
  const qs = quiz.questions;
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => qs.map(() => null));
  const [submitted, setSubmitted] = useState<boolean[]>(() => qs.map(() => false));
  const [finished, setFinished] = useState(false);
  const q = qs[i]!;
  const pick = answers[i];
  const isSub = submitted[i];

  const reset = () => {
    setI(0);
    setAnswers(qs.map(() => null));
    setSubmitted(qs.map(() => false));
    setFinished(false);
  };

  if (finished) {
    const score = scoreQuiz(qs, answers);
    const wrong = qs.filter((x: QuizQuestion, k: number) => answers[k] !== x.correct);
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Panel>
          <p className="text-sm text-muted-foreground">{quiz.title} · result</p>
          <p className="mt-2 font-display text-4xl font-black text-[#6541F5]">{score} / {qs.length}</p>
          <p className="mt-2 font-medium">
            {score === qs.length
              ? "Full marks! You earned the Quiz Ace badge and completed your Daily Mission."
              : "Good effort. Review the topics below and try again."}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Scores are saved in offline device store and recorded with cryptographic timestamps.
          </p>
        </Panel>

        {wrong.length > 0 && (
          <Panel title="Revise these topics">
            <ul className="space-y-2 text-sm">
              {wrong.map((w: QuizQuestion) => (
                <li key={w.id} className="rounded-lg border border-border bg-card p-3">
                  <span className="font-bold text-foreground block">{w.topic}</span>
                  <span className="text-xs text-muted-foreground mt-0.5 block">{w.explanation}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/lesson/$id"
              params={{ id: quiz.lessonId }}
              className="mt-4 inline-block text-sm font-semibold text-[#6541F5] hover:underline"
            >
              Open lesson notes →
            </Link>
          </Panel>
        )}

        <div className="flex gap-3">
          <Button onClick={reset} variant="outline" className="text-xs font-semibold">
            <RotateCcw className="h-3.5 w-3.5 mr-1" /> Try again
          </Button>
          <Button asChild className="bg-[#6541F5] text-white hover:bg-[#5230E8] text-xs font-bold shadow-sm">
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{quiz.title}</p>
        <div className="mt-2 flex items-center gap-3">
          <Meter value={(submitted.filter(Boolean).length / qs.length) * 100} label="Quiz progress" tone="purple" />
          <span className="shrink-0 text-xs font-mono font-bold text-muted-foreground">{i + 1} / {qs.length}</span>
        </div>
      </div>

      <nav aria-label="Questions" className="flex gap-2">
        {qs.map((x: QuizQuestion, k: number) => (
          <button
            key={x.id}
            onClick={() => setI(k)}
            aria-current={k === i}
            aria-label={`Question ${k + 1}`}
            className={cn(
              "h-9 w-9 rounded-lg border text-xs font-bold transition-all",
              k === i && "border-[#6541F5] bg-[#6541F5] text-white shadow-sm",
              k !== i && submitted[k] && (answers[k] === x.correct ? "bg-[#DDF8EE] text-[#19B99A] border-[#19B99A]/40" : "bg-[#FCE5EB] text-[#E95778] border-[#E95778]/40"),
              k !== i && !submitted[k] && "border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            {k + 1}
          </button>
        ))}
      </nav>

      <Panel>
        <h1 className="text-base font-bold text-foreground leading-snug">{q.text}</h1>
        <div role="radiogroup" className="mt-5 space-y-2.5">
          {q.options.map((o: string, k: number) => {
            const state = isSub ? (k === q.correct ? "right" : k === pick ? "wrong" : "") : pick === k ? "picked" : "";
            return (
              <button
                key={o}
                role="radio"
                aria-checked={pick === k}
                disabled={isSub}
                onClick={() => setAnswers((a) => a.map((v, j) => (j === i ? k : v)))}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all",
                  state === "picked" && "border-[#6541F5] bg-[#EAE7FF]/40 text-[#5230E8] font-bold shadow-sm",
                  state === "right" && "border-[#19B99A] bg-[#DDF8EE] text-[#19B99A] font-bold",
                  state === "wrong" && "border-[#E95778] bg-[#FCE5EB] text-[#E95778] font-bold",
                  !state && !isSub && "border-border bg-card hover:bg-[#F4F3FD]/40 text-foreground"
                )}
              >
                <span>{o}</span>
                {state === "right" && <CheckCircle2 className="h-4 w-4 text-[#19B99A]" />}
                {state === "wrong" && <XCircle className="h-4 w-4 text-[#E95778]" />}
              </button>
            );
          })}
        </div>

        {isSub && (
          <div
            className={cn(
              "mt-4 rounded-xl p-3.5 text-xs",
              pick === q.correct ? "bg-[#DDF8EE] border border-[#19B99A]/40 text-[#19B99A]" : "bg-[#FCE5EB] border border-[#E95778]/40 text-[#E95778]"
            )}
            role="status"
          >
            <p className="font-bold">{pick === q.correct ? "Correct! 🎯" : "Not quite"}</p>
            <p className="mt-1 text-foreground leading-relaxed">{q.explanation}</p>
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2.5">
          {!isSub ? (
            <Button
              disabled={pick === null}
              onClick={() => setSubmitted((s) => s.map((v, j) => (j === i ? true : v)))}
              className="bg-[#6541F5] text-white hover:bg-[#5230E8] font-bold text-xs"
            >
              Submit answer
            </Button>
          ) : i < qs.length - 1 ? (
            <Button onClick={() => setI(i + 1)} className="bg-[#6541F5] text-white hover:bg-[#5230E8] font-bold text-xs">
              Next question <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          ) : (
            <Button
              disabled={submitted.some((s) => !s)}
              onClick={() => {
                setFinished(true);
                const score = scoreQuiz(qs, answers);
                const xpAmount = score * 10 + (score === qs.length ? 50 : 0);
                d.awardActivityXp(`quiz-${quizId}`, xpAmount, `${quiz.title}: ${score}/${qs.length}`);
                if (score === qs.length) {
                  d.unlock("quiz-ace");
                  if (quizId === "fractions") {
                    d.completeChallenge("daily-fractions-1", 50, "Fractions Practice Quiz Perfect Score");
                    d.completeChallenge("daily-goal-fractions", 50, "Daily Fractions Practice Checkpoint");
                  }
                }
              }}
              className="bg-[#19B99A] text-white hover:bg-[#19B99A]/90 font-bold text-xs shadow-sm"
            >
              See results
            </Button>
          )}
        </div>
        {isSub && i === qs.length - 1 && submitted.some((s) => !s) && (
          <p className="mt-2 text-right text-xs text-muted-foreground">Answer every question to see results.</p>
        )}
      </Panel>
    </div>
  );
}
