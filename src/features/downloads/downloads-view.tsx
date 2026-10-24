import { useState } from "react";
import {
  Download, HardDrive, Trash2, RefreshCw, CheckCircle2,
  FolderDown, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader, Panel, Meter, SimNote } from "@/components/vv/primitives";
import { useDemo } from "@/lib/demo-store";
import { learningPacks } from "@/data/demo";

export function DownloadsView() {
  const d = useDemo();
  const [packToDelete, setPackToDelete] = useState<string | null>(null);

  // Storage calculation
  const totalCachedMb = learningPacks.reduce((acc, p) => {
    return d.downloads[p.id] === "saved" ? acc + p.sizeMb : acc;
  }, 0);
  const maxStorageMb = 512; // 512MB demo quota on student device
  const storagePct = Math.round((totalCachedMb / maxStorageMb) * 100);

  const languagePacks = [
    { code: "kn", name: "Kannada (ಕನ್ನಡ) Voice Synthesizer & Audio Lessons", sizeMb: 35, status: "saved" },
    { code: "hi", name: "Hindi (हिन्दी) Voice Synthesizer & Glossaries", sizeMb: 42, status: "saved" },
    { code: "en", name: "English Offline Grammar Audio Engine", sizeMb: 28, status: "saved" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Downloads & Offline Storage Manager"
        description="Preload comprehensive curriculum chapters and multilingual voice packs onto local tablet storage before leaving the school Wi-Fi zone."
        eyebrow={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DDF8EE] px-3 py-1 text-xs font-bold text-[#19B99A]">
            <Download className="h-3 w-3" /> Offline Storage Engine
          </span>
        }
      />

      {/* Storage Gauge Banner */}
      <div className="card-surface p-5 sm:p-6 border border-border shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#EAE7FF] flex items-center justify-center text-[#6541F5] dark:bg-[#7C5CFA]/20 dark:text-[#D8D5FF]">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-foreground">Internal SD Card Space</span>
              <p className="text-xs text-muted-foreground">Allocated for VidyaVerse Offline Learning Hub</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="font-mono font-bold text-base text-foreground">{totalCachedMb} MB / {maxStorageMb} MB</span>
            <span className="text-xs text-[#28B987] font-semibold ml-2">({storagePct}% utilized)</span>
          </div>
        </div>

        <Meter value={storagePct} tone="purple" label="Storage Quota" className="h-2.5" />
        <div className="flex flex-wrap justify-between gap-2 text-[11px] text-muted-foreground mt-2.5">
          <span>Wi-Fi Only Downloads: {d.wifiOnlyDownloads ? "Active" : "Disabled"}</span>
          <span>Automatic Cache Pruning: Protected</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Content Packs */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="font-bold text-sm text-foreground flex items-center gap-2">
            <FolderDown className="h-4 w-4 text-[#6541F5]" /> Curriculum Content Packs
          </h2>

          <div className="space-y-3">
            {learningPacks.map((pack) => {
              const state = d.downloads[pack.id] || "none";
              const isDownloaded = state === "saved";
              const isDownloading = state === "downloading";

              return (
                <div
                  key={pack.id}
                  className="card-surface p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:border-[#6541F5]/40 shadow-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-foreground">{pack.name}</h3>
                      {isDownloaded && (
                        <Badge className="bg-[#DDF8EE] text-[#19B99A] border-[#19B99A]/30 text-[10px] font-bold">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Cached Offline ✓
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {pack.lessons} complete interactive lessons, quizzes and worksheets · {pack.sizeMb} MB
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isDownloading ? (
                      <Button size="sm" disabled className="bg-[#EAE7FF] text-[#6541F5] text-xs h-8 font-semibold">
                        <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" /> Downloading...
                      </Button>
                    ) : isDownloaded ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPackToDelete(pack.id)}
                        className="border-border text-[#E95778] hover:bg-[#FCE5EB] dark:hover:bg-[#E95778]/15 text-xs h-8"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => d.startDownload(pack.id)}
                        className="bg-[#6541F5] hover:bg-[#5230E8] text-white font-bold text-xs h-8"
                      >
                        <Download className="h-3.5 w-3.5 mr-1" /> Download
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Language Voice Synthesis Packs */}
          <h2 className="font-bold text-sm text-foreground flex items-center gap-2 pt-4">
            <Sparkles className="h-4 w-4 text-[#F5A623]" /> Multilingual Voice Synthesis Models
          </h2>

          <div className="space-y-3">
            {languagePacks.map((lp) => (
              <div key={lp.code} className="card-surface p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <h3 className="font-bold text-sm text-foreground">{lp.name}</h3>
                  <p className="text-xs text-muted-foreground">Local edge speech pronunciation model · {lp.sizeMb} MB</p>
                </div>
                <Badge className="bg-[#DDF8EE] text-[#19B99A] border-[#19B99A]/30 text-xs font-semibold shrink-0">
                  Active in Storage ✓
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Right Info */}
        <div className="lg:col-span-4 space-y-6">
          <Panel title="Offline Readiness Guarantee">
            <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Zero Cellular Data Drain:</strong> Downloaded packages store locally within indexed browser storage. Interactive lessons run without buffering or mobile recharge fees.
              </p>
              <p>
                <strong className="text-foreground">Auto-Sync When Returning to School:</strong> Any quiz attempts taken on downloaded lessons queue automatically until your tablet re-enters the school mesh boundary.
              </p>
            </div>
          </Panel>

          <SimNote>
            Simulated content storage using local browser cache for prototype fidelity.
          </SimNote>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!packToDelete} onOpenChange={() => setPackToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#E95778] flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> Remove Downloaded Content Pack?
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground my-2">
            This will free storage on your device. You can re-download this pack anytime when connected to the School Mesh Hub.
          </p>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setPackToDelete(null)} className="text-xs">
              Keep Pack
            </Button>
            <Button
              onClick={() => {
                if (packToDelete) d.removeDownload(packToDelete);
                setPackToDelete(null);
              }}
              className="bg-[#E95778] hover:bg-[#d64364] text-white text-xs font-bold"
            >
              Confirm Removal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
