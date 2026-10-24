import { useState } from "react";
import {
  Network,
  RefreshCw,
  Server,
  Laptop,
  Radio,
  HardDrive,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Wifi,
  WifiOff,
  ShieldCheck,
  CalendarClock,
  Database,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader, Panel } from "@/components/vv/primitives";
import { useDemo, type NetworkMode } from "@/lib/demo-store";
import { MAX_ALLOWED_XP } from "@/lib/services/sync-service";

export function OfflineSyncView() {
  const d = useDemo();
  const [testingTimeout, setTestingTimeout] = useState(false);

  const connectedNodes = [
    {
      id: "node-hub",
      name: "Kalyan School Micro-Server",
      role: "Primary Hub (Local Cache)",
      status: "Active",
      ip: "192.168.4.1",
      latency: "2ms",
      color: "#6541F5",
      bg: "#EAE7FF",
    },
    {
      id: "node-1",
      name: "Ananya's Tablet (This Device)",
      role: "Class 7 Student",
      status: "Active Peer",
      ip: "192.168.4.15",
      latency: "4ms",
      color: "#42A5E8",
      bg: "#DDF2FC",
    },
    {
      id: "node-2",
      name: "Ravi's Laptop",
      role: "Class 7 Student",
      status: "Mesh Relay",
      ip: "192.168.4.22",
      latency: "7ms",
      color: "#19B99A",
      bg: "#DDF8EE",
    },
    {
      id: "node-3",
      name: "Teacher Priya's Terminal",
      role: "Classroom Master",
      status: "Active Peer",
      ip: "192.168.4.2",
      latency: "3ms",
      color: "#F5A623",
      bg: "#FFF0D5",
    },
  ];

  const handleTriggerSync = async (simulateFailure = false) => {
    if (simulateFailure) setTestingTimeout(true);
    await d.syncNow(simulateFailure);
    if (simulateFailure) setTestingTimeout(false);
  };

  const networkStateMeta = {
    syncing: {
      title: "Syncing",
      badge: "bg-[#EAE7FF] text-[#6541F5] border-[#6541F5]/40",
      description: "Transmitting pending learning packets to Kalyan School Hub...",
      icon: RefreshCw,
      color: "#6541F5",
    },
    sync_needed: {
      title: "Sync Needed",
      badge: "bg-[#FFF0D5] text-[#F5A623] border-[#F5A623]/40",
      description: `${d.pendingSyncCount} offline activities queued on device awaiting school hub connection.`,
      icon: Clock,
      color: "#F5A623",
    },
    offline: {
      title: "Offline",
      badge: "bg-muted text-muted-foreground border-border",
      description: "Device operating autonomously from local storage cache. All lessons and quizzes active.",
      icon: WifiOff,
      color: "#77778D",
    },
    online: {
      title: "Online",
      badge: "bg-[#DDF8EE] text-[#19B99A] border-[#19B99A]/40",
      description: "Direct connection established. Local outbox queue is fully synchronized.",
      icon: Wifi,
      color: "#19B99A",
    },
  };

  const currentNetworkMeta = networkStateMeta[d.effectiveNetworkState] || networkStateMeta.online;
  const NetworkIcon = currentNetworkMeta.icon;

  const pendingCount = d.syncQueue.filter((i) => i.status === "pending").length;
  const failedCount = d.syncQueue.filter((i) => i.status === "failed").length;
  const syncedCount = d.syncQueue.filter((i) => i.status === "synced").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Offline-First Learning & Outbox Sync Hub"
        description="Autonomous on-device storage with tamper-resistant event queues, late-sync competition protection, and peer micro-mesh synchronization."
        eyebrow={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DDF8EE] px-3 py-1 text-xs font-bold text-[#19B99A]">
            <Network className="h-3 w-3" /> Resilient Local Data Lifecycle
          </span>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => void handleTriggerSync(true)}
              disabled={d.isSyncing || testingTimeout}
              variant="outline"
              size="sm"
              className="text-xs font-semibold border-destructive/40 text-destructive hover:bg-destructive/10"
            >
              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
              Test Network Loss &amp; Retry
            </Button>
            <Button
              onClick={() => void handleTriggerSync(false)}
              disabled={d.isSyncing}
              size="sm"
              className="bg-[#6541F5] text-white hover:bg-[#5230E8] font-bold text-xs shadow-sm"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${d.isSyncing ? "animate-spin" : ""}`} />
              {d.isSyncing ? "Synchronizing Queue..." : "Sync With School Hub"}
            </Button>
          </div>
        }
      />

      {/* 1. Network States Overview Banner */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Effective Network State */}
        <div className="card-surface p-4.5 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Network State</span>
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${currentNetworkMeta.color}20`, color: currentNetworkMeta.color }}
            >
              <NetworkIcon className={`h-3.5 w-3.5 ${d.isSyncing ? "animate-spin" : ""}`} />
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xl font-black text-foreground">{currentNetworkMeta.title}</span>
            <Badge variant="outline" className={`text-[10px] font-bold uppercase ${currentNetworkMeta.badge}`}>
              Active
            </Badge>
          </div>
          <p className="mt-2 text-[11px] font-medium text-muted-foreground line-clamp-2">
            {currentNetworkMeta.description}
          </p>
        </div>

        {/* Last Hub Sync */}
        <div className="card-surface p-4.5 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Last Successful Sync</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#DDF8EE] text-[#19B99A]">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="text-sm font-bold text-foreground mt-2 truncate">{d.lastSyncTime}</div>
          <p className="mt-2 text-[11px] font-semibold text-[#19B99A]">Kalyan School Micro-Server</p>
        </div>

        {/* Pending Sync Outbox */}
        <div className="card-surface p-4.5 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Outbox Queue Items</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFF0D5] text-[#F5A623]">
              <Server className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="text-2xl font-black text-foreground mt-2">
            {d.pendingSyncCount}{" "}
            <span className="text-xs font-normal text-muted-foreground">pending retry</span>
          </div>
          <div className="mt-2 flex gap-2 text-[10px] font-medium">
            <span className="text-[#F5A623]">{pendingCount} pending</span>
            {failedCount > 0 && <span className="text-destructive font-bold">{failedCount} failed</span>}
            <span className="text-[#19B99A]">{syncedCount} synced</span>
          </div>
        </div>

        {/* Persistence Architecture */}
        <div className="card-surface p-4.5 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Local Storage Layer</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#DDF2FC] text-[#42A5E8]">
              <Database className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="text-sm font-bold text-foreground mt-2">safeStorage Engine</div>
          <p className="mt-2 text-[11px] font-semibold text-[#42A5E8]">
            LocalStorage + Memory Fallback
          </p>
        </div>
      </div>

      {/* 2. Interactive Network Simulator & Outbox Queue */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Outbox Sync Queue (Real Events) */}
        <div className="lg:col-span-8 space-y-4">
          <Panel
            title={
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Server className="h-4 w-4 text-[#6541F5]" /> Local Outbox Event Queue ({d.syncQueue.length} records)
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  Idempotent UUID tracking
                </span>
              </div>
            }
          >
            <div className="space-y-3">
              {d.syncQueue.map((item) => {
                const isSynced = item.status === "synced";
                const isFailed = item.status === "failed";
                const isPending = item.status === "pending";

                const dateFormatted = new Date(item.timestamp).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                });

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border text-xs transition-colors ${
                      isFailed
                        ? "bg-destructive/5 border-destructive/40"
                        : isSynced
                        ? "bg-card/60 border-border"
                        : "bg-[#FFF0D5]/20 border-[#F5A623]/40"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                          {item.id}
                        </span>
                        <span className="font-bold text-foreground text-sm">{item.title}</span>
                      </div>

                      <div>
                        {isSynced && (
                          <Badge className="bg-[#DDF8EE] text-[#19B99A] border-[#19B99A]/40 text-[10px] font-bold">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Synced ✓
                          </Badge>
                        )}
                        {isPending && (
                          <Badge className="bg-[#FFF0D5] text-[#F5A623] border-[#F5A623]/40 text-[10px] font-bold">
                            <Clock className="h-3 w-3 mr-1" /> Pending Hub Sync
                          </Badge>
                        )}
                        {isFailed && (
                          <Badge className="bg-destructive/15 text-destructive border-destructive/40 text-[10px] font-bold">
                            <AlertTriangle className="h-3 w-3 mr-1" /> Sync Dropped (Retry #{item.retryCount})
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 mt-2 text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span>Type: <strong className="text-foreground capitalize">{item.type.replace(/_/g, " ")}</strong></span>
                        <span>•</span>
                        <span>Recorded: {dateFormatted}</span>
                      </div>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="font-bold text-[#6541F5] dark:text-[#7C5CFA]">
                          +{item.xpEarned} XP (Clamped)
                        </span>
                        {item.retryCount > 0 && (
                          <span className="text-destructive text-[10px]">
                            {item.retryCount} retry attempts
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          {/* Network Switcher Sandbox */}
          <Panel title="Network Simulation Sandbox">
            <p className="text-xs text-muted-foreground mb-3">
              Switch connectivity mode to test how VidyaVerse seamlessly transitions between online, mesh, and offline states without interrupting study:
            </p>
            <div className="grid sm:grid-cols-3 gap-2.5">
              {(["online", "mesh", "offline"] as NetworkMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => d.set("networkMode", mode)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    d.networkMode === mode
                      ? "border-[#6541F5] bg-[#EAE7FF]/40 text-[#5230E8] font-bold shadow-xs"
                      : "border-border bg-card hover:bg-muted/30 text-muted-foreground"
                  }`}
                >
                  <div className="text-xs font-bold capitalize flex items-center justify-between">
                    <span>{mode === "online" ? "Cloud Online" : mode === "mesh" ? "School Mesh" : "Autonomous Offline"}</span>
                    {d.networkMode === mode && <CheckCircle2 className="h-3.5 w-3.5 text-[#6541F5]" />}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 block">
                    {mode === "online"
                      ? "Direct internet to cloud"
                      : mode === "mesh"
                      ? "Local Wi-Fi Direct hub"
                      : "No connection; queues local events"}
                  </span>
                </button>
              ))}
            </div>
          </Panel>
        </div>

        {/* Right Column: Policies & Verification */}
        <div className="lg:col-span-4 space-y-6">
          {/* Transparent Late-Sync Competition Policy */}
          <Panel
            title={
              <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <CalendarClock className="h-4 w-4 text-[#F5A623]" /> Late-Sync Competition Policy
              </span>
            }
          >
            <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
              <div className="p-3 rounded-xl border border-border bg-muted/20">
                <strong className="text-foreground block text-xs mb-1">
                  72-Hour Grace Period Window
                </strong>
                <p className="text-[11px]">
                  Activities finished offline over the weekend are held with ISO local timestamps. If synced within 72 hours of cycle cutoff, points retroactively apply to that week's cup.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-border bg-muted/20">
                <strong className="text-foreground block text-xs mb-1">
                  Lifetime XP is Permanent &amp; Monotonic
                </strong>
                <p className="text-[11px]">
                  Weekly cups cycle every Sunday night, but <strong>Lifetime XP is NEVER reset</strong>. Even if a sync occurs past 72 hours, 100% of earned XP is credited to Lifetime level progress.
                </p>
              </div>
            </div>
          </Panel>

          {/* Anti-Tampering XP Bounds Table */}
          <Panel
            title={
              <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#19B99A]" /> Anti-Spoofing XP Validation
              </span>
            }
          >
            <p className="text-xs text-muted-foreground mb-3">
              Client-supplied XP is strictly validated and clamped against maximum permitted thresholds:
            </p>
            <div className="space-y-1.5 font-mono text-xs">
              {Object.entries(MAX_ALLOWED_XP).map(([type, max]) => (
                <div key={type} className="flex justify-between p-2 rounded-lg bg-muted/30 border border-border">
                  <span className="capitalize text-muted-foreground">{type.replace(/_/g, " ")}:</span>
                  <span className="font-bold text-foreground">max {max} XP</span>
                </div>
              ))}
            </div>
          </Panel>

          {/* Genuine vs Simulated Implementation Transparency */}
          <Panel
            title={
              <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <Info className="h-4 w-4 text-[#42A5E8]" /> Implementation Architecture Reality
              </span>
            }
          >
            <div className="space-y-2.5 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="text-[#19B99A] font-bold">✓ Genuinely Implemented:</span>
              </div>
              <p className="text-[11px] pl-4">
                - safeStorage (LocalStorage + Memory fallback)<br />
                - Outbox queue with unique event IDs<br />
                - Anti-tampering XP bounds clamping<br />
                - Work preservation upon sync drop / retry<br />
                - Idempotent quiz and lesson deduplication<br />
                - 4 understandable network states
              </p>
              <div className="flex items-start gap-2 pt-1">
                <span className="text-[#F5A623] font-bold">⚡ Simulated Component:</span>
              </div>
              <p className="text-[11px] pl-4">
                - School micro-server Wi-Fi Direct socket latency and timeout simulation (simulateHubSync).
              </p>
              <div className="flex items-start gap-2 pt-1">
                <span className="text-muted-foreground font-bold">📋 Documented Migration Plan:</span>
              </div>
              <p className="text-[11px] pl-4">
                - IndexedDB for binary content packs (&gt;50MB)<br />
                - Service Worker Cache API for offline asset interception<br />
                - BackgroundSync API for automatic reconnection sync
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

export const LearningMeshView = OfflineSyncView;
