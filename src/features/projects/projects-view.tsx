import { useState } from "react";
import {
  FolderGit2, Plus, Sparkles, Printer, Award, ExternalLink,
  MessageSquare, CheckCircle2, Cpu, Code2, Beaker
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageHeader, SimNote } from "@/components/vv/primitives";
import { useDemo, type StudentProject } from "@/lib/demo-store";
import { demoStudent } from "@/data/demo";

export function ProjectsView() {
  const d = useDemo();
  const [selectedProject, setSelectedProject] = useState<StudentProject | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  // New project form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<StudentProject["category"]>("Electronics");
  const [newDesc, setNewDesc] = useState("");
  const [newSkills, setNewSkills] = useState("");

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    d.addProject({
      title: newTitle,
      category: newCategory,
      status: "submitted",
      xpEarned: 100,
      description: newDesc,
      skills: newSkills.split(",").map((s) => s.trim()).filter(Boolean),
    });

    setNewTitle("");
    setNewDesc("");
    setNewSkills("");
    setCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student STEM Project Portfolios"
        description="Applied electronics, coding algorithms, and hands-on scientific models designed by students."
        eyebrow={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAE7FF] px-3 py-1 text-xs font-bold text-[#6541F5] dark:bg-[#7C5CFA]/20 dark:text-[#D8D5FF]">
            <FolderGit2 className="h-3 w-3" /> Hands-On Discovery Portfolio
          </span>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => setShowCertificate(true)}
              variant="outline"
              size="sm"
              className="text-xs text-[#F5A623] hover:bg-[#FFF0D5]/50 border-border"
            >
              <Printer className="h-3.5 w-3.5 mr-1.5" /> Printable Certificate
            </Button>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-[#6541F5] hover:bg-[#5230E8] text-white font-bold text-xs">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add New Project (+100 XP)
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-base font-bold text-[#6541F5]">Document New Student STEM Project</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateProject} className="space-y-3 py-2 text-xs">
                  <div>
                    <label className="block text-muted-foreground mb-1 font-semibold">Project Title:</label>
                    <input
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Automatic Solar Well Water Level Monitor"
                      className="w-full rounded-xl bg-background border border-border p-2 text-foreground focus:outline-none focus:border-[#6541F5]"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1 font-semibold">Discipline Domain:</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full rounded-xl bg-background border border-border p-2 text-foreground focus:outline-none focus:border-[#6541F5]"
                    >
                      <option value="Electronics">Electronics (CircuitVerse)</option>
                      <option value="Coding">Coding (CodeVerse)</option>
                      <option value="Science">Physical Science</option>
                      <option value="Math">Applied Mathematics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1 font-semibold">Description &amp; Findings:</label>
                    <textarea
                      required
                      rows={3}
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Summarize the circuit logic, physical apparatus, or mathematical algorithm..."
                      className="w-full rounded-xl bg-background border border-border p-2 text-foreground focus:outline-none focus:border-[#6541F5]"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1 font-semibold">Key Competencies (Comma Separated):</label>
                    <input
                      value={newSkills}
                      onChange={(e) => setNewSkills(e.target.value)}
                      placeholder="e.g. Ohm's Law, Breadboard Polarity, Logic"
                      className="w-full rounded-xl bg-background border border-border p-2 text-foreground focus:outline-none focus:border-[#6541F5]"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#6541F5] hover:bg-[#5230E8] text-white font-bold text-xs mt-3">
                    Publish Project to Portfolio
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* Projects Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {d.projects.map((proj) => (
          <div
            key={proj.id}
            className="card-surface p-5 flex flex-col justify-between hover:border-[#6541F5]/40 transition-all shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge
                  className={`text-[10px] font-bold ${
                    proj.category === "Electronics"
                      ? "bg-[#DDF8EE] text-[#19B99A] border-[#19B99A]/30"
                      : proj.category === "Coding"
                      ? "bg-[#DDF2FC] text-[#42A5E8] border-[#42A5E8]/30"
                      : "bg-[#FFF0D5] text-[#F5A623] border-[#F5A623]/30"
                  }`}
                >
                  {proj.category}
                </Badge>
                <span className="text-[11px] font-mono text-muted-foreground">{proj.date}</span>
              </div>

              <h2 className="font-bold text-base text-foreground leading-snug mb-2">
                {proj.title}
              </h2>
              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                {proj.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {proj.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#6541F5] dark:text-[#7C5CFA]">
                +{proj.xpEarned} XP Awarded
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedProject(proj)}
                className="text-xs h-8"
              >
                Project Details &amp; Feedback
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Project Details Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#6541F5] flex items-center gap-2">
              <FolderGit2 className="h-5 w-5" /> {selectedProject?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedProject && (
            <div className="space-y-4 py-2 text-xs">
              <div className="flex items-center justify-between text-muted-foreground border-b border-border pb-2">
                <span>Domain: <strong className="text-foreground">{selectedProject.category}</strong></span>
                <span>Date: <strong className="text-foreground">{selectedProject.date}</strong></span>
                <Badge className="bg-[#DDF8EE] text-[#19B99A] border-[#19B99A]/30 text-[10px] font-bold">
                  Verified Submission
                </Badge>
              </div>

              <div>
                <strong className="text-foreground block mb-1">Architecture &amp; Technical Overview:</strong>
                <p className="text-muted-foreground leading-relaxed">{selectedProject.description}</p>
              </div>

              {/* Teacher Feedback Box */}
              <div className="rounded-xl border border-[#6541F5]/20 bg-[#EAE7FF]/40 dark:bg-[#7C5CFA]/10 p-3.5 text-xs space-y-1">
                <span className="font-bold text-[#6541F5] dark:text-[#D8D5FF] flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5" /> Teacher Feedback (Mrs. K. Lakshmi):
                </span>
                <p className="text-foreground leading-relaxed italic">
                  "Exemplary calculation of current limiting resistor values! Ananya demonstrated exceptional understanding of Ohm's Law and breadboard polarity safety."
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Demonstration Certificate Modal */}
      <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
        <DialogContent className="max-w-lg p-6 sm:p-8">
          <div className="border border-border p-6 rounded-2xl text-center space-y-4 bg-card">
            <div className="flex justify-center">
              <Award className="h-12 w-12 text-[#F5A623]" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-widest text-[#F5A623]">
              Certificate of STEM Diligence
            </h2>
            <p className="text-xs text-muted-foreground">
              This certifies that student explorer
            </p>
            <p className="text-2xl font-bold text-foreground font-serif underline decoration-[#6541F5]">
              {demoStudent.name}
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              has completed verified projects across CircuitVerse and CodeVerse within {demoStudent.school}.
            </p>
            <div className="flex justify-between items-end border-t border-border pt-6 text-[10px] text-muted-foreground">
              <div>
                <span className="font-bold block text-foreground">Mrs. K. Lakshmi</span>
                <span>Science Master</span>
              </div>
              <div className="text-center font-mono text-[9px] text-[#6541F5] dark:text-[#7C5CFA] font-bold">
                VIDYA-CERT-2026-AR7B
              </div>
              <div>
                <span className="font-bold block text-foreground">VidyaVerse Hub</span>
                <span>Autonomous Mesh Node</span>
              </div>
            </div>
          </div>
          <SimNote>
            Demonstration certificate format for student motivation. Not an official state accreditation.
          </SimNote>
        </DialogContent>
      </Dialog>
    </div>
  );
}
