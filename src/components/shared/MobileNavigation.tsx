import { Link } from "@tanstack/react-router";
import { Menu, RefreshCw, Sun, Moon } from "lucide-react";
import { Logo } from "@/components/vv/primitives";
import { getRoleNavSections, roleLabels } from "@/components/vv/nav";
import { useDemo } from "@/lib/demo-store";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NavSection } from "@/components/shared/AppSidebar";
import { SITE_CONFIG } from "@/config/site";

interface MobileNavigationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNavigation({ open, onOpenChange }: MobileNavigationProps) {
  const demo = useDemo();
  const sections = getRoleNavSections(demo.role);

  const handleClose = () => onOpenChange(false);

  const roleBadgeColor = {
    student: "bg-[#6541F5]/10 text-[#6541F5] border-[#6541F5]/30 dark:text-[#7C5CFA]",
    teacher: "bg-[#31B98A]/10 text-[#31B98A] border-[#31B98A]/30",
    parent: "bg-[#F4B942]/10 text-[#b48216] border-[#F4B942]/30 dark:text-[#F4B942]",
  }[demo.role];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-foreground hover:bg-accent h-9 w-9 min-h-[44px] min-w-[44px]"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-80 bg-sidebar border-r border-sidebar-border p-0 text-sidebar-foreground flex flex-col justify-between"
      >
        <div>
          <SheetHeader className="p-4 pr-12 border-b border-sidebar-border text-left space-y-2">
            <SheetTitle asChild>
              <Link to="/" onClick={handleClose} className="flex items-center">
                <Logo />
              </Link>
            </SheetTitle>
            <div className="flex items-center">
              <Badge variant="outline" className={`text-[10px] font-semibold ${roleBadgeColor}`}>
                {roleLabels[demo.role][demo.language]}
              </Badge>
            </div>
          </SheetHeader>

          {/* Grouped Navigation List */}
          <div className="overflow-y-auto px-3 py-4 max-h-[calc(100vh-140px)] space-y-1">
            {sections.map((section) => (
              <NavSection
                key={section.id}
                title={section.title[demo.language]}
                items={section.items}
                onNavigate={handleClose}
              />
            ))}
          </div>
        </div>

        {/* Mobile Navigation Drawer Footer */}
        <div className="border-t border-sidebar-border p-4 bg-muted/20 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground text-xs">{SITE_CONFIG.schoolHub}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => demo.set("theme", demo.theme === "dark" ? "light" : "dark")}
              className="h-8 gap-1.5 text-xs text-muted-foreground"
            >
              {demo.theme === "dark" ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-[#F4B942]" /> Light
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-[#6541F5]" /> Dark
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between bg-card px-3 py-2 rounded-lg border border-border">
            <span className="text-muted-foreground text-[11px]">
              Sync: <strong className="text-primary">{demo.pendingSyncCount} pending</strong>
            </span>
            <button
              type="button"
              onClick={() => void demo.syncNow()}
              className="text-primary hover:underline flex items-center gap-1 font-semibold text-xs"
            >
              <RefreshCw className="h-3 w-3" /> Sync Now
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
