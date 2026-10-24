import { useState, useRef, useEffect } from "react";
import { Maximize2, Minimize2, RotateCcw, ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ArcadeTab {
  id: string;
  label: string;
  route: string;
  icon?: string;
}

interface ArcadeEmbedProps {
  title: string;
  subtitle?: string;
  defaultRoute: string;
  tabs?: ArcadeTab[];
  height?: string;
}

export function ArcadeEmbed({
  title,
  subtitle,
  defaultRoute,
  tabs = [],
  height = "h-[calc(100vh-13.5rem)] min-h-[720px]",
}: ArcadeEmbedProps) {
  const [activeRoute, setActiveRoute] = useState(defaultRoute);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync theme with iframe content
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    const sendTheme = () => {
      try {
        iframeRef.current?.contentWindow?.postMessage(
          { type: "SET_THEME", theme: isDark ? "dark" : "light" },
          "*"
        );
      } catch {
        // Ignore cross-origin issues if any
      }
    };
    sendTheme();

    const observer = new MutationObserver(() => {
      sendTheme();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const handleReload = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      const src = iframeRef.current.src;
      iframeRef.current.src = "";
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = src;
        }
      }, 50);
    }
  };

  const handleOpenStandalone = () => {
    window.open(`/arcade/index.html#${activeRoute}`, "_blank");
  };

  const iframeSrc = `/arcade/index.html#${activeRoute}`;

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col bg-card rounded-2xl border border-border/80 shadow-sm overflow-hidden transition-all duration-200",
        isFullscreen ? "h-screen w-screen rounded-none border-0 fixed inset-0 z-50 p-0 bg-background" : height
      )}
    >
      {/* Top Studio Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-muted/30 border-b border-border/70 backdrop-blur-sm">
        {/* Left: Studio identity & Tabs */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground text-sm">{title}</span>
            <Badge variant="outline" className="text-[11px] bg-primary/10 text-primary border-primary/20 px-2 py-0.5">
              Live Studio
            </Badge>
          </div>

          {/* Quick-switch Tabs */}
          {tabs.length > 0 && (
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 max-w-full sm:max-w-xl">
              {tabs.map((tab) => {
                const isActive = activeRoute === tab.route;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveRoute(tab.route);
                      setIsLoading(true);
                    }}
                    className={cn(
                      "px-2.5 py-1 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap flex items-center gap-1.5",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {tab.icon && <span>{tab.icon}</span>}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground px-2 py-1 rounded-md bg-muted/50 border border-border/40">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium">100% Offline Ready</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReload}
            title="Reload Studio"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenStandalone}
            title="Open in new window"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleFullscreen}
            className="h-8 text-xs gap-1.5 font-medium border-border/70 hover:bg-muted"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-3.5 w-3.5" />
                <span>Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Fullscreen</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Interactive Canvas Container */}
      <div className="relative flex-1 w-full h-full min-h-0 bg-background overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-xs transition-opacity">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border shadow-sm">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-xs font-medium text-foreground">Loading Studio Engine...</span>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          key={iframeSrc}
          src={iframeSrc}
          title={title}
          onLoad={() => setIsLoading(false)}
          className="w-full h-full border-0 select-none block"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
        />
      </div>
    </div>
  );
}
