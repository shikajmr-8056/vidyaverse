import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Mic, Volume2, Sparkles, Languages, Radio, CheckCircle2,
  Headphones, Play, Square, RotateCcw, Clock, ShieldCheck,
  Download, HardDrive, Wifi, WifiOff, AlertTriangle, ArrowRight,
  BookOpen, Trophy, FileText, Check, HelpCircle, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader, Panel, SimNote } from "@/components/vv/primitives";
import { useDemo, type Lang } from "@/lib/demo-store";
import { demoStudent } from "@/data/demo";
import { toast } from "sonner";

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

  const [voiceLogs, setVoiceLogs] = useState<VoiceLog[]>([
    {
      id: "v-init-1",
      commandRecognized: "Open fractions lesson",
      matchedAction: "Navigated to /lesson/fractions-intro",
      language: "English",
      response: "Opening 'What a fraction really means' lesson.",
      timestamp: "10 mins ago"
    },
    {
      id: "v-init-2",
      commandRecognized: "Check my study streak",
      matchedAction: "Read progress metrics",
      language: "English",
      response: "Ananya, you currently have a 6-day learning streak and 1,240 XP earned!",
      timestamp: "1 hour ago"
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
    let actionLink: { label: string; to: string } | null = null;

    if (
      lower.includes("fraction") ||
      lower.includes("भिन्न") ||
      lower.includes("ಭಿನ್ನರಾಶಿ")
    ) {
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
      reply = selectedLang === "hi"
        ? "एनसीईआरटी विज्ञान परिभाषा को बोलकर सुनाया जा रहा है।"
        : selectedLang === "kn"
        ? "ವಿಜ್ಞಾನ ಪಠ್ಯವನ್ನು ಗಟ್ಟಿಯಾಗಿ ಓದಲಾಗುತ್ತಿದೆ."
        : "Reading aloud the official NCERT lesson summary.";
      matchedAction = "Triggered Curriculum Read-Aloud";
    } else {
      reply = selectedLang === "hi"
        ? `कमांड "${raw}" प्राप्त हुआ। आप 'पाठ खोलें', 'प्रश्नोत्तरी शुरू करें' या 'प्रगति जांचें' कह सकते हैं।`
        : selectedLang === "kn"
        ? `"${raw}" ಆಜ್ಞೆ ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ನೀವು 'ಪಾಠ ತೆರೆಯಿರಿ', 'ರಸಪ್ರಶ್ನೆ ಪ್ರಾರಂಭಿಸಿ' ಅಥವಾ 'ಪ್ರಗತಿ ಪರಿಶೀಲಿಸಿ' ಎಂದು ಹೇಳಬಹುದು.`
        : `Command recognized: "${raw}". Supported commands: Open lesson, Start quiz, Read question, or Check progress.`;
      matchedAction = "Educational Voice Assistance";
    }

    setActiveActionLink(actionLink);

    // Speak and log response
    speakText(reply, selectedLang);

    setVoiceLogs((prev) => [
      {
        id: `v-${Date.now()}`,
        commandRecognized: raw,
        matchedAction,
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
      // User tapped again to stop listening
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
          ? "सुन रहा हूँ... अपना शैक्षिक कमांड बोलें (रोकने के लिए दोबारा टैप करें)"
          : selectedLang === "kn"
          ? "ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ... ನಿಮ್ಮ ಆಜ್ಞೆಯನ್ನು ಮಾತನಾಡಿ (ನಿಲ್ಲಿಸಲು ಮತ್ತೆ ಟ್ಯಾಪ್ ಮಾಡಿ)"
          : "Listening... Speak your educational command (Tap again to finish)"
      );
    }, 400);
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
    <div className="space-y-6">
      <PageHeader
        title="VidyaVerse Voice: Audio Assistant"
        description="Tap-to-talk voice companion designed for rural and multilingual learners. Supports curriculum commands, read-aloud practice, and transparent offline models."
        eyebrow={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAE7FF] px-3 py-1 text-xs font-bold text-[#6541F5]">
            <Headphones className="h-3.5 w-3.5" /> Multilingual Audio Engine
          </span>
        }
      />

      {/* Honest Privacy & Model Disclosure Banner */}
      <div className="rounded-xl border border-[#19B99A]/30 bg-[#DDF8EE]/40 p-4 text-xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-bold text-[#19B99A]">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>Child Privacy Protected · Transient Voice Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-card dark:bg-[#19B99A]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#19B99A] border border-[#19B99A]/30">
              <WifiOff className="h-3 w-3" /> Offline Tested on School Mesh
            </span>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed text-[11px]">
          <strong>Transparent Audio Architecture:</strong> Audio commands are processed transiently without persistent recording or advertising tracking. Offline speech synthesis uses quantized regional voice packs. Speech recognition does not claim Siri-level open conversational abilities and operates on a defined syllabus command set.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Interactive Tap-to-Talk Canvas */}
        <div className="lg:col-span-7 card-surface rounded-2xl border border-border p-6 shadow-sm flex flex-col justify-between min-h-[560px]">
          {/* Top Bar: Language Selector & Mic Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <Headphones className="h-5 w-5 text-[#6541F5]" />
              <span className="font-bold text-sm text-foreground">Tap-to-Talk Console</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Voice Language:</span>
              <div className="flex rounded-lg border border-border bg-muted/40 p-0.5">
                {[
                  { code: "en", label: "EN" },
                  { code: "hi", label: "हिन्दी" },
                  { code: "kn", label: "ಕನ್ನಡ" }
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setSelectedLang(l.code as Lang)}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                      selectedLang === l.code
                        ? "bg-[#6541F5] text-white shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Central Microphone Touch Target & Waveform */}
          <div className="my-8 flex flex-col items-center">
            {/* Status Indicator Badge */}
            <div className="mb-4">
              {micState === "listening" && (
                <Badge className="bg-[#6541F5] text-white animate-pulse">
                  Listening (Tap again to stop)
                </Badge>
              )}
              {micState === "speaking" && (
                <Badge className="bg-[#19B99A] text-white">
                  Speaking Response...
                </Badge>
              )}
              {micState === "processing" && (
                <Badge className="bg-[#F5A623] text-white">
                  Matching Syllabus Command...
                </Badge>
              )}
              {micState === "idle" && (
                <Badge variant="outline" className="border-border text-muted-foreground">
                  Tap to Talk (Not Always-On)
                </Badge>
              )}
            </div>

            {/* Tap-to-Talk Circular Button */}
            <button
              id="voice-mic-btn"
              onClick={handleTapToTalk}
              aria-label={micState === "listening" ? "Stop listening" : "Tap to speak command"}
              className={`relative flex h-28 w-28 items-center justify-center rounded-full transition-all duration-300 shadow-md ${
                micState === "listening"
                  ? "bg-[#6541F5] text-white scale-110 shadow-[0_0_35px_rgba(101,65,245,0.4)] animate-pulse"
                  : micState === "speaking"
                  ? "bg-[#19B99A] text-white scale-105 shadow-[0_0_30px_rgba(25,185,154,0.4)]"
                  : "bg-[#EAE7FF] text-[#6541F5] border-2 border-[#6541F5]/40 hover:scale-105 hover:border-[#6541F5]"
              }`}
            >
              {micState === "speaking" ? (
                <Volume2 className="h-12 w-12 animate-pulse" />
              ) : (
                <Mic className="h-12 w-12" />
              )}
              {micState === "listening" && (
                <span className="absolute inset-0 rounded-full border-4 border-[#6541F5] animate-ping opacity-30" />
              )}
            </button>

            <span className="mt-4 text-xs font-semibold text-muted-foreground">
              {micState === "listening"
                ? "Listening... Speak your syllabus command"
                : micState === "speaking"
                ? "Reading response aloud. Tap button to stop."
                : "Tap Once to Speak • No Always-On Background Listening"}
            </span>

            {/* Audio Waveform Bars */}
            <div className="mt-4 flex items-center gap-1.5 h-8">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    micState === "listening" || micState === "speaking"
                      ? "bg-[#6541F5] animate-pulse"
                      : "bg-muted"
                  }`}
                  style={{
                    height: micState === "listening" || micState === "speaking"
                      ? `${Math.floor(Math.sin(i * 0.8) * 16) + 12}px`
                      : "6px"
                  }}
                />
              ))}
            </div>

            {/* Cancel & Stop Button */}
            {(micState !== "idle" || spokenResponse) && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelAndReset}
                className="mt-4 text-xs font-semibold border-border hover:bg-muted"
              >
                <Square className="h-3 w-3 mr-1.5 text-[#E95778]" /> Cancel & Reset Audio
              </Button>
            )}
          </div>

          {/* Recognized Command & Output Feedback */}
          <div className="w-full space-y-3 pt-3 border-t border-border">
            <div className="rounded-xl border border-border bg-muted/30 p-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6541F5] block mb-0.5">
                Recognized Command
              </span>
              <p className="text-xs font-medium text-foreground italic">{transcription}</p>
            </div>

            {spokenResponse && (
              <div className="rounded-xl border border-[#19B99A]/30 bg-[#DDF8EE]/50 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#19B99A] flex items-center gap-1.5">
                    <Volume2 className="h-4 w-4" /> Spoken Educational Feedback
                  </span>
                  <Badge variant="outline" className="border-[#19B99A]/40 bg-card dark:bg-[#19B99A]/15 text-[#19B99A] text-[10px]">
                    Audio Readout
                  </Badge>
                </div>
                <p className="text-xs text-foreground leading-relaxed font-medium">{spokenResponse}</p>

                {/* Direct Action Link if recognized command maps to a route */}
                {activeActionLink && (
                  <div className="pt-2 border-t border-[#19B99A]/20 flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => navigate({ to: activeActionLink?.to as any })}
                      className="bg-[#19B99A] text-white hover:bg-[#14957c] text-xs font-bold"
                    >
                      {activeActionLink.label} <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Keyboard & Touch Text Alternative for No-Mic / Noisy Environments */}
          <div className="mt-4 pt-3 border-t border-border space-y-1.5">
            <label htmlFor="text-alternative-input" className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5">
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
                className="bg-[#6541F5] text-white hover:bg-[#5230E8] font-bold text-xs"
              >
                Execute
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Supported Commands, Curriculum Reader & Downloadable Language Packs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Supported Command Set Palette */}
          <Panel title="Supported Curriculum Voice Commands">
            <p className="text-xs text-muted-foreground mb-3">
              Tap any example command to test execution without speech recognition:
            </p>
            <div className="space-y-2">
              {[
                { cmd: "Open fractions lesson", lang: "English", desc: "Routes directly to Fractions Intro lesson" },
                { cmd: "Start fractions quiz", lang: "English", desc: "Launches Chapter 2 practice quiz" },
                { cmd: "Check my study streak", lang: "English", desc: "Reads out days, XP, and weekly progress" },
                { cmd: "भिन्न पाठ खोलें", lang: "हिन्दी", desc: "गणित अध्याय 2 पाठ खोलता है" },
                { cmd: "ಭಿನ್ನರಾಶಿಗಳ ಪಾಠ ತೆರೆಯಿರಿ", lang: "ಕನ್ನಡ", desc: "ಗಣಿತ ಪಾಠವನ್ನು ನೇರವಾಗಿ ತೆರೆಯುತ್ತದೆ" }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => processVoiceCommand(item.cmd)}
                  className="w-full rounded-xl border border-border card-surface p-2.5 text-left hover:border-[#6541F5] hover:bg-[#EAE7FF]/30 transition-all flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">"{item.cmd}"</span>
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                        {item.lang}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  <Play className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </Panel>

          {/* Curriculum Read-Aloud Reader */}
          <Panel title="Curriculum Read-Aloud Reader">
            <p className="text-xs text-muted-foreground mb-3">
              Test text-to-speech pronunciation on approved textbook definitions:
            </p>
            <div className="space-y-3">
              {READ_ALOUD_CURRICULUM.map((snip) => {
                const isCurrentReading = isReadingAloud && activeReaderId === snip.id;
                const displayText = selectedLang === "hi" ? snip.textHi : selectedLang === "kn" ? snip.textKn : snip.textEn;

                return (
                  <div
                    key={snip.id}
                    className={`rounded-xl border p-3 text-xs space-y-2 transition-all ${
                      isCurrentReading ? "border-[#19B99A] bg-[#DDF8EE]/20" : "border-border card-surface"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground text-[11px]">{snip.title}</span>
                      <Button
                        size="sm"
                        variant={isCurrentReading ? "default" : "outline"}
                        onClick={() => (isCurrentReading ? handleStopSpeech() : handleReadAloudSnippet(snip))}
                        className={`h-7 px-2.5 text-[11px] font-bold ${
                          isCurrentReading ? "bg-[#19B99A] text-white hover:bg-[#14957c]" : ""
                        }`}
                      >
                        {isCurrentReading ? (
                          <>
                            <Square className="h-3 w-3 mr-1" /> Stop
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-3 w-3 mr-1 text-[#6541F5]" /> Read Aloud
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-muted-foreground text-[11px] leading-relaxed italic">
                      "{displayText}"
                    </p>
                  </div>
                );
              })}
            </div>
          </Panel>

          {/* Downloadable Local Language Packs */}
          <Panel title="Downloadable Local Language Models">
            <p className="text-xs text-muted-foreground mb-3">
              Optional regional acoustic packs for offline execution without active cellular data:
            </p>
            <div className="space-y-2.5">
              {languagePacks.map((pack) => (
                <div
                  key={pack.code}
                  className="rounded-xl border border-border card-surface p-3 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-foreground">{pack.nativeName}</span>
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                        {pack.version}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {pack.name} · {pack.sizeMb} MB footprint
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant={pack.downloaded ? "outline" : "default"}
                    onClick={() => handleToggleDownloadPack(pack.code)}
                    className={`h-8 px-3 text-xs font-semibold ${
                      pack.downloaded
                        ? "border-[#19B99A]/40 text-[#19B99A] hover:bg-[#DDF8EE]"
                        : "bg-[#6541F5] text-white hover:bg-[#5230E8]"
                    }`}
                  >
                    {pack.downloaded ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1" /> Cached
                      </>
                    ) : (
                      <>
                        <Download className="h-3.5 w-3.5 mr-1" /> Download
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </Panel>

          <SimNote>
            Audio synthesis uses local device Web Speech API with regional fallbacks. Acoustic packs emulate quantized whisper-tiny models hosted on the local school micro-mesh server.
          </SimNote>
        </div>
      </div>
    </div>
  );
}
