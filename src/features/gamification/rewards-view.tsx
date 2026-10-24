import { useState } from "react";
import {
  Sparkles, Gift, CheckCircle2, Lock, ArrowRight, ShieldCheck,
  AlertCircle, ShoppingBag, Award, Coins
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader, SimNote } from "@/components/vv/primitives";
import { useDemo } from "@/lib/demo-store";

interface RewardItem {
  id: string;
  name: string;
  category: "Physical STEM Kit" | "Classroom Honor" | "Digital Cosmetic";
  cost: number;
  icon: string;
  desc: string;
  eligibility: string;
  fulfillment: string;
}

const rewards: RewardItem[] = [
  {
    id: "r1",
    name: "Solar Bug DIY Experiment Kit",
    category: "Physical STEM Kit",
    cost: 500,
    icon: "🦗",
    desc: "Mini solar panel, vibration motor, and copper clips. Shipped to Kalyan School Hub for distribution.",
    eligibility: "Completed Class 7 Simple Circuits & 500 XP",
    fulfillment: "Dispatched to school teacher monthly package.",
  },
  {
    id: "r2",
    name: "Science Explorer Badge Pin",
    category: "Physical STEM Kit",
    cost: 250,
    icon: "🎖️",
    desc: "Physical enamel metal lapel pin handed over during Monday school assembly.",
    eligibility: "Level 3 or higher",
    fulfillment: "Awarded during Monday school assembly.",
  },
  {
    id: "r3",
    name: "Geometric Drawing Geometry Box",
    category: "Physical STEM Kit",
    cost: 400,
    icon: "📐",
    desc: "Complete mathematical compass, divider, protractor and set squares set.",
    eligibility: "Fractions & Angles lessons completed",
    fulfillment: "Provided by CSR partner at school office.",
  },
  {
    id: "r4",
    name: "Classroom Peer Mentor Status",
    category: "Classroom Honor",
    cost: 150,
    icon: "🌟",
    desc: "Official recommendation to teacher to act as Circuit Lab Assistant during practicals.",
    eligibility: "90% score on Simple Circuits Quiz",
    fulfillment: "Teacher dashboard notification sent.",
  },
  {
    id: "r5",
    name: "Cosmic Nebula Student Avatar",
    category: "Digital Cosmetic",
    cost: 100,
    icon: "🌌",
    desc: "Unlock glowing deep-space cosmic avatar frame for your profile across school mesh.",
    eligibility: "Open to all cadets",
    fulfillment: "Instant in-app profile upgrade.",
  },
  {
    id: "r6",
    name: "Offline Audio Story Pack: Ramanujan",
    category: "Digital Cosmetic",
    cost: 75,
    icon: "🎧",
    desc: "Downloadable 4-part audio documentary on Srinivasa Ramanujan's mathematical journey.",
    eligibility: "Open to all cadets",
    fulfillment: "Instant cache to device storage.",
  },
];

export function RewardsView() {
  const d = useDemo();
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [redeemResult, setRedeemResult] = useState<string | null>(null);

  const handleRedeem = () => {
    if (!selectedReward) return;
    if (d.sparks < selectedReward.cost) {
      setRedeemResult(`Insufficient Sparks balance (${d.sparks}/${selectedReward.cost}). Complete more lessons and STEM activities!`);
      return;
    }

    const res = d.redeemItem(selectedReward.name, selectedReward.cost);
    setRedeemResult(res.message);
    setTimeout(() => {
      setModalOpen(false);
      setSelectedReward(null);
      setRedeemResult(null);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rewards Store & Educational Bazaar"
        description="Redeem your earned Sparks for real hands-on STEM materials, books, digital badges, and classroom honors without depleting your Lifetime XP."
        eyebrow={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF0D5] px-3 py-1 text-xs font-bold text-[#F5A623]">
            <Sparkles className="h-3 w-3" /> Learning Incentives &amp; Bazaar
          </span>
        }
      />

      {/* Balance Banner in Vibrant Purple */}
      <div className="flex flex-col sm:flex-row items-center justify-between rounded-2xl bg-gradient-to-r from-[#6541F5] via-[#5230E8] to-[#42A5E8] p-6 shadow-md text-white">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-[#FFF0D5] backdrop-blur-sm">
            <Sparkles className="h-7 w-7" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-white/80">Available Spendable Sparks</span>
            <div className="text-3xl font-black text-white">{d.sparks} Sparks</div>
            <p className="text-xs text-white/90 font-medium">
              Permanent Lifetime XP: <strong>{d.xp.toLocaleString("en-IN")} XP</strong> (Level {Math.floor(d.xp / 250) + 1}) · Lifetime XP is strictly monotonic and never deducted.
            </p>
          </div>
        </div>

        <div className="mt-4 sm:mt-0 text-right">
          <span className="inline-block rounded-xl bg-white/20 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
            {d.redeemedItems.length} Rewards Claimed
          </span>
        </div>
      </div>

      {/* Reward Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rewards.map((r) => {
          const isOwned = d.redeemedItems.includes(r.name);
          const canAfford = d.sparks >= r.cost;

          return (
            <div
              key={r.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all card-surface shadow-sm ${
                isOwned
                  ? "border-[#19B99A]/50 bg-[#DDF8EE]/20"
                  : "border-border hover:border-[#6541F5]/40"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{r.icon}</span>
                  <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    {r.category}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-foreground">{r.name}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{r.desc}</p>

                <div className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
                  <strong className="text-[#6541F5] block font-semibold">Eligibility:</strong> {r.eligibility}
                </div>
              </div>

              <div className="mt-5 border-t border-border pt-3 flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-[#F5A623] flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> {r.cost} XP
                </span>

                {isOwned ? (
                  <span className="rounded-lg bg-[#DDF8EE] px-2.5 py-1 text-xs font-bold text-[#19B99A] border border-[#19B99A]/30">
                    Claimed ✓
                  </span>
                ) : (
                  <Button
                    size="sm"
                    disabled={!canAfford}
                    onClick={() => {
                      setSelectedReward(r);
                      setRedeemResult(null);
                      setModalOpen(true);
                    }}
                    className={`font-bold text-xs h-8 ${
                      canAfford
                        ? "bg-[#6541F5] text-white hover:bg-[#5230E8] shadow-sm"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {canAfford ? "Redeem" : "Need XP"}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Redemption Confirmation Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#6541F5] flex items-center gap-2">
              <Gift className="h-5 w-5" /> Confirm Learning Reward Claim
            </DialogTitle>
          </DialogHeader>

          {selectedReward && (
            <div className="space-y-4 py-2 text-xs">
              <div className="rounded-xl bg-muted/40 p-4 border border-border flex items-center gap-4">
                <span className="text-4xl">{selectedReward.icon}</span>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{selectedReward.name}</h4>
                  <p className="text-[11px] text-muted-foreground">{selectedReward.category}</p>
                  <p className="font-mono font-bold text-[#F5A623] mt-1">Cost: {selectedReward.cost} XP</p>
                </div>
              </div>

              <div className="rounded-xl border border-dashed border-border bg-background p-3 text-[11px] text-muted-foreground">
                <strong className="text-[#6541F5] block mb-1 font-semibold">Simulated Fulfillment Process:</strong>
                {selectedReward.fulfillment}
              </div>

              {redeemResult && (
                <div className="rounded-lg bg-[#DDF8EE] border border-[#19B99A]/40 p-2.5 text-xs text-[#19B99A] font-semibold">
                  {redeemResult}
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <Button variant="outline" onClick={() => setModalOpen(false)} className="w-1/2 border-border text-xs">
                  Cancel
                </Button>
                <Button onClick={handleRedeem} className="w-1/2 bg-[#6541F5] text-white hover:bg-[#5230E8] font-bold text-xs">
                  Confirm Deduction (-{selectedReward.cost} XP)
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <SimNote>
        XP is an internal motivational educational currency, not real currency. Rewards simulate school kit distribution via education partners.
      </SimNote>
    </div>
  );
}
