import type {
  Subject,
  Lesson,
  SubjectTheme,
  CurriculumBoard,
  Definition,
  WorkedExample,
  GuidedPractice,
  StemActivityRef,
  Lang,
} from "@/types";
export type {
  Subject,
  Lesson,
  SubjectTheme,
  CurriculumBoard,
  Definition,
  WorkedExample,
  GuidedPractice,
  StemActivityRef,
  Lang,
};

export const demoStudent = {
  name: "Ananya R.",
  classLevel: 7,
  section: "B",
  school: "Demo Government Higher Primary School",
  startingXp: 1240,
  streakDays: 6,
};

export const SUBJECT_THEMES: Record<Subject, SubjectTheme> = {
  Mathematics: { primary: "#42A5E8", tint: "#DDF2FC", border: "#42A5E8", meterTone: "blue" },
  Science: { primary: "#19B99A", tint: "#DDF8EE", border: "#19B99A", meterTone: "teal" },
  Computing: { primary: "#6541F5", tint: "#EAE7FF", border: "#6541F5", meterTone: "purple" },
  "Social Science": { primary: "#F5A623", tint: "#FFF0D5", border: "#F5A623", meterTone: "orange" },
  English: { primary: "#E95778", tint: "#FCE5EB", border: "#E95778", meterTone: "pink" },
};

export function getSubjectTheme(subject: string): SubjectTheme {
  return (SUBJECT_THEMES as Record<string, SubjectTheme>)[subject] ?? SUBJECT_THEMES.Mathematics;
}

export const lessons: Lesson[] = [
  {
    id: "fractions-intro",
    title: "What a fraction really means",
    subject: "Mathematics",
    chapter: "Ch 2 · Fractions and Decimals",
    classLevel: 7,
    durationMin: 12,
    type: "Video",
    sizeMb: 18,
    board: "NCERT",
    language: "en",
    availableLanguages: ["en", "hi", "kn"],
    version: "v2.1.0",
    packId: "pack-math7",
    summary:
      "A fraction represents equal shares or parts of a single whole unit. Understanding fractions on a number line builds the foundation for algebra and measurement.",
    objectives: [
      "Describe a fraction as equal parts of a whole",
      "Compare fractions with the same denominator",
      "Place simple fractions on a number line",
    ],
    notes: [
      "A fraction a/b means the whole is split into b equal parts and we take a of them.",
      "The parts must be equal. Three unequal pieces of a roti are not thirds.",
      "When denominators are the same, the fraction with the larger numerator is larger.",
    ],
    definitions: [
      { term: "Numerator", explanation: "The top number showing how many equal parts are selected or considered." },
      { term: "Denominator", explanation: "The bottom number showing the total number of equal parts the whole is divided into." },
      { term: "Proper Fraction", explanation: "A fraction where the numerator is strictly smaller than the denominator (e.g. 3/4)." },
    ],
    examples: [
      {
        title: "Sharing Roti Fairly",
        problem: "Meera divides 1 circular roti into 4 equal slices and gives 3 slices to her brother. What fraction remains for Meera?",
        solution: "Total parts = 4 (denominator). Brother takes 3 parts. Remaining parts = 4 - 3 = 1 slice. Therefore, Meera gets 1/4 of the roti.",
      },
      {
        title: "Comparing Like Fractions",
        problem: "Which is greater: 5/8 or 3/8?",
        solution: "Since both denominators are 8, each part is the same size. 5 parts is more than 3 parts, so 5/8 > 3/8.",
      },
    ],
    guidedPractice: {
      prompt: "A field is divided into 6 equal strips. A farmer plants wheat on 4 of the strips. What fraction of the field is planted with wheat?",
      options: ["4/6", "2/6", "6/4", "1/4"],
      correctIndex: 0,
      explanation: "The whole field has 6 equal parts (denominator), and 4 are planted (numerator), giving 4/6 (or 2/3 simplified).",
    },
    quizId: "fractions",
    stemActivity: {
      kind: "playlab",
      title: "Fraction Strips & Number Line Simulator",
      description: "Experiment visually by cutting virtual clay slabs and comparing strip lengths in PlayLab.",
      route: "/playlab",
      badge: "Visual Math Lab",
    },
    transcript: {
      en: "Welcome to Fractions! Look at this circular roti. When we cut it into four equal quarters, each slice is exactly 1/4. The bottom number is the denominator, and the top number is the numerator.",
      hi: "भिन्न (Fractions) में आपका स्वागत है! जब हम एक रोटी को चार बराबर भागों में बाँटते हैं, तो प्रत्येक भाग 1/4 होता है। नीचे की संख्या हर (Denominator) है और ऊपर की संख्या अंश (Numerator) है।",
      kn: "ಭಿನ್ನರಾಶಿಗಳಿಗೆ (Fractions) ಸುಸ್ವಾಗತ! ಒಂದು ರೊಟ್ಟಿಯನ್ನು 4 ಸಮಾನ ಭಾಗಗಳಾಗಿ ವಿಂಗಡಿಸಿದಾಗ, ಪ್ರತಿ ಭಾಗವು 1/4 ಆಗಿರುತ್ತದೆ. ಕೆಳಗಿನ ಸಂಖ್ಯೆ ಛೇದ (Denominator), ಮೇಲಿನ ಸಂಖ್ಯೆ ಅಂಶ (Numerator).",
    },
  },
  {
    id: "fractions-multiply",
    title: "Multiplying a fraction by a whole number",
    subject: "Mathematics",
    chapter: "Ch 2 · Fractions and Decimals",
    classLevel: 7,
    durationMin: 15,
    type: "Activity",
    sizeMb: 6,
    board: "NCERT",
    language: "en",
    availableLanguages: ["en", "hi", "kn"],
    version: "v2.0.4",
    packId: "pack-math7",
    summary:
      "Multiplying a fraction by a whole number can be understood as repeated addition. We multiply the numerator while keeping the denominator unchanged.",
    objectives: ["Use repeated addition to multiply fractions", "Simplify the resulting product"],
    notes: [
      "3 × 2/5 is the same as 2/5 + 2/5 + 2/5 = 6/5.",
      "Multiply the numerator by the whole number and keep the denominator.",
    ],
    definitions: [
      { term: "Repeated Addition", explanation: "Adding the same fraction multiple times (e.g., 3 groups of 2/5 = 6/5)." },
      { term: "Improper Fraction", explanation: "A fraction where the numerator is greater than or equal to the denominator." },
    ],
    examples: [
      {
        title: "Repeated Addition Formula",
        problem: "Calculate 4 × 2/9.",
        solution: "Multiply the whole number 4 by the numerator 2: (4 × 2) / 9 = 8/9.",
      },
    ],
    guidedPractice: {
      prompt: "What is 5 × 1/3?",
      options: ["5/3", "1/15", "5/15", "6/3"],
      correctIndex: 0,
      explanation: "5 × 1/3 = (5 × 1) / 3 = 5/3 (which is 1 whole and 2/3).",
    },
    quizId: "fractions",
    stemActivity: {
      kind: "playlab",
      title: "Math Ludo & Fraction Multiplication",
      description: "Play against classmates in the offline math arena, multiplying steps to advance across the board.",
      route: "/playlab",
      badge: "Board Game Practice",
    },
    transcript: {
      en: "Think of multiplication as groups. If you have 3 bowls and each bowl has 2/5 kg of flour, you have 2/5 + 2/5 + 2/5 = 6/5 kg.",
      hi: "गुणा को समूहों के रूप में सोचें। यदि आपके पास 3 कटोरियाँ हैं और प्रत्येक में 2/5 किग्रा आटा है, तो कुल 6/5 किग्रा होगा।",
      kn: "ಗುಣಾಕಾರವನ್ನು ಗುಂಪುಗಳಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ. 3 ಬಟ್ಟಲುಗಳಲ್ಲಿ ಪ್ರತಿಯೊಂದರಲ್ಲೂ 2/5 ಕಿಲೋಗ್ರಾಂ ಹಿಟ್ಟಿದ್ದರೆ, ಒಟ್ಟು 6/5 ಕಿಲೋಗ್ರಾಂ ಆಗುತ್ತದೆ.",
    },
  },
  {
    id: "decimals-place-value",
    title: "Decimals and place value",
    subject: "Mathematics",
    chapter: "Ch 2 · Fractions and Decimals",
    classLevel: 7,
    durationMin: 10,
    type: "Reading",
    sizeMb: 2,
    board: "NCERT",
    language: "en",
    availableLanguages: ["en", "hi", "kn"],
    version: "v1.8.0",
    packId: "pack-math7",
    summary:
      "Decimals are another way to express fractions whose denominators are powers of ten (10, 100, 1000). Place value determines their magnitude.",
    objectives: ["Read tenths and hundredths correctly", "Convert between fractions and decimals accurately"],
    notes: ["0.25 means 2 tenths and 5 hundredths, which equals 25/100 or 1/4."],
    definitions: [
      { term: "Tenth", explanation: "One part out of 10 equal parts (0.1 = 1/10)." },
      { term: "Hundredth", explanation: "One part out of 100 equal parts (0.01 = 1/100)." },
    ],
    examples: [
      {
        title: "Fraction to Decimal Conversion",
        problem: "Convert 3/10 and 7/100 into decimal notation.",
        solution: "3/10 has 1 zero in denominator, so it is 0.3. 7/100 has 2 zeros, so it is 0.07.",
      },
    ],
    guidedPractice: {
      prompt: "Which decimal is equivalent to 1/2?",
      options: ["0.5", "0.2", "0.05", "0.12"],
      correctIndex: 0,
      explanation: "1/2 = 5/10 = 0.5.",
    },
    quizId: "fractions",
    stemActivity: {
      kind: "playlab",
      title: "Cash Register & Currency Counter",
      description: "Simulate counting Indian Rupees and Paise to master decimals place value.",
      route: "/playlab",
      badge: "Real-world Practical",
    },
    transcript: {
      en: "Place value shifts by powers of ten. The first place after the decimal point is tenths, followed by hundredths.",
      hi: "दशमलव बिंदु के बाद पहला स्थान दशांश (tenths) और दूसरा स्थान शतांश (hundredths) होता है।",
      kn: "ದಶಮಾಂಶ ಬಿಂದುವಿನ ನಂತರದ ಮೊದಲ ಸ್ಥಾನ ದಶಮಾಂಶ (tenths) ಮತ್ತು ಎರಡನೇ ಸ್ಥಾನ ಶತಮಾಂಶ (hundredths).",
    },
  },
  {
    id: "electric-circuits",
    title: "Electric current and simple circuits",
    subject: "Science",
    chapter: "Ch 10 · Electric Current and its Effects",
    classLevel: 7,
    durationMin: 14,
    type: "Video",
    sizeMb: 22,
    board: "NCERT",
    language: "en",
    availableLanguages: ["en", "hi", "kn"],
    version: "v3.0.1",
    packId: "pack-sci7",
    summary:
      "Electric current is the flow of electric charges. For charges to move and light a bulb, there must be an uninterrupted closed conducting loop from the positive terminal to the negative terminal.",
    objectives: [
      "Identify the parts of a simple circuit",
      "Explain why a circuit must be closed for a bulb to glow",
      "Draw circuit symbols for cell, switch and bulb",
    ],
    notes: [
      "Current flows only through a closed path from one terminal of the cell to the other.",
      "A switch opens or closes the path. When open, no current flows.",
    ],
    definitions: [
      { term: "Electric Circuit", explanation: "A closed continuous loop through which electric current can flow." },
      { term: "Conductor", explanation: "A material (like copper or aluminium) that allows electric current to pass through freely." },
      { term: "Insulator", explanation: "A material (like rubber, plastic, or dry wood) that blocks electric current from passing." },
    ],
    examples: [
      {
        title: "Diagnosing an Unlit Bulb",
        problem: "A student connects a cell and bulb with copper wire, but the key is unplugged (open switch). Why doesn't the bulb glow?",
        solution: "When the switch is open, the conducting loop is broken. Current cannot flow across the air gap. Closing the switch completes the circuit.",
      },
    ],
    guidedPractice: {
      prompt: "Which component acts as the source of electrical energy in a portable torch?",
      options: ["The dry cell", "The switch", "The bulb glass", "The copper connector"],
      correctIndex: 0,
      explanation: "The cell provides electrical potential energy from chemical reactions. The switch merely controls the path.",
    },
    quizId: "circuits",
    stemActivity: {
      kind: "circuitverse",
      title: "Virtual Breadboard & Circuit Simulator",
      description: "Drag wires, switches, batteries and LED bulbs to simulate circuit continuity without burning components.",
      route: "/circuitverse",
      badge: "Interactive Lab Simulator",
    },
    transcript: {
      en: "Electricity powers our homes, radios, and flashlights. Notice how the battery has two terminals: positive and negative. When connected through copper wire to a lamp, electrons complete the circuit.",
      hi: "विद्युत धारा एक बंद परिपथ में बहती है। सेल के दो सिरे होते हैं: धनात्मक (+) और ऋणात्मक (-)। जब कुंजी बंद होती है, तो बल्ब जलता है।",
      kn: "ವಿದ್ಯುತ್ ಪ್ರವಾಹವು ಮುಚ್ಚಿದ ಮಂಡಲದಲ್ಲಿ ಮಾತ್ರ ಹರಿಯುತ್ತದೆ. ಬ್ಯಾಟರಿಯು ಧನ ಮತ್ತು ಋಣ ಎಂಬ ಎರಡು ತುದಿಗಳನ್ನು ಹೊಂದಿರುತ್ತದೆ. ಸ್ವಿಚ್ ಆನ್ ಮಾಡಿದಾಗ ಮಾತ್ರ ದೀಪ ಬೆಳಗುತ್ತದೆ.",
    },
  },
  {
    id: "heating-effect",
    title: "Heating effect of current",
    subject: "Science",
    chapter: "Ch 10 · Electric Current and its Effects",
    classLevel: 7,
    durationMin: 9,
    type: "Reading",
    sizeMb: 3,
    board: "NCERT",
    language: "en",
    availableLanguages: ["en", "hi", "kn"],
    version: "v1.4.0",
    packId: "pack-sci7",
    summary:
      "When current encounters resistance in a conducting wire, electrical energy transforms into heat energy. This property is utilized in electric heaters, geysers, and safety fuses.",
    objectives: [
      "Explain how a fuse protects a circuit from overloading",
      "Name domestic appliances using the heating effect",
    ],
    notes: [
      "When current flows through a thin wire, the wire heats up. Fuses use this effect to protect appliances.",
    ],
    definitions: [
      { term: "Heating Effect", explanation: "Generation of thermal energy when electric current passes through a high-resistance conductor." },
      { term: "Electric Fuse", explanation: "A safety device with a low melting point wire that melts to break the circuit when excess current flows." },
    ],
    examples: [
      {
        title: "How an Electric Fuse Saves Appliances",
        problem: "A sudden lightning surge sends 25 Amperes of current through a 5 Amp domestic circuit. What happens to the fuse wire?",
        solution: "The surge produces intense heat, quickly exceeding the melting point of the fuse wire. The wire melts and breaks the circuit safely.",
      },
    ],
    guidedPractice: {
      prompt: "Why is nichrome wire used in electric room heaters instead of copper?",
      options: [
        "Nichrome has high electrical resistance and glows red hot without oxidizing easily",
        "Nichrome is cheaper than copper",
        "Nichrome does not conduct current",
        "Nichrome cools down when current flows",
      ],
      correctIndex: 0,
      explanation: "High electrical resistance causes electric energy to efficiently convert into intense thermal energy.",
    },
    quizId: "circuits",
    stemActivity: {
      kind: "circuitverse",
      title: "Fuse Overload & Current Tester",
      description: "Simulate short circuits safely and watch how fuse wires melt when current thresholds are exceeded.",
      route: "/circuitverse",
      badge: "Safety Simulator",
    },
    transcript: {
      en: "Feel the back of an active radio or lamp: it feels warm. That warmth is the heating effect of electric current at work.",
      hi: "जब किसी तार से विद्युत धारा प्रवाहित होती है, तो वह गर्म हो जाता है। इसे धारा का तापीय प्रभाव कहते हैं।",
      kn: "ತಂತಿಯ ಮೂಲಕ ವಿದ್ಯುತ್ ಪ್ರವಾಹ ಹರಿದಾಗ ಅದು ಬಿಸಿಯಾಗುತ್ತದೆ. ಇದನ್ನು ವಿದ್ಯುತ್ ಪ್ರವಾಹದ ಉಷ್ಣ ಪರಿಣಾಮ ಎಂದು ಕರೆಯಲಾಗುತ್ತದೆ.",
    },
  },
  {
    id: "nutrition-plants",
    title: "How plants make their food",
    subject: "Science",
    chapter: "Ch 1 · Nutrition in Plants",
    classLevel: 7,
    durationMin: 11,
    type: "Video",
    sizeMb: 16,
    board: "NCERT",
    language: "en",
    availableLanguages: ["en", "hi", "kn"],
    version: "v2.2.0",
    packId: "pack-sci7",
    summary:
      "Green plants are autotrophs that synthesize their own food using sunlight, water, carbon dioxide, and chlorophyll through photosynthesis.",
    objectives: [
      "Describe photosynthesis in simple terms",
      "Name the essential raw materials required",
    ],
    notes: [
      "Leaves use sunlight, water and carbon dioxide to make food (glucose) and release oxygen for all living beings.",
    ],
    definitions: [
      { term: "Autotroph", explanation: "Organisms that make their own food from simple inorganic substances (like green plants)." },
      { term: "Photosynthesis", explanation: "The process by which green plants make glucose from carbon dioxide and water using sunlight and chlorophyll." },
      { term: "Stomata", explanation: "Tiny pores on leaf surfaces that take in carbon dioxide and release oxygen." },
    ],
    examples: [
      {
        title: "The Photosynthesis Equation",
        problem: "What are the inputs and outputs of the photosynthesis chemical reaction?",
        solution: "Inputs: Carbon dioxide + Water + Sunlight. Catalyzed by: Chlorophyll. Outputs: Glucose (carbohydrate) + Oxygen gas.",
      },
    ],
    guidedPractice: {
      prompt: "Which green pigment in leaves traps solar energy for photosynthesis?",
      options: ["Chlorophyll", "Hemoglobin", "Carotene", "Cellulose"],
      correctIndex: 0,
      explanation: "Chlorophyll is the pigment in chloroplasts that absorbs sunlight.",
    },
    quizId: "circuits",
    stemActivity: {
      kind: "playlab",
      title: "Photosynthesis Sunlight Chamber",
      description: "Adjust sunlight, water, and CO2 levels in PlayLab to observe leaf starch production.",
      route: "/playlab",
      badge: "Ecology Sandbox",
    },
    transcript: {
      en: "Every green leaf is a miniature solar-powered kitchen. Green plants capture photons from the sun and combine them with water from the soil.",
      hi: "पौधे सूर्य के प्रकाश, जल और कार्बन डाइऑक्साइड की सहायता से अपना भोजन स्वयं बनाते हैं। इस प्रक्रिया को प्रकाश संश्लेषण कहते हैं।",
      kn: "ಹಸಿರು ಸಸ್ಯಗಳು ಸೂರ್ಯನ ಬೆಳಕು, ನೀರು ಮತ್ತು ಇಂಗಾಲದ ಡೈಆಕ್ಸೈಡ್ ಬಳಸಿ ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ ಕ್ರಿಯೆಯ ಮೂಲಕ ಆಹಾರವನ್ನು ತಯಾರಿಸುತ್ತವೆ.",
    },
  },
  {
    id: "tenses-past",
    title: "Simple past tense in stories",
    subject: "English",
    chapter: "Unit 3 · Grammar in Context",
    classLevel: 7,
    durationMin: 8,
    type: "Reading",
    sizeMb: 1,
    board: "NCERT",
    language: "en",
    availableLanguages: ["en", "hi", "kn"],
    version: "v1.2.0",
    packId: "pack-sst7",
    summary:
      "The simple past tense is used to describe actions that started and finished at a specific time in the past. It is essential for narrative writing.",
    objectives: [
      "Change regular and irregular verbs to simple past",
      "Use simple past to recount historical events and stories",
    ],
    notes: [
      "Regular verbs add -ed (walk -> walked). Irregular verbs change form completely (go -> went, see -> saw).",
    ],
    definitions: [
      { term: "Regular Verb", explanation: "A verb that forms its past tense by adding -d or -ed (e.g. jump -> jumped)." },
      { term: "Irregular Verb", explanation: "A verb that changes its spelling in the past tense without adding -ed (e.g. eat -> ate)." },
    ],
    examples: [
      {
        title: "Story Transformation",
        problem: "Rewrite: 'The tiger sees the deer and runs fast.' into past tense.",
        solution: "'The tiger saw the deer and ran fast.' (sees -> saw, runs -> ran).",
      },
    ],
    guidedPractice: {
      prompt: "Which is the correct past tense of the verb 'teach'?",
      options: ["Taught", "Teached", "Teaching", "Tought"],
      correctIndex: 0,
      explanation: "'Teach' is an irregular verb whose past tense is 'taught'.",
    },
    quizId: "fractions",
    stemActivity: {
      kind: "playlab",
      title: "Story Weaver & Voice Recorder",
      description: "Narrate folk tales into VidyaVerse Voice and practice past tense pronunciations.",
      route: "/playlab",
      badge: "Language Lab",
    },
    transcript: {
      en: "When we tell a story about what happened yesterday, we speak in the past tense. Notice how 'walk' becomes 'walked', but 'fly' becomes 'flew'.",
      hi: "भूतकाल (Past Tense) का प्रयोग उन क्रियाओं के लिए किया जाता है जो पहले घटित हो चुकी हैं। जैसे 'खेलता है' का भूतकाल 'खेला' होता है।",
      kn: "ಹಿಂದೆ ನಡೆದ ಘಟನೆಗಳನ್ನು ವಿವರಿಸಲು ಭೂತಕಾಲವನ್ನು (Past Tense) ಬಳಸುತ್ತೇವೆ. ಉದಾಹರಣೆಗೆ 'ಹೋಗುತ್ತಾನೆ' ಎನ್ನುವುದು 'ಹೋದನು' ಆಗುತ್ತದೆ.",
    },
  },
  {
    id: "rivers-india",
    title: "Rivers of the Deccan plateau",
    subject: "Social Science",
    chapter: "Ch 4 · Our Land and Water",
    classLevel: 7,
    durationMin: 13,
    type: "Video",
    sizeMb: 20,
    board: "Karnataka State Board",
    language: "en",
    availableLanguages: ["en", "hi", "kn"],
    version: "v2.5.0",
    packId: "pack-sst7",
    summary:
      "The Deccan plateau is a peninsular triangular landmass south of the Narmada River. It slopes gently from the Western Ghats eastwards towards the Bay of Bengal.",
    objectives: [
      "Locate the Godavari, Krishna and Kaveri on a physical map",
      "Explain why most peninsular rivers flow eastward into the Bay of Bengal",
      "Understand seasonal rain-fed flows vs perennial Himalayan rivers",
    ],
    notes: [
      "The Deccan plateau slopes from west to east, so major rivers flow into the Bay of Bengal.",
      "The Narmada and Tapi are exceptions: they flow westwards into the Arabian Sea through rift valleys.",
    ],
    definitions: [
      { term: "Plateau", explanation: "An elevated flat-topped tableland standing above surrounding terrain." },
      { term: "Delta", explanation: "A wetland landform formed as river waters deposit sediment into another water body." },
      { term: "Rain-fed River", explanation: "A river whose water volume depends primarily on monsoon rainfall rather than melting glaciers." },
    ],
    examples: [
      {
        title: "River Slope Analysis",
        problem: "Why do rivers like the Kaveri and Krishna originate in the Western Ghats but travel across India to empty in the Bay of Bengal?",
        solution: "Because the Deccan landmass tilts gently towards the east. Gravity pulls flowing water downhill towards the lower eastern coastline.",
      },
    ],
    guidedPractice: {
      prompt: "Which major river rises in Talakaveri in Karnataka and flows eastwards?",
      options: ["Kaveri", "Yamuna", "Narmada", "Indus"],
      correctIndex: 0,
      explanation: "The Kaveri river originates at Talakaveri in the Brahmagiri Hills of Karnataka.",
    },
    quizId: "fractions",
    stemActivity: {
      kind: "playlab",
      title: "Bharat Explorer: River Terrain Map",
      description: "Trace peninsular river basins and catchment areas in the interactive Bharat Explorer map.",
      route: "/playlab",
      badge: "Geographic Atlas",
    },
    transcript: {
      en: "Look at the physical relief map of southern India. The tall Western Ghats act as a giant wall, sending rain-fed waters flowing gently across the Deccan plateau into the Bay of Bengal.",
      hi: "दक्कन का पठार पश्चिम से पूर्व की ओर ढलान वाला है। इसलिए गोदावरी, कृष्णा और कावेरी नदियाँ बंगाल की खाड़ी में गिरती हैं।",
      kn: "ದಖನ್ ಪ್ರಸ್ಥಭೂಮಿಯು ಪಶ್ಚಿಮದಿಂದ ಪೂರ್ವಕ್ಕೆ ಇಳಿಜಾರಾಗಿದೆ. ಆದ್ದರಿಂದ ಗೋದಾವರಿ, ಕೃಷ್ಣಾ ಮತ್ತು ಕಾವೇರಿ ನದಿಗಳು ಬಂಗಾಳ ಕೊಲ್ಲಿಯನ್ನು ಸೇರುತ್ತವೆ.",
    },
  },
  {
    id: "algorithms-steps",
    title: "Algorithms are step-by-step plans",
    subject: "Computing",
    chapter: "Unit 1 · Computational Thinking",
    classLevel: 7,
    durationMin: 10,
    type: "Activity",
    sizeMb: 4,
    board: "NCERT",
    language: "en",
    availableLanguages: ["en", "hi", "kn"],
    version: "v2.0.0",
    packId: "pack-math7",
    summary:
      "An algorithm is a finite sequence of well-defined, unambiguous computer-implementable instructions to solve a class of specific problems or perform a computation.",
    objectives: [
      "Write sequential instructions in the correct logical order",
      "Find and debug faulty instructions in a daily routine algorithm",
    ],
    notes: [
      "An algorithm is a precise list of steps. Order matters: you cannot pour tea before boiling water.",
      "Computers follow instructions literally: ambiguous directions lead to bugs.",
    ],
    definitions: [
      { term: "Algorithm", explanation: "A clear step-by-step procedure for solving a problem or finishing a task." },
      { term: "Debugging", explanation: "Finding and fixing mistakes or unexpected outcomes in computer logic." },
      { term: "Sequencing", explanation: "Executing steps strictly one after another in designated chronological order." },
    ],
    examples: [
      {
        title: "Making Chai Algorithm",
        problem: "Order these steps: [Boil water], [Add tea leaves & milk], [Filter into cup], [Turn on stove].",
        solution: "1. Turn on stove -> 2. Boil water -> 3. Add tea leaves & milk -> 4. Filter into cup.",
      },
    ],
    guidedPractice: {
      prompt: "If a robot is told: 'Step forward 2 times, Turn Left, Step forward 3 times', what happens if the order is changed to 'Turn Left first'?",
      options: [
        "The robot ends up in a completely different location because orientation changed first",
        "The robot ends up at the exact same location",
        "The robot stops working",
        "The robot walks backwards",
      ],
      correctIndex: 0,
      explanation: "In algorithmic execution, the sequence of operations directly dictates the spatial path.",
    },
    quizId: "fractions",
    stemActivity: {
      kind: "codeverse",
      title: "CodeBot Maze: Block Coding Logic",
      description: "Stack move, turn, and loop blocks to navigate the rover robot through obstacles to the goal in CodeVerse.",
      route: "/codeverse",
      badge: "Visual Block Programming",
    },
    transcript: {
      en: "Every software application and game starts with algorithms. An algorithm is just an unambiguous list of steps that guides a machine.",
      hi: "एल्गोरिदम किसी कार्य को पूरा करने के लिए चरण-दर-चरण निर्देशों का एक समूह है। निर्देशों का क्रम बहुत महत्वपूर्ण होता है।",
      kn: "ಅಲ್ಗಾರಿದಮ್ ಎಂದರೆ ಒಂದು ಸಮಸ್ಯೆಯನ್ನು ಪರಿಹರಿಸಲು ಹಂತ-ಹಂತವಾಗಿ ನೀಡಲಾಗುವ ಸ್ಪಷ್ಟ ಸೂಚನೆಗಳ ಪಟ್ಟಿ. ಸೂಚನೆಗಳ ಅನುಕ್ರಮವು ಅತ್ಯಂತ ಮುಖ್ಯವಾಗಿದೆ.",
    },
  },
  {
    id: "knowing-numbers-6",
    title: "Comparing large numbers and place value",
    subject: "Mathematics",
    chapter: "Ch 1 · Knowing Our Numbers",
    classLevel: 6,
    durationMin: 12,
    type: "Video",
    sizeMb: 14,
    board: "NCERT",
    language: "en",
    availableLanguages: ["en", "hi", "kn"],
    version: "v1.1.0",
    packId: "pack-math7",
    summary:
      "Understanding the Indian and International numeration systems helps compare large population and distance numbers accurately.",
    objectives: [
      "Read and write large numbers up to 7 digits",
      "Use commas correctly according to the Indian system of numeration",
    ],
    notes: [
      "In the Indian system: ones, tens, hundreds, thousands, ten thousands, lakhs, ten lakhs.",
      "To compare numbers, check the number of digits first; if equal, compare digits from the highest place value.",
    ],
    definitions: [
      { term: "Lakh", explanation: "One hundred thousand (1,00,000)." },
      { term: "Place Value", explanation: "The value of a digit depending on its position within a number." },
    ],
    examples: [
      {
        title: "Commas Placement",
        problem: "Insert commas for 5080120 according to the Indian system.",
        solution: "50,80,120 (fifty lakh eighty thousand one hundred twenty).",
      },
    ],
    guidedPractice: {
      prompt: "Which number is larger: 7,54,320 or 7,45,320?",
      options: ["7,54,320", "7,45,320", "Equal", "Cannot determine"],
      correctIndex: 0,
      explanation: "Comparing from the left: both have 7 in the lakhs place, but ten-thousands has 5 vs 4. Thus 7,54,320 is larger.",
    },
    quizId: "fractions",
    stemActivity: {
      kind: "playlab",
      title: "Abacus & Place Value Counter",
      description: "Move virtual beads on an interactive abacus to visualize thousands and lakhs.",
      route: "/playlab",
      badge: "Math Manipulatives",
    },
    transcript: {
      en: "Numbers help us count the stars, citizens in our village, and kilometers to the moon. Today we master large place values.",
      hi: "बड़ी संख्याओं की तुलना करने के लिए हम उच्चतम स्थानीय मान से तुलना शुरू करते हैं।",
      kn: "ದೊಡ್ಡ ಸಂಖ್ಯೆಗಳನ್ನು ಹೋಲಿಸಲು ನಾವು ಎಡಭಾಗದ ಅತ್ಯುನ್ನತ ಸ್ಥಾನದ ಮೌಲ್ಯದಿಂದ ಪ್ರಾರಂಭಿಸುತ್ತೇವೆ.",
    },
  },
  {
    id: "components-food-6",
    title: "Nutrients and balanced diet",
    subject: "Science",
    chapter: "Ch 2 · Components of Food",
    classLevel: 6,
    durationMin: 10,
    type: "Reading",
    sizeMb: 5,
    board: "Karnataka State Board",
    language: "en",
    availableLanguages: ["en", "hi", "kn"],
    version: "v1.3.0",
    packId: "pack-sci7",
    summary:
      "Our food contains nutrients: carbohydrates, fats, proteins, vitamins, and minerals. A balanced diet prevents deficiency diseases and sustains immunity.",
    objectives: [
      "Identify major nutrient groups in local millets and pulses",
      "Describe laboratory tests for starch using iodine solution",
    ],
    notes: [
      "Carbohydrates and fats provide energy. Proteins build body tissues. Vitamins protect against diseases.",
      "Dietary fibres (roughage) and water do not provide nutrients but are essential for healthy digestion.",
    ],
    definitions: [
      { term: "Balanced Diet", explanation: "A daily diet containing all essential nutrients in proper proportion along with roughage and water." },
      { term: "Deficiency Disease", explanation: "Diseases caused by the prolonged lack of nutrients in one's diet (e.g. Scurvy, Rickets)." },
    ],
    examples: [
      {
        title: "Testing for Starch",
        problem: "What color change confirms starch when iodine is dropped on a boiled potato?",
        solution: "The iodine changes from brown to a deep blue-black color.",
      },
    ],
    guidedPractice: {
      prompt: "Which nutrient is primarily responsible for repairing muscle and body tissues?",
      options: ["Proteins", "Fats", "Carbohydrates", "Roughage"],
      correctIndex: 0,
      explanation: "Proteins are body-building foods essential for growth and cellular repair.",
    },
    quizId: "circuits",
    stemActivity: {
      kind: "playlab",
      title: "Plate Balance Nutrition Lab",
      description: "Assemble a balanced Indian thali with ragi, lentils, and greens to meet dietary targets.",
      route: "/playlab",
      badge: "Health Sandbox",
    },
    transcript: {
      en: "A healthy mind requires nutritious food. Let us examine what our traditional ragi mudde, dal, and green vegetables contain.",
      hi: "हमारे भोजन में कार्बोहाइड्रेट, प्रोटीन, वसा, विटामिन और खनिज होते हैं। संतुलित आहार हमें स्वस्थ रखता है।",
      kn: "ನಮ್ಮ ಆಹಾರದಲ್ಲಿ ಕಾರ್ಬೋಹೈಡ್ರೇಟ್, ಪ್ರೋಟೀನ್, ಕೊಬ್ಬು, ಜೀವಸತ್ವಗಳು ಮತ್ತು ಖನಿಜಾಂಶಗಳಿರುತ್ತವೆ. ರಾಗಿ ಮುದ್ದೆ ಮತ್ತು ಬೇಳೆ ಅತ್ಯುತ್ತಮ ಪೌಷ್ಟಿಕಾಂಶ ನೀಡುತ್ತವೆ.",
    },
  },
  {
    id: "force-pressure-8",
    title: "Contact and non-contact forces",
    subject: "Science",
    chapter: "Ch 11 · Force and Pressure",
    classLevel: 8,
    durationMin: 15,
    type: "Video",
    sizeMb: 21,
    board: "NCERT",
    language: "en",
    availableLanguages: ["en", "hi", "kn"],
    version: "v2.0.0",
    packId: "pack-sci7",
    summary:
      "A force is a push or pull on an object. Forces can change an object's state of motion, speed, or direction. Pressure measures how concentrated a force is over an area.",
    objectives: [
      "Distinguish contact forces from non-contact forces",
      "Calculate pressure as force per unit area",
    ],
    notes: [
      "Friction and muscular force require physical contact between objects.",
      "Gravity, electrostatic, and magnetic forces act across empty space without physical contact.",
    ],
    definitions: [
      { term: "Pressure", explanation: "The force acting perpendicularly per unit surface area (Pressure = Force / Area)." },
      { term: "Non-contact Force", explanation: "A force exerted by an object on another without any physical touch." },
    ],
    examples: [
      {
        title: "Why Sharp Knives Cut Better",
        problem: "Why does a sharp knife slice vegetables easier than a blunt knife with the same downward force?",
        solution: "A sharp edge has a tiny surface area (A). Since Pressure = Force / Area, a smaller area produces much higher cutting pressure.",
      },
    ],
    guidedPractice: {
      prompt: "Which of the following is an example of a non-contact force?",
      options: ["Gravitational force", "Frictional force", "Muscular force", "Mechanical force"],
      correctIndex: 0,
      explanation: "Gravitational force pulls the Moon and apples without physical contact.",
    },
    quizId: "circuits",
    stemActivity: {
      kind: "playlab",
      title: "Gravity & Friction Ramp Simulator",
      description: "Roll carts down various terrain materials in PlayLab to measure frictional resistance.",
      route: "/playlab",
      badge: "Physics Simulator",
    },
    transcript: {
      en: "Forces govern everything in our universe: from dropping a cricket ball to pushing an irrigation cart across a field.",
      hi: "बल किसी वस्तु पर लगने वाला धक्का या खिंचाव है। यह संपर्क या गैर-संपर्क हो सकता है।",
      kn: "ಬಲವು ಒಂದು ವಸ್ತುವಿನ ಮೇಲಿನ ತಳ್ಳುವಿಕೆ ಅಥವಾ ಎಳೆಯುವಿಕೆಯಾಗಿದೆ. ಗುರುತ್ವಾಕರ್ಷಣೆಯು ಅಸಂಪರ್ಕ ಬಲಕ್ಕೆ ಉದಾಹರಣೆಯಾಗಿದೆ.",
    },
  },
  {
    id: "karnataka-heritage-7",
    title: "Architecture and heritage of Karnataka",
    subject: "Social Science",
    chapter: "Ch 2 · Heritage of Karnataka",
    classLevel: 7,
    durationMin: 12,
    type: "Video",
    sizeMb: 18,
    board: "Karnataka State Board",
    language: "kn",
    availableLanguages: ["en", "hi", "kn"],
    version: "v1.5.0",
    packId: "pack-sst7",
    summary:
      "Karnataka possesses a vibrant historical heritage spanning the Hoysalas, Chalukyas, Vijayanagara Empire, and Bahmani sultanate.",
    objectives: [
      "Identify UNESCO World Heritage monuments in Hampi and Pattadakal",
      "Appreciate the star-shaped temple architecture of Belur and Halebidu",
    ],
    notes: [
      "Hampi was the majestic capital of the Vijayanagara Empire along the Tungabhadra river.",
      "Hoysala temples are famed for intricate soapstone carvings and star-shaped platforms.",
    ],
    definitions: [
      { term: "UNESCO Heritage Site", explanation: "A landmark legally protected by an international convention for cultural significance." },
      { term: "Soapstone (Schist)", explanation: "Soft metamorphic rock used by Hoysala sculptors that hardens upon exposure to air." },
    ],
    examples: [
      {
        title: "Temple Architecture",
        problem: "What unique material enabled Hoysala sculptors to carve intricate lace-like jewelry on stone idols?",
        solution: "Soft chloritic schist (soapstone), which allowed ultra-fine chiseling before hardening over centuries.",
      },
    ],
    guidedPractice: {
      prompt: "Which historic empire had its capital at Hampi on the banks of the Tungabhadra?",
      options: ["Vijayanagara Empire", "Mughal Empire", "Chola Dynasty", "Maratha Empire"],
      correctIndex: 0,
      explanation: "Hampi was the 14th-century capital of the Vijayanagara Empire.",
    },
    quizId: "fractions",
    stemActivity: {
      kind: "playlab",
      title: "Hampi 3D Monument Walkthrough",
      description: "Examine stone chariot carvings and virtual temple architecture in the PlayLab history pavilion.",
      route: "/playlab",
      badge: "Heritage Explorer",
    },
    transcript: {
      en: "Karnataka is home to world-renowned heritage sites. From the stone chariot of Hampi to the cave temples of Badami.",
      hi: "कर्नाटक की वास्तुकला अद्वितीय है। हम्पी का पत्थर का रथ और बादामी की गुफाएँ भारत का गौरव हैं।",
      kn: "ಕರ್ನಾಟಕದ ಶಿಲ್ಪಕಲೆ ಮತ್ತು ವಾಸ್ತುಶಿಲ್ಪ ವಿಶ್ವವಿಖ್ಯಾತವಾದದ್ದು. ಹಂಪಿಯ ಕಲ್ಲಿನ ರಥ ಮತ್ತು ಬೇಲೂರು-ಹಳೇಬೀಡಿನ ಹೊಯ್ಸಳ ದೇವಾಲಯಗಳು ನಮ್ಮ ಹೆಮ್ಮೆಯ ಪರಂಪರೆ.",
    },
  },
];

export const subjects: Subject[] = ["Mathematics", "Science", "English", "Social Science", "Computing"];

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
  topic: string;
}

export type Quiz = {
  title: string;
  lessonId: string;
  questions: QuizQuestion[];
};

export const quizzes: Record<string, Quiz> = {
  fractions: {
    title: "Fractions practice",
    lessonId: "fractions-intro",
    questions: [
      {
        id: "q1",
        text: "A chapati is cut into 8 equal pieces. Ravi eats 3 pieces. What fraction did he eat?",
        options: ["3/5", "3/8", "5/8", "8/3"],
        correct: 1,
        explanation: "The whole has 8 equal parts and Ravi took 3, so the fraction is 3/8.",
        topic: "Meaning of a fraction",
      },
      {
        id: "q2",
        text: "Which is larger: 5/9 or 4/9?",
        options: ["5/9", "4/9", "They are equal", "Cannot be compared"],
        correct: 0,
        explanation: "The denominators are the same, so compare numerators. 5 is more than 4.",
        topic: "Comparing fractions",
      },
      {
        id: "q3",
        text: "What is 3 × 2/7?",
        options: ["6/21", "5/7", "6/7", "2/21"],
        correct: 2,
        explanation: "Multiply only the numerator by 3: 3 × 2 = 6. The denominator stays 7.",
        topic: "Multiplying fractions",
      },
      {
        id: "q4",
        text: "Which decimal equals 1/4?",
        options: ["0.4", "0.14", "1.4", "0.25"],
        correct: 3,
        explanation: "1/4 = 25/100, which is written as 0.25.",
        topic: "Fractions and decimals",
      },
    ],
  },
  circuits: {
    title: "Simple circuits check",
    lessonId: "electric-circuits",
    questions: [
      {
        id: "c1",
        text: "A bulb does not glow even though it is connected to a cell. The switch is open. Why?",
        options: ["The cell is too strong", "The circuit is not closed", "The bulb is too new", "Wires are too long"],
        correct: 1,
        explanation: "An open switch breaks the path, so current cannot flow through the bulb.",
        topic: "Closed circuits",
      },
      {
        id: "c2",
        text: "Which material would you use to connect a cell to a bulb?",
        options: ["Plastic straw", "Rubber band", "Copper wire", "Cotton thread"],
        correct: 2,
        explanation: "Copper is a good conductor. The others are insulators.",
        topic: "Conductors and insulators",
      },
      {
        id: "c3",
        text: "What does a fuse do in a circuit?",
        options: ["Makes the bulb brighter", "Stores current", "Melts to stop excess current", "Changes direction of current"],
        correct: 2,
        explanation: "A fuse wire heats up and melts when too much current flows, opening the circuit.",
        topic: "Heating effect",
      },
    ],
  },
};

export const playlabGames = [
  {
    id: "codebot-maze",
    name: "CodeBot Maze",
    mode: "Digital",
    classes: "Class 5 to 8",
    objective: "Plan a sequence of moves so a robot reaches the goal. Builds sequencing and debugging.",
    activity: "Arrange arrow commands, run them and fix the path if the robot hits a wall.",
    playable: true,
  },
  {
    id: "math-ludo",
    name: "Math Ludo",
    mode: "Physical + optional QR",
    classes: "Class 4 to 7",
    objective: "Practise fractions and integer operations while moving tokens.",
    activity: "Solve the card question to move your token. A wrong answer means you stay. Printable board, no device needed.",
    playable: true,
  },
  {
    id: "newtons-race",
    name: "Newton's Race",
    mode: "Physical",
    classes: "Class 8 to 9",
    objective: "Understand force, mass and motion through toy-car ramp races.",
    activity: "Teams change ramp height and load, predict which car travels farther, then measure with a scale.",
    playable: false,
  },
  {
    id: "circuit-masters",
    name: "Circuit Masters",
    mode: "Card game",
    classes: "Class 6 to 8",
    objective: "Recognise circuit components and complete working circuits.",
    activity: "Collect cell, wire, switch and bulb cards to build a closed circuit before other players.",
    playable: false,
  },
  {
    id: "ecoquest",
    name: "EcoQuest",
    mode: "Outdoor + worksheet",
    classes: "Class 5 to 7",
    objective: "Observe local plants and animals and classify them by habitat.",
    activity: "Groups walk the school grounds with a checklist and record observations for a class map.",
    playable: false,
  },
  {
    id: "bharat-explorer",
    name: "Bharat Explorer",
    mode: "Board game",
    classes: "Class 6 to 8",
    objective: "Learn states, rivers and landforms of India.",
    activity: "Travel across a map board answering geography clues to collect state cards.",
    playable: false,
  },
] as const;

export const classrooms = [
  {
    code: "SCI7B",
    name: "Class 7B Science",
    teacher: "Demo Teacher: Mrs. K. Lakshmi",
    announcements: [
      { date: "Mon, 5 Oct", text: "Bring one cell and two wires on Thursday for the circuit activity." },
      { date: "Thu, 1 Oct", text: "Chapter 10 reading is assigned. Finish before the practical." },
    ],
    assigned: [
      { title: "Electric current and simple circuits", kind: "Lesson", due: "Wed, 14 Oct", lessonId: "electric-circuits" },
      { title: "Simple circuits check", kind: "Quiz", due: "Fri, 16 Oct", quizId: "circuits" },
    ],
    team: "Team challenge: build a working torch from the CircuitVerse kit. Due Mon, 19 Oct.",
  },
  {
    code: "MATH7",
    name: "Class 7 Mathematics",
    teacher: "Demo Teacher: Mr. S. Prakash",
    announcements: [{ date: "Tue, 6 Oct", text: "Fractions quiz this Friday. Practise in VidyaVerse." }],
    assigned: [
      { title: "What a fraction really means", kind: "Lesson", due: "Thu, 15 Oct", lessonId: "fractions-intro" },
      { title: "Fractions practice", kind: "Quiz", due: "Fri, 16 Oct", quizId: "fractions" },
    ],
    team: "Team challenge: Math Ludo tournament in the activity period.",
  },
  {
    code: "CODE1",
    name: "Coding Club",
    teacher: "Demo Teacher: Ms. F. Begum",
    announcements: [{ date: "Wed, 7 Oct", text: "This week: loops. Try the CodeBot Maze before Saturday." }],
    assigned: [{ title: "Algorithms are step-by-step plans", kind: "Lesson", due: "Sat, 17 Oct", lessonId: "algorithms-steps" }],
    team: "Team challenge: design a maze for another team to solve.",
  },
];

export const leaderboardDemo = [
  { name: "Demo student A", weekly: 310 },
  { name: "Demo student B", weekly: 285 },
  { name: "Demo student C", weekly: 240 },
  { name: "Demo student D", weekly: 190 },
];

export const achievements = [
  { id: "first-lesson", name: "First Step", desc: "Complete your first lesson.", rule: "Complete 1 lesson" },
  { id: "quiz-ace", name: "Quiz Ace", desc: "Score full marks on any practice quiz.", rule: "100% on a quiz" },
  { id: "maze-solver", name: "Maze Solver", desc: "Guide CodeBot to the goal in PlayLab.", rule: "Solve CodeBot Maze" },
  { id: "circuit-closed", name: "Circuit Closer", desc: "Light the bulb in the CircuitVerse workspace.", rule: "Close a circuit" },
  { id: "coder", name: "Loop Starter", desc: "Solve the beginner CodeVerse challenge.", rule: "Solve challenge 1" },
  { id: "classmate", name: "Classmate", desc: "Join a classroom with a code.", rule: "Join 1 classroom" },
  { id: "detective", name: "Detective", desc: "Fix a misconception in Concept Detective.", rule: "Correct a retry" },
  { id: "streak-7", name: "Week Streak", desc: "Learn on 7 days in a row.", rule: "7-day streak" },
] as const;

export type AchievementId = (typeof achievements)[number]["id"];

export const learningPacks = [
  { id: "pack-math7", name: "Class 7 Mathematics · Fractions", sizeMb: 26, lessons: 3 },
  { id: "pack-sci7", name: "Class 7 Science · Electricity", sizeMb: 25, lessons: 2 },
  { id: "pack-circuit", name: "CircuitVerse starter kit guides", sizeMb: 12, lessons: 4 },
  { id: "pack-sst7", name: "Class 7 Social Science · Rivers", sizeMb: 20, lessons: 1 },
];

export const rewardCatalogue = [
  { name: "Saffron profile frame", cost: 500, kind: "Cosmetic" },
  { name: "Unlock bonus CodeBot levels", cost: 800, kind: "Content" },
  { name: "Class certificate of effort (teacher-approved)", cost: 1500, kind: "Recognition" },
];

export const misconceptions = [
  {
    id: "add-fractions",
    question: "What is 1/2 + 1/3?",
    studentAnswer: "2/5",
    rule: "Answer equals (sum of numerators)/(sum of denominators)",
    misconception: "Adding numerators and denominators separately",
    why: "Halves and thirds are different sized pieces. You must first cut them into same-sized pieces (sixths) before adding: 3/6 + 2/6.",
    lessonId: "fractions-intro",
    practice: { text: "What is 1/4 + 1/2?", options: ["2/6", "3/4", "2/4", "1/6"], correct: 1 },
  },
  {
    id: "decimal-length",
    question: "Which is greater: 0.5 or 0.45?",
    studentAnswer: "0.45",
    rule: "Chose the decimal with more digits",
    misconception: "Thinking more digits means a bigger decimal",
    why: "0.5 is 5 tenths, which is 50 hundredths. 0.45 is only 45 hundredths. Compare place by place, starting from tenths.",
    lessonId: "decimals-place-value",
    practice: { text: "Which is greater: 0.7 or 0.65?", options: ["0.65", "0.7", "They are equal"], correct: 1 },
  },
  {
    id: "open-switch",
    question: "Why does the bulb glow when the switch is closed?",
    studentAnswer: "Because the switch makes electricity",
    rule: "Answer contains 'switch makes' or 'switch creates'",
    misconception: "Believing the switch is a source of current",
    why: "The cell is the source. A closed switch only completes the path so current from the cell can flow through the bulb.",
    lessonId: "electric-circuits",
    practice: { text: "What provides the current in a torch?", options: ["The switch", "The bulb", "The cell", "The case"], correct: 2 },
  },
];

export const teacherRoster = [
  { name: "Demo student 01", assignments: "2/2", quiz: 92, gap: "None flagged", lastSync: "Fri, 9 Oct 4:10 PM" },
  { name: "Demo student 02", assignments: "1/2", quiz: 64, gap: "Comparing fractions", lastSync: "Fri, 9 Oct 3:55 PM" },
  { name: "Demo student 03", assignments: "2/2", quiz: 78, gap: "Fractions and decimals", lastSync: "Thu, 8 Oct 2:20 PM" },
  { name: "Demo student 04", assignments: "0/2", quiz: null, gap: "Not yet synced", lastSync: "Not synced since Mon, 5 Oct" },
  { name: "Demo student 05", assignments: "2/2", quiz: 85, gap: "Multiplying fractions", lastSync: "Fri, 9 Oct 4:02 PM" },
];

export const DEMO_LAST_SYNC = "Fri, 9 Oct 2026, 4:12 PM (demo)";
