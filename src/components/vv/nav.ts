import {
  Home, BookOpen, Gamepad2, CircuitBoard, Code2, Bot, Mic, Network, Users,
  Trophy, Award, LineChart, Download, FolderGit2, Target, GraduationCap, HeartHandshake, Settings,
  type LucideIcon,
} from "lucide-react";
import type { Lang, NavCategory, NavItem, UserRole } from "@/types";

export type { NavCategory, NavItem };

export const allNav: NavItem[] = [
  // 1. Learn
  { to: "/dashboard", icon: Home, label: { en: "Home", hi: "मुख्य पृष्ठ", kn: "ಮುಖಪುಟ" }, category: "learn" },
  { to: "/learn", icon: BookOpen, label: { en: "Learn", hi: "पाठ्यक्रम", kn: "ಕಲಿಯಿರಿ" }, category: "learn" },

  // 2. Explore
  { to: "/playlab", icon: Gamepad2, label: { en: "PlayLab", hi: "प्ले लैब", kn: "ಪ್ಲೇ ಲ್ಯಾಬ್" }, category: "explore" },
  { to: "/circuitverse", icon: CircuitBoard, label: { en: "CircuitVerse", hi: "सर्किट वर्स", kn: "ಸರ್ಕ್ಯೂಟ್ ವರ್ಸ್" }, category: "explore" },
  { to: "/codeverse", icon: Code2, label: { en: "CodeVerse", hi: "कोड वर्स", kn: "ಕೋಡ್ ವರ್ಸ್" }, category: "explore" },
  { to: "/projects", icon: FolderGit2, label: { en: "Projects", hi: "प्रोजेक्ट्स", kn: "ಯೋಜನೆಗಳು" }, category: "explore" },

  // 3. AI & Offline
  { to: "/tutor", icon: Bot, label: { en: "AI Tutor", hi: "AI शिक्षक", kn: "AI ಶಿಕ್ಷಕ" }, category: "ai-offline" },
  { to: "/voice", icon: Mic, label: { en: "VidyaVoice", hi: "वाणी सहायक", kn: "ಧ್ವನಿ ಸಹಾಯಕ" }, category: "ai-offline" },
  { to: "/mesh", icon: Network, label: { en: "Learning Mesh", hi: "लर्निंग मेश", kn: "ಲರ್ನಿಂಗ್ ಮೆಶ್" }, category: "ai-offline" },

  // 4. Community
  { to: "/classrooms", icon: Users, label: { en: "Classrooms", hi: "कक्षाएँ", kn: "ತರಗತಿಗಳು" }, category: "community" },
  { to: "/leaderboard", icon: Trophy, label: { en: "Leaderboard", hi: "लीडरबोर्ड", kn: "ಲೀಡರ್‌ಬೋರ್ಡ್" }, category: "community" },
  { to: "/challenges", icon: Target, label: { en: "Challenges", hi: "चुनौतियाँ", kn: "ಸವಾಲುಗಳು" }, category: "community" },
  { to: "/rewards", icon: Award, label: { en: "Rewards Bazaar", hi: "इनाम केंद्र", kn: "ಬಹುಮಾನ ಅಂಗಡಿ" }, category: "community" },

  // 5. Progress
  { to: "/progress", icon: LineChart, label: { en: "My Progress", hi: "मेरी प्रगति", kn: "ನನ್ನ ಪ್ರಗತಿ" }, category: "progress" },
  { to: "/downloads", icon: Download, label: { en: "Downloads", hi: "डाउनलोड्स", kn: "ಡೌನ್‌ಲೋಡ್‌ಗಳು" }, category: "progress" },

  // 6. Portals
  { to: "/teacher", icon: GraduationCap, label: { en: "Teacher Portal", hi: "शिक्षक डैशबोर्ड", kn: "ಶಿಕ್ಷಕರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್" }, category: "portals", roleRestricted: "teacher" },
  { to: "/parent", icon: HeartHandshake, label: { en: "Parent Portal", hi: "अभिभावक दृश्य", kn: "ಪೋಷಕರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್" }, category: "portals", roleRestricted: "parent" },

  // 7. Settings
  { to: "/settings", icon: Settings, label: { en: "Settings", hi: "सेटिंग्स", kn: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು" }, category: "settings" },
];

export const learnNav = allNav.filter((n) => n.category === "learn");
export const exploreNav = allNav.filter((n) => n.category === "explore");
export const aiOfflineNav = allNav.filter((n) => n.category === "ai-offline");
export const communityNav = allNav.filter((n) => n.category === "community");
export const progressNav = allNav.filter((n) => n.category === "progress");
export const portalsNav = allNav.filter((n) => n.category === "portals");
export const settingsNav = allNav.filter((n) => n.category === "settings");

// Legacy aliases for backward compatibility if any imports exist
export const primaryNav = learnNav;
export const labsNav = [...exploreNav, ...aiOfflineNav];
export const rolesNav = [...portalsNav, ...settingsNav];

export const categoryLabels: Record<NavCategory, Record<Lang, string>> = {
  learn: { en: "Learn", hi: "अध्ययन", kn: "ಕಲಿಕೆ" },
  explore: { en: "Explore & Labs", hi: "प्रयोगशाला", kn: "ಪ್ರಯೋಗಶಾಲೆ" },
  "ai-offline": { en: "AI & Offline", hi: "AI और मेश", kn: "AI ಮತ್ತು ಮೆಶ್" },
  community: { en: "Community & Quests", hi: "समुदाय और प्रश्न", kn: "ಸಮುದಾಯ" },
  progress: { en: "Progress & Storage", hi: "प्रगति", kn: "ಪ್ರಗತಿ" },
  portals: { en: "Portals", hi: "पोर्टल", kn: "ಪೋರ್ಟಲ್" },
  settings: { en: "Settings", hi: "सेटिंग्स", kn: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು" },
};

export const langNames: Record<Lang, string> = {
  en: "English",
  hi: "हिन्दी",
  kn: "ಕನ್ನಡ",
};

export interface NavSectionConfig {
  id: string;
  title: Record<Lang, string>;
  items: NavItem[];
}

export const roleLabels: Record<UserRole, Record<Lang, string>> = {
  student: { en: "Student Portal", hi: "विद्यार्थी पोर्टल", kn: "ವಿದ್ಯಾರ್ಥಿ ಪೋರ್ಟಲ್" },
  teacher: { en: "Teacher Portal", hi: "शिक्षक पोर्टल", kn: "ಶಿಕ್ಷಕರ ಪೋರ್ಟಲ್" },
  parent: { en: "Guardian Portal", hi: "अभिभावक पोर्टल", kn: "ಪೋಷಕರ ಪೋರ್ಟಲ್" },
};

export function getRoleDefaultRoute(role: UserRole): string {
  switch (role) {
    case "teacher":
      return "/teacher";
    case "parent":
      return "/parent";
    default:
      return "/dashboard";
  }
}

export function getRoleNavSections(role: UserRole): NavSectionConfig[] {
  if (role === "teacher") {
    return [
      {
        id: "teacher-command",
        title: { en: "Teaching Hub", hi: "शिक्षण केंद्र", kn: "ಬೋಧನಾ ಕೇಂದ್ರ" },
        items: [
          { to: "/teacher", icon: GraduationCap, label: { en: "Teacher Dashboard", hi: "शिक्षक डैशबोर्ड", kn: "ಶಿಕ್ಷಕರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್" }, category: "portals" },
          { to: "/classrooms", icon: Users, label: { en: "Classrooms & Roster", hi: "कक्षाएँ और छात्र", kn: "ತರಗತಿಗಳು ಮತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳು" }, category: "community" },
        ],
      },
      {
        id: "teacher-curriculum",
        title: { en: "Curriculum & Labs", hi: "पाठ्यक्रम और लैब", kn: "ಪಠ್ಯಕ್ರಮ ಮತ್ತು ಲ್ಯಾಬ್" },
        items: [
          { to: "/learn", icon: BookOpen, label: { en: "Curriculum Library", hi: "पाठ्यक्रम पुस्तकालय", kn: "ಪಠ್ಯಕ್ರಮ ಗ್ರಂಥಾಲಯ" }, category: "learn" },
          { to: "/circuitverse", icon: CircuitBoard, label: { en: "CircuitVerse", hi: "सर्किट वर्स", kn: "ಸರ್ಕ್ಯೂಟ್ ವರ್ಸ್" }, category: "explore" },
          { to: "/codeverse", icon: Code2, label: { en: "CodeVerse", hi: "कोड वर्स", kn: "ಕೋಡ್ ವರ್ಸ್" }, category: "explore" },
          { to: "/playlab", icon: Gamepad2, label: { en: "PlayLab", hi: "प्ले लैब", kn: "ಪ್ಲೇ ಲ್ಯಾಬ್" }, category: "explore" },
          { to: "/projects", icon: FolderGit2, label: { en: "Student Projects", hi: "छात्र प्रोजेक्ट्स", kn: "ವಿದ್ಯಾರ್ಥಿ ಯೋಜನೆಗಳು" }, category: "explore" },
        ],
      },
      {
        id: "teacher-diagnostics",
        title: { en: "Diagnostics & Network", hi: "निदान और नेटवर्क", kn: "ರೋಗನಿರ್ಣಯ ಮತ್ತು ಜಾಲಬಂಧ" },
        items: [
          { to: "/tutor", icon: Bot, label: { en: "AI Misconceptions", hi: "AI भ्रांतियाँ", kn: "AI ತಪ್ಪು ಕಲ್ಪನೆಗಳು" }, category: "ai-offline" },
        ],
      },
      {
        id: "teacher-quests",
        title: { en: "School Quests & Storage", hi: "स्कूल चुनौतियाँ और स्टोरेज", kn: "ಶಾಲಾ ಸವಾಲುಗಳು ಮತ್ತು ಸಂಗ್ರಹಣೆ" },
        items: [
          { to: "/challenges", icon: Target, label: { en: "School Challenges", hi: "स्कूल चुनौतियाँ", kn: "ಶಾಲಾ ಸವಾಲುಗಳು" }, category: "community" },
          { to: "/downloads", icon: Download, label: { en: "Offline Packs", hi: "डाउनलोड्स", kn: "ಡೌನ್‌ಲೋಡ್‌ಗಳು" }, category: "progress" },
        ],
      },
      {
        id: "teacher-settings",
        title: { en: "Preferences", hi: "प्राथमिकताएं", kn: "ಆದ್ಯತೆಗಳು" },
        items: [
          { to: "/settings", icon: Settings, label: { en: "Settings", hi: "सेटिंग्स", kn: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು" }, category: "settings" },
        ],
      },
    ];
  }

  if (role === "parent") {
    return [
      {
        id: "parent-hub",
        title: { en: "Guardian Overview", hi: "अभिभावक दृश्य", kn: "ಪೋಷಕರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್" },
        items: [
          { to: "/parent", icon: HeartHandshake, label: { en: "Guardian Portal", hi: "अभिभावक दृश्य", kn: "ಪೋಷಕರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್" }, category: "portals" },
        ],
      },
      {
        id: "parent-learning",
        title: { en: "Child Learning", hi: "बच्चे की पढ़ाई", kn: "ಮಗುವಿನ ಕಲಿಕೆ" },
        items: [
          { to: "/learn", icon: BookOpen, label: { en: "Curriculum Overview", hi: "पाठ्यक्रम विवरण", kn: "ಪಠ್ಯಕ್ರಮ ವಿವರ" }, category: "learn" },
          { to: "/projects", icon: FolderGit2, label: { en: "Student Projects", hi: "छात्र प्रोजेक्ट्स", kn: "ವಿದ್ಯಾರ್ಥಿ ಯೋಜನೆಗಳು" }, category: "explore" },
        ],
      },
      {
        id: "parent-progress",
        title: { en: "Progress & Insights", hi: "प्रगति और विश्लेषण", kn: "ಪ್ರಗತಿ ಮತ್ತು ಒಳನೋಟಗಳು" },
        items: [
          { to: "/progress", icon: LineChart, label: { en: "Learning Analytics", hi: "प्रगति विश्लेषण", kn: "ಪ್ರಗತಿ ವಿಶ್ಲೇಷಣೆ" }, category: "progress" },
          { to: "/voice", icon: Mic, label: { en: "VidyaVoice Audio", hi: "वाणी सहायक", kn: "ಧ್ವನಿ ಸಹಾಯಕ" }, category: "ai-offline" },
        ],
      },
      {
        id: "parent-settings",
        title: { en: "Preferences", hi: "प्राथमिकताएं", kn: "ಆದ್ಯತೆಗಳು" },
        items: [
          { to: "/settings", icon: Settings, label: { en: "Language & Display", hi: "भाषा और डिस्प्ले", kn: "ಭಾಷೆ ಮತ್ತು ಪ್ರದರ್ಶನ" }, category: "settings" },
        ],
      },
    ];
  }

  // Default: Student (Clean 4-part grouping for balanced visual hierarchy)
  return [
    {
      id: "student-learn",
      title: { en: "Learning Hub", hi: "अध्ययन केंद्र", kn: "ಕಲಿಕಾ ಕೇಂದ್ರ" },
      items: [
        allNav.find((n) => n.to === "/dashboard")!,
        allNav.find((n) => n.to === "/learn")!,
      ],
    },
    {
      id: "student-explore",
      title: { en: "STEM Studios", hi: "स्टेम लैब्स", kn: "ಸ್ಟೆಮ್ ಲ್ಯಾಬ್ಸ್" },
      items: [
        allNav.find((n) => n.to === "/playlab")!,
        allNav.find((n) => n.to === "/circuitverse")!,
        allNav.find((n) => n.to === "/codeverse")!,
        allNav.find((n) => n.to === "/projects")!,
        allNav.find((n) => n.to === "/tutor")!,
        allNav.find((n) => n.to === "/voice")!,
      ],
    },
    {
      id: "student-community",
      title: { en: "Community & Quests", hi: "समुदाय और चुनौतियाँ", kn: "ಸಮುದಾಯ ಮತ್ತು ಸವಾಲುಗಳು" },
      items: [
        allNav.find((n) => n.to === "/classrooms")!,
        allNav.find((n) => n.to === "/challenges")!,
        allNav.find((n) => n.to === "/rewards")!,
      ],
    },
    {
      id: "student-progress",
      title: { en: "Progress & Storage", hi: "प्रगति और स्टोरेज", kn: "ಪ್ರಗತಿ ಮತ್ತು ಸಂಗ್ರಹಣೆ" },
      items: [
        allNav.find((n) => n.to === "/progress")!,
        allNav.find((n) => n.to === "/downloads")!,
        allNav.find((n) => n.to === "/settings")!,
      ],
    },
  ];
}

export function getRoleBottomNav(role: UserRole): NavItem[] {
  if (role === "teacher") {
    return [
      { to: "/teacher", icon: GraduationCap, label: { en: "Hub", hi: "हब", kn: "ಹಬ್" }, category: "portals" },
      { to: "/classrooms", icon: Users, label: { en: "Classes", hi: "कक्षाएँ", kn: "ತರಗತಿಗಳು" }, category: "community" },
      { to: "/learn", icon: BookOpen, label: { en: "Curriculum", hi: "पाठ्यक्रम", kn: "ಪಠ್ಯಕ್ರಮ" }, category: "learn" },
      { to: "/mesh", icon: Network, label: { en: "Mesh", hi: "मेश", kn: "ಮೆಶ್" }, category: "ai-offline" },
    ];
  }

  if (role === "parent") {
    return [
      { to: "/parent", icon: HeartHandshake, label: { en: "Overview", hi: "अवलोकन", kn: "ವಿವರ" }, category: "portals" },
      { to: "/progress", icon: LineChart, label: { en: "Progress", hi: "प्रगति", kn: "ಪ್ರಗತಿ" }, category: "progress" },
      { to: "/learn", icon: BookOpen, label: { en: "Lessons", hi: "पाठ", kn: "ಪಾಠಗಳು" }, category: "learn" },
      { to: "/voice", icon: Mic, label: { en: "Audio", hi: "वाणी", kn: "ಧ್ವನಿ" }, category: "ai-offline" },
    ];
  }

  // Student
  return [
    { to: "/dashboard", icon: Home, label: { en: "Home", hi: "होम", kn: "ಮುಖಪುಟ" }, category: "learn" },
    { to: "/learn", icon: BookOpen, label: { en: "Learn", hi: "पाठ", kn: "ಕಲಿಯಿರಿ" }, category: "learn" },
    { to: "/playlab", icon: Gamepad2, label: { en: "PlayLab", hi: "लैब", kn: "ಲ್ಯಾಬ್" }, category: "explore" },
    { to: "/progress", icon: LineChart, label: { en: "Progress", hi: "प्रगति", kn: "ಪ್ರಗತಿ" }, category: "progress" },
  ];
}
