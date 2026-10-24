import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { Logo } from "@/components/vv/primitives";
import { getRoleNavSections, type NavItem } from "@/components/vv/nav";
import { useDemo } from "@/lib/demo-store";
import { SITE_CONFIG } from "@/config/site";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
}

export function NavLinkItem({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate?: (() => void) | undefined;
}) {
  const { language } = useDemo();
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      className="group flex h-10 items-center justify-between rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-[#F4F2FF] hover:text-[#6541F5] dark:hover:bg-[#25253B] dark:hover:text-[#7C5CFA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6541F5]"
      activeProps={{
        className:
          "bg-[#6541F5] text-white font-semibold shadow-sm shadow-[#6541F5]/25 hover:bg-[#5230E8] hover:text-white dark:bg-[#7C5CFA] dark:text-white",
        "aria-current": "page",
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Icon
          className="h-4 w-4 shrink-0 transition-transform group-hover:scale-105"
          aria-hidden="true"
        />
        <span className="truncate">{item.label[language]}</span>
      </div>
      {item.badge && (
        <span className="rounded-md bg-[#D8D5FF]/40 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#5230E8] group-hover:text-inherit dark:bg-[#7C5CFA]/20 dark:text-[#D8D5FF]">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function CollapsedNavLinkItem({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate?: (() => void) | undefined;
}) {
  const { language } = useDemo();
  const Icon = item.icon;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to={item.to}
          onClick={onNavigate}
          aria-label={item.label[language]}
          className="group relative flex h-10 w-10 mx-auto items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-[#F4F2FF] hover:text-[#6541F5] dark:hover:bg-[#25253B] dark:hover:text-[#7C5CFA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6541F5]"
          activeProps={{
            className:
              "bg-[#6541F5] text-white font-semibold shadow-sm shadow-[#6541F5]/25 hover:bg-[#5230E8] hover:text-white dark:bg-[#7C5CFA] dark:text-white",
            "aria-current": "page",
          }}
        >
          <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-105" aria-hidden="true" />
          {item.badge && (
            <span
              className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#F4B942]"
              aria-hidden="true"
            />
          )}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="flex items-center gap-2">
        <span className="font-medium">{item.label[language]}</span>
        {item.badge && (
          <span className="rounded bg-white/20 px-1 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
            {item.badge}
          </span>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

export function NavSection({
  title,
  items,
  collapsed = false,
  onNavigate,
}: {
  title: string;
  items: NavItem[];
  collapsed?: boolean;
  onNavigate?: (() => void) | undefined;
}) {
  if (collapsed) {
    return (
      <div className="py-1">
        <nav className="flex flex-col items-center gap-1">
          {items.map((item) => (
            <CollapsedNavLinkItem key={item.to} item={item} onNavigate={onNavigate} />
          ))}
        </nav>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <p className="mb-1.5 px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/75">
        {title}
      </p>
      <nav className="flex flex-col gap-0.5">
        {items.map((item) => (
          <NavLinkItem key={item.to} item={item} onNavigate={onNavigate} />
        ))}
      </nav>
    </div>
  );
}

export function AppSidebar({
  className,
  collapsed = false,
  onToggleCollapse,
  onNavigate,
}: AppSidebarProps) {
  const demo = useDemo();
  const sections = getRoleNavSections(demo.role);

  return (
    <aside
      aria-label="Sidebar navigation"
      aria-expanded={!collapsed}
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 motion-reduce:transition-none sm:flex",
        collapsed ? "w-20" : "w-64",
        className,
      )}
    >
      {/* Brand Header */}
      <div
        className={cn(
          "flex h-16 items-center border-b border-sidebar-border bg-sidebar/80 backdrop-blur px-3",
          collapsed ? "justify-center" : "justify-between px-5",
        )}
      >
        <Link to="/" aria-label="VidyaVerse home" className="flex items-center">
          <Logo className={collapsed ? "[&>div:last-child]:hidden" : ""} />
        </Link>
        {onToggleCollapse && !collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {sections.map((section, idx) => (
          <div key={section.id}>
            {collapsed && idx > 0 && (
              <div className="my-2 border-t border-sidebar-border/60 mx-2" aria-hidden="true" />
            )}
            <NavSection
              title={section.title[demo.language]}
              items={section.items}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      {collapsed ? (
        <div className="border-t border-sidebar-border p-3 flex flex-col items-center gap-2 bg-muted/30">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => void demo.syncNow()}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-primary hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6541F5]"
                aria-label={`Force offline sync with school server (${demo.pendingSyncCount} pending)`}
              >
                <RefreshCw className="h-4 w-4" />
                {demo.pendingSyncCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <span className="font-medium">
                {SITE_CONFIG.schoolHub} · {demo.pendingSyncCount} pending sync
              </span>
            </TooltipContent>
          </Tooltip>

          {onToggleCollapse && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleCollapse}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  aria-label="Expand sidebar"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Expand sidebar</TooltipContent>
            </Tooltip>
          )}
        </div>
      ) : (
        <div className="border-t border-sidebar-border p-4 bg-muted/30 text-xs text-muted-foreground">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-foreground truncate">{SITE_CONFIG.schoolHub}</span>
            <span className="text-[10px] font-mono shrink-0 ml-1">{SITE_CONFIG.version}</span>
          </div>
          <div className="flex items-center justify-between bg-card px-2.5 py-1.5 rounded-lg border border-border">
            <span className="truncate">
              Pending sync:{" "}
              <strong className="text-primary dark:text-[#7C5CFA]">{demo.pendingSyncCount}</strong>
            </span>
            <button
              type="button"
              onClick={() => void demo.syncNow()}
              className="text-primary dark:text-[#7C5CFA] hover:underline flex items-center gap-1 font-semibold shrink-0 ml-2"
              aria-label="Force offline sync with school server"
            >
              <RefreshCw className="h-3 w-3" /> Sync
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
