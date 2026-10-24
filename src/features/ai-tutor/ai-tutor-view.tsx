import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bot, Send, Sparkles, Lightbulb, CheckCircle2,
  BookOpen, ShieldCheck, AlertTriangle, RotateCcw,
  ExternalLink, Languages, Info, Paperclip,
  Image as ImageIcon, Mic, MicOff, Share2, Plus, ArrowUp, X,
  SlidersHorizontal, Check, Copy, Zap, Workflow, RefreshCw, Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useDemo, type Lang } from "@/lib/demo-store";
import { misconceptions } from "@/data/demo";
import { cn } from "@/lib/utils";
import {
  getN8nConfig,
  saveN8nConfig,
  sendChatMessageToN8n,
  testN8nConnection,
  resetN8nSession,
  DEFAULT_WEBHOOK_ID,
  DEFAULT_SYSTEM_PROMPT,
  getDefaultWebhookUrl,
  type N8nWorkflowConfig,
} from "@/services/n8n-tutor";

interface PracticeQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "tutor";
  timestamp: string;
  text: string;
  sourceEngine?: "n8n-agent" | "offline-curriculum" | undefined;
  modelUsed?: string | undefined;
  // Pedagogical scaffolding
  groundedLessonId?: string | undefined;
  groundedLessonTitle?: string | undefined;
  groundedChapter?: string | undefined;
  steps?: string[] | undefined;
  analogy?: {
    title: string;
    text: string;
  } | undefined;
  hint?: string | undefined;
  practice?: PracticeQuestion | undefined;
  followUps?: string[] | undefined;
  isUncertain?: boolean | undefined;
  uncertaintyReason?: string | undefined;
  languageUsed?: Lang | undefined;
  attachment?: {
    name: string;
    size: string;
  } | undefined;
}

interface AiTutorViewProps {
  initialQuery?: string;
}

// Approved curriculum diagnostic knowledge entries
const CURRICULUM_KNOWLEDGE: Array<{
  id: string;
  keywords: string[];
  lessonId: string;
  lessonTitle: string;
  chapter: string;
  subject: string;
  diagnosticTitle: string;
  steps: string[];
  analogy: { title: string; text: string };
  hint: string;
  practice: PracticeQuestion;
  followUps: string[];
  hi: { steps: string[]; analogyText: string; hint: string };
  kn: { steps: string[]; analogyText: string; hint: string };
}> = [
  {
    id: "fractions-addition",
    keywords: ["fraction", "1/2", "1/3", "numerator", "denominator", "add fractions", "halves", "thirds", "भिन्न", "ಭಿನ್ನರಾಶಿ"],
    lessonId: "fractions-intro",
    lessonTitle: "What a fraction really means",
    chapter: "NCERT Class 7 Maths · Ch 2",
    subject: "Mathematics",
    diagnosticTitle: "Numerator Addition Misconception (1/2 + 1/3 ≠ 2/5)",
    steps: [
      "Identify the parts: Denominators represent slice size. A 1/2 slice is larger than a 1/3 slice.",
      "Find equal cut sizes: You cannot count different sized slices together directly. Cut both into equal sixths: 1/2 = 3/6 and 1/3 = 2/6.",
      "Combine like pieces: Add the numerators of the shared size: 3/6 + 2/6 = 5/6."
    ],
    analogy: {
      title: "Village Chapati / Roti Sharing",
      text: "Imagine two chapatis. Half a chapati (1/2) is a giant semicircle. One-third (1/3) is a smaller triangle slice. If you combine them, you clearly have MORE than a half! But 2/5 is LESS than half. You must cut both chapatis into 6 equal smaller pieces before counting them together."
    },
    hint: "The bottom number (denominator) tells you the slice size. Look for a common denominator before adding.",
    practice: {
      question: "Test your understanding: What is 1/4 + 1/2?",
      options: ["2/6", "3/4", "2/4", "1/6"],
      correctIndex: 1,
      explanation: "Convert 1/2 into equivalent fourths: 1/2 = 2/4. Then add numerators: 1/4 + 2/4 = 3/4."
    },
    followUps: [
      "Why do we need a common denominator?",
      "How do we multiply fractions?",
      "What is an improper fraction?"
    ],
    hi: {
      steps: [
        "भागों को पहचानें: हर (denominator) टुकड़े के आकार को दर्शाता है। 1/2 टुकड़ा 1/3 से बड़ा है।",
        "समान आकार खोजें: अलग-अलग आकार के टुकड़ों को सीधे नहीं जोड़ सकते। दोनों को 6 बराबर भागों में काटें: 1/2 = 3/6 और 1/3 = 2/6।",
        "समान भागों को जोड़ें: 3/6 + 2/6 = 5/6।"
      ],
      analogyText: "रोटी का उदाहरण लें: 1/2 रोटी एक बड़ा आधा टुकड़ा है और 1/3 छोटा कोना है। दोनों को मिलाएंगे तो आधे से ज्यादा मिलेगा, जबकि 2/5 आधे से भी कम है! इसलिए पहले दोनों को बराबर 6 टुकड़ों में बांटना जरूरी है।",
      hint: "हर (denominator) आकार बताता है। जोड़ने से पहले समान हर (LCM) निकालें।"
    },
    kn: {
      steps: [
        "ಭಾಗಗಳನ್ನು ಗುರುತಿಸಿ: ಛೇದವು ತುಂಡಿನ ಗಾತ್ರವನ್ನು ಸೂಚಿಸುತ್ತದೆ. 1/2 ಭಾಗವು 1/3 ಗಿಂತ ದೊಡ್ಡದಾಗಿದೆ.",
        "ಸಮಾನ ಗಾತ್ರ ಕಂಡುಕೊಳ್ಳಿ: ವಿಭಿನ್ನ ಗಾತ್ರದ ತುಂಡುಗಳನ್ನು ನೇರವಾಗಿ ಕೂಡಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ. ಎರಡನ್ನೂ 6 ಸಮಾನ ಭಾಗಗಳಾಗಿ ಮಾಡಿ: 1/2 = 3/6 ಮತ್ತು 1/3 = 2/6.",
        "ಒಟ್ಟುಗೂಡಿಸಿ: 3/6 + 2/6 = 5/6."
      ],
      analogyText: "ರೊಟ್ಟಿಯ ತುಂಡುಗಳನ್ನು ಊಹಿಸಿ: ಅರ್ಧ ರೊಟ್ಟಿ (1/2) ದೊಡ್ಡದಾಗಿರುತ್ತದೆ, ಮೂರನೇ ಒಂದು ಭಾಗ (1/3) ಚಿಕ್ಕದಾಗಿರುತ್ತದೆ. ಅವೆರಡನ್ನೂ ಸೇರಿಸಿದರೆ ಅರ್ಧಕ್ಕಿಂತ ಹೆಚ್ಚಾಗುತ್ತದೆ! ಆದ್ದರಿಂದ ಮೊದಲು ಸಮಾನ ಗಾತ್ರದ 6 ತುಂಡುಗಳಾಗಿ ಮಾಡಿ ನಂತರ ಎಣಿಸಿ.",
      hint: "ಛೇದವು ತುಂಡಿನ ಗಾತ್ರವನ್ನು ನಿರ್ಧರಿಸುತ್ತದೆ. ಕೂಡಿಸುವ ಮುನ್ನ ಲ.ಸಾ.ಅ (LCM) ಕಂಡುಹಿಡಿಯಿರಿ."
    }
  },
  {
    id: "electric-switch-source",
    keywords: ["switch", "bulb", "circuit", "battery", "current", "electricity", "cell", "wire", "विद्युत", "ವಿದ್ಯುತ್", "ಸ್ವಿಚ್"],
    lessonId: "electric-circuits",
    lessonTitle: "Electric Current and its Effects",
    chapter: "NCERT Class 7 Science · Ch 14",
    subject: "Science",
    diagnosticTitle: "Switch vs. Source Misconception (Switch does not create electricity)",
    steps: [
      "Distinguish energy source from controller: The chemical cell (battery) stores chemical energy and pushes electrons.",
      "Understand the switch role: The metallic switch only opens or closes a physical gap in the continuous conductive loop.",
      "Flow condition: Current only circulates when the loop is unbroken from positive terminal to negative terminal."
    ],
    analogy: {
      title: "Village Irrigation Canal Sluice Gate",
      text: "Think of an irrigation canal gate in a village paddy field. The sluice gate does NOT produce river water! The reservoir produces the water pressure. The gate only opens to let water flow or closes to block it. Similarly, the battery supplies current; the switch merely completes the pathway."
    },
    hint: "Where is the chemical energy stored? Inside the battery cell, not the switch contact.",
    practice: {
      question: "What is the primary source of electric current in a simple torch?",
      options: ["The metallic slider switch", "The glass reflector", "The chemical dry cell", "The plastic casing"],
      correctIndex: 2,
      explanation: "The chemical dry cell provides the electrical potential difference that drives electrons through the circuit."
    },
    followUps: [
      "What happens when a wire gets too hot?",
      "Why does a fuse wire melt during overload?",
      "What is the difference between open and closed circuits?"
    ],
    hi: {
      steps: [
        "ऊर्जा स्रोत और नियंत्रक में अंतर: सेल में रासायनिक ऊर्जा होती है जो धारा प्रवाहित करती है।",
        "स्विच का कार्य: स्विच केवल परिपथ के खुले या बंद होने को नियंत्रित करता है, बिजली नहीं बनाता।",
        "प्रवाह की शर्त: परिपथ जब पूर्ण (बंद) होता है, तभी धारा प्रवाहित होती है।"
      ],
      analogyText: "खेत की नहर के फाटक को याद करें। फाटक पानी नहीं बनाता, पानी तो कुएं या जलाशय से आता है। फाटक केवल पानी के रास्ते को खोलता या रोकता है।",
      hint: "रासायनिक ऊर्जा सेल के भीतर होती है, स्विच में नहीं।"
    },
    kn: {
      steps: [
        "ಶಕ್ತಿಯ ಮೂಲ ಮತ್ತು ನಿಯಂತ್ರಕದ ವ್ಯತ್ಯಾಸ: ಬ್ಯಾಟರಿ ಸೆಲ್ ರಾಸಾಯನಿಕ ಶಕ್ತಿಯಿಂದ ವಿದ್ಯುತ್ ಪ್ರವಾಹವನ್ನು ಉಂಟುಮಾಡುತ್ತದೆ.",
        "ಸ್ವಿಚ್‌ನ ಪಾತ್ರ: ಸ್ವಿಚ್ ಕೇವಲ ಮಾರ್ಗವನ್ನು ತೆರೆಯುತ್ತದೆ ಅಥವಾ ಮುಚ್ಚುತ್ತದೆ, ವಿದ್ಯುತ್ ಉತ್ಪಾದಿಸುವುದಿಲ್ಲ.",
        "ಪ್ರವಾಹದ ನಿಯಮ: ಸಂಪೂರ್ಣ ಮುಚ್ಚಿದ ಸರ್ಕ್ಯೂಟ್‌ನಲ್ಲಿ ಮಾತ್ರ ಪ್ರವಾಹ ಹರಿಯುತ್ತದೆ."
      ],
      analogyText: "ಹಳ್ಳಿಯ ಕಾಲುವೆಯ ಗೇಟ್ ಅನ್ನು ನೆನಪಿಸಿಕೊಳ್ಳಿ. ಗೇಟ್ ನೀರನ್ನು ಸೃಷ್ಟಿಸುವುದಿಲ್ಲ, ಜಲಾಶಯದಿಂದ ನೀರು ಬರುತ್ತದೆ. ಗೇಟ್ ಕೇವಲ ನೀರು ಹರಿಯಲು ದಾರಿ ಮಾಡಿಕೊಡುತ್ತದೆ.",
      hint: "ರಾಸಾಯನಿಕ ಶಕ್ತಿಯು ಬ್ಯಾಟರಿ ಕೋಶದಲ್ಲಿದೆ, ಸ್ವಿಚ್‌ನಲ್ಲಿ ಅಲ್ಲ."
    }
  },
  {
    id: "decimal-digits-value",
    keywords: ["decimal", "0.5", "0.45", "0.7", "0.65", "place value", "digits", "tenths", "hundredths", "दशमलव", "ದಶಮಾಂಶ"],
    lessonId: "decimals-place-value",
    lessonTitle: "Decimals and Place Value",
    chapter: "NCERT Class 7 Maths · Ch 2",
    subject: "Mathematics",
    diagnosticTitle: "Digit Count Misconception in Decimals (0.5 > 0.45)",
    steps: [
      "Understand place value weight: In decimals, positions immediately right of the dot have greater value than positions further right.",
      "Compare tenths first: In 0.5, there are 5 tenths (0.50). In 0.45, there are only 4 tenths and 5 hundredths.",
      "Equalize decimal lengths: Append zeros to compare like units: 0.50 (50 hundredths) is greater than 0.45 (45 hundredths)."
    ],
    analogy: {
      title: "Village Market Currency / Rupee Coins",
      text: "Think of 50-paise coins versus smaller 5-paise coins. 0.5 rupees is 50 paise. 0.45 rupees is 45 paise. Even though '45' has two digits and '5' has one, 50 paise is worth more than 45 paise!"
    },
    hint: "Compare digits starting from the tenths column. You can add a zero to make lengths equal.",
    practice: {
      question: "Which decimal represents the larger quantity: 0.7 or 0.65?",
      options: ["0.65 (it has two digits)", "0.7 (7 tenths equals 70 hundredths)", "They are equal"],
      correctIndex: 1,
      explanation: "0.7 can be written as 0.70 (70 hundredths), which is greater than 0.65 (65 hundredths)."
    },
    followUps: [
      "How do you convert 0.75 into a simple fraction?",
      "Why does adding a zero to the right of a decimal not change its value?",
      "What is the difference between tenths and hundredths?"
    ],
    hi: {
      steps: [
        "स्थानीय मान को समझें: दशमलव बिंदु के ठीक बाद का अंक (दशांश) अधिक मान रखता है।",
        "दशांश की तुलना करें: 0.5 में 5 दशांश हैं (0.50), जबकि 0.45 में केवल 4 दशांश हैं।",
        "शून्य जोड़कर तुलना करें: 0.50 (50 शतांश) स्पष्ट रूप से 0.45 (45 शतांश) से बड़ा है।"
      ],
      analogyText: "पैसे के रूप में सोचें: 0.5 रुपये का मतलब 50 पैसे है और 0.45 रुपये का मतलब 45 पैसे है। 50 पैसे, 45 पैसे से अधिक होते हैं, भले ही 45 में दो अंक हों।",
      hint: "पहले दशांश के स्थान की तुलना करें।"
    },
    kn: {
      steps: [
        "ಸ್ಥಾನ ಬೆಲೆಯನ್ನು ಗಮನಿಸಿ: ದಶಮಾಂಶ ಬಿಂದುವಿನ ಪಕ್ಕದ ಹತ್ತನೇ ಒಂದು ಭಾಗ (tenths) ಹೆಚ್ಚಿನ ಮೌಲ್ಯ ಹೊಂದಿರುತ್ತದೆ.",
        "ಹತ್ತನೇ ಭಾಗ ಹೋಲಿಸಿ: 0.5 ರಲ್ಲಿ 5 ಹತ್ತನೇ ಭಾಗಗಳಿವೆ (0.50), ಆದರೆ 0.45 ರಲ್ಲಿ 4 ಹತ್ತನೇ ಭಾಗಗಳಿವೆ.",
        "ಸೊನ್ನೆ ಸೇರಿಸಿ ಪರಿಶೀಲಿಸಿ: 0.50 (50 ನೂರನೇ ಭಾಗ) 0.45 ಕ್ಕಿಂತ ದೊಡ್ಡದಾಗಿದೆ."
      ],
      analogyText: "ಪೈಸೆಗಳ ಲೆಕ್ಕ ಹಾಕಿ: 0.5 ರೂಪಾಯಿ ಎಂದರೆ 50 ಪೈಸೆ, 0.45 ಎಂದರೆ 45 ಪೈಸೆ. 50 ಪೈಸೆ ಯಾವಾಗಲೂ 45 ಪೈಸೆಗಿಂತ ಹೆಚ್ಚಾಗಿರುತ್ತದೆ.",
      hint: "ದಶಮಾಂಶ ಬಿಂದುವಿನ ನಂತರದ ಮೊದಲ ಸ್ಥಾನವನ್ನು ಮೊದಲು ಹೋಲಿಸಿ."
    }
  },
  {
    id: "plant-photosynthesis",
    keywords: ["plant", "photosynthesis", "leaf", "sunlight", "chlorophyll", "stomata", "carbon dioxide", "moon", "प्रकाश संश्लेषण", "ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ"],
    lessonId: "plant-nutrition",
    lessonTitle: "Nutrition in Plants",
    chapter: "NCERT Class 7 Science · Ch 1",
    subject: "Science",
    diagnosticTitle: "Autotrophic Nutrition (Plants do not 'eat' soil)",
    steps: [
      "Identify the true raw materials: Plants absorb water from roots and carbon dioxide through microscopic leaf pores (stomata).",
      "Understand the solar catalyst: Chlorophyll traps sunlight energy to convert water and carbon dioxide into glucose.",
      "Recognize the byproduct: Oxygen is released back into the atmosphere as a vital byproduct."
    ],
    analogy: {
      title: "Village Solar Cooking Hearth",
      text: "Think of cooking rice on a solar cooker in the courtyard. The rice pot needs water and grain (raw materials) and sunlight heat to cook. The plant's leaf is the kitchen pot, chlorophyll is the solar receiver, and sunlight is the heat source."
    },
    hint: "Soil provides water and minerals, but the main food mass comes from carbon dioxide in air and solar energy.",
    practice: {
      question: "Which gas do green leaves absorb from the atmosphere for photosynthesis?",
      options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Argon"],
      correctIndex: 1,
      explanation: "Leaves absorb Carbon dioxide (CO₂) through stomata, releasing oxygen as a byproduct."
    },
    followUps: [
      "What happens to plants during the night?",
      "Why are leaves green in color?",
      "What are stomata and how do guard cells work?"
    ],
    hi: {
      steps: [
        "कच्चे माल को समझें: जड़ें पानी सोखती हैं और पत्तियां रंध्रों (stomata) से कार्बन डाइऑक्साइड लेती हैं।",
        "सूर्य ऊर्जा: क्लोरोफिल सूर्य के प्रकाश को पकड़कर भोजन (ग्लूकोज) तैयार करता है।",
        "उत्पाद: इस प्रक्रिया में ऑक्सीजन गैस बाहर निकलती है।"
      ],
      analogyText: "आंगन में सौर चूल्हे पर खाना पकाने जैसा समझें। धूप से ऊर्जा मिलती है, पानी और अनाज मिलाकर भोजन तैयार होता है। पत्ती पौधे की रसोई है।",
      hint: "पत्तियां हवा से कार्बन डाइऑक्साइड और जड़ों से पानी लेती हैं।"
    },
    kn: {
      steps: [
        "ಕಚ್ಚಾ ಸಾಮಗ್ರಿಗಳನ್ನು ತಿಳಿಯಿರಿ: ಬೇರುಗಳು ನೀರನ್ನು ಹೀರುತ್ತವೆ, ಎಲೆಗಳು ಪತ್ರರಂಧ್ರಗಳ ಮೂಲಕ ಇಂಗಾಲದ ಡೈಆಕ್ಸೈಡ್ ಹೀರುತ್ತವೆ.",
        "ಸೌರಶಕ್ತಿ ಬಳಕೆ: ಕ್ಲೋರೋಫಿಲ್ ಸೂರ್ಯನ ಬೆಳಕನ್ನು ಬಳಸಿಕೊಂಡು ಗ್ಲೂಕೋಸ್ ತಯಾರಿಸುತ್ತದೆ.",
        "ಉಪಉತ್ಪನ್ನ: ಈ ಕ್ರಿಯೆಯಲ್ಲಿ ಆಮ್ಲಜನಕ ಹೊರಬರುತ್ತದೆ."
      ],
      analogyText: "ಸೌರ ಒಲೆಯಂತೆ ಕಲ್ಪಿಸಿಕೊಳ್ಳಿ. ಬಿಸಿಲಿನ ಶಾಖದಲ್ಲಿ ಅಡುಗೆ ತಯಾರಾಗುವಂತೆ, ಎಲೆಯೆಂಬ ಅಡುಗೆಮನೆಯಲ್ಲಿ ಸೂರ್ಯನ ಬೆಳಕಿನಿಂದ ಆಹಾರ ತಯಾರಾಗುತ್ತದೆ.",
      hint: "ಗಿಡಗಳು ಗಾಳಿಯಿಂದ ಇಂಗಾಲದ ಡೈಆಕ್ಸೈಡ್ ಮತ್ತು ಬೇರುಗಳಿಂದ ನೀರನ್ನು ಪಡೆಯುತ್ತವೆ."
    }
  }
];

export function AiTutorView({ initialQuery = "" }: AiTutorViewProps) {
  const d = useDemo();
  const [inputMsg, setInputMsg] = useState(initialQuery);
  const [selectedLang, setSelectedLang] = useState<Lang>(d.language || "en");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "ready">("ready");
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [activeStepTab, setActiveStepTab] = useState<Record<string, "steps" | "analogy" | "practice">>({});
  const [selectedPracticeAnswers, setSelectedPracticeAnswers] = useState<Record<string, number>>({});
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string } | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // n8n Workflow State
  const [n8nConfig, setN8nConfig] = useState<N8nWorkflowConfig>(getN8nConfig);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [tempWebhookUrl, setTempWebhookUrl] = useState(n8nConfig.webhookUrl);
  const [tempMode, setTempMode] = useState(n8nConfig.mode);
  const [isTestingN8n, setIsTestingN8n] = useState(false);
  const [testFeedback, setTestFeedback] = useState<{ ok: boolean; message: string; latency?: number } | null>(null);
  const [copiedWebhookId, setCopiedWebhookId] = useState(false);
  const [lastN8nError, setLastN8nError] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);

  // Whether user has entered into an active conversation session
  const hasUserMessages = messages.length > 0;

  // Handle initial query if present
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      void handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  // Auto-scroll on messages update
  useEffect(() => {
    if (hasUserMessages && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, status, hasUserMessages]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMsg).trim();
    if (!textToSend && !attachedFile) return;

    const userMessageId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: textToSend || (attachedFile ? `Attached file: ${attachedFile.name}` : ""),
      attachment: attachedFile || undefined,
      languageUsed: selectedLang
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMsg("");
    setAttachedFile(null);
    setStatus("loading");
    setLastN8nError(null);
    setFallbackNotice(null);

    // 1. If n8n Live or Hybrid mode is enabled, attempt calling the n8n LangChain Agent workflow
    if (n8nConfig.mode !== "offline-only") {
      try {
        const n8nResult = await sendChatMessageToN8n(textToSend, {
          webhookUrl: n8nConfig.webhookUrl,
        });

        if (n8nResult.success) {
          const tutorMessageId = `tutor-${Date.now()}`;
          const lowerText = textToSend.toLowerCase();
          const match = CURRICULUM_KNOWLEDGE.find((item) =>
            item.keywords.some((kw) => lowerText.includes(kw.toLowerCase()))
          );

          const reply: ChatMessage = {
            id: tutorMessageId,
            sender: "tutor",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            text: n8nResult.text,
            sourceEngine: "n8n-agent",
            modelUsed: n8nResult.model,
            groundedLessonId: match?.lessonId,
            groundedLessonTitle: match?.lessonTitle,
            groundedChapter: match?.chapter,
            hint: match?.hint,
            practice: match?.practice,
            followUps: match?.followUps || [
              "Can you explain this with a simpler village analogy?",
              "Can you give me a quick practice question to test my understanding?",
              "How does this relate to Class 7 NCERT Science/Math?"
            ],
            languageUsed: selectedLang
          };

          setMessages((prev) => [...prev, reply]);
          setStatus("ready");
          d.awardActivityXp("tutor-consultation", 15, "Consulted n8n GPT-5 Mini Agent");
          return;
        } else if (n8nConfig.mode === "n8n-live") {
          // In live-only mode, report error directly
          setLastN8nError(n8nResult.error || "Could not reach n8n agent.");
          setStatus("error");
          return;
        } else {
          // Hybrid mode: record notice and fall through to offline curriculum engine
          setFallbackNotice(
            `n8n Agent unreachable (${n8nResult.error || "offline"}). Routed seamlessly to offline NCERT engine.`
          );
        }
      } catch (err: any) {
        if (n8nConfig.mode === "n8n-live") {
          setLastN8nError(err?.message || "Error communicating with n8n workflow.");
          setStatus("error");
          return;
        }
        setFallbackNotice("n8n workflow connection error. Switched to offline NCERT engine.");
      }
    }

    // 2. Offline Curriculum Diagnostic Engine (Fallback or Standalone mode)
    setTimeout(() => {
      const lowerText = textToSend.toLowerCase();
      const match = CURRICULUM_KNOWLEDGE.find((item) =>
        item.keywords.some((kw) => lowerText.includes(kw.toLowerCase()))
      );

      const tutorMessageId = `tutor-${Date.now()}`;
      let reply: ChatMessage;

      if (match) {
        const isHi = selectedLang === "hi";
        const isKn = selectedLang === "kn";

        const introText = isHi
          ? `शाबाश! आपने "${match.diagnosticTitle}" से जुड़ा प्रश्न पूछा है। आइए इसे चरणबद्ध तरीके से समझें:`
          : isKn
          ? `ಉತ್ತಮ ಪ್ರಶ್ನೆ! ನೀವು "${match.diagnosticTitle}" ಕುರಿತು ಕೇಳಿದ್ದೀರಿ. ಇದನ್ನು ಹಂತ-ಹಂತವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳೋಣ:`
          : `Great inquiry! You are examining "${match.diagnosticTitle}". Here is the step-by-step curriculum breakdown:`;

        const steps = isHi ? match.hi.steps : isKn ? match.kn.steps : match.steps;
        const analogyText = isHi ? match.hi.analogyText : isKn ? match.kn.analogyText : match.analogy.text;
        const hintText = isHi ? match.hi.hint : isKn ? match.kn.hint : match.hint;

        reply = {
          id: tutorMessageId,
          sender: "tutor",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: introText,
          sourceEngine: "offline-curriculum",
          groundedLessonId: match.lessonId,
          groundedLessonTitle: match.lessonTitle,
          groundedChapter: match.chapter,
          steps,
          analogy: {
            title: match.analogy.title,
            text: analogyText
          },
          hint: hintText,
          practice: match.practice,
          followUps: match.followUps,
          languageUsed: selectedLang
        };

        setActiveStepTab((prev) => ({ ...prev, [tutorMessageId]: "steps" }));
        setStatus("ready");
        d.awardActivityXp("tutor-consultation", 15, "Consulted Concept Detective AI");
      } else if (
        lowerText.includes("quantum") ||
        lowerText.includes("black hole") ||
        lowerText.includes("crypto") ||
        lowerText.includes("calculus") ||
        lowerText.includes("movie") ||
        lowerText.includes("cheat")
      ) {
        reply = {
          id: tutorMessageId,
          sender: "tutor",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: selectedLang === "hi"
            ? `पाठ्यक्रम सीमा (Out of Scope): "${textToSend}" कक्षा 6-8 के स्वीकृत NCERT पाठ्यक्रम में शामिल नहीं है।`
            : selectedLang === "kn"
            ? `ಪಠ್ಯಕ್ರಮದ ಮಿತಿ (Out of Scope): "${textToSend}" ತರಗತಿ 6-8 ರ ಅಧಿಕೃತ NCERT ಪಠ್ಯಕ್ರಮದಲ್ಲಿ ಬರುವುದಿಲ್ಲ.`
            : `Curriculum Scope Boundary: "${textToSend}" falls outside the approved Class 6–8 NCERT syllabus.`,
          sourceEngine: "offline-curriculum",
          isUncertain: true,
          uncertaintyReason: "To protect students from AI hallucinations, Concept Detective is strictly grounded in the approved middle-school syllabus. I do not guess or speculate on out-of-syllabus topics. Please ask your science/math teacher or consult higher secondary textbooks.",
          followUps: [
            "Why is 1/2 + 1/3 not equal to 2/5?",
            "Why does a closed switch make the bulb glow?",
            "Which is bigger: 0.5 or 0.45?"
          ],
          languageUsed: selectedLang
        };
        setStatus("ready");
      } else {
        reply = {
          id: tutorMessageId,
          sender: "tutor",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: `I examined your inquiry regarding "${textToSend}". In science and mathematics, breaking this into observable components gives us the key!`,
          sourceEngine: "offline-curriculum",
          steps: [
            "Identify the fundamental physical or mathematical quantities involved.",
            "Test whether any conservation law applies (conservation of energy, mass, or parts of a whole).",
            "Verify your conclusion with a small numeric example before generalizing."
          ],
          analogy: {
            title: "Village Weighing Scale (Tarazu)",
            text: "Imagine a two-pan market scale at the weekly haat. Any equation or balance must have equal weights on both sides. If you add to one side, you must adjust the other side to keep balance."
          },
          hint: "Ask yourself: What is staying constant, and what is changing?",
          practice: {
            question: "Quick verification: Which decimal is larger, 0.7 or 0.65?",
            options: ["0.65 (has more digits)", "0.7 (7 tenths > 6 tenths)", "They are equal"],
            correctIndex: 1,
            explanation: "0.7 equals 70 hundredths, while 0.65 is only 65 hundredths."
          },
          followUps: [
            "Can you explain this with a simpler village analogy?",
            "How does this connect to my Class 7 syllabus?",
            "Give me a harder follow-up practice problem."
          ],
          languageUsed: selectedLang
        };
        setActiveStepTab((prev) => ({ ...prev, [tutorMessageId]: "steps" }));
        setStatus("ready");
      }

      setMessages((prev) => [...prev, reply]);
    }, 600);
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputMsg("");
    setAttachedFile(null);
    setStatus("ready");
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    }
  };

  const handleSimulateError = () => {
    setStatus("error");
  };

  const handleRetry = () => {
    setStatus("ready");
    handleSendMessage("Why can't we add 1/2 + 1/3 as 2/5?");
  };

  const toggleHint = (msgId: string) => {
    setRevealedHints((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const handleAnswerPractice = (msgId: string, optIdx: number, correctIdx: number) => {
    setSelectedPracticeAnswers((prev) => ({ ...prev, [msgId]: optIdx }));
    if (optIdx === correctIdx) {
      d.awardActivityXp(`tutor-practice-${msgId}`, 20, "Solved Concept Detective practice check");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`
      });
    }
  };

  const toggleSpeechRecognition = () => {
    const win = window as any;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback if not supported
      setInputMsg("Explain how fractions work with real-world examples");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang === "hi" ? "hi-IN" : selectedLang === "kn" ? "kn-IN" : "en-IN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setInputMsg((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Educational prompt suggestions matching student learning
  const promptSuggestions = [
    {
      title: "Understand a concept",
      example: "Explain fractions with examples.",
      query: "Why is 1/2 + 1/3 not equal to 2/5? Explain fractions with examples."
    },
    {
      title: "Explore science",
      example: "Why does the Moon change shape?",
      query: "Why does the Moon change shape and how does sunlight reflect on it?"
    },
    {
      title: "Solve a problem",
      example: "Help me solve this algebra question.",
      query: "Help me understand how to solve equations with balance and variables."
    }
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-140px)] w-full">
      {/* 1. Header: Compact, aligned with page container */}
      <header className="flex items-center justify-between py-3 border-b border-border/80 mb-4 px-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-[#EAE7FF] flex items-center justify-center text-[#6541F5] shadow-xs">
              <Bot className="h-4 w-4" />
            </div>
            <h1 className="text-base font-bold text-foreground tracking-tight">AI Assistant</h1>
          </div>

          {/* Language Selector */}
          <div className="hidden sm:flex rounded-lg border border-border bg-muted/40 p-0.5 ml-2">
            {[
              { code: "en", label: "English" },
              { code: "hi", label: "हिन्दी" },
              { code: "kn", label: "ಕನ್ನಡ" }
            ].map((l) => (
              <button
                key={l.code}
                onClick={() => setSelectedLang(l.code as Lang)}
                className={`rounded-md px-2 py-0.5 text-xs font-semibold transition-all ${
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

        {/* Header Right Actions: n8n Workflow Status, New Chat & Share */}
        <div className="flex items-center gap-2">
          {shareSuccess && (
            <Badge variant="outline" className="border-[#19B99A]/40 bg-[#DDF8EE]/80 text-[#19B99A] text-xs font-medium py-1">
              Link copied!
            </Badge>
          )}

          {/* n8n Workflow Trigger Button */}
          <button
            onClick={() => {
              setTempWebhookUrl(n8nConfig.webhookUrl);
              setTempMode(n8nConfig.mode);
              setTestFeedback(null);
              setIsConfigModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card hover:bg-muted/60 px-2.5 py-1 text-xs font-semibold text-foreground hover:border-[#6541F5] hover:text-[#6541F5] transition-all cursor-pointer shadow-2xs"
            title="Configure n8n Agent Workflow (GPT-5 Mini)"
          >
            <span className="relative flex h-2 w-2">
              <span className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                n8nConfig.mode === "offline-only" ? "bg-amber-400" : "bg-emerald-400"
              )} />
              <span className={cn(
                "relative inline-flex rounded-full h-2 w-2",
                n8nConfig.mode === "offline-only" ? "bg-amber-500" : "bg-emerald-500"
              )} />
            </span>
            <span className="hidden sm:inline">n8n Agent:</span>
            <span className="font-bold text-[#6541F5] dark:text-[#7C5CFA]">
              {n8nConfig.mode === "offline-only" ? "Offline" : "GPT-5 Mini"}
            </span>
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground ml-0.5" />
          </button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleNewChat}
            className="card-surface border-border hover:border-[#6541F5] hover:text-[#6541F5] text-xs font-semibold h-8 px-3"
          >
            <Plus className="h-3.5 w-3.5 mr-1 text-[#6541F5]" /> New Chat
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleShare}
            className="card-surface border-border hover:border-[#6541F5] hover:text-[#6541F5] text-xs font-semibold h-8 px-3"
          >
            <Share2 className="h-3.5 w-3.5 mr-1" /> Share
          </Button>

          <button
            onClick={handleSimulateError}
            className="text-[10px] text-muted-foreground hover:text-[#E95778] underline ml-1 hidden md:inline"
            title="Simulate network or diagnostic timeout"
          >
            Timeout
          </button>
        </div>
      </header>

      {/* Hidden file input for attachment/image */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.txt"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Main Content Area */}
      {!hasUserMessages ? (
        /* 2 & 3 & 4. Centered Welcome View with Composer & 3 Suggestion Cards */
        <div className="flex-1 flex flex-col justify-center items-center py-6 md:py-12 px-2 max-w-[860px] mx-auto w-full">
          {/* Centered Welcome Section */}
          <div className="flex flex-col items-center text-center mb-7">
            <div className="h-16 w-16 md:h-18 md:w-18 rounded-full bg-[#EAE7FF] border border-[#6541F5]/25 flex items-center justify-center text-[#6541F5] shadow-sm mb-4">
              <Sparkles className="h-8 w-8 text-[#6541F5]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              What can I help with?
            </h2>
          </div>

          {/* 3. Main Message Composer */}
          <div className="w-full card-surface rounded-2xl md:rounded-3xl border border-border shadow-sm p-4 md:p-5 flex flex-col justify-between min-h-[155px] md:min-h-[165px] transition-all focus-within:border-[#6541F5] focus-within:ring-2 focus-within:ring-[#6541F5]/10">
            {/* Top-left: Multiline text input */}
            <div className="w-full">
              <textarea
                id="tutor-chat-input"
                rows={3}
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask anything AI assistant"
                className="w-full resize-none bg-transparent border-0 p-0 text-sm md:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 leading-relaxed"
                disabled={status === "loading"}
              />

              {/* Attachment Pill if a file is attached */}
              {attachedFile && (
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#EAE7FF]/70 border border-[#6541F5]/30 px-2.5 py-1 text-xs text-[#6541F5] mt-1 font-medium">
                  <Paperclip className="h-3.5 w-3.5" />
                  <span>{attachedFile.name} ({attachedFile.size})</span>
                  <button
                    onClick={() => setAttachedFile(null)}
                    className="hover:text-foreground ml-1"
                    title="Remove attachment"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Controls Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-2">
              {/* Bottom-left: Attachment and Image upload */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  title="Attach file"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  title="Upload image"
                >
                  <ImageIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Bottom-right: Microphone and Primary Send */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`p-2 rounded-xl transition-colors ${
                    isListening
                      ? "bg-[#E95778]/15 text-[#E95778] animate-pulse"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  title={isListening ? "Listening... click to stop" : "Use microphone"}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>

                <Button
                  id="tutor-ask-btn"
                  size="sm"
                  onClick={() => handleSendMessage()}
                  disabled={status === "loading" || (!inputMsg.trim() && !attachedFile)}
                  className="h-9 w-9 rounded-full bg-[#6541F5] text-white hover:bg-[#5230E8] p-0 flex items-center justify-center shadow-xs"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* 4. Suggested Prompt Cards: Exactly 3 in one horizontal row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full mt-4">
            {promptSuggestions.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.query)}
                className="card-surface rounded-xl border border-border p-3.5 text-left hover:border-[#6541F5] hover:bg-[#6541F5]/5 transition-all cursor-pointer group shadow-xs flex flex-col justify-between"
              >
                <div className="font-bold text-xs text-foreground group-hover:text-[#6541F5] transition-colors">
                  {item.title}
                </div>
                <div className="text-[11px] text-muted-foreground truncate mt-1">
                  {item.example}
                </div>
              </button>
            ))}
          </div>

          {/* Subtle Grounding Disclosure */}
          <div className="mt-8 flex items-center gap-2 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-[#19B99A]" />
            <span>Strictly grounded in approved NCERT Class 6–8 Mathematics & Science curriculum.</span>
          </div>
        </div>
      ) : (
        /* 7. Active Conversation State: Central Column with Bottom Composer */
        <div className="flex-1 flex flex-col justify-between max-w-[860px] mx-auto w-full">
          {/* Conversation Stream */}
          <div className="flex-1 space-y-4 py-4 overflow-y-auto pr-1">
            {/* Active Workflow Status Banner */}
            <div className="rounded-xl border border-[#6541F5]/25 bg-[#F5F5FF] dark:bg-[#6541F5]/10 p-3 text-xs flex flex-wrap items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2 text-[#6541F5] dark:text-[#7C5CFA] font-bold text-[11px]">
                <Workflow className="h-4 w-4 shrink-0" />
                <span>
                  {n8nConfig.mode === "offline-only"
                    ? "Offline NCERT Curriculum Diagnosis Engine · Local Memory"
                    : "n8n LangChain Agent Active · Model: GPT-5 Mini · Webhook: 2025e060..."}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-[#6541F5]/30 bg-card text-[#6541F5] dark:text-[#7C5CFA] text-[10px] font-bold">
                  {n8nConfig.mode === "offline-only" ? "Offline Only" : "n8n Live: GPT-5 Mini"}
                </Badge>
                <button
                  onClick={() => setIsConfigModalOpen(true)}
                  className="text-[10px] underline font-bold text-[#6541F5] dark:text-[#7C5CFA] hover:text-[#5230E8] cursor-pointer"
                >
                  Configure
                </button>
              </div>
            </div>

            {/* Seamless Hybrid Fallback Notification */}
            {fallbackNotice && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs flex items-center justify-between gap-2 text-amber-800 dark:text-amber-200 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                  <span className="text-[11px] leading-tight">{fallbackNotice}</span>
                </div>
                <button
                  onClick={() => setIsConfigModalOpen(true)}
                  className="text-[10px] font-bold underline hover:opacity-80 shrink-0 cursor-pointer"
                >
                  Check Webhook
                </button>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "tutor" && (
                  <div className="h-8 w-8 rounded-xl bg-[#EAE7FF] flex items-center justify-center shrink-0 text-[#6541F5] shadow-xs mt-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs space-y-3 ${
                    m.sender === "user"
                      ? "bg-[#6541F5] text-white font-medium rounded-tr-none shadow-sm"
                      : "card-surface text-foreground border border-border rounded-tl-none shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] opacity-80 border-b border-current/10 pb-1 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{m.sender === "user" ? "You (Ananya R.)" : "Concept Detective"}</span>
                      {m.sender === "tutor" && (
                        m.sourceEngine === "n8n-agent" ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold text-[9px]">
                            <Zap className="h-2.5 w-2.5 fill-current" /> n8n Agent · GPT-5 Mini
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#6541F5]/10 border border-[#6541F5]/25 text-[#6541F5] dark:text-[#7C5CFA] font-bold text-[9px]">
                            <BookOpen className="h-2.5 w-2.5" /> NCERT Offline Engine
                          </span>
                        )
                      )}
                    </div>
                    <span>{m.timestamp}</span>
                  </div>

                  {m.attachment && (
                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-black/10 px-2 py-1 text-[11px]">
                      <Paperclip className="h-3 w-3" />
                      <span>{m.attachment.name} ({m.attachment.size})</span>
                    </div>
                  )}

                  <p className="leading-relaxed text-xs">{m.text}</p>

                  {/* Grounded Lesson Badge if curriculum-connected */}
                  {m.groundedLessonId && (
                    <div className="flex items-center justify-between rounded-lg bg-[#EAE7FF]/60 border border-[#6541F5]/30 p-2 text-[11px] text-[#6541F5]">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Grounded in: {m.groundedLessonTitle} ({m.groundedChapter})</span>
                      </div>
                      <Link
                        to="/lesson/$id"
                        params={{ id: m.groundedLessonId }}
                        className="inline-flex items-center gap-1 font-bold underline hover:text-[#5230E8]"
                      >
                        Open Lesson <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  )}

                  {/* Uncertainty / Out-of-Syllabus State */}
                  {m.isUncertain && (
                    <div className="rounded-xl border border-[#F5A623]/40 bg-[#FFF0D5] dark:bg-[#F5A623]/15 p-3 text-foreground space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-[#F5A623]">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Uncertainty & Syllabus Boundary</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-muted-foreground">{m.uncertaintyReason}</p>
                    </div>
                  )}

                  {/* Pedagogical Tabs: Steps vs Analogy vs Practice */}
                  {(m.steps || m.analogy || m.practice) && (
                    <div className="pt-2 border-t border-border space-y-3">
                      <div className="flex rounded-lg bg-muted/40 p-1 border border-border text-[11px]">
                        {m.steps && (
                          <button
                            onClick={() => setActiveStepTab((prev) => ({ ...prev, [m.id]: "steps" }))}
                            className={`flex-1 py-1 rounded-md font-semibold transition-all ${
                              (activeStepTab[m.id] || "steps") === "steps"
                                ? "bg-background text-[#6541F5] shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            1. Step Breakdown
                          </button>
                        )}
                        {m.analogy && (
                          <button
                            onClick={() => setActiveStepTab((prev) => ({ ...prev, [m.id]: "analogy" }))}
                            className={`flex-1 py-1 rounded-md font-semibold transition-all ${
                              activeStepTab[m.id] === "analogy"
                                ? "bg-background text-[#F5A623] shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            2. Village Analogy
                          </button>
                        )}
                        {m.practice && (
                          <button
                            onClick={() => setActiveStepTab((prev) => ({ ...prev, [m.id]: "practice" }))}
                            className={`flex-1 py-1 rounded-md font-semibold transition-all ${
                              activeStepTab[m.id] === "practice"
                                ? "bg-background text-[#19B99A] shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            3. Practice Check
                          </button>
                        )}
                      </div>

                      {/* Tab 1: Step Breakdown */}
                      {(activeStepTab[m.id] || "steps") === "steps" && m.steps && (
                        <div className="space-y-2 bg-muted/20 p-3 rounded-xl border border-border">
                          {m.steps.map((st, sIdx) => (
                            <div key={sIdx} className="flex gap-2.5 items-start text-xs">
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6541F5] text-white text-[10px] font-bold">
                                {sIdx + 1}
                              </span>
                              <p className="leading-relaxed text-foreground">{st}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tab 2: Village Analogy */}
                      {activeStepTab[m.id] === "analogy" && m.analogy && (
                        <div className="rounded-xl border border-[#F5A623]/30 bg-[#FFF0D5]/50 p-3 text-foreground space-y-1.5">
                          <span className="font-bold flex items-center gap-1.5 text-xs text-[#F5A623]">
                            <Sparkles className="h-3.5 w-3.5" /> {m.analogy.title}
                          </span>
                          <p className="text-xs leading-relaxed text-foreground">{m.analogy.text}</p>
                        </div>
                      )}

                      {/* Tab 3: Interactive Practice Quiz */}
                      {activeStepTab[m.id] === "practice" && m.practice && (
                        <div className="rounded-xl border border-[#19B99A]/30 bg-[#DDF8EE]/40 p-3 text-xs space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#19B99A] uppercase text-[10px] tracking-wide">
                              Knowledge Verification Check
                            </span>
                            <Badge variant="outline" className="text-[10px] bg-card border-[#19B99A]/40 text-[#19B99A]">
                              +20 XP Reward
                            </Badge>
                          </div>
                          <p className="font-bold text-foreground text-xs">{m.practice.question}</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {m.practice.options.map((opt, oIdx) => {
                              const isSelected = selectedPracticeAnswers[m.id] === oIdx;
                              const isCorrect = oIdx === m.practice?.correctIndex;

                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => handleAnswerPractice(m.id, oIdx, m.practice?.correctIndex ?? 0)}
                                  className={`rounded-lg p-2.5 text-xs text-left border transition-all ${
                                    isSelected
                                      ? isCorrect
                                        ? "bg-[#DDF8EE] border-[#19B99A] text-[#19B99A] font-bold"
                                        : "bg-[#FCE5EB] border-[#E95778] text-[#E95778] font-bold"
                                      : "card-surface border-border text-foreground hover:border-[#6541F5]"
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>

                          {selectedPracticeAnswers[m.id] !== undefined && (
                            <div className="rounded-lg bg-background p-2.5 border border-border text-[11px] text-muted-foreground mt-2">
                              <strong>Explanation:</strong> {m.practice.explanation}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Progressive Hint */}
                  {m.hint && (
                    <div className="border-t border-border pt-2">
                      <button
                        onClick={() => toggleHint(m.id)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#19B99A] hover:underline"
                      >
                        <Lightbulb className="h-3.5 w-3.5" />
                        <span>{revealedHints[m.id] ? "Hide Progressive Hint" : "Need a Hint First?"}</span>
                      </button>

                      {revealedHints[m.id] && (
                        <div className="mt-1.5 rounded-lg border border-[#19B99A]/20 bg-[#DDF8EE]/30 p-2 text-[11px] text-foreground leading-relaxed">
                          💡 <strong>Hint:</strong> {m.hint}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Follow-up question chips */}
                  {m.followUps && m.followUps.length > 0 && (
                    <div className="border-t border-border pt-2 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                        Recommended Follow-Up Inquiries:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {m.followUps.map((fu, fIdx) => (
                          <button
                            key={fIdx}
                            onClick={() => handleSendMessage(fu)}
                            className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] text-foreground hover:border-[#6541F5] hover:text-[#6541F5] transition-colors"
                          >
                            {fu}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading State Skeleton */}
            {status === "loading" && (
              <div className="flex gap-3 justify-start items-center">
                <div className="h-8 w-8 rounded-xl bg-[#EAE7FF] flex items-center justify-center text-[#6541F5] animate-pulse">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl rounded-tl-none border border-border card-surface p-3.5 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-[#6541F5] font-semibold">
                    <span className="h-2 w-2 rounded-full bg-[#6541F5] animate-ping" />
                    <span>Searching NCERT Class 6–8 syllabus database...</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Diagnosing root misconceptions and mapping analogies.</p>
                </div>
              </div>
            )}

            {/* Error State Card */}
            {status === "error" && (
              <div className="rounded-xl border border-[#E95778]/40 bg-[#FCE5EB] dark:bg-[#E95778]/15 p-4 text-xs space-y-2">
                <div className="flex items-center justify-between text-[#E95778] font-bold">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" /> {lastN8nError ? "n8n AI Agent Workflow Error" : "Diagnostic Engine Timeout"}
                  </span>
                  <Badge variant="outline" className="border-[#E95778]/40 bg-card text-[#E95778]">
                    {lastN8nError ? "n8n Webhook" : "Network Issue"}
                  </Badge>
                </div>
                <p className="text-foreground text-[11px] leading-relaxed">
                  {lastN8nError
                    ? `Could not communicate with the n8n webhook (${n8nConfig.webhookUrl}). Make sure your n8n workflow is activated and listening, or switch to Hybrid/Offline mode.`
                    : "Unable to connect to the curriculum diagnosis engine. Please verify offline sync status or retry your inquiry."}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    onClick={handleRetry}
                    className="bg-[#E95778] text-white hover:bg-[#d04565] text-xs font-bold h-8 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Retry Inquiry
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setTempWebhookUrl(n8nConfig.webhookUrl);
                      setTempMode(n8nConfig.mode);
                      setIsConfigModalOpen(true);
                    }}
                    className="border-[#E95778]/40 text-[#E95778] hover:bg-[#E95778]/10 text-xs font-bold h-8 cursor-pointer"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" /> Configure n8n Webhook
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      saveN8nConfig({ mode: "offline-only" });
                      setN8nConfig((prev) => ({ ...prev, mode: "offline-only" }));
                      setStatus("ready");
                    }}
                    className="text-xs font-bold text-muted-foreground hover:text-foreground h-8 cursor-pointer"
                  >
                    Switch to Offline Mode
                  </Button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Sticky Bottom Composer */}
          <div className="sticky bottom-0 bg-gradient-to-t from-background via-background/95 to-transparent pt-3 pb-2 w-full">
            <div className="card-surface rounded-2xl border border-border shadow-md p-3.5 flex flex-col justify-between transition-all focus-within:border-[#6541F5]">
              <textarea
                id="tutor-chat-input"
                rows={2}
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask anything AI assistant"
                className="w-full resize-none bg-transparent border-0 p-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 leading-relaxed"
                disabled={status === "loading"}
              />

              {attachedFile && (
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#EAE7FF]/70 border border-[#6541F5]/30 px-2 py-0.5 text-xs text-[#6541F5] mt-1 font-medium">
                  <Paperclip className="h-3 w-3" />
                  <span>{attachedFile.name} ({attachedFile.size})</span>
                  <button onClick={() => setAttachedFile(null)} className="hover:text-foreground ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-border/50 mt-1">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    title="Attach file"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    title="Upload image"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isListening
                        ? "bg-[#E95778]/15 text-[#E95778] animate-pulse"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                    title={isListening ? "Listening... click to stop" : "Use microphone"}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>

                  <Button
                    id="tutor-ask-btn"
                    size="sm"
                    onClick={() => handleSendMessage()}
                    disabled={status === "loading" || (!inputMsg.trim() && !attachedFile)}
                    className="h-8 w-8 rounded-full bg-[#6541F5] text-white hover:bg-[#5230E8] p-0 flex items-center justify-center shadow-xs"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* n8n LangChain Workflow Configuration Modal */}
      <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <div className="flex items-center gap-2 text-[#6541F5] dark:text-[#7C5CFA]">
              <Workflow className="h-5 w-5" />
              <DialogTitle className="text-base font-extrabold text-foreground">
                n8n AI Agent Workflow Configuration
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Integrated with LangChain Agent v3.1, OpenAI GPT-5 Mini, and Chat Trigger webhook.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Architecture Node Diagram */}
            <div className="rounded-xl border border-border bg-muted/40 p-3 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Workflow Architecture Pipeline
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-[11px]">
                <div className="rounded-lg border border-border bg-card p-2 shadow-2xs">
                  <div className="flex items-center justify-center gap-1 font-bold text-foreground">
                    <Workflow className="h-3.5 w-3.5 text-[#6541F5]" />
                    <span>Chat Trigger</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block mt-0.5 truncate">
                    ID: 2025e060...
                  </span>
                </div>
                <div className="rounded-lg border border-[#6541F5]/30 bg-[#EAE7FF]/30 dark:bg-[#6541F5]/10 p-2 shadow-2xs">
                  <div className="flex items-center justify-center gap-1 font-bold text-[#6541F5] dark:text-[#7C5CFA]">
                    <Cpu className="h-3.5 w-3.5" />
                    <span>AI Agent (v3.1)</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">
                    LangChain Agent
                  </span>
                </div>
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 shadow-2xs">
                  <div className="flex items-center justify-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                    <Zap className="h-3.5 w-3.5 fill-current" />
                    <span>GPT-5 Mini</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">
                    OpenAI Chat Model
                  </span>
                </div>
              </div>
            </div>

            {/* Webhook ID & Copy */}
            <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Workflow Webhook ID
                </span>
                <code className="text-xs font-mono font-bold text-foreground">
                  {DEFAULT_WEBHOOK_ID}
                </code>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (typeof navigator !== "undefined" && navigator.clipboard) {
                    navigator.clipboard.writeText(DEFAULT_WEBHOOK_ID);
                    setCopiedWebhookId(true);
                    setTimeout(() => setCopiedWebhookId(false), 2000);
                  }
                }}
                className="h-8 text-xs font-bold cursor-pointer"
              >
                {copiedWebhookId ? (
                  <>
                    <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 mr-1" /> Copy ID
                  </>
                )}
              </Button>
            </div>

            {/* Webhook Endpoint URL Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>Webhook Endpoint URL</span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  Production / Test / Custom Tunnel
                </span>
              </label>
              <Input
                value={tempWebhookUrl}
                onChange={(e) => setTempWebhookUrl(e.target.value)}
                placeholder="http://localhost:5678/webhook/2025e060-0d48-4bd3-9bce-3f418ce83a7d/chat"
                className="font-mono text-xs h-9"
              />

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-muted-foreground font-medium mr-1">Presets:</span>
                <button
                  type="button"
                  onClick={() => setTempWebhookUrl(`http://localhost:5678/webhook/${DEFAULT_WEBHOOK_ID}/chat`)}
                  className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-foreground hover:border-[#6541F5] hover:text-[#6541F5] cursor-pointer"
                >
                  Local Live (5678)
                </button>
                <button
                  type="button"
                  onClick={() => setTempWebhookUrl(`http://localhost:5678/webhook-test/${DEFAULT_WEBHOOK_ID}/chat`)}
                  className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-foreground hover:border-[#6541F5] hover:text-[#6541F5] cursor-pointer"
                >
                  Test Webhook
                </button>
                <button
                  type="button"
                  onClick={() => setTempWebhookUrl(getDefaultWebhookUrl())}
                  className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-foreground hover:border-[#6541F5] hover:text-[#6541F5] cursor-pointer"
                >
                  Default
                </button>
              </div>
            </div>

            {/* Mode Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">
                Operation Mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    id: "hybrid",
                    title: "Hybrid (Recommended)",
                    desc: "Live n8n GPT-5 Mini with offline fallback",
                  },
                  {
                    id: "n8n-live",
                    title: "n8n Live Agent Only",
                    desc: "Direct cloud/local agent execution",
                  },
                  {
                    id: "offline-only",
                    title: "Offline NCERT Only",
                    desc: "Rural low-resource local engine",
                  },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setTempMode(m.id as any)}
                    className={`rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
                      tempMode === m.id
                        ? "border-[#6541F5] bg-[#6541F5]/10 text-foreground ring-1 ring-[#6541F5]"
                        : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                    }`}
                  >
                    <div className="font-bold text-xs text-foreground">{m.title}</div>
                    <div className="text-[10px] leading-tight text-muted-foreground mt-0.5">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Test Connection Button & Result Feedback */}
            <div className="rounded-xl border border-border/80 bg-muted/30 p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Verify Connectivity</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    setIsTestingN8n(true);
                    setTestFeedback(null);
                    const res = await testN8nConnection(tempWebhookUrl);
                    setTestFeedback(res);
                    setIsTestingN8n(false);
                  }}
                  disabled={isTestingN8n || !tempWebhookUrl.trim()}
                  className="h-8 text-xs font-bold cursor-pointer"
                >
                  {isTestingN8n ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Pinging...
                    </>
                  ) : (
                    <>
                      <Zap className="h-3.5 w-3.5 mr-1.5 text-emerald-600 fill-current" /> Test Connection
                    </>
                  )}
                </Button>
              </div>

              {testFeedback && (
                <div
                  className={`rounded-lg p-2.5 text-[11px] leading-snug border ${
                    testFeedback.ok
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200"
                  }`}
                >
                  <strong>{testFeedback.ok ? "✓ Connection Successful:" : "⚠ Connection Notice:"}</strong>{" "}
                  {testFeedback.message}
                  {!testFeedback.ok && (
                    <span className="block mt-1 text-[10px] opacity-85">
                      Tip: If using n8n locally, ensure your workflow with webhook ID <code>{DEFAULT_WEBHOOK_ID}</code> is active. VidyaVerse's Hybrid mode will automatically serve students via the offline NCERT diagnostic engine if n8n is offline.
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* System Prompt Inspector */}
            <div className="rounded-xl border border-border bg-card p-3 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Workflow System Prompt
              </span>
              <p className="text-[11px] font-mono text-muted-foreground leading-relaxed bg-muted/30 p-2 rounded-lg border border-border/50">
                "{DEFAULT_SYSTEM_PROMPT}"
              </p>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                resetN8nSession();
                alert("Conversation memory session reset. Next inquiry will begin with a fresh context.");
              }}
              className="text-xs text-muted-foreground hover:text-foreground h-9 cursor-pointer"
            >
              Reset Session Memory
            </Button>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsConfigModalOpen(false)}
                className="h-9 text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  saveN8nConfig({
                    webhookUrl: tempWebhookUrl.trim(),
                    mode: tempMode,
                  });
                  setN8nConfig({
                    ...n8nConfig,
                    webhookUrl: tempWebhookUrl.trim(),
                    mode: tempMode,
                    isCustomUrl: true,
                  });
                  setIsConfigModalOpen(false);
                }}
                className="bg-[#6541F5] hover:bg-[#5230E8] text-white font-bold text-xs h-9 px-4 shadow-xs cursor-pointer"
              >
                Save & Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
