import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { classrooms, demoStudent, learningPacks, lessons } from "@/data/demo";
import { safeStorage } from "@/lib/persistence/storage";
import {
  simulateHubSync,
  validateAndClampXp,
  createQueueItem,
  type SyncQueueItem,
  type SyncEventType,
} from "@/lib/services/sync-service";
import { SITE_CONFIG } from "@/config/site";
import type {
  Lang,
  UserRole,
  NetworkMode,
  EffectiveNetworkState,
  DownloadState,
  StudentProject,
  DemoState,
  AchievementId,
} from "@/types";

export type {
  Lang,
  UserRole,
  NetworkMode,
  EffectiveNetworkState,
  DownloadState,
  StudentProject,
  DemoState,
  AchievementId,
};

const initialProjects: StudentProject[] = [
  {
    id: "proj-1",
    title: "Dual-Switch Emergency Lantern Circuit",
    category: "Electronics",
    date: "8 Oct 2026",
    status: "completed",
    xpEarned: 120,
    description: "Designed in CircuitVerse: Parallel switch setup with an LED array and a 9V battery emulator for rural night-study.",
    skills: ["Ohm's Law", "Parallel Circuits", "LED Polarities"],
  },
  {
    id: "proj-2",
    title: "Automatic Crop Irrigation Maze Logic",
    category: "Coding",
    date: "4 Oct 2026",
    status: "completed",
    xpEarned: 150,
    description: "Built in CodeVerse: Step-by-step block sequence guiding an autonomous water sprinkler robot around field obstacles.",
    skills: ["Loops", "Conditional Logic", "Pathfinding"],
  },
  {
    id: "proj-3",
    title: "Deccan Plateau Soil & Water Filtration Model",
    category: "Science",
    date: "1 Oct 2026",
    status: "submitted",
    xpEarned: 90,
    description: "Physical PlayLab eco-experiment using gravel, charcoal, and sand layers to test river water purification.",
    skills: ["Ecosystems", "Sedimentation", "Data Logging"],
  },
];

const initialSyncQueue: SyncQueueItem[] = [
  {
    id: "evt-init-01",
    type: "lesson_completed",
    entityId: "decimals-place-value",
    title: "Decimals & Place Value",
    xpEarned: 25,
    timestamp: "2026-10-11T07:15:00.000Z",
    status: "synced",
    retryCount: 0,
  },
  {
    id: "evt-init-02",
    type: "quiz_score",
    entityId: "decimals-quiz",
    title: "Decimals Practice Quiz Score",
    xpEarned: 50,
    timestamp: "2026-10-12T05:00:00.000Z",
    status: "pending",
    retryCount: 0,
  },
  {
    id: "evt-init-03",
    type: "activity_xp",
    entityId: "circuit-parallel-basic",
    title: "CircuitVerse: Dual-Switch Lantern Lab",
    xpEarned: 35,
    timestamp: "2026-10-12T08:30:00.000Z",
    status: "pending",
    retryCount: 0,
  },
];

const initial: DemoState = {
  role: "student",
  theme: "light",
  networkMode: "online",
  pendingSyncCount: 2,
  lastSyncTime: "11 Oct 2026, 12:45 PM",
  xp: demoStudent.startingXp,
  sparks: 350, // Spendable bazaar tokens
  weeklyXp: 260,
  completed: ["decimals-place-value"],
  completedActivities: [],
  joined: ["SCI7B"],
  unlocked: ["first-lesson"],
  downloads: { "pack-math7": "saved", "pack-sci7": "saved", "pack-circuit": "none", "pack-sst7": "none" },
  language: "en",
  reducedMotion: false,
  largeText: false,
  notifyAssignments: true,
  notifyStreak: true,
  wifiOnlyDownloads: true,
  redeemedItems: ["Solar Torch Badge"],
  completedChallenges: ["daily-fractions-1"],
  projects: initialProjects,
  syncQueue: initialSyncQueue,
};

export const XP_PER_LEVEL = 250;
export const levelFor = (xp: number) => Math.floor(xp / XP_PER_LEVEL) + 1;

export interface DemoContextValue extends DemoState {
  level: number;
  isSyncing: boolean;
  effectiveNetworkState: EffectiveNetworkState;
  addXp: (amount: number, reason: string) => void;
  awardActivityXp: (activityId: string, amount: number, reason: string) => boolean;
  completeLesson: (id: string) => void;
  unlock: (id: AchievementId) => void;
  joinClass: (code: string) => { ok: boolean; message: string };
  leaveClass: (code: string) => void;
  startDownload: (id: string) => void;
  removeDownload: (id: string) => void;
  syncNow: (simulateFailure?: boolean) => Promise<{ success: boolean; message: string }>;
  redeemItem: (name: string, cost: number) => { ok: boolean; message: string };
  completeChallenge: (id: string, xpReward: number, title: string) => void;
  addProject: (project: Omit<StudentProject, "id" | "date">) => void;
  set: <K extends keyof DemoState>(k: K, v: DemoState[K]) => void;
  resetDemo: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(initial);
  const [loaded, setLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const saved = safeStorage.getItem<DemoState | null>(SITE_CONFIG.storageKeys.demoState, null);
    if (saved) {
      const restoredQueue = saved.syncQueue ?? initialSyncQueue;
      setState({
        ...initial,
        ...saved,
        syncQueue: restoredQueue,
        pendingSyncCount: restoredQueue.filter((i) => i.status === "pending" || i.status === "failed").length,
      });
    }
    setLoaded(true);
  }, []);

  // Listen for browser online / offline state changes
  useEffect(() => {
    const handleOnline = () => {
      setState((s) => ({ ...s, networkMode: "online" }));
      toast.info("Connection Restored", {
        description: "Back online. School hub synchronization available.",
      });
    };
    const handleOffline = () => {
      setState((s) => ({ ...s, networkMode: "offline" }));
      toast.warning("Offline Mode Active", {
        description: "Working offline. Learning progress is safely stored and queued on device.",
      });
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const persist = {
      ...state,
      downloads: Object.fromEntries(
        Object.entries(state.downloads).map(([k, v]) => [k, v === "downloading" ? "none" : v])
      ),
    };
    safeStorage.setItem(SITE_CONFIG.storageKeys.demoState, persist);

    // Apply document styling & accessibility classes
    document.documentElement.classList.toggle("light", state.theme === "light");
    document.documentElement.classList.toggle("dark", state.theme === "dark");
    document.documentElement.classList.toggle("reduce-motion", state.reducedMotion);
    document.documentElement.classList.toggle("large-text", state.largeText);
    document.documentElement.lang = state.language;
  }, [state, loaded]);

  const effectiveNetworkState: EffectiveNetworkState = useMemo(() => {
    if (isSyncing) return "syncing";
    if (state.networkMode === "offline") return "offline";
    const pendingItems = state.syncQueue.filter((i) => i.status === "pending" || i.status === "failed").length;
    if (pendingItems > 0) return "sync_needed";
    return "online";
  }, [isSyncing, state.networkMode, state.syncQueue]);

  const unlock = useCallback((id: AchievementId) => {
    setState((s) => {
      if (s.unlocked.includes(id)) return s;
      toast.success("Achievement Unlocked!", { description: id.replace(/-/g, " ") });
      return { ...s, unlocked: [...s.unlocked, id] };
    });
  }, []);

  const addXp = useCallback((amount: number, reason: string) => {
    setState((s) => ({
      ...s,
      xp: s.xp + amount,
      sparks: s.sparks + Math.floor(amount / 2),
      weeklyXp: s.weeklyXp + amount,
    }));
    toast.success(`+${amount} XP Awarded`, { description: reason });
  }, []);

  const awardActivityXp = useCallback((activityId: string, amount: number, reason: string) => {
    let newlyAwarded = false;
    setState((s) => {
      if (s.completedActivities.includes(activityId)) {
        return s;
      }
      newlyAwarded = true;
      const clampedAmount = validateAndClampXp("activity_xp", amount);
      const sparksBonus = Math.floor(clampedAmount / 2);
      const queueItem = createQueueItem("activity_xp", activityId, reason, clampedAmount);
      const newQueue = [...s.syncQueue, queueItem];

      return {
        ...s,
        completedActivities: [...s.completedActivities, activityId],
        xp: s.xp + clampedAmount,
        sparks: s.sparks + sparksBonus,
        weeklyXp: s.weeklyXp + clampedAmount,
        syncQueue: newQueue,
        pendingSyncCount: newQueue.filter((i) => i.status === "pending" || i.status === "failed").length,
      };
    });
    if (newlyAwarded) {
      toast.success(`+${amount} XP Earned!`, { description: reason });
    }
    return newlyAwarded;
  }, []);

  const completeLesson = useCallback(
    (id: string) => {
      setState((s) => {
        if (s.completed.includes(id)) return s;
        const targetLesson = lessons.find((l) => l.id === id);
        const title = targetLesson ? targetLesson.title : id;
        const clampedAmount = validateAndClampXp("lesson_completed", 25);
        const queueItem = createQueueItem("lesson_completed", id, title, clampedAmount);
        const newQueue = [...s.syncQueue, queueItem];

        return {
          ...s,
          completed: [...s.completed, id],
          xp: s.xp + clampedAmount,
          sparks: s.sparks + 15,
          weeklyXp: s.weeklyXp + clampedAmount,
          syncQueue: newQueue,
          pendingSyncCount: newQueue.filter((i) => i.status === "pending" || i.status === "failed").length,
        };
      });
      toast.success("+25 XP", { description: "Lesson completed and queued for school hub sync" });
      unlock("first-lesson");
    },
    [unlock]
  );

  const syncNow = useCallback(
    async (simulateFailure = false) => {
      setIsSyncing(true);
      try {
        const result = await simulateHubSync({
          studentId: "student-ananya-01",
          timestamp: new Date().toISOString(),
          pendingCount: state.syncQueue.filter((i) => i.status === "pending" || i.status === "failed").length,
          queue: state.syncQueue,
          completedLessons: state.completed,
          xp: state.xp,
          simulateFailure,
        });

        if (result.success) {
          setState((s) => ({
            ...s,
            syncQueue: result.reconciledQueue,
            pendingSyncCount: 0,
            lastSyncTime: result.syncTimestamp,
          }));
          toast.success("School Mesh Synchronized", {
            description: result.message,
          });
          return { success: true, message: result.message };
        } else {
          // Preserve local work if synchronization fails!
          setState((s) => ({
            ...s,
            syncQueue: result.reconciledQueue,
            pendingSyncCount: result.reconciledQueue.filter((i) => i.status === "pending" || i.status === "failed").length,
          }));
          toast.error("School Hub Offline", {
            description: result.message,
          });
          return { success: false, message: result.message };
        }
      } finally {
        setIsSyncing(false);
      }
    },
    [state.syncQueue, state.completed, state.xp]
  );

  const redeemItem = useCallback((name: string, cost: number) => {
    let result = { ok: false, message: "" };
    setState((s) => {
      if (s.redeemedItems.includes(name)) {
        result = { ok: false, message: "You already redeemed this item!" };
        return s;
      }
      if (s.sparks < cost) {
        result = { ok: false, message: `Need ${cost - s.sparks} more Sparks to redeem.` };
        return s;
      }
      result = { ok: true, message: `Successfully claimed ${name}!` };
      return {
        ...s,
        sparks: s.sparks - cost,
        redeemedItems: [...s.redeemedItems, name],
      };
    });
    return result;
  }, []);

  const completeChallenge = useCallback(
    (id: string, xpReward: number, title: string) => {
      setState((s) => {
        if (s.completedChallenges.includes(id)) {
          toast.info("Challenge already completed");
          return s;
        }
        const clampedReward = validateAndClampXp("challenge_completed", xpReward);
        const queueItem = createQueueItem("challenge_completed", id, title, clampedReward);
        const newQueue = [...s.syncQueue, queueItem];

        toast.success(`Challenge Completed: +${clampedReward} XP`, { description: title });
        return {
          ...s,
          completedChallenges: [...s.completedChallenges, id],
          xp: s.xp + clampedReward,
          sparks: s.sparks + Math.floor(clampedReward / 2),
          weeklyXp: s.weeklyXp + clampedReward,
          syncQueue: newQueue,
          pendingSyncCount: newQueue.filter((i) => i.status === "pending" || i.status === "failed").length,
        };
      });
    },
    []
  );

  const addProject = useCallback((project: Omit<StudentProject, "id" | "date">) => {
    const newProj: StudentProject = {
      ...project,
      id: `proj-${Date.now()}`,
      date: "Today",
    };
    const clampedReward = validateAndClampXp("project_submitted", 100);
    const queueItem = createQueueItem("project_submitted", newProj.id, project.title, clampedReward);

    setState((s) => {
      const newQueue = [...s.syncQueue, queueItem];
      return {
        ...s,
        projects: [newProj, ...s.projects],
        xp: s.xp + clampedReward,
        sparks: s.sparks + 50,
        syncQueue: newQueue,
        pendingSyncCount: newQueue.filter((i) => i.status === "pending" || i.status === "failed").length,
      };
    });
    toast.success("+100 XP", { description: `Project added to portfolio: ${project.title}` });
  }, []);

  const joinClass = useCallback(
    (raw: string) => {
      const code = raw.trim().toUpperCase();
      const c = classrooms.find((x) => x.code === code);
      if (!code) return { ok: false, message: "Enter a classroom code." };
      if (!c) return { ok: false, message: `No demo classroom uses "${code}". Try SCI7B, MATH7 or CODE1.` };
      let already = false;
      setState((s) => {
        if (s.joined.includes(code)) {
          already = true;
          return s;
        }
        return { ...s, joined: [...s.joined, code] };
      });
      if (already) return { ok: false, message: `You are already in ${c.name}.` };
      unlock("classmate");
      return { ok: true, message: `Joined ${c.name}.` };
    },
    [unlock]
  );

  const startDownload = useCallback((id: string) => {
    setState((s) => ({ ...s, downloads: { ...s.downloads, [id]: "downloading" } }));
    const pack = learningPacks.find((p) => p.id === id);
    const lesson = lessons.find((l) => l.id === id);
    const title = pack ? pack.name : lesson ? lesson.title : id;
    setTimeout(() => {
      setState((s) => (s.downloads[id] === "downloading" ? { ...s, downloads: { ...s.downloads, [id]: "saved" } } : s));
      toast.success("Download Complete", { description: `${title} is now cached and available offline.` });
    }, 1500);
  }, []);

  const value = useMemo<DemoContextValue>(
    () => ({
      ...state,
      level: levelFor(state.xp),
      isSyncing,
      effectiveNetworkState,
      addXp,
      awardActivityXp,
      completeLesson,
      unlock,
      joinClass,
      leaveClass: (code) => setState((s) => ({ ...s, joined: s.joined.filter((c) => c !== code) })),
      startDownload,
      removeDownload: (id) => {
        const pack = learningPacks.find((p) => p.id === id);
        const lesson = lessons.find((l) => l.id === id);
        const title = pack ? pack.name : lesson ? lesson.title : "Content";
        setState((s) => ({ ...s, downloads: { ...s.downloads, [id]: "none" } }));
        toast.info("Offline Cache Cleared", { description: `${title} removed from local storage.` });
      },
      syncNow,
      redeemItem,
      completeChallenge,
      addProject,
      set: (k, v) => setState((s) => ({ ...s, [k]: v })),
      resetDemo: () => {
        setState(initial);
        toast("Demo state reset to defaults");
      },
    }),
    [
      state,
      isSyncing,
      effectiveNetworkState,
      addXp,
      awardActivityXp,
      completeLesson,
      unlock,
      joinClass,
      startDownload,
      syncNow,
      redeemItem,
      completeChallenge,
      addProject,
    ]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used inside DemoProvider");
  return ctx;
}
