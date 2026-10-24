import { Link } from "@tanstack/react-router";
import { LayoutGrid } from "lucide-react";
import { getRoleBottomNav } from "@/components/vv/nav";
import { useDemo } from "@/lib/demo-store";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  onOpenMore: () => void;
  className?: string;
}

export function BottomNavigation({ onOpenMore, className }: BottomNavigationProps) {
  const demo = useDemo();
  const navItems = getRoleBottomNav(demo.role);

  return (
    <nav
      aria-label="Mobile primary navigation"
      className={cn(
        "fixed bottom-0 inset-x-0 z-40 flex h-16 items-center justify-around border-t border-border bg-card/95 px-2 backdrop-blur-md sm:hidden safe-area-pb",
        className,
      )}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            className="group relative flex min-h-[44px] min-w-[48px] flex-1 flex-col items-center justify-center gap-1 py-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6541F5] rounded-xl"
            activeProps={{
              className: "text-[#6541F5] font-semibold dark:text-[#7C5CFA]",
              "aria-current": "page",
            }}
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg transition-transform group-hover:scale-105",
                    isActive && "bg-[#6541F5]/10 dark:bg-[#7C5CFA]/20",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <span className="text-[10px] font-medium leading-none tracking-tight">
                  {item.label[demo.language]}
                </span>
                {isActive && (
                  <span
                    className="absolute -bottom-1 h-1 w-6 rounded-full bg-[#6541F5] dark:bg-[#7C5CFA]"
                    aria-hidden="true"
                  />
                )}
              </>
            )}
          </Link>
        );
      })}

      {/* 5th "More" Action - triggers slide-out drawer */}
      <button
        type="button"
        onClick={onOpenMore}
        className="group relative flex min-h-[44px] min-w-[48px] flex-1 flex-col items-center justify-center gap-1 py-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6541F5] rounded-xl"
        aria-label="Open all navigation options"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg group-hover:scale-105 transition-transform">
          <LayoutGrid className="h-4 w-4" aria-hidden="true" />
        </div>
        <span className="text-[10px] font-medium leading-none tracking-tight">
          {demo.language === "hi" ? "अधिक" : demo.language === "kn" ? "ಹೆಚ್ಚು" : "More"}
        </span>
      </button>
    </nav>
  );
}
