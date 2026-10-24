import { User, GraduationCap, HeartHandshake, Check } from "lucide-react";
import { useDemo, type UserRole } from "@/lib/demo-store";
import { demoStudent } from "@/data/demo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RoleSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectRole?: (role: UserRole) => void;
}

export function RoleSelectionModal({ open, onOpenChange, onSelectRole }: RoleSelectionModalProps) {
  const demo = useDemo();

  const roles = [
    {
      id: "student" as UserRole,
      title: `Student (${demoStudent.name})`,
      subtitle: "Class 7B · Kalyan Higher Primary",
      icon: User,
      color: "#6541F5",
      bg: "#EAE7FF",
      desc: "Cosmic curriculum quests, PlayLab simulations, interactive quizzes and Sparks reward store.",
    },
    {
      id: "teacher" as UserRole,
      title: "Teacher (Mrs. K. Lakshmi)",
      subtitle: "Class 7 Science Instructor",
      icon: GraduationCap,
      color: "#19B99A",
      bg: "#DDF8EE",
      desc: "Cohort diagnostic heatmaps, offline sync audits, intervention tracking and assignments.",
    },
    {
      id: "parent" as UserRole,
      title: "Parent (Guardian View)",
      subtitle: "Ananya's Learning Record",
      icon: HeartHandshake,
      color: "#F5A623",
      bg: "#FFF0D5",
      desc: "Weekly attendance, completed chapters, offline hours, and teacher announcements.",
    },
  ];

  const handleSelect = (role: UserRole) => {
    demo.set("role", role);
    onSelectRole?.(role);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">
            Select Active Learning Portal
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Switch between persona views in this VidyaVerse offline simulation.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-3">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = demo.role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => handleSelect(r.id)}
                className={`w-full flex items-start gap-3.5 p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "border-[#6541F5] bg-[#EAE7FF]/30 dark:bg-[#7C5CFA]/10 shadow-sm"
                    : "border-border hover:bg-accent/50"
                }`}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: r.bg, color: r.color }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">{r.title}</span>
                    {isSelected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#6541F5] text-white">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-semibold text-primary mt-0.5">{r.subtitle}</div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{r.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
