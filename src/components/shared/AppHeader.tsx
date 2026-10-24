import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Search,
  Languages,
  ChevronDown,
  Sun,
  Moon,
  GraduationCap,
  HeartHandshake,
  User,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Logo } from "@/components/vv/primitives";
import { langNames, roleLabels, getRoleDefaultRoute } from "@/components/vv/nav";
import { useDemo, type Lang, type UserRole } from "@/lib/demo-store";
import { demoStudent } from "@/data/demo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DemoStatus } from "@/components/shared/DemoStatus";
import { MobileNavigation } from "@/components/shared/MobileNavigation";

interface AppHeaderProps {
  pageTitle: string;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  mobileDrawerOpen?: boolean;
  onOpenMobileDrawer?: (open: boolean) => void;
  onOpenCommandPalette: () => void;
}

export function AppHeader({
  pageTitle,
  sidebarCollapsed = false,
  onToggleSidebar,
  mobileDrawerOpen,
  onOpenMobileDrawer,
  onOpenCommandPalette,
}: AppHeaderProps) {
  const demo = useDemo();
  const navigate = useNavigate();
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const isMobileOpen = mobileDrawerOpen ?? internalMobileOpen;
  const setMobileOpen = onOpenMobileDrawer ?? setInternalMobileOpen;

  const roleProfiles = {
    student: {
      name: demoStudent.name,
      subtitle: "Class 7B · Kalyan School",
      initials: "AR",
      badgeColor: "bg-[#6541F5]/10 text-[#6541F5] border-[#6541F5]/25 dark:text-[#7C5CFA]",
      avatarBg: "bg-[#6541F5]/15 text-[#6541F5] dark:text-[#7C5CFA]",
    },
    teacher: {
      name: "Mrs. Lakshmi",
      subtitle: "Science Dept · Kalyan School",
      initials: "ML",
      badgeColor: "bg-[#31B98A]/10 text-[#31B98A] border-[#31B98A]/25",
      avatarBg: "bg-[#31B98A]/15 text-[#31B98A]",
    },
    parent: {
      name: "Guardian",
      subtitle: "Parent of Ananya · Class 7B",
      initials: "GD",
      badgeColor: "bg-[#F4B942]/10 text-[#b48216] border-[#F4B942]/25 dark:text-[#F4B942]",
      avatarBg: "bg-[#F4B942]/15 text-[#b48216] dark:text-[#F4B942]",
    },
  }[demo.role];

  const notifications = [
    {
      id: "1",
      title: "Class 7B Science Practical",
      desc: "Bring one cell & two wires on Thursday.",
      time: "1 hr ago",
      tag: "Class",
    },
    {
      id: "2",
      title: "Daily Mission Active",
      desc: "Score 100% on Fractions quiz for +50 XP",
      time: "Today",
      tag: "Mission",
    },
    {
      id: "3",
      title: "Mesh Sync Pending",
      desc: `${demo.pendingSyncCount} offline activities ready to sync with school hub.`,
      time: demo.lastSyncTime,
      tag: "Sync",
    },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur-md">
      <div className="flex h-16 items-center gap-2.5 px-3 md:px-6">
        {/* Mobile Navigation Sheet Trigger */}
        <MobileNavigation open={isMobileOpen} onOpenChange={setMobileOpen} />

        {/* Desktop/Tablet Sidebar Collapse Toggle */}
        {onToggleSidebar && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="hidden sm:flex h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        )}

        {/* Mobile Logo */}
        <Link to="/" className="sm:hidden flex items-center">
          <Logo className="[&>div:last-child]:hidden sm:[&>div:last-child]:flex" />
        </Link>

        {/* Current Page Context & Role Indicator */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <Badge
            variant="outline"
            className={`text-[10px] font-semibold tracking-wide shrink-0 ${roleProfiles.badgeColor}`}
          >
            {roleLabels[demo.role][demo.language]}
          </Badge>
          <span className="text-muted-foreground/40 text-xs select-none">/</span>
          <h1 className="text-sm md:text-base font-bold text-foreground truncate max-w-[200px] lg:max-w-none">
            {pageTitle}
          </h1>
        </div>

        {/* Mobile Page Title (when space permits) */}
        <div className="sm:hidden flex items-center truncate min-w-0 ml-1">
          <h1 className="text-sm font-bold text-foreground truncate">{pageTitle}</h1>
        </div>

        {/* Centered Search Bar */}
        <div className="mx-auto hidden md:flex items-center justify-center w-full max-w-xs px-2">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchVal.trim()) {
                  navigate({ to: "/learn", search: { q: searchVal.trim() } });
                }
              }}
              placeholder="Search lessons, subjects and games..."
              className="h-9 w-full rounded-lg border border-input bg-card pl-9 pr-14 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground border border-border"
              title="Search Palette (Ctrl+K)"
            >
              Ctrl+K
            </button>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="ml-auto flex items-center gap-1.5 md:gap-2">
          {/* Network Connectivity Status Pill */}
          <div className="hidden sm:block">
            <DemoStatus />
          </div>

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 gap-1 text-xs font-medium text-muted-foreground hover:text-foreground px-2"
                aria-label={`Select language, current is ${langNames[demo.language]}`}
              >
                <Languages className="h-4 w-4" />
                <span className="hidden sm:inline">{langNames[demo.language]}</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-popover text-popover-foreground border-border"
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Language
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={demo.language}
                onValueChange={(l) => demo.set("language", l as Lang)}
              >
                <DropdownMenuRadioItem value="en" className="cursor-pointer">
                  English
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="hi" className="cursor-pointer">
                  हिन्दी (Hindi)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="kn" className="cursor-pointer">
                  ಕನ್ನಡ (Kannada)
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => demo.set("theme", demo.theme === "dark" ? "light" : "dark")}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title={`Switch to ${demo.theme === "dark" ? "Light Mode" : "Dark Mode"}`}
            aria-label={`Switch to ${demo.theme === "dark" ? "Light Mode" : "Dark Mode"}`}
          >
            {demo.theme === "dark" ? (
              <Sun className="h-4 w-4 text-[#F4B942]" />
            ) : (
              <Moon className="h-4 w-4 text-[#6541F5]" />
            )}
          </Button>

          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-8 w-8 text-muted-foreground hover:text-foreground"
                aria-label="View notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#6541F5]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 bg-popover text-popover-foreground border-border p-0"
            >
              <div className="flex items-center justify-between p-3 border-b border-border">
                <span className="font-semibold text-xs">Class & Mesh Alerts</span>
                <Badge variant="outline" className="text-[10px]">
                  3 New
                </Badge>
              </div>
              <div className="divide-y divide-border/60 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-accent transition-colors">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                      <span className="font-semibold text-[#6541F5] dark:text-[#7C5CFA]">
                        {n.tag}
                      </span>
                      <span>{n.time}</span>
                    </div>
                    <p className="text-xs font-medium text-foreground">{n.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile & Role Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={`flex items-center gap-1.5 rounded-lg border border-border p-1 text-xs font-bold transition-colors hover:opacity-90 ${roleProfiles.avatarBg}`}
                aria-label="User role switcher profile menu"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded font-extrabold text-xs">
                  {roleProfiles.initials}
                </span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-popover text-popover-foreground border-border"
            >
              <DropdownMenuLabel className="text-xs">
                <p className="font-bold text-foreground">{roleProfiles.name}</p>
                <p className="text-[10px] text-muted-foreground font-normal">
                  {roleProfiles.subtitle}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={demo.role}
                onValueChange={(r) => {
                  const newRole = r as UserRole;
                  demo.set("role", newRole);
                  const targetRoute = getRoleDefaultRoute(newRole);
                  void navigate({ to: targetRoute });
                }}
              >
                <DropdownMenuRadioItem value="student" className="cursor-pointer">
                  <User className="h-4 w-4 mr-2 text-[#6541F5]" />
                  <span>Student (Ananya)</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="teacher" className="cursor-pointer">
                  <GraduationCap className="h-4 w-4 mr-2 text-[#31B98A]" />
                  <span>Teacher (Mrs. Lakshmi)</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="parent" className="cursor-pointer">
                  <HeartHandshake className="h-4 w-4 mr-2 text-[#F4B942]" />
                  <span>Parent (Guardian)</span>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
