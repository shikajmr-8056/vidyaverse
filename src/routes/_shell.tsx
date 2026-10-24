import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { allNav } from "@/components/vv/nav";
import { useDemo } from "@/lib/demo-store";
import { lessons } from "@/data/demo";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar, AppHeader, BottomNavigation } from "@/components/shared";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell")({
  component: Shell,
});

function getInitialSidebarCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem("vv_sidebar_collapsed");
    if (stored !== null) return stored === "true";
  } catch {
    // Ignore localStorage access errors
  }
  // On tablet screens (768px - 1023px), start collapsed for comfortable reading
  return window.innerWidth < 1024 && window.innerWidth >= 768;
}

function Shell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const demo = useDemo();
  const navigate = useNavigate();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(getInitialSidebarCollapsed);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Keyboard shortcut for Cmd/Ctrl + K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleToggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("vv_sidebar_collapsed", String(next));
      } catch {
        // Ignore localStorage error
      }
      return next;
    });
  };

  const current = allNav.find((n) => pathname === n.to || (pathname.startsWith(n.to + "/") && n.to !== "/"));
  const pageTitle = pathname.startsWith("/quiz")
    ? "Quiz"
    : pathname.startsWith("/lesson")
    ? "Lesson"
    : current?.label[demo.language] ?? "Home";

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:text-primary-foreground focus:px-3 focus:py-2 focus:font-semibold"
        >
          Skip to content
        </a>

        {/* Global Command Palette */}
        <CommandDialog open={cmdOpen} onOpenChange={setCmdOpen}>
          <CommandInput placeholder="Search universe of lessons, labs, experiments or pages..." />
          <CommandList className="max-h-96">
            <CommandEmpty>No matching learning module found.</CommandEmpty>
            <CommandGroup heading="Core Pages & Labs">
              {allNav.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.to}
                    onSelect={() => {
                      void navigate({ to: item.to });
                      setCmdOpen(false);
                    }}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary dark:text-[#7C5CFA]" />
                      <span>{item.label[demo.language]}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground uppercase">{item.category}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandGroup heading="Curriculum Lessons">
              {lessons.map((lesson) => (
                <CommandItem
                  key={lesson.id}
                  onSelect={() => {
                    void navigate({ to: "/lesson/$id", params: { id: lesson.id } });
                    setCmdOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{lesson.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {lesson.subject} · {lesson.chapter}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>

        {/* Desktop/Tablet Collapsible Sidebar */}
        <AppSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />

        {/* Main Content Area */}
        <div
          className={cn(
            "flex flex-col min-h-screen transition-[padding] duration-200 motion-reduce:transition-none",
            sidebarCollapsed ? "sm:pl-20" : "sm:pl-64",
          )}
        >
          {/* Sticky Top Header */}
          <AppHeader
            pageTitle={pageTitle}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
            mobileDrawerOpen={mobileDrawerOpen}
            onOpenMobileDrawer={setMobileDrawerOpen}
            onOpenCommandPalette={() => setCmdOpen(true)}
          />

          {/* Page Content Outlet */}
          <main
            id="main-content"
            className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 sm:pb-8"
          >
            <Outlet />
          </main>
        </div>

        {/* Mobile Fixed Bottom Navigation Bar */}
        <BottomNavigation onOpenMore={() => setMobileDrawerOpen(true)} />
      </div>
    </TooltipProvider>
  );
}
