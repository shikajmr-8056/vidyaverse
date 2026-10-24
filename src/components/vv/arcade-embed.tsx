import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ArcadeEmbedProps {
  title?: string;
  defaultRoute: string;
  height?: string;
  className?: string;
}

export function ArcadeEmbed({
  title = "Studio Engine",
  defaultRoute,
  height = "h-[calc(100vh-5.5rem)] min-h-[750px]",
  className,
}: ArcadeEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
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

  const iframeSrc = `/arcade/index.html#${defaultRoute}`;

  return (
    <div
      className={cn(
        "relative w-full bg-card rounded-2xl border border-border/80 shadow-sm overflow-hidden transition-all duration-200",
        height,
        className
      )}
    >
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
  );
}
