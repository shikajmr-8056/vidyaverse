import { Link } from "@tanstack/react-router";
import {
  Settings, User, Moon, Sun, Languages, Eye, Bell, HardDrive,
  ShieldCheck, RefreshCw, Smartphone, Laptop, Lock, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { PageHeader, Panel } from "@/components/vv/primitives";
import { useDemo, type Lang, type UserRole } from "@/lib/demo-store";
import { demoStudent } from "@/data/demo";

export function SettingsView() {
  const d = useDemo();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & Accessibility Preferences"
        description="Customize your learning environment, theme styling, multilingual preferences, and local mesh parameters."
        eyebrow={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAE7FF] px-3 py-1 text-xs font-bold text-[#6541F5]">
            <Settings className="h-3 w-3" /> System Configuration
          </span>
        }
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Preferences */}
        <div className="lg:col-span-8 space-y-6">
          {/* Profile Card */}
          <Panel title="Student Profile Preview">
            <div className="flex items-center gap-4 text-xs">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#5230E8] to-[#6541F5] text-white font-black text-xl flex items-center justify-center shrink-0 shadow-sm">
                AR
              </div>
              <div className="space-y-1">
                <span className="font-bold text-sm text-foreground">{demoStudent.name}</span>
                <p className="text-muted-foreground">Class {demoStudent.classLevel}{demoStudent.section} · Roll 7B-01</p>
                <p className="text-muted-foreground">{demoStudent.school}</p>
              </div>
            </div>
          </Panel>

          {/* Theme & Visual Display */}
          <Panel title="Visual Theme & Display Preferences">
            <div className="space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-foreground block">Visual Color Theme</span>
                  <span className="text-muted-foreground">Switch between default Purple & Lavender and optional Charcoal Dark mode.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={d.theme === "light" ? "default" : "outline"}
                    onClick={() => d.set("theme", "light")}
                    className={d.theme === "light" ? "bg-[#6541F5] text-white font-bold text-xs h-8" : "border-border text-xs h-8 text-foreground"}
                  >
                    <Sun className="h-3.5 w-3.5 mr-1 text-[#F5A623]" /> Light (Purple)
                  </Button>
                  <Button
                    size="sm"
                    variant={d.theme === "dark" ? "default" : "outline"}
                    onClick={() => d.set("theme", "dark")}
                    className={d.theme === "dark" ? "bg-[#7C5CFA] text-white font-bold text-xs h-8" : "border-border text-xs h-8 text-foreground"}
                  >
                    <Moon className="h-3.5 w-3.5 mr-1 text-[#6541F5] dark:text-[#7C5CFA]" /> Dark (Charcoal)
                  </Button>
                </div>
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-foreground block">Enlarged Accessible Text</span>
                  <span className="text-muted-foreground">Scales base typography to 112.5% for visual readability on rural tablets.</span>
                </div>
                <Switch
                  checked={d.largeText}
                  onCheckedChange={(val) => d.set("largeText", val)}
                />
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-foreground block">Reduced Motion</span>
                  <span className="text-muted-foreground">Disables pulse animations and transitions for performance on low-end hardware.</span>
                </div>
                <Switch
                  checked={d.reducedMotion}
                  onCheckedChange={(val) => d.set("reducedMotion", val)}
                />
              </div>
            </div>
          </Panel>

          {/* Multilingual Localization */}
          <Panel title="Regional Language Selection">
            <div className="space-y-3 text-xs">
              <span className="text-muted-foreground block">Choose default interface and tutor language:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "en", title: "English", sub: "Standard Curriculum" },
                  { id: "hi", title: "हिन्दी (Hindi)", sub: "एनसीईआरटी अनुवाद" },
                  { id: "kn", title: "ಕನ್ನಡ (Kannada)", sub: "ಕರ್ನಾಟಕ ಪಠ್ಯಕ್ರಮ" },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => d.set("language", l.id as Lang)}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      d.language === l.id
                        ? "bg-[#EAE7FF] dark:bg-[#6541F5]/20 border-[#6541F5] text-[#5230E8] dark:text-[#7C5CFA] font-bold"
                        : "bg-card border-border text-muted-foreground hover:border-[#6541F5]/40"
                    }`}
                  >
                    <span className="block text-sm font-semibold text-foreground">{l.title}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5 block">{l.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </Panel>

          {/* Offline & Storage Settings */}
          <Panel title="Offline Downloads & Sync Policy">
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-foreground block">Wi-Fi / Mesh Only Downloads</span>
                  <span className="text-muted-foreground">Prevents accidental downloads over mobile phone hotspot tethering.</span>
                </div>
                <Switch
                  checked={d.wifiOnlyDownloads}
                  onCheckedChange={(val) => d.set("wifiOnlyDownloads", val)}
                />
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-foreground block">Auto-Sync on Mesh Detection</span>
                  <span className="text-muted-foreground">Automatically reconciles pending scores when near school micro-hub.</span>
                </div>
                <Badge className="bg-[#DDF8EE] dark:bg-[#19B99A]/20 text-[#28B987] border-[#28B987]/30 text-[10px]">Enabled</Badge>
              </div>
            </div>
          </Panel>
        </div>

        {/* Right: Privacy & Reset */}
        <div className="lg:col-span-4 space-y-6">
          <Panel title="Privacy & Children Safety">
            <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
              <div className="flex items-center gap-2 text-[#28B987]">
                <ShieldCheck className="h-5 w-5 shrink-0" />
                <span className="font-bold text-foreground">Zero Child Data Exposure</span>
              </div>
              <p>
                All student names and scores in this prototype are demonstration records. No personal phone numbers, GPS coordinates or biometrics are ever stored.
              </p>
              <div className="flex gap-2 pt-2">
                <Button asChild variant="outline" size="sm" className="w-1/2 border-border text-[11px] h-8 text-foreground">
                  <Link to="/privacy">Privacy Notice</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="w-1/2 border-border text-[11px] h-8 text-foreground">
                  <Link to="/terms">Terms of Service</Link>
                </Button>
              </div>
            </div>
          </Panel>

          <Panel title="Prototype State Control">
            <p className="text-xs text-[#77778D] mb-3 leading-relaxed">
              Reset browser localStorage to re-experience initial walkthrough:
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={d.resetDemo}
              className="w-full border-[#E95778]/40 text-[#E95778] hover:bg-[#FCE5EB] text-xs font-semibold"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Reset Demo State
            </Button>
          </Panel>
        </div>
      </div>
    </div>
  );
}
