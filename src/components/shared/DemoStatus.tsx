import { Wifi, WifiOff, Radio, RefreshCw, ChevronDown } from "lucide-react";
import { useDemo, type NetworkMode } from "@/lib/demo-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DemoStatusProps {
  className?: string;
}

export function DemoStatus({ className }: DemoStatusProps) {
  const demo = useDemo();

  const stateConfig = {
    syncing: {
      dot: "bg-[#6541F5] animate-spin",
      label: "Syncing...",
      textColor: "text-[#6541F5] dark:text-[#7C5CFA]",
      badge: "bg-[#EAE7FF] text-[#6541F5]",
    },
    sync_needed: {
      dot: "bg-[#F5A623] animate-pulse",
      label: `Sync Needed (${demo.pendingSyncCount})`,
      textColor: "text-[#F5A623]",
      badge: "bg-[#FFF0D5] text-[#F5A623]",
    },
    offline: {
      dot: "bg-[#77778D]",
      label: "Offline (Local Cache)",
      textColor: "text-[#77778D]",
      badge: "bg-muted text-muted-foreground",
    },
    online: {
      dot: "bg-[#31B98A]",
      label: "Online",
      textColor: "text-[#31B98A]",
      badge: "bg-[#DDF8EE] text-[#19B99A]",
    },
  };

  const currentCfg = stateConfig[demo.effectiveNetworkState] || stateConfig.online;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:bg-accent transition-colors",
            className,
          )}
        >
          <span className={cn("h-2 w-2 rounded-full", currentCfg.dot)} />
          <span className="font-semibold text-[11px]">
            {currentCfg.label}
          </span>
          <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 bg-popover text-popover-foreground border-border p-2 space-y-2"
      >
        <div className="px-2 py-1.5">
          <DropdownMenuLabel className="p-0 text-xs font-bold text-foreground">
            Network &amp; Sync State
          </DropdownMenuLabel>
          <div className="flex items-center justify-between mt-1 text-[11px] text-muted-foreground">
            <span>Pending Outbox:</span>
            <strong className="text-foreground">{demo.pendingSyncCount} items</strong>
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Last Hub Sync:</span>
            <span className="font-medium text-right truncate max-w-[130px]">{demo.lastSyncTime}</span>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="px-2 py-1 text-[11px] text-muted-foreground">
          Simulated Connection Mode
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={demo.networkMode}
          onValueChange={(v) => demo.set("networkMode", v as NetworkMode)}
        >
          <DropdownMenuRadioItem value="online" className="cursor-pointer text-xs">
            <Wifi className="h-3.5 w-3.5 mr-2 text-[#31B98A]" />
            <div>
              <p className="font-semibold text-xs">Cloud / Campus Wi-Fi</p>
              <p className="text-[10px] text-muted-foreground">Normal internet connection</p>
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="mesh" className="cursor-pointer text-xs">
            <Radio className="h-3.5 w-3.5 mr-2 text-[#6541F5] dark:text-[#7C5CFA]" />
            <div>
              <p className="font-semibold text-xs">School Micro-Hub Mesh</p>
              <p className="text-[10px] text-muted-foreground">Local Raspberry Pi Wi-Fi Direct</p>
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="offline" className="cursor-pointer text-xs">
            <WifiOff className="h-3.5 w-3.5 mr-2 text-[#F4B942]" />
            <div>
              <p className="font-semibold text-xs">Autonomous Offline</p>
              <p className="text-[10px] text-muted-foreground">Queues pending sync on device</p>
            </div>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <div className="space-y-1.5 pt-1">
          <Button
            size="sm"
            disabled={demo.isSyncing}
            onClick={() => void demo.syncNow(false)}
            className="w-full text-xs font-semibold h-8 bg-[#6541F5] hover:bg-[#5230E8] text-white"
          >
            <RefreshCw className={cn("h-3 w-3 mr-1.5", demo.isSyncing && "animate-spin")} />
            {demo.isSyncing ? "Syncing..." : "Sync With School Hub"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={demo.isSyncing}
            onClick={() => void demo.syncNow(true)}
            className="w-full text-[11px] font-medium h-7 text-muted-foreground hover:text-foreground"
          >
            Simulate Drop &amp; Test Retry
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
