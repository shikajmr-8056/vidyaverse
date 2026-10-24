import { createFileRoute } from "@tanstack/react-router";
import { AuthView } from "@/features/auth";

export const Route = createFileRoute("/auth")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { role?: string | undefined; mode?: string | undefined } => ({
    role: typeof search["role"] === "string" ? search["role"] : undefined,
    mode: typeof search["mode"] === "string" ? search["mode"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Portal Sign In & Authorization · VidyaVerse" },
      {
        name: "description",
        content: "Dedicated portal sign-in and onboarding for students, teachers, and guardians.",
      },
      { property: "og:title", content: "Portal Sign In & Authorization · VidyaVerse" },
      {
        property: "og:description",
        content: "Dedicated portal sign-in and onboarding for students, teachers, and guardians.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  return <AuthView />;
}
