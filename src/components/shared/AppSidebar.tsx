import { Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Home,
  ClipboardList,
  Pencil,
  CalendarCheck,
  MessageSquare,
  Settings as SettingsIcon,
} from "lucide-react";
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
      className="group flex h-11 items-center justify-between rounded-2xl px-4 text-sm font-semibold text-white/75 transition-all hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      activeProps={{
        className:
          "bg-[#FA6400] text-white font-bold shadow-md shadow-[#FA6400]/30 hover:bg-[#FA6400] hover:text-white",
        "aria-current": "page",
      }}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <Icon
          className="h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-105"
          aria-hidden="true"
        />
        <span className="truncate">{item.label[language]}</span>
      </div>
      {item.badge && (
        <span className="rounded-full bg-[#FA6400] px-2 py-0.5 text-[10px] font-bold text-white group-hover:text-inherit">
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
          className="group relative flex h-10 w-10 mx-auto items-center justify-center rounded-xl text-white/75 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          activeProps={{
            className:
              "bg-[#FA6400] text-white font-bold shadow-md shadow-[#FA6400]/30 hover:bg-[#FA6400] hover:text-white",
            "aria-current": "page",
          }}
        >
          <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-105" aria-hidden="true" />
          {item.badge && (
            <span
              className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#FA6400]"
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
      <p className="mb-1.5 px-3 text-[11px] font-bold uppercase tracking-wider text-white/60">
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

  // Exact 6 e-Class navigation items for student matching the reference screenshot
  const studentNavItems: NavItem[] = [
    {
      to: "/dashboard",
      icon: Home,
      label: { en: "Dashboard", hi: "डैशबोर्ड", kn: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್" },
      category: "learn",
    },
    {
      to: "/learn",
      icon: ClipboardList,
      label: { en: "Classes", hi: "कक्षाएँ", kn: "ತರಗತಿಗಳು" },
      category: "learn",
    },
    {
      to: "/playlab",
      icon: Pencil,
      label: { en: "Resources", hi: "संसाधन", kn: "ಸಂಪನ್ಮೂಲಗಳು" },
      category: "explore",
    },
    {
      to: "/progress",
      icon: CalendarCheck,
      label: { en: "Learning Plan", hi: "अध्ययन योजना", kn: "ಕಲಿಕಾ ಯೋಜನೆ" },
      category: "progress",
    },
    {
      to: "/tutor",
      icon: MessageSquare,
      badge: "5",
      label: { en: "Chat", hi: "चैट", kn: "ಚಾಟ್" },
      category: "ai-offline",
    },
    {
      to: "/settings",
      icon: SettingsIcon,
      label: { en: "Settings", hi: "सेटिंग्स", kn: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು" },
      category: "settings",
    },
  ];

  return (
    <aside
      aria-label="Sidebar navigation"
      aria-expanded={!collapsed}
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden flex-col bg-[#4834D4] text-white transition-[width] duration-200 motion-reduce:transition-none sm:flex border-r border-[#3E29C6] shadow-xl",
        collapsed ? "w-20" : "w-64",
        className,
      )}
    >
      {/* Brand Header: e-Class. matching screenshot */}
      <div
        className={cn(
          "flex h-16 items-center px-4 border-b border-white/10",
          collapsed ? "justify-center" : "justify-between px-6",
        )}
      >
        <Link to="/" aria-label="e-Class VidyaVerse" className="flex items-center gap-1.5">
          <span className="text-2xl font-black tracking-tight text-white font-display">
            e-Class<span className="text-[#FA6400]">.</span>
          </span>
        </Link>
        {onToggleCollapse && !collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {demo.role === "student" ? (
          <div className="space-y-1.5">
            {collapsed ? (
              <nav className="flex flex-col items-center gap-1.5">
                {studentNavItems.map((item) => (
                  <CollapsedNavLinkItem key={item.to} item={item} onNavigate={onNavigate} />
                ))}
              </nav>
            ) : (
              <nav className="flex flex-col gap-1.5">
                {studentNavItems.map((item) => (
                  <NavLinkItem key={item.to} item={item} onNavigate={onNavigate} />
                ))}
              </nav>
            )}
          </div>
        ) : (
          sections.map((section, idx) => (
            <div key={section.id}>
              {collapsed && idx > 0 && (
                <div className="my-2 border-t border-white/10 mx-2" aria-hidden="true" />
              )}
              <NavSection
                title={section.title[demo.language]}
                items={section.items}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            </div>
          ))
        )}
      </div>

      {/* Sidebar Footer matching screenshot */}
      {collapsed ? (
        <div className="border-t border-white/10 p-3 flex flex-col items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => void demo.syncNow()}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-white hover:bg-white/10 transition-colors focus-visible:outline-none"
                aria-label={`Force offline sync (${demo.pendingSyncCount} pending)`}
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <span className="font-medium">
                {SITE_CONFIG.schoolHub} · {demo.pendingSyncCount} pending
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
                  className="h-8 w-8 text-white/70 hover:text-white"
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
        <div className="p-4 pt-1 flex flex-col gap-3">
          {/* White Promotion / Action Card matching reference screenshot */}
          <div className="rounded-2xl bg-white p-4 text-center text-[#1E1B39] shadow-lg flex flex-col items-center">
            {/* 3D Toy Illustration */}
            <div className="w-14 h-14 mb-2 flex items-center justify-center">
              <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-xs">
                <circle cx="30" cy="45" r="10" fill="#E95778" />
                <circle cx="18" cy="48" r="7" fill="#F5A623" />
                <circle cx="42" cy="48" r="7" fill="#42A5E8" />
                <ellipse cx="30" cy="24" rx="12" ry="12" fill="#99603D" />
                <circle cx="26" cy="23" r="1.5" fill="#1C1008" />
                <circle cx="34" cy="23" r="1.5" fill="#1C1008" />
                <path d="M 27 28 Q 30 31 33 28" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <circle cx="30" cy="11" r="5" fill="#00B4F0" />
                <path d="M 22 36 Q 30 39 38 36 L 40 45 L 20 45 Z" fill="#00B4F0" />
              </svg>
            </div>
            <h4 className="font-extrabold text-xs text-[#1E1B39] leading-tight">Upgrade to Pro</h4>
            <p className="text-[10px] text-[#7D7B93] mt-0.5">for more resources!</p>
            <button
              type="button"
              onClick={() => void demo.syncNow()}
              className="mt-2.5 w-full bg-[#00B4F0] hover:bg-[#009FDA] text-white font-bold text-xs py-1.5 px-3 rounded-xl shadow-xs transition-colors"
            >
              Upgrade Now
            </button>
          </div>

          {/* Sign Out Link */}
          <Link
            to="/auth"
            className="flex items-center gap-2 text-white/75 hover:text-white text-xs font-semibold px-2 py-1 transition-colors"
          >
            <span className="text-sm">←</span> Sign Out
          </Link>
        </div>
      )}
    </aside>
  );
}
