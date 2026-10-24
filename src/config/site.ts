import type { Lang } from "@/types";

export const SITE_CONFIG = {
  name: "VidyaVerse",
  tagline: "Gamified, offline-first learning platform for rural and underserved students",
  version: "v2.4 Demo",
  schoolHub: "Kalyan School Hub",
  defaultLanguage: "en" as Lang,
  languages: [
    { code: "en", label: "English", localName: "English" },
    { code: "hi", label: "Hindi", localName: "हिन्दी" },
    { code: "kn", label: "Kannada", localName: "ಕನ್ನಡ" },
  ] as const,
  storageKeys: {
    demoState: "vidyaverse_demo_state_v2",
    offlineQueue: "vidyaverse_offline_queue_v2",
  },
  routes: {
    home: "/",
    dashboard: "/dashboard",
    learn: "/learn",
    playlab: "/playlab",
    circuitverse: "/circuitverse",
    codeverse: "/codeverse",
    tutor: "/tutor",
    voice: "/voice",
    mesh: "/mesh",
    classrooms: "/classrooms",
    challenges: "/challenges",
    leaderboard: "/leaderboard",
    progress: "/progress",
    projects: "/projects",
    rewards: "/rewards",
    downloads: "/downloads",
    teacher: "/teacher",
    parent: "/parent",
    settings: "/settings",
  },
} as const;
