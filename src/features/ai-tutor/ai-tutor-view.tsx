import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bot, Send, Sparkles, Lightbulb, CheckCircle2,
  BookOpen, Layers, ArrowRight, ShieldCheck, Search,
  AlertTriangle, RotateCcw, HelpCircle, ExternalLink,
  MessageSquare, Languages, ChevronRight, FileQuestion,
  Info, Check, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader, Panel, SimNote } from "@/components/vv/primitives";
import { useDemo, type Lang } from "@/lib/demo-store";
import { lessons, misconceptions } from "@/data/demo";

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
  // Pedagogical scaffolding
  groundedLessonId?: string;
  groundedLessonTitle?: string;
  groundedChapter?: string;
  steps?: string[];
  analogy?: {
    title: string;
    text: string;
  };
  hint?: string;
  practice?: PracticeQuestion;
  followUps?: string[];
  isUncertain?: boolean;
  uncertaintyReason?: string;
  languageUsed?: Lang;
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
    keywords: ["plant", "photosynthesis", "leaf", "sunlight", "chlorophyll", "stomata", "carbon dioxide", "प्रकाश संश्लेषण", "ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ"],
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

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "tutor",
      timestamp: "Just now",
      text: selectedLang === "hi"
        ? "नमस्ते अनन्या! मैं आपका कॉन्सेप्ट डिटेक्टिव (Concept Detective) हूँ। मैं सीधा उत्तर देने के बजाय यह समझाता हूँ कि अवधारणाएं कैसे काम करती हैं। भिन्न, विद्युत परिपथ या पौधों के पोषण से जुड़ा कोई भी प्रश्न पूछें!"
        : selectedLang === "kn"
        ? "ನಮಸ್ಕಾರ ಅನನ್ಯಾ! ನಾನು ನಿಮ್ಮ ಕಾನ್ಸೆಪ್ಟ್ ಡಿಟೆಕ್ಟಿವ್. ನಾನು ನೇರ ಉತ್ತರ ನೀಡುವ ಬದಲು ವಿಷಯದ ಆಳವಾದ ಕಾರಣವನ್ನು ವಿವರಿಸುತ್ತೇನೆ. ಭಿನ್ನರಾಶಿಗಳು, ವಿದ್ಯುತ್ ಸರ್ಕ್ಯೂಟ್ ಅಥವಾ ಸಸ್ಯಗಳ ಬಗ್ಗೆ ಪ್ರಶ್ನೆ ಕೇಳಿ!"
        : "Namaste Ananya! I am your Concept Detective. Instead of giving direct answers to memorize, I diagnose learning bottlenecks, explain root concepts with relatable Indian analogies, and test your understanding step by step.",
      hint: "Try asking: 'Why can't we add 1/2 + 1/3 as 2/5?' or 'Why does a bulb glow when the switch closes?'",
      followUps: [
        "Why is 1/2 + 1/3 not equal to 2/5?",
        "Why does a closed switch make the bulb glow?",
        "Which is bigger: 0.5 or 0.45?",
        "How do plants make food without soil?"
      ],
      languageUsed: selectedLang
    }
  ]);

  const handleSendMessage = (customText?: string) => {
    const textToSend = (customText || inputMsg).trim();
    if (!textToSend) return;

    const userMessageId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: textToSend,
      languageUsed: selectedLang
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMsg("");
    setStatus("loading");

    // Diagnostic syllabus resolution
    setTimeout(() => {
      // Find matching curriculum knowledge entry
      const lowerText = textToSend.toLowerCase();
      const match = CURRICULUM_KNOWLEDGE.find((item) =>
        item.keywords.some((kw) => lowerText.includes(kw.toLowerCase()))
      );

      const tutorMessageId = `tutor-${Date.now()}`;
      let reply: ChatMessage;

      if (match) {
        // Grounded in approved NCERT lesson
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

        // Initialize view mode to steps
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
        // Explicit uncertainty / out-of-syllabus state
        reply = {
          id: tutorMessageId,
          sender: "tutor",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: selectedLang === "hi"
            ? `पाठ्यक्रम सीमा (Out of Scope): "${textToSend}" कक्षा 6-8 के स्वीकृत NCERT पाठ्यक्रम में शामिल नहीं है।`
            : selectedLang === "kn"
            ? `ಪಠ್ಯಕ್ರಮದ ಮಿತಿ (Out of Scope): "${textToSend}" ತರಗತಿ 6-8 ರ ಅಧಿಕೃತ NCERT ಪಠ್ಯಕ್ರಮದಲ್ಲಿ ಬರುವುದಿಲ್ಲ.`
            : `Curriculum Scope Boundary: "${textToSend}" falls outside the approved Class 6–8 NCERT syllabus.`,
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
        // Fallback pedagogical grounding
        reply = {
          id: tutorMessageId,
          sender: "tutor",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: `I examined your inquiry regarding "${textToSend}". In science and mathematics, breaking this into observable components gives us the key!`,
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
    }, 750);
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Tutor: Concept Detective"
        description="Diagnoses learning bottlenecks, explains misconceptions using relatable Indian village analogies, and grounds answers in approved NCERT curriculum lessons."
        eyebrow={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAE7FF] px-3 py-1 text-xs font-bold text-[#6541F5]">
            <Bot className="h-3.5 w-3.5" /> Concept Detective AI
          </span>
        }
      />

      {/* Honest AI Disclaimer & Model Boundary */}
      <div className="rounded-xl border border-[#6541F5]/20 bg-[#F5F5FF] dark:bg-[#6541F5]/10 p-4 text-xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-bold text-[#6541F5] dark:text-[#7C5CFA]">
            <Info className="h-4 w-4 shrink-0" />
            <span>Curriculum-Grounded Pedagogical Assistant · In-Browser Simulation</span>
          </div>
          <Badge variant="outline" className="border-[#6541F5]/30 bg-card dark:bg-[#6541F5]/20 text-[#6541F5] dark:text-[#7C5CFA] font-semibold text-[11px]">
            No External Cloud LLM Connected
          </Badge>
        </div>
        <p className="text-muted-foreground leading-relaxed text-[11px]">
          <strong>Pedagogical Guarantee Notice:</strong> AI responses are educational scaffolding tools grounded in approved NCERT Class 6–8 units. Responses are not guaranteed to be 100% error-free. Always cross-verify with your teacher Mrs. Lakshmi or official school textbooks.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Chat Conversation Container */}
        <div className="lg:col-span-8 card-surface rounded-2xl border border-border p-5 shadow-sm flex flex-col justify-between min-h-[640px]">
          {/* Header Controls: Language Selector & Mode Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Languages className="h-4 w-4 text-[#6541F5]" /> Supported Languages:
              </span>
              <div className="flex rounded-lg border border-border bg-muted/40 p-0.5">
                {[
                  { code: "en", label: "English" },
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

            <div className="flex items-center gap-2">
              <button
                onClick={handleSimulateError}
                className="text-[11px] text-muted-foreground hover:text-[#E95778] transition-colors underline"
                title="Test how the assistant handles a network or diagnostic timeout"
              >
                Simulate Timeout
              </button>
            </div>
          </div>

          {/* Messages Flow */}
          <div className="my-4 space-y-5 overflow-y-auto max-h-[500px] pr-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "tutor" && (
                  <div className="h-9 w-9 rounded-xl bg-[#EAE7FF] flex items-center justify-center shrink-0 text-[#6541F5] shadow-xs">
                    <Bot className="h-5 w-5" />
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-2xl p-4 text-xs space-y-3 ${
                    m.sender === "user"
                      ? "bg-[#6541F5] text-white font-medium rounded-tr-none shadow-sm"
                      : "card-surface text-foreground border border-border rounded-tl-none shadow-sm"
                  }`}
                >
                  {/* Timestamp & Sender */}
                  <div className="flex items-center justify-between text-[10px] opacity-75 border-b border-current/10 pb-1">
                    <span className="font-semibold">{m.sender === "user" ? "You (Ananya R.)" : "Concept Detective"}</span>
                    <span>{m.timestamp}</span>
                  </div>

                  {/* Main Response Text */}
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

                      {/* Tab 1: Step-by-Step Breakdown */}
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
                            <Badge variant="outline" className="text-[10px] bg-card dark:bg-[#19B99A]/20 border-[#19B99A]/40 text-[#19B99A]">
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

                  {/* Hints-First Scaffolding */}
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
                <div className="h-9 w-9 rounded-xl bg-[#EAE7FF] flex items-center justify-center text-[#6541F5] animate-pulse">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="rounded-2xl rounded-tl-none border border-border card-surface p-4 text-xs space-y-2">
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
              <div className="rounded-xl border border-[#E95778]/40 bg-[#FCE5EB] p-4 text-xs space-y-2">
                <div className="flex items-center justify-between text-[#E95778] font-bold">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" /> Diagnostic Engine Timeout
                  </span>
                  <Badge variant="outline" className="border-[#E95778]/40 bg-card dark:bg-[#E95778]/20 text-[#E95778]">
                    Network Issue
                  </Badge>
                </div>
                <p className="text-foreground text-[11px]">
                  Unable to connect to the local curriculum diagnosis engine. Please verify offline sync status or retry your inquiry.
                </p>
                <Button
                  size="sm"
                  onClick={handleRetry}
                  className="bg-[#E95778] text-white hover:bg-[#d04565] text-xs font-bold"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Retry Inquiry
                </Button>
              </div>
            )}
          </div>

          {/* Chat Input Controls */}
          <div className="pt-3 border-t border-border flex gap-2">
            <input
              id="tutor-chat-input"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={
                selectedLang === "hi"
                  ? "पाठ्यक्रम का कोई भी प्रश्न पूछें (जैसे: 1/2 + 1/3 = 2/5 क्यों नहीं होता?)..."
                  : selectedLang === "kn"
                  ? "ಯಾವುದೇ ಪಠ್ಯಕ್ರಮ ಪ್ರಶ್ನೆ ಕೇಳಿ (ಉದಾ: 1/2 + 1/3 = 2/5 ಏಕೆ ಅಲ್ಲ?)..."
                  : "Ask any curriculum question (e.g. Why does a fraction need a common denominator?)..."
              }
              className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#6541F5]"
              disabled={status === "loading"}
            />
            <Button
              id="tutor-ask-btn"
              onClick={() => handleSendMessage()}
              disabled={status === "loading" || !inputMsg.trim()}
              className="bg-[#6541F5] text-white hover:bg-[#5230E8] font-bold text-xs shadow-sm px-4"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" /> Ask Detective
            </Button>
          </div>
        </div>

        {/* Right Column: Syllabus Misconceptions & Grounding Catalogue */}
        <div className="lg:col-span-4 space-y-6">
          <Panel title="Frequently Diagnosed Misconceptions">
            <p className="text-xs text-muted-foreground mb-3">
              Tap any common syllabus bottleneck to see how Concept Detective uncovers the root error:
            </p>
            <div className="space-y-2.5 text-xs">
              {misconceptions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSendMessage(`Why is it a mistake to answer "${item.studentAnswer}" for "${item.question}"?`)}
                  className="w-full text-left rounded-xl border border-border card-surface p-3 text-xs space-y-1.5 hover:border-[#6541F5] hover:bg-[#EAE7FF]/20 transition-all shadow-xs"
                >
                  <span className="font-bold text-foreground block">{item.misconception}</span>
                  <p className="text-[11px] text-[#E95778] font-medium">Common error: "{item.studentAnswer}"</p>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">{item.why}</p>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Curriculum Grounding Standards">
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <BookOpen className="h-4 w-4 text-[#6541F5] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-foreground block">NCERT Textbook Alignment</span>
                  <p className="text-[11px] text-muted-foreground">Class 6–8 Mathematics & Science learning competencies.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-[#19B99A] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-foreground block">Zero Student Data Tracking</span>
                  <p className="text-[11px] text-muted-foreground">Questions are processed in browser memory without third-party advertising cookies.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Languages className="h-4 w-4 text-[#F5A623] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-foreground block">Regional Dialect Fidelity</span>
                  <p className="text-[11px] text-muted-foreground">Native analogies validated in English, Hindi, and Kannada.</p>
                </div>
              </div>
            </div>
          </Panel>

          <SimNote>
            Pedagogical AI model running locally in browser memory without external APIs or privacy risks.
          </SimNote>
        </div>
      </div>
    </div>
  );
}
