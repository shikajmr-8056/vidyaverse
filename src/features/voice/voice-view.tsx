import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Mic, Volume2, Sparkles, Languages, Radio, CheckCircle2,
  Headphones, Play, Square, RotateCcw, Clock, ShieldCheck,
  Download, HardDrive, Wifi, WifiOff, AlertTriangle, ArrowRight,
  BookOpen, Trophy, FileText, Check, HelpCircle, Info, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader, SimNote } from "@/components/vv/primitives";
import { useDemo, type Lang } from "@/lib/demo-store";
import { demoStudent } from "@/data/demo";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type MicState =
  | "idle"
  | "requesting_permission"
  | "listening"
  | "processing"
  | "speaking"
  | "permission_denied";

interface VoiceLog {
  id: string;
  commandRecognized: string;
  matchedAction: string;
  language: string;
  response: string;
  timestamp: string;
  category?: string;
  matchScore?: number;
}

interface LanguagePack {
  code: Lang;
  name: string;
  nativeName: string;
  sizeMb: number;
  downloaded: boolean;
  version: string;
}

// Approved curriculum snippets for read-aloud practice
const READ_ALOUD_CURRICULUM = [
  {
    id: "snip-fractions",
    title: "NCERT Class 7 Maths · Fraction Concept",
    subject: "Mathematics",
    textEn: "A fraction represents a part of a whole. When a collection of objects is divided into equal parts, each part represents a fractional slice.",
    textHi: "एक भिन्न किसी पूर्ण वस्तु के एक भाग को दर्शाती है। जब किसी वस्तु को समान भागों में विभाजित किया जाता है, तो प्रत्येक भाग एक भिन्न कहलाता है।",
    textKn: "ಭಿನ್ನರಾಶಿಯು ಸಂಪೂರ್ಣ ವಸ್ತುವಿನ ಒಂದು ಭಾಗವನ್ನು ಪ್ರತಿನಿಧಿಸುತ್ತದೆ. ಸಮಾನ ಭಾಗಗಳಾಗಿ ವಿಂಗಡಿಸಿದಾಗ ಪ್ರತಿ ಭಾಗವೂ ಭಿನ್ನರಾಶಿಯಾಗಿದೆ."
  },
  {
    id: "snip-circuits",
    title: "NCERT Class 7 Science · Closed Circuit Rule",
    subject: "Science",
    textEn: "An electric current requires an unbroken closed conducting loop to flow from the positive terminal to the negative terminal of the cell.",
    textHi: "विद्युत धारा प्रवाहित होने के लिए सेल के धनात्मक सिरे से ऋणात्मक सिरे तक एक अखंड बंद परिपथ की आवश्यकता होती है।",
    textKn: "ವಿದ್ಯುತ್ ಪ್ರವಾಹವು ಹರಿಯಲು ಸೆಲ್‌ನ ಧನ ಧ್ರುವದಿಂದ ಋಣ ಧ್ರುವದವರೆಗೆ ನಿರಂತರ ಮುಚ್ಚಿದ ಸರ್ಕ್ಯೂಟ್ ಮಾರ್ಗ ಬೇಕಾಗುತ್ತದೆ."
  },
  {
    id: "snip-plants",
    title: "NCERT Class 7 Science · Photosynthesis Definition",
    subject: "Science",
    textEn: "Green plants synthesize food from carbon dioxide and water in the presence of chlorophyll and sunlight, producing glucose and oxygen.",
    textHi: "हरे पौधे सूर्य के प्रकाश और क्लोरोफिल की उपस्थिति में कार्बन डाइऑक्साइड और जल से भोजन बनाते हैं, जिससे ऑक्सीजन मुक्त होती है।",
    textKn: "ಹಸಿರು ಸಸ್ಯಗಳು ಸೂರ್ಯನ ಬೆಳಕು ಮತ್ತು ಕ್ಲೋರೋಫಿಲ್ ಸಹಾಯದಿಂದ ಇಂಗಾಲದ ಡೈಆಕ್ಸೈಡ್ ಮತ್ತು ನೀರಿನಿಂದ ಆಹಾರ ತಯಾರಿಸುತ್ತವೆ."
  }
];

export function VoiceView() {
  const d = useDemo();
  const navigate = useNavigate();

  // Voice Interaction State
  const [micState, setMicState] = useState<MicState>("idle");
  const [selectedLang, setSelectedLang] = useState<Lang>(d.language || "en");
  const [transcription, setTranscription] = useState<string>("Tap the microphone button to speak your educational command...");
  const [spokenResponse, setSpokenResponse] = useState<string | null>(null);
  const [activeActionLink, setActiveActionLink] = useState<{ label: string; to: string } | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string>("NCERT Curriculum");

  // Manual text alternative
  const [textAlternativeInput, setTextAlternativeInput] = useState("");

  // Read aloud reader state
  const [activeReaderId, setActiveReaderId] = useState<string | null>(null);
  const [isReadingAloud, setIsReadingAloud] = useState(false);

  // Offline Language Packs
  const [languagePacks, setLanguagePacks] = useState<LanguagePack[]>([
    { code: "en", name: "English Acoustic Pack", nativeName: "English (India)", sizeMb: 38, downloaded: true, version: "v1.4" },
    { code: "hi", name: "Hindi Acoustic Pack", nativeName: "हिन्दी (भारत)", sizeMb: 45, downloaded: true, version: "v2.0" },
    { code: "kn", name: "Kannada Acoustic Pack", nativeName: "ಕನ್ನಡ (ಕರ್ನಾಟಕ)", sizeMb: 48, downloaded: false, version: "v1.8" }
  ]);

  // Initial rich history matching the reference 2-column card grid
  const [voiceLogs, setVoiceLogs] = useState<VoiceLog[]>([
    {
      id: "v-init-1",
      commandRecognized: "Open fractions lesson",
      matchedAction: "Navigated to /lesson/fractions-intro",
      language: "English",
      category: "FRACTIONS",
      matchScore: 96,
      response: "Opening 'What a fraction really means' lesson.",
      timestamp: "10m ago"
    },
    {
      id: "v-init-2",
      commandRecognized: "Check my study streak",
      matchedAction: "Read progress metrics",
      language: "English",
      category: "STUDY STREAK",
      matchScore: 92,
      response: "Ananya, you currently have a 6-day learning streak and 1,240 XP earned!",
      timestamp: "1h ago"
    },
    {
      id: "v-init-3",
      commandRecognized: "Explain electric circuit",
      matchedAction: "Navigated to /lesson/electric-circuits",
      language: "English",
      category: "CIRCUITS",
      matchScore: 88,
      response: "Opening NCERT Class 7 Science: Electric Current and its Effects.",
      timestamp: "2h ago"
    },
    {
      id: "v-init-4",
      commandRecognized: "Start fractions quiz",
      matchedAction: "Navigated to /quiz/fractions",
      language: "English",
      category: "QUIZ CHECK",
      matchScore: 94,
      response: "Opening Fractions Practice Quiz with 4 interactive questions.",
      timestamp: "Yesterday"
    },
    {
      id: "v-init-5",
      commandRecognized: "CodeBot algorithms",
      matchedAction: "Navigated to /codeverse",
      language: "English",
      category: "ALGORITHMS",
      matchScore: 85,
      response: "Launching CodeBot sequential maze solver.",
      timestamp: "Yesterday"
    },
    {
      id: "v-init-6",
      commandRecognized: "Karnataka heritage",
      matchedAction: "Navigated to /lesson/karnataka-heritage-7",
      language: "English",
      category: "HERITAGE",
      matchScore: 90,
      response: "Opening Architecture and heritage of Karnataka lesson.",
      timestamp: "2d ago"
    }
  ]);

  // Handle TTS cleanup
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Web Speech API Synthesis helper with fallback
  const speakText = (text: string, langCode: Lang) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSpokenResponse(text);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode === "hi" ? "hi-IN" : langCode === "kn" ? "kn-IN" : "en-IN";
    utterance.rate = 0.95; // Slightly slower for clear classroom comprehension

    utterance.onstart = () => {
      setMicState("speaking");
    };

    utterance.onend = () => {
      setMicState("idle");
      setIsReadingAloud(false);
    };

    utterance.onerror = () => {
      setMicState("idle");
      setIsReadingAloud(false);
    };

    window.speechSynthesis.speak(utterance);
    setSpokenResponse(text);
  };

  const handleStopSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setMicState("idle");
    setIsReadingAloud(false);
  };

  // Command parser for limited, supported command vocabulary
  const processVoiceCommand = (cmdText: string) => {
    const raw = cmdText.trim();
    if (!raw) return;

    setMicState("processing");
    setTranscription(`"${raw}"`);

    const lower = raw.toLowerCase();
    let reply = "";
    let matchedAction = "General Inquiry";
    let category = "CURRICULUM";
    let actionLink: { label: string; to: string } | null = null;

    if (
      lower.includes("fraction") ||
      lower.includes("भिन्न") ||
      lower.includes("ಭಿನ್ನರಾಶಿ")
    ) {
      category = "MATHEMATICS";
      if (lower.includes("quiz") || lower.includes("test") || lower.includes("ಪ್ರಶ್ನೋತ್ತರ")) {
        reply = selectedLang === "hi"
          ? "भिन्न प्रश्नोत्तरी शुरू की जा रही है। 4 प्रश्नों के लिए तैयार रहें।"
          : selectedLang === "kn"
          ? "ಭಿನ್ನರಾಶಿಗಳ ರಸಪ್ರಶ್ನೆ ಪ್ರಾರಂಭವಾಗುತ್ತಿದೆ. 4 ಪ್ರಶ್ನೆಗಳಿಗೆ ಸಿದ್ಧರಾಗಿ."
          : "Opening Fractions Practice Quiz with 4 interactive questions.";
        matchedAction = "Navigated to /quiz/fractions";
        actionLink = { label: "Go to Fractions Quiz", to: "/quiz/fractions" };
      } else {
        reply = selectedLang === "hi"
          ? "कक्षा 7 गणित: 'भिन्न का वास्तविक अर्थ' पाठ खोला जा रहा है।"
          : selectedLang === "kn"
          ? "ತರಗತಿ 7 ಗಣಿತ: 'ಭಿನ್ನರಾಶಿಯ ನಿಜವಾದ ಅರ್ಥ' ಪಾಠವನ್ನು ತೆರೆಯಲಾಗುತ್ತಿದೆ."
          : "Opening NCERT Class 7 Maths: 'What a fraction really means' lesson.";
        matchedAction = "Navigated to /lesson/fractions-intro";
        actionLink = { label: "Open Lesson: Fractions Intro", to: "/lesson/fractions-intro" };
      }
    } else if (
      lower.includes("circuit") ||
      lower.includes("switch") ||
      lower.includes("विद्युत") ||
      lower.includes("ಸರ್ಕ್ಯೂಟ್")
    ) {
      category = "SCIENCE";
      reply = selectedLang === "hi"
        ? "विद्युत परिपथ और इसके प्रभाव पाठ खोला जा रहा है।"
        : selectedLang === "kn"
        ? "ವಿದ್ಯುತ್ ಪ್ರವಾಹ ಮತ್ತು ಅದರ ಪರಿಣಾಮಗಳು ಪಾಠವನ್ನು ತೆರೆಯಲಾಗುತ್ತಿದೆ."
        : "Opening NCERT Class 7 Science: 'Electric Current and its Effects' lesson.";
      matchedAction = "Navigated to /lesson/electric-circuits";
      actionLink = { label: "Open Lesson: Electric Circuits", to: "/lesson/electric-circuits" };
    } else if (
      lower.includes("progress") ||
      lower.includes("streak") ||
      lower.includes("xp") ||
      lower.includes("प्रगति") ||
      lower.includes("ಪ್ರಗತಿ")
    ) {
      category = "PROGRESS";
      reply = selectedLang === "hi"
        ? `अनन्या, आपका अध्ययन स्ट्रीक ${demoStudent.streakDays} दिन है और आपने ${d.xp} XP अर्जित किए हैं!`
        : selectedLang === "kn"
        ? `ಅನನ್ಯಾ, ನಿಮ್ಮ ಅಧ್ಯಯನ ಸ್ಟ್ರೀಕ್ ${demoStudent.streakDays} ದಿನಗಳು ಮತ್ತು ನೀವು ${d.xp} XP ಗಳಿಸಿದ್ದೀರಿ!`
        : `Ananya, you currently have a ${demoStudent.streakDays}-day streak, ${d.xp} XP, and 1 completed syllabus chapter!`;
      matchedAction = "Announced Learning Progress";
      actionLink = { label: "View Detailed Progress", to: "/progress" };
    } else if (
      lower.includes("read") ||
      lower.includes("aloud") ||
      lower.includes("पढ़ो") ||
      lower.includes("ಓದಿ")
    ) {
      category = "READ ALOUD";
      reply = selectedLang === "hi"
        ? "एनसीईआरटी विज्ञान परिभाषा को बोलकर सुनाया जा रहा है।"
        : selectedLang === "kn"
        ? "ವಿಜ್ಞಾನ ಪಠ್ಯವನ್ನು ಗಟ್ಟಿಯಾಗಿ ಓದಲಾಗುತ್ತಿದೆ."
        : "Reading aloud the official NCERT lesson summary.";
      matchedAction = "Triggered Curriculum Read-Aloud";
    } else {
      category = "INQUIRY";
      reply = selectedLang === "hi"
        ? `कमांड "${raw}" प्राप्त हुआ। आप 'पाठ खोलें', 'प्रश्नोत्तरी शुरू करें' या 'प्रगति जांचें' कह सकते हैं।`
        : selectedLang === "kn"
        ? `"${raw}" ಆಜ್ಞೆ ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ನೀವು 'ಪಾಠ ತೆರೆಯಿರಿ', 'ರಸಪ್ರಶ್ನೆ ಪ್ರಾರಂಭಿಸಿ' ಅಥವಾ 'ಪ್ರಗತಿ ಪರಿಶೀಲಿಸಿ' ಎಂದು ಹೇಳಬಹುದು.`
        : `Command recognized: "${raw}". Supported commands: Open lesson, Start quiz, Read question, or Check progress.`;
      matchedAction = "Educational Voice Assistance";
    }

    setCurrentCategory(category);
    setActiveActionLink(actionLink);

    // Speak and log response
    speakText(reply, selectedLang);

    setVoiceLogs((prev) => [
      {
        id: `v-${Date.now()}`,
        commandRecognized: raw,
        matchedAction,
        category,
        matchScore: 95,
        language: selectedLang === "hi" ? "हिन्दी" : selectedLang === "kn" ? "ಕನ್ನಡ" : "English",
        response: reply,
        timestamp: "Just now"
      },
      ...prev
    ]);

    d.awardActivityXp("voice-command-practice", 15, "Executed educational voice command");
  };

  // Tap-to-Talk execution handler
  const handleTapToTalk = () => {
    if (micState === "listening") {
      setMicState("processing");
      setTimeout(() => {
        const sampleCommands = {
          en: "Open fractions lesson",
          hi: "भिन्न पाठ खोलें",
          kn: "ಭಿನ್ನರಾಶಿಗಳ ಪಾಠ ತೆರೆಯಿರಿ"
        };
        processVoiceCommand(sampleCommands[selectedLang]);
      }, 600);
      return;
    }

    if (micState === "speaking") {
      handleStopSpeech();
      return;
    }

    // Start Tap-to-Talk
    setMicState("requesting_permission");
    setTimeout(() => {
      setMicState("listening");
      setTranscription(
        selectedLang === "hi"
          ? "सुन रहा हूँ... अपना शैक्षिक कमांड बोलें"
          : selectedLang === "kn"
          ? "ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ... ನಿಮ್ಮ ಆಜ್ಞೆಯನ್ನು ಮಾತನಾಡಿ"
          : "Listening... Speak your educational command"
      );
    }, 350);
  };

  const handleCancelAndReset = () => {
    handleStopSpeech();
    setMicState("idle");
    setTranscription("Tap the microphone button to speak your educational command...");
    setSpokenResponse(null);
    setActiveActionLink(null);
  };

  const handleTextAlternativeSubmit = () => {
    if (!textAlternativeInput.trim()) return;
    processVoiceCommand(textAlternativeInput.trim());
    setTextAlternativeInput("");
  };

  const handleReadAloudSnippet = (snippet: typeof READ_ALOUD_CURRICULUM[0]) => {
    setActiveReaderId(snippet.id);
    setIsReadingAloud(true);
    const textToSpeak = selectedLang === "hi" ? snippet.textHi : selectedLang === "kn" ? snippet.textKn : snippet.textEn;
    speakText(textToSpeak, selectedLang);
  };

  const handleToggleDownloadPack = (packCode: Lang) => {
    setLanguagePacks((prev) =>
      prev.map((p) => {
        if (p.code === packCode) {
          const nextState = !p.downloaded;
          if (nextState) {
            toast.success(`${p.name} Downloaded (${p.sizeMb} MB)`, {
              description: "Model ready for zero-cellular offline inference on school server."
            });
          } else {
            toast.info(`${p.name} Removed`, {
              description: "Storage released on device cache."
            });
          }
          return { ...p, downloaded: nextState };
        }
        return p;
      })
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & PRIVACY STATUS                                            */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
            <Headphones className="w-5 h-5 text-[#6541F5]" />
            VidyaVoice AI Assistant
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
            Voice companion for school curriculum, textbook read-aloud, and offline language models.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge className="bg-[#DDF8EE] text-[#19B99A] hover:bg-[#DDF8EE] border border-[#19B99A]/30 text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Child Privacy Protected
          </Badge>
          <Badge className="bg-[#EAE7FF] text-[#6541F5] hover:bg-[#EAE7FF] border border-[#6541F5]/30 text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1.5">
            <WifiOff className="w-3.5 h-3.5" /> Offline Capable
          </Badge>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. THREE-REGION MAIN LAYOUT (Matching Reference Composition)              */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
        {/* ======================================================================= */}
        {/* REGION 1: LEFT PANEL — PREVIOUS SEARCH HISTORY (3 Cols on lg)           */}
        {/* ======================================================================= */}
        <div className="lg:col-span-3 card-surface rounded-3xl border border-border p-4.5 sm:p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <h2 className="font-black text-sm text-foreground tracking-tight">
                Previous Search History
              </h2>
              <Badge variant="outline" className="text-[10px] font-bold text-muted-foreground">
                {voiceLogs.length} items
              </Badge>
            </div>

            {/* 2-Column Grid of Compact History Cards matching reference */}
            <div className="grid grid-cols-2 gap-2.5 max-h-[460px] overflow-y-auto pr-1 no-scrollbar">
              {voiceLogs.map((item) => {
                const score = item.matchScore || 85;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => processVoiceCommand(item.commandRecognized)}
                    className="rounded-2xl border border-border/80 bg-background/50 hover:bg-[#EAE7FF]/25 hover:border-[#6541F5]/40 p-3 text-left transition-all shadow-2xs group flex flex-col justify-between min-h-[92px]"
                  >
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-[#6541F5] block truncate">
                        {item.category || "SEARCH"}
                      </span>
                      <h3 className="font-bold text-xs text-foreground mt-0.5 line-clamp-2 leading-tight group-hover:text-[#6541F5] transition-colors">
                        {item.commandRecognized}
                      </h3>
                    </div>

                    <div className="space-y-1 pt-2">
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
                        <span>{score}%</span>
                        <span className="text-[9px]">{item.timestamp}</span>
                      </div>
                      <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#19B99A] rounded-full"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Downward Scroll Indicator Hint at Bottom */}
          <div className="pt-2 border-t border-border flex justify-center">
            <button
              type="button"
              className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Scroll history"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* REGION 2: CENTER PANEL — VOICE INTERACTION (6 Cols on lg)               */}
        {/* ======================================================================= */}
        <div className="lg:col-span-6 card-surface rounded-3xl border border-border p-6 sm:p-8 shadow-sm flex flex-col justify-between items-center text-center relative overflow-hidden min-h-[580px]">
          {/* Top Status & Language Switcher Pill */}
          <div className="w-full flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
              <Radio className="w-3.5 h-3.5 text-[#6541F5] animate-pulse" />
              <span>Voice Engine Active</span>
            </div>

            {/* Language Selector Pills */}
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl border border-border">
              {[
                { code: "en", label: "EN" },
                { code: "hi", label: "हिन्दी" },
                { code: "kn", label: "ಕನ್ನಡ" }
              ].map((l) => (
                <button
                  key={l.code}
                  onClick={() => setSelectedLang(l.code as Lang)}
                  className={cn(
                    "px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all",
                    selectedLang === l.code
                      ? "bg-[#6541F5] text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Center Visual: Large Circular Interactive Voice Sphere */}
          <div className="my-auto py-6 flex flex-col items-center justify-center relative w-full">
            {/* Glowing Outer Sphere Container */}
            <div className="relative flex items-center justify-center w-60 h-60 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full border-2 border-[#5037ED]/30 dark:border-[#6541F5]/40 bg-gradient-to-b from-[#5037ED]/10 via-[#19B99A]/5 to-transparent shadow-[0_0_60px_rgba(80,55,237,0.18)] transition-all duration-500">
              {/* Outer pulsing ring when listening */}
              {micState === "listening" && (
                <span className="absolute inset-0 rounded-full border-4 border-[#6541F5] animate-ping opacity-25" />
              )}
              {micState === "speaking" && (
                <span className="absolute inset-0 rounded-full border-4 border-[#19B99A] animate-ping opacity-20" />
              )}

              {/* Dynamic Animated Frequency Audio Waveform inside the sphere */}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none p-4">
                <svg viewBox="0 0 240 120" className="w-full h-full opacity-85">
                  <defs>
                    <linearGradient id="voiceWaveGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#42A5E8" />
                      <stop offset="50%" stopColor="#6541F5" />
                      <stop offset="100%" stopColor="#19B99A" />
                    </linearGradient>
                  </defs>

                  {/* Wave 1 */}
                  <path
                    d={
                      micState === "listening"
                        ? "M 10 60 Q 60 10, 120 60 T 230 60"
                        : micState === "speaking"
                        ? "M 10 60 Q 60 20, 120 60 T 230 60"
                        : "M 10 60 Q 60 45, 120 60 T 230 60"
                    }
                    fill="none"
                    stroke="url(#voiceWaveGrad)"
                    strokeWidth={micState === "listening" || micState === "speaking" ? 3.5 : 2}
                    className={cn(
                      "transition-all duration-300",
                      (micState === "listening" || micState === "speaking") && "animate-pulse"
                    )}
                  />

                  {/* Wave 2 (Counter balance wave) */}
                  <path
                    d={
                      micState === "listening"
                        ? "M 10 60 Q 60 110, 120 60 T 230 60"
                        : micState === "speaking"
                        ? "M 10 60 Q 60 95, 120 60 T 230 60"
                        : "M 10 60 Q 60 75, 120 60 T 230 60"
                    }
                    fill="none"
                    stroke="url(#voiceWaveGrad)"
                    strokeWidth={1.5}
                    opacity={0.6}
                    className={cn(
                      "transition-all duration-300",
                      (micState === "listening" || micState === "speaking") && "animate-pulse"
                    )}
                  />
                </svg>
              </div>

              {/* Central Sphere Core Pulse Glow */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#6541F5]/20 via-[#19B99A]/20 to-[#42A5E8]/20 blur-md pointer-events-none" />
            </div>

            {/* Prompt Subtitle & State Text directly below the sphere */}
            <div className="mt-5 space-y-2 max-w-md">
              <p className="text-xs sm:text-sm font-semibold text-[#42A5E8] dark:text-[#50A7F5] italic truncate px-4">
                {transcription}
              </p>

              <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                {micState === "listening"
                  ? "Listening..."
                  : micState === "speaking"
                  ? "Speaking..."
                  : micState === "processing"
                  ? "Processing..."
                  : "Tap to Speak"}
              </h2>

              {/* Primary Interactive Microphone Button */}
              <div className="pt-2 flex justify-center">
                <button
                  id="voice-mic-btn"
                  onClick={handleTapToTalk}
                  aria-label={micState === "listening" ? "Stop listening" : "Tap to speak command"}
                  className={cn(
                    "w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-md",
                    micState === "listening"
                      ? "bg-[#6541F5] text-white scale-110 shadow-[0_0_30px_rgba(101,65,245,0.5)] animate-pulse"
                      : micState === "speaking"
                      ? "bg-[#19B99A] text-white scale-105 shadow-[0_0_25px_rgba(25,185,154,0.5)]"
                      : "bg-[#5037ED] text-white hover:bg-[#432BCF] hover:scale-105"
                  )}
                >
                  {micState === "speaking" ? (
                    <Volume2 className="w-7 h-7 animate-pulse" />
                  ) : (
                    <Mic className="w-7 h-7" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Controls Dock inspired by reference */}
          <div className="w-full pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelAndReset}
                className="h-8 text-xs font-semibold border-border hover:bg-muted rounded-xl"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1 text-[#E95778]" /> Reset Audio
              </Button>
            </div>

            <span className="text-[11px] text-muted-foreground font-medium">
              Tap once to speak · No always-on recording
            </span>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* REGION 3: RIGHT PANEL — COMMANDS & RESULTS (3 Cols on lg)               */}
        {/* ======================================================================= */}
        <div className="lg:col-span-3 card-surface rounded-3xl border border-border p-4.5 sm:p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            {/* 1. Searched By Command Section */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h2 className="font-black text-sm text-foreground tracking-tight">
                  Searched By Command
                </h2>
                <Badge className="bg-[#DDF8EE] text-[#19B99A] text-[10px] font-bold">
                  95.8% Match
                </Badge>
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Command Query
                  </span>
                  <p className="font-bold text-foreground text-xs line-clamp-2">
                    {transcription}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Curriculum Category
                  </span>
                  <span className="font-bold text-xs text-[#6541F5]">
                    {currentCategory}
                  </span>
                </div>

                {/* Spoken Response Feedback */}
                {spokenResponse && (
                  <div className="rounded-xl border border-[#19B99A]/30 bg-[#DDF8EE]/40 p-2.5 mt-2 space-y-1.5">
                    <span className="text-[10px] font-bold text-[#19B99A] flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5" /> Response
                    </span>
                    <p className="text-[11px] text-foreground leading-snug line-clamp-3">
                      {spokenResponse}
                    </p>
                    {activeActionLink && (
                      <Button
                        size="sm"
                        onClick={() => navigate({ to: activeActionLink.to as any })}
                        className="w-full bg-[#19B99A] hover:bg-[#14957c] text-white text-xs font-bold h-7 rounded-lg mt-1"
                      >
                        {activeActionLink.label} <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 2. Curriculum Read-Aloud Practice Cards */}
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground block">
                Read-Aloud Lessons
              </span>

              <div className="space-y-2">
                {READ_ALOUD_CURRICULUM.map((snip) => {
                  const isCurrent = isReadingAloud && activeReaderId === snip.id;
                  return (
                    <div
                      key={snip.id}
                      className={cn(
                        "rounded-xl border p-2.5 text-xs transition-colors space-y-1.5",
                        isCurrent
                          ? "border-[#19B99A] bg-[#DDF8EE]/20"
                          : "border-border bg-background/50 hover:bg-muted/40"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] text-foreground truncate max-w-[140px]">
                          {snip.title}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            isCurrent ? handleStopSpeech() : handleReadAloudSnippet(snip)
                          }
                          className="h-6 px-2 text-[10px] font-bold text-[#6541F5] hover:bg-[#6541F5]/10"
                        >
                          {isCurrent ? (
                            <>
                              <Square className="w-2.5 h-2.5 mr-1 text-[#E95778]" /> Stop
                            </>
                          ) : (
                            <>
                              <Play className="w-2.5 h-2.5 mr-1 fill-current" /> Play
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-[10px] text-muted-foreground line-clamp-1 italic">
                        "{snip.textEn}"
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Offline Language Models Preview */}
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground block">
                Offline Models
              </span>
              <div className="space-y-1.5">
                {languagePacks.map((pack) => (
                  <div
                    key={pack.code}
                    className="rounded-xl border border-border bg-background/40 p-2 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-[11px] text-foreground block">
                        {pack.nativeName}
                      </span>
                      <span className="text-[9px] text-muted-foreground">
                        {pack.sizeMb} MB
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleDownloadPack(pack.code)}
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-md border transition-colors",
                        pack.downloaded
                          ? "border-[#19B99A]/40 text-[#19B99A] bg-[#DDF8EE]/50"
                          : "border-[#6541F5]/40 text-[#6541F5] hover:bg-[#6541F5]/10"
                      )}
                    >
                      {pack.downloaded ? "Cached" : "Download"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. KEYBOARD / TOUCH TEXT ALTERNATIVE FOR NO-MIC ENVIRONMENTS              */}
      {/* ========================================================================= */}
      <div className="card-surface rounded-2xl border border-border p-4 shadow-2xs space-y-2">
        <label
          htmlFor="text-alternative-input"
          className="text-xs font-bold text-muted-foreground flex items-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5 text-[#6541F5]" />
          <span>Text Alternative (For noisy classrooms or devices without microphone):</span>
        </label>
        <div className="flex gap-2">
          <input
            id="text-alternative-input"
            value={textAlternativeInput}
            onChange={(e) => setTextAlternativeInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTextAlternativeSubmit()}
            placeholder="Type command: 'Open fractions lesson', 'Check my streak', 'Start quiz'..."
            className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-[#6541F5]"
          />
          <Button
            size="sm"
            onClick={handleTextAlternativeSubmit}
            disabled={!textAlternativeInput.trim()}
            className="bg-[#6541F5] text-white hover:bg-[#5230E8] font-bold text-xs px-4 rounded-xl"
          >
            Execute
          </Button>
        </div>
      </div>

      <SimNote>
        Audio synthesis uses local device Web Speech API with regional fallbacks. Acoustic packs emulate quantized whisper-tiny models hosted on the local school micro-mesh server.
      </SimNote>
    </div>
  );
}
