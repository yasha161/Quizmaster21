import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  BookOpen,
  Brain,
  Flame,
  Award,
  Moon,
  Sun,
  ArrowRight,
  Play,
  CheckCircle,
  XCircle,
  Volume2,
  VolumeX,
  History,
  Cpu,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  BarChart2,
  AlertTriangle,
  Lightbulb,
  Trash2,
  Database,
  Calendar,
  GraduationCap,
  Clock,
  Shuffle,
  ShieldAlert,
  Sliders,
  Plus,
  Lock,
  Eye,
  Check,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// @ts-ignore
import boyGamingPic from "./assets/images/boy_gaming_3d_1782227232981.jpg";
// @ts-ignore
import girlGamingPic from "./assets/images/girl_gaming_3d_1782227250329.jpg";
// @ts-ignore
import proTopperPic from "./assets/images/pro_topper_3d_1782227269673.jpg";

// TYPE INTERFACES MATCHING DATABASE & USER ENGINE
interface DbQuestion {
  id: string;
  subject: string;
  topic: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
  importance: "high" | "conceptual" | "unexpected";
  createdAt: string;
}

interface Quiz {
  title: string;
  subject: string;
  questions: DbQuestion[];
  source?: string;
  searchGroundingUsed?: boolean;
  groundedQueries?: string[];
}

interface AttemptedRecord {
  id?: string;
  userId: string;
  topic: string;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeSpent: number;
  timestamp: string;
  questions?: string[];
  answers?: number[];
}

// 3D FIFA PROFILE CARD COMPONENT WITH DYNAMIC TILT MOUSE LISTENER
function FifaCard3D({ name, avatar, score, level, subject, difficulty }: {
  name: string;
  avatar: string;
  score: number;
  level: number;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard"
}) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Smooth responsive degree tilt calculations
    const rotateY = ((x - centerX) / centerX) * 15;
    const rotateX = -((y - centerY) / centerY) * 15;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  // Select 3D picture
  let characterImg = boyGamingPic;
  if (avatar === "girl") characterImg = girlGamingPic;
  if (avatar === "topper") characterImg = proTopperPic;

  // Custom gamer title and rank decorations
  let rankTitle = "Constitutional Scout";
  let badgeColor = "from-slate-600 to-slate-400";
  let bgGradient = "from-slate-950 via-[#131b2d] to-slate-950 border-slate-800";
  
  if (score === 100) {
    rankTitle = "🏆 GRANDMASTER OVERLORD";
    badgeColor = "from-amber-400 via-yellow-500 to-amber-600 animate-pulse";
    bgGradient = "from-[#221a00] via-[#4a3a02] to-[#221a00] border-yellow-500/80 shadow-[0_0_25px_rgba(234,179,8,0.2)]";
  } else if (score >= 80) {
    rankTitle = "⭐ CYBERNETIC ELITE";
    badgeColor = "from-[#a855f7] to-[#6366f1]";
    bgGradient = "from-[#11051c] via-[#241344] to-[#11051c] border-purple-500/80 shadow-[0_0_20px_rgba(168,85,247,0.15)]";
  } else if (score >= 50) {
    rankTitle = "⚔️ STUDY PALADIN";
    badgeColor = "from-teal-400 to-emerald-600";
    bgGradient = "from-[#01141a] via-[#052c3c] to-[#01141a] border-teal-500/50";
  } else {
    rankTitle = "🛡️ SYLLABUS RECRUIT";
    badgeColor = "from-gray-500 to-slate-700";
    bgGradient = "from-[#080b11] via-[#101726] to-[#080b11] border-slate-700/60";
  }

  // Numerical parameters resembling FIFA attributes
  const speedStat = Math.min(99, Math.max(45, 98 - Math.round(score * 0.1)));
  const focusStat = score >= 90 ? 98 : score >= 75 ? 88 : 72;
  const gritStat = difficulty === "Hard" ? 99 : difficulty === "Medium" ? 85 : 70;
  const intelStat = Math.min(99, 45 + score);

  return (
    <div 
      className="perspective-1000 w-full max-w-sm mx-auto flex justify-center py-4"
      style={{ perspective: "1000px" }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className={`relative w-72 h-[420px] rounded-[32px] overflow-hidden border-2 cursor-pointer transition-all duration-300 shadow-2xl ${bgGradient} flex flex-col`}
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${isHovered ? 1.04 : 1})`,
          transition: isHovered ? "transform 0.05s ease-out, box-shadow 0.3s" : "transform 0.4s ease-out, box-shadow 0.3s",
        }}
      >
        {/* Holographic light angle overlay */}
        {isHovered && (
          <div 
            className="absolute inset-0 pointer-events-none z-30 opacity-40 mix-blend-color-dodge transition-all"
            style={{
              background: `radial-gradient(circle at ${rotate.y * 10 + 50}% ${-rotate.x * 10 + 50}%, rgba(255, 255, 255, 0.5) 0%, rgba(120, 119, 198, 0.2) 60%, transparent 100%)`
            }}
          />
        )}

        {/* Shimmer line inside */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />

        {/* FIFA attributes Header block */}
        <div className="p-5 flex justify-between items-start z-10">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-black tracking-tighter text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-mono">
              {score}
            </span>
            <span className="text-[9px] font-mono tracking-widest text-indigo-400 font-extrabold uppercase drop-shadow">
              OVR
            </span>
          </div>

          <div className="px-2.5 py-1 rounded-full bg-black/50 border border-white/10 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-[9px] font-mono text-white font-extrabold">LVL {level}</span>
          </div>
        </div>

        {/* FIFA 3D character layout container */}
        <div className="relative flex-1 flex flex-col items-center justify-center -mt-6">
          <div className="relative w-44 h-44 rounded-full border-4 border-white/10 overflow-hidden shadow-2xl bg-black/40 flex items-center justify-center">
            <img
              src={characterImg}
              alt="Gamer character in 3D"
              className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-300 hover:scale-110"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Dynamic Badge design plate with glow backdrop */}
          <div className={`mt-4 px-3.5 py-1 rounded-full bg-gradient-to-r ${badgeColor} text-[9px] text-white font-black tracking-widest font-mono uppercase shadow-lg border border-white/25 z-10`}>
            {rankTitle}
          </div>
        </div>

        {/* STATS DECORATOR PANEL (FIFA STYLE) */}
        <div className="bg-black/50 border-t border-white/10 p-4 z-10 font-mono text-center">
          <h5 className="text-sm font-black text-white tracking-tight truncate px-2 font-sans">
            {name}
          </h5>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-mono truncate px-2">
            {subject}
          </span>

          <div className="grid grid-cols-4 gap-1 text-center border-t border-white/15 pt-3 mt-2 select-none">
            <div className="flex flex-col border-r border-white/10">
              <span className="text-white font-extrabold text-[12px]">{score}%</span>
              <span className="text-[8px] text-slate-500 font-extrabold uppercase">ACC</span>
            </div>
            <div className="flex flex-col border-r border-white/10">
              <span className="text-white font-extrabold text-[12px]">{speedStat}</span>
              <span className="text-[8px] text-slate-500 font-extrabold uppercase">SPD</span>
            </div>
            <div className="flex flex-col border-r border-white/10">
              <span className="text-white font-extrabold text-[12px]">{focusStat}</span>
              <span className="text-[8px] text-slate-500 font-extrabold uppercase">FOC</span>
            </div>
            <div className="flex flex-col">
              <span className="text-teal-400 font-extrabold text-[12px]">{intelStat}</span>
              <span className="text-[8px] text-slate-500 font-extrabold uppercase">INT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // CONFIG & THEME STATES
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [userName, setUserName] = useState<string>("");
  const [userAvatar, setUserAvatar] = useState<string>("boy");
  const [userId, setUserId] = useState<string>("");

  // Temporary inputs in session login view
  const [tempName, setTempName] = useState("");
  const [tempAvatar, setTempAvatar] = useState("boy");

  // PERSISTENCE BACKED BY FIRESTORE
  const [userXP, setUserXP] = useState<number>(150);
  const [streakDays, setStreakDays] = useState<number>(1);

  // Background quiz processing jobs states
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [jobProgress, setJobProgress] = useState<{ totalFound?: number; relevantCount?: number } | null>(null);
  const [jobError, setJobError] = useState<string | null>(null);

  // UI STATE ROUTER: "home", "quiz", "results", "history", "admin", "subject"
  const [currentScreen, setCurrentScreen] = useState<"home" | "quiz" | "results" | "history" | "admin" | "subject">("home");
  const [selectedSubjectView, setSelectedSubjectView] = useState<any>(null);

  // SECURE AUTH GUEST AND LOGOUT HELPER WITH LOCAL PROFILE STORAGE
  const handleGuestLogin = async (enteredName: string, selectedAvatar: string) => {
    const final = enteredName.trim();
    if (!final) return;

    const guestUid = `guest_local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const userData = {
      userId: guestUid,
      name: final,
      avatar: selectedAvatar,
      xp: 150,
      streak: 1,
      createdAt: new Date().toISOString()
    };

    setUserId(guestUid);
    setUserName(final);
    setUserAvatar(selectedAvatar);
    setUserXP(150);
    setStreakDays(1);

    localStorage.setItem("quizgenius_user", JSON.stringify(userData));
  };

  const handleSignOut = async () => {
    try {
      setUserId("");
      setUserName("");
      setUserAvatar("boy");
      setUserXP(150);
      setStreakDays(1);
      localStorage.removeItem("quizgenius_user");
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  // SECTOR SEARCH, TOPICS, AND AI ENGINE STATE
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSteps, setGenerationSteps] = useState<string[]>([]);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);

  // DATABASE REAL-TIME METRICS CACHED LOCALLY
  const [dbStats, setDbStats] = useState<{
    totalQuestions: number;
    difficultyBreakdown: { Easy: number; Medium: number; Hard: number };
    subjectBreakdown: Record<string, number>;
  }>({
    totalQuestions: 0,
    difficultyBreakdown: { Easy: 0, Medium: 0, Hard: 0 },
    subjectBreakdown: {},
  });

  // HISTORICAL ATTEMPT LOGS FETCHED FROM SERVER
  const [attemptsList, setAttemptsList] = useState<AttemptedRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // DYNAMIC PUBLIC EXAMS STORAGE
  const [publicSubjects, setPublicSubjects] = useState<any[]>([]);
  const [publicQuizzes, setPublicQuizzes] = useState<any[]>([]);

  const enrichedSubjects = useMemo(() => {
    return publicSubjects.map(sub => {
      const lowercaseName = sub.name.toLowerCase();
      let desc = "";
      let emoji = "📂";
      let alias = sub.name;

      if (sub.id === "sub-upsc" || lowercaseName.includes("upsc")) {
        desc = "Indian Constitution, Drafting Committee, Fundamental Rights & Judiciaries";
        emoji = "🏛️";
        alias = "UPSC Indian Constitution & Polity";
      } else if (sub.id === "sub-ssc-cgl" || lowercaseName.includes("ssc cgl")) {
        desc = "Algebra, Trigonometry, Data Interpretation, Logical deduction & Series";
        emoji = "📊";
        alias = "SSC CGL Quantitative Aptitude & Reasoning";
      } else if (sub.id === "sub-rrb-ntpc" || lowercaseName.includes("rrb ntpc")) {
        desc = "General Physics, Chemistry, Biology, Indian Railways history & static GK";
        emoji = "🚂";
        alias = "RRB NTPC General Science & Awareness";
      } else if (sub.id === "sub-state-pcs" || lowercaseName.includes("state pcs")) {
        desc = "Freedom struggle, state-specific arts, climate zones & river basins";
        emoji = "🗺️";
        alias = "State PCS Indian History & Geography";
      } else if (sub.id === "sub-banking" || lowercaseName.includes("banking")) {
        desc = "Monetary policies, banking terms, current social issues & economics";
        emoji = "🏦";
        alias = "Banking Exams General & Financial Awareness";
      } else if (sub.id === "sub-nda-cds" || lowercaseName.includes("nda") || lowercaseName.includes("cds")) {
        desc = "Sentence reconstruction, vocabulary, physics, current world events";
        emoji = "⚔️";
        alias = "NDA CDS General Ability & English Grammar";
      } else if (sub.id === "sub-ugc-net" || lowercaseName.includes("ugc net")) {
        desc = "Teaching methodologies, communication, logical reasoning & computer basics";
        emoji = "🎓";
        alias = "UGC NET Teaching & Research Aptitude";
      } else if (sub.id === "sub-ctet" || lowercaseName.includes("ctet")) {
        desc = "Inclusive education, learning theories, child psychology & NCERT syllabus";
        emoji = "🏫";
        alias = "CTET Child Development & Pedagogy";
      } else if (sub.id === "sub-lic-aao" || lowercaseName.includes("lic aao")) {
        desc = "History of insurance, financial regulators, premium calculations & risk";
        emoji = "🛡️";
        alias = "LIC AAO Insurance & Financial Market";
      } else if (sub.id === "sub-police-si" || lowercaseName.includes("police")) {
        desc = "Criminal procedure code basics, local laws, police acts & state history";
        emoji = "🚔";
        alias = "State Police Law, Order & Local GK";
      } else if (sub.id === "sub-capf" || lowercaseName.includes("capf")) {
        desc = "Security forces, cyber security, environmental hazards & drafting skills";
        emoji = "🎖️";
        alias = "UPSC CAPF Forces";
      } else if (sub.id === "sub-rbi-grade-b" || lowercaseName.includes("rbi")) {
        desc = "Inflation, sustainable growth, balance of payments & Indian banking";
        emoji = "📈";
        alias = "RBI Grade B Economic & Social Issues";
      } else if (sub.id === "sub-ib-acio" || lowercaseName.includes("ib acio")) {
        desc = "Anomalies, critical reasoning, coding-decoding, current intelligence reviews";
        emoji = "🕵️";
        alias = "IB ACIO General Intelligence & Analytics";
      } else if (sub.id === "sub-sebi-grade-a" || lowercaseName.includes("sebi")) {
        desc = "Corporate governance, companies act, financial ratios & portfolio risk";
        emoji = "💵";
        alias = "SEBI Grade A Securities Market & Finance";
      } else if (sub.id === "sub-epfo" || lowercaseName.includes("epfo")) {
        desc = "Industrial disputes, trade unions, social security schemes in India";
        emoji = "💼";
        alias = "EPFO Enforcement";
      } else if (sub.id === "sub-ifs" || lowercaseName.includes("forest service") || lowercaseName.includes("ifs")) {
        desc = "Silviculture, environmental impact assessments, biosphere reserves";
        emoji = "🌳";
        alias = "UPSC Forest Service Ecology & Biodiversity";
      } else if (sub.id === "sub-jee" || lowercaseName.includes("jee")) {
        desc = "Joint Entrance Examination - Physics, Chemistry, and Mathematics topics";
        emoji = "💻";
        alias = "JEE Physics Chemistry Mathematics";
      } else if (sub.id === "sub-neet" || lowercaseName.includes("neet")) {
        desc = "National Eligibility cum Entrance Test - Biology, Physics, and Chemistry prep";
        emoji = "🩺";
        alias = "NEET Biology Physics Chemistry";
      } else if (sub.id === "sub-gk" || lowercaseName.includes("general knowledge") || lowercaseName.includes("gk")) {
        desc = "General Knowledge, Indian and World History, Geography, and Science";
        emoji = "🌍";
        alias = "General Knowledge & Static GK";
      } else if (sub.id === "sub-current-affairs" || lowercaseName.includes("current affairs")) {
        desc = "Latest news, awards, sports, summits, appointments, and national events";
        emoji = "📅";
        alias = "Current Affairs Daily Prep";
      } else {
        desc = `Practice tests and exam prep curriculum for ${sub.name}`;
        emoji = "📝";
        alias = sub.name;
      }

      const quizzesCount = publicQuizzes.filter(q => q.subjectId === sub.id && q.published).length;

      return {
        id: sub.id,
        name: sub.name,
        category: sub.category,
        desc: desc,
        icon: emoji,
        alias: alias,
        count: quizzesCount
      };
    });
  }, [publicSubjects, publicQuizzes]);

  const fetchPublicSubjectsAndQuizzes = async () => {
    try {
      const subRes = await fetch("/api/admin/subjects");
      const quizRes = await fetch("/api/admin/quizzes");
      if (subRes.ok) {
        const data = await subRes.json();
        setPublicSubjects(data.subjects || []);
      }
      if (quizRes.ok) {
        const data = await quizRes.json();
        setPublicQuizzes(data.quizzes || []);
      }
    } catch (e) {
      console.warn("Error fetching public subjects & quizzes:", e);
    }
  };

  // SHOW MORE SUBJECTS STATE
  const [showAllSubjects, setShowAllSubjects] = useState(false);

  // ACTIVE DYNAMIC EXAM ASSESSMENT STATE
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]); // User's choices indices
  const [questionAnswersVerified, setQuestionAnswersVerified] = useState<boolean[]>([]); // Whether each choice has been checked
  const [answeredCount, setAnsweredCount] = useState(0);

  // QUICK CONFIGURATION DISPATCH modal STATE
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [quizDifficulty, setQuizDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [quizCount, setQuizCount] = useState<number>(5);
  const [timerEnabled, setTimerEnabled] = useState(true);

  // REAL SECONDS RUNNING CORES
  const [secondsRemaining, setSecondsRemaining] = useState(150);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // OUTLINE SUGGESTED AUTOMATED EXAMS REFERENCES (Government Exam Focus)
  const featuredSubjects = [
    { name: "UPSC IAS Civils", alias: "UPSC Indian Constitution & Polity", desc: "Indian Constitution, Drafting Committee, Fundamental Rights & Judiciaries", count: 120, icon: "🏛️" },
    { name: "SSC CGL Exam", alias: "SSC CGL Quantitative Aptitude & Reasoning", desc: "Algebra, Trigonometry, Data Interpretation, Logical deduction & Series", count: 145, icon: "📊" },
    { name: "RRB NTPC", alias: "RRB NTPC General Science & Awareness", desc: "General Physics, Chemistry, Biology, Indian Railways history & static GK", count: 110, icon: "🚂" },
    { name: "State PCS Exam", alias: "State PCS Indian History & Geography", desc: "Freedom struggle, state-specific arts, climate zones & river basins", count: 95, icon: "🗺️" },
    { name: "Banking PO Exams", alias: "Banking Exams General & Financial Awareness", desc: "Monetary policies, banking terms, current social issues & economics", count: 130, icon: "🏦" },
    
    // Additional government exam prep subjects
    { name: "NDA & CDS Exams", alias: "NDA CDS General Ability & English Grammar", desc: "Sentence reconstruction, vocabulary, physics, current world events", count: 85, icon: "⚔️" },
    { name: "UGC NET Paper 1", alias: "UGC NET Teaching & Research Aptitude", desc: "Teaching methodologies, communication, logical reasoning & computer basics", count: 105, icon: "🎓" },
    { name: "CTET Pedagogy", alias: "CTET Child Development & Pedagogy", desc: "Inclusive education, learning theories, child psychology & NCERT syllabus", count: 90, icon: "🏫" },
    { name: "LIC AAO Exam", alias: "LIC AAO Insurance & Financial Market", desc: "History of insurance, financial regulators, premium calculations & risk", count: 75, icon: "🛡️" },
    { name: "State Police SI", alias: "State Police Law, Order & Local GK", desc: "Criminal procedure code basics, local laws, police acts & state history", count: 115, icon: "🚔" },
    { name: "UPSC CAPF Forces", alias: "UPSC CAPF Internal Security & Essay", desc: "Security forces, cyber security, environmental hazards & drafting skills", count: 80, icon: "🎖️" },
    { name: "RBI Grade B Officer", alias: "RBI Grade B Economic & Social Issues", desc: "Inflation, sustainable growth, balance of payments & Indian banking", count: 95, icon: "📈" },
    { name: "IB ACIO Intelligence", alias: "IB ACIO General Intelligence & Analytics", desc: "Anomalies, critical reasoning, coding-decoding, current intelligence reviews", count: 100, icon: "🕵️" },
    { name: "SEBI Grade A", alias: "SEBI Grade A Securities Market & Finance", desc: "Corporate governance, companies act, financial ratios & portfolio risk", count: 85, icon: "💵" },
    { name: "EPFO Enforcement", alias: "EPFO Labour Laws & Social Security", desc: "Industrial disputes, trade unions, social security schemes in India", count: 110, icon: "💼" },
    { name: "Indian Forest Service", alias: "UPSC Forest Service Ecology & Biodiversity", desc: "Silviculture, environmental impact assessments, biosphere reserves", count: 90, icon: "🌳" }
  ];

  const typicalSearches = [
    "UPSC Constitutional Drafting Committee & Amendments",
    "SSC CGL Geometry & Mensuration",
    "Rajasthan Folk Dances & Culture SI",
    "Banking General Awareness Monetary Policy",
    "Indian National Movement & Freedom Fighters"
  ];

  // RETRO SOUND WAVE GENERATOR (Native client AudioContext API)
  const triggerRetroNoise = (isCorrect: boolean) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (isCorrect) {
        // High, pleasant chime
        osc.type = "sine";
        osc.frequency.setValueAtTime(512, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1024, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else {
        // Low, unexpected buzzing crash
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(130, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(65, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      }
    } catch (e) {
      console.warn("Audio Context blocked by browser user gesture policies.", e);
    }
  };

  // LOAD GENERAL STATISTICS FOR DATABASE CATALOGS
  const fetchDatabaseStatistics = async () => {
    try {
      const response = await fetch("/api/db-stats");
      if (response.ok) {
        const data = await response.json();
        setDbStats(data);
      }
    } catch (e) {
      console.warn("Err loading DB statistics:", e);
    }
  };

  // LOAD USER ATTEMPT HISTORY TIMELINE
  const fetchUserHistoricalLogs = async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch(`/api/history?userId=${encodeURIComponent(userId)}`);
      if (response.ok) {
        const data = await response.json();
        setAttemptsList(data.attempts || []);
      }
    } catch (e) {
      console.warn("Err fetching user attempt logs:", e);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Load local user profile from localStorage
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("quizgenius_user");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setUserId(data.userId || "");
        setUserName(data.name || "");
        setUserAvatar(data.avatar || "boy");
        setUserXP(data.xp !== undefined ? data.xp : 150);
        setStreakDays(data.streak !== undefined ? data.streak : 1);
      } catch (err) {
        console.error("Local user profile parse error:", err);
      }
    }
    setAuthLoading(false);
  }, []);

  // Poll for background extraction job status
  useEffect(() => {
    if (!activeJobId) return;

    let intervalId: any;
    const checkJobStatus = async () => {
      try {
        const res = await fetch(`/api/admin/jobs/${activeJobId}`);
        if (!res.ok) throw new Error("Failed checking background processing job status");
        const data = await res.json();
        
        setJobStatus(data.status);
        if (data.status === "completed") {
          setActiveJobId(null);
          setJobStatus(null);
          setParsedQuizPreview({
            detectedSubject: data.detectedSubject || "General Prep",
            detectedDifficulty: data.detectedDifficulty || "Medium",
            totalFound: data.totalQuestions,
            relevantCount: data.savedQuestions,
            questions: data.questions || []
          });
          setUploadQuizName(`${data.detectedSubject || "General Prep"} MCQ Practice Test`);
          setUploadDifficulty("Medium");
          setIsParsingFile(false);
        } else if (data.status === "failed") {
          setActiveJobId(null);
          setJobStatus(null);
          setJobError(data.errorMessage || "Extraction job failed.");
          setIsParsingFile(false);
        } else {
          setJobProgress({
            totalFound: data.totalQuestions,
            relevantCount: data.savedQuestions
          });
        }
      } catch (err: any) {
        console.error("Error checking job status:", err);
        setActiveJobId(null);
        setJobStatus(null);
        setJobError(err.message || "Connection to job engine lost.");
        setIsParsingFile(false);
      }
    };

    intervalId = setInterval(checkJobStatus, 2000);
    checkJobStatus();

    return () => clearInterval(intervalId);
  }, [activeJobId]);

  // AUTO TRIGGER ON MOUNT
  useEffect(() => {
    if (userId) {
      fetchDatabaseStatistics();
      fetchUserHistoricalLogs();
      fetchPublicSubjectsAndQuizzes();
    }
  }, [userId]);

  // COMPLETE KEYWORD AUTOCOMPLETE SUGGESTIONS IN SEARCH PANEL
  const searchSuggestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    
    // Auto outline based on user input
    const matched = featuredSubjects
      .map((fs) => fs.alias)
      .filter((alias) => alias.toLowerCase().includes(query));

    // Also offer custom prefixes
    const custom = [
      `${searchQuery} Exam Patterns Pack`,
      `Advanced ${searchQuery} Conceptual Test`,
      `Previous Year ${searchQuery} MCQs`
    ];

    return Array.from(new Set([...matched, ...custom])).slice(0, 4);
  }, [searchQuery]);

  // INTELLIGENT QUIZ GENERATION TIMING WRAPPER
  const generateQuizAssessment = async (topicTitle: string) => {
    setIsGenerating(true);
    setApiError(null);
    setIsConfigModalOpen(false);

    // Setup animated step transitions inside the strictly required <= 5 second interval
    const steps = [
      "Securing target query: Analyzing conceptual keywords & syllabus requirements...",
      "Connecting to Gemini 3.5-flash: Initializing LLM pipeline...",
      "Search Grounding live: Crawling official previous year exam patterns & books...",
      "Deduplicating pool: Cross-checking questions previously attempted by " + userId + "...",
      "Formulating questions: Balancing high-yield templates & unexpected conceptual exceptions...",
      "Cataloguing database: Saving generated questions into persistent shared library pool!"
    ];
    setGenerationSteps(steps);
    setActiveStepIdx(0);

    const stepInterval = setInterval(() => {
      setActiveStepIdx((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 700);

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topicTitle,
          difficulty: quizDifficulty,
          count: quizCount,
          userId: userId,
        }),
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        throw new Error(`Endpoint returned failed HTTP status: ${response.status}`);
      }

      const rawQuiz: Quiz = await response.json();
      
      if (!rawQuiz.questions || rawQuiz.questions.length === 0) {
        throw new Error("Quiz returned an empty questions catalog. Retrying fallback.");
      }

      // Finish step animations perfectly before screen switch
      setActiveStepIdx(steps.length - 1);
      setTimeout(() => {
        setActiveQuiz(rawQuiz);
        setCurrentQuestionIndex(0);
        setSelectedAnswers(new Array(rawQuiz.questions.length).fill(-1));
        setQuestionAnswersVerified(new Array(rawQuiz.questions.length).fill(false));
        setAnsweredCount(0);
        setSecondsRemaining(rawQuiz.questions.length * 40); // Generous time allocated
        setTotalTimeSpent(0);
        setCurrentScreen("quiz");
        setIsGenerating(false);

        if (timerEnabled) {
          launchCountdownTimer();
        }
      }, 300);

      // Refresh stats automatically
      fetchDatabaseStatistics();

    } catch (error: any) {
      clearInterval(stepInterval);
      console.error("Failed executing AI API pipeline, launching direct database offline recovery loader.", error);
      setApiError("High latency detected. Initiated intelligent local database fallback pool for: " + topicTitle);
      
      // Assemble quick reliable pool if API offline
      setTimeout(() => {
        const recoveryQuiz: Quiz = {
          title: `${topicTitle} Resilient Foundation Mock`,
          subject: "Dynamic Assessment Lab",
          questions: [
            {
              id: "fallback-rec-0",
              subject: "Database Recovery Module",
              topic: topicTitle,
              question: "Which approach ensures an educational quiz avoids duplicate questions for a candidate in high-stress attempts?",
              options: [
                "Deleting the entire server's storage cookies daily",
                "Maintaining an indexed question registry linked against candidate's historical ID attempts",
                "Instructing candidate to write questions manually",
                "Resetting the browser display viewport zoom parameters"
              ],
              correctOptionIndex: 1,
              explanation: "Logging and filtering previously committed indices dynamically prevents repetitive academic question fatigue.\n\nप्रवेश और पूर्व में हल किए गए प्रश्नों के सूचकांक को गतिशील रूप से छानना पुनरावृत्ति थकान को रोकता है।",
              difficulty: quizDifficulty,
              importance: "conceptual",
              createdAt: new Date().toISOString()
            },
            {
              id: "fallback-rec-1",
              subject: "Database Recovery Module",
              topic: topicTitle,
              question: "What primary benefit does combining Gemini models with search engines (Google Search Grounding) introduce?",
              options: [
                "It reduces server port speed constraints",
                "It pulls factual, up-to-date real exam patterns, textbooks, and syllabus PYQs",
                "It restricts candidate input text sizes",
                "It disables background visual layout assets"
              ],
              correctOptionIndex: 1,
              explanation: "Live search grounding enables AI models to fetch correct, real-time factual patterns in lieu of static obsolete information.\n\nलाइव सर्च ग्राउंडिंग एआई मॉडल को स्थिर पुरानी जानकारी के बजाय सही, वास्तविक समय के तथ्यात्मक पैटर्न प्राप्त करने में सक्षम बनाता है।",
              difficulty: quizDifficulty,
              importance: "high",
              createdAt: new Date().toISOString()
            },
            {
              id: "fallback-rec-2",
              subject: "Database Recovery Module",
              topic: topicTitle,
              question: "How should a professional full-stack platform handle sudden third-party network outages?",
              options: [
                "Shutting down the server instance instantly",
                "Deploying modular offline caching systems and robust local database recovery fallbacks",
                "Flickering the browser display window repeatedly",
                "Re-routing requests to public unencrypted APIs"
              ],
              correctOptionIndex: 1,
              explanation: "Fallback caches and structured database recovery guarantees high availability and continued operation during network errors.\n\nफ़ॉलबैक कैश और संरचित डेटाबेस रिकवरी नेटवर्क त्रुटियों के दौरान उच्च उपलब्धता और निरंतर संचालन की गारंटी देते हैं।",
              difficulty: quizDifficulty,
              importance: "unexpected",
              createdAt: new Date().toISOString()
            }
          ]
        };
        setActiveQuiz(recoveryQuiz);
        setCurrentQuestionIndex(0);
        setSelectedAnswers(new Array(recoveryQuiz.questions.length).fill(-1));
        setQuestionAnswersVerified(new Array(recoveryQuiz.questions.length).fill(false));
        setAnsweredCount(0);
        setSecondsRemaining(120);
        setTotalTimeSpent(0);
        setCurrentScreen("quiz");
        setIsGenerating(false);
        setApiError(null);
      }, 1200);
    }
  };

  const handleStartCuratedQuiz = (quiz: any) => {
    // Shuffle options of questions to increase randomness and ensure option variety
    const shuffledQuestions = (quiz.questions || []).map((q: any) => {
      if (!q.options || q.options.length === 0) return q;
      const originalCorrectOptionText = q.options[q.correctOptionIndex];
      const shuffledOptions = [...q.options];
      for (let i = shuffledOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = shuffledOptions[i];
        shuffledOptions[i] = shuffledOptions[j];
        shuffledOptions[j] = temp;
      }
      const newIndex = shuffledOptions.indexOf(originalCorrectOptionText);
      return {
        ...q,
        options: shuffledOptions,
        correctOptionIndex: newIndex !== -1 ? newIndex : q.correctOptionIndex
      };
    });

    setActiveQuiz({
      id: quiz.id,
      topic: quiz.name,
      difficulty: quiz.difficulty,
      questions: shuffledQuestions
    });
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(quiz.questions.length).fill(-1));
    setQuestionAnswersVerified(new Array(quiz.questions.length).fill(false));
    setAnsweredCount(0);
    setSecondsRemaining(quiz.questions.length * 40);
    setTotalTimeSpent(0);
    setCurrentScreen("quiz");
    if (timerEnabled) {
      launchCountdownTimer();
    }
  };

  const launchCountdownTimer = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current!);
          // Trigger immediate evaluation upon countdown exhaustion
          handleSubmitQuizForReview();
          return 0;
        }
        return prev - 1;
      });
      setTotalTimeSpent((prev) => prev + 1);
    }, 1000);
  };

  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // CHOICE MANIPULATION & AUTO TRIGGER FLOW
  const selectOptionIndex = (optIdx: number) => {
    const isChecked = questionAnswersVerified[currentQuestionIndex];
    if (isChecked) return; // Block changes after assertion

    // Clear any active scheduled advance timer
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }

    const copied = [...selectedAnswers];
    copied[currentQuestionIndex] = optIdx;
    setSelectedAnswers(copied);

    // Immediately verify answer to remove unnecessary clicks
    const verified = [...questionAnswersVerified];
    verified[currentQuestionIndex] = true;
    setQuestionAnswersVerified(verified);
    setAnsweredCount((prev) => prev + 1);

    const correctIdx = activeQuiz!.questions[currentQuestionIndex].correctOptionIndex;
    const isCorrect = optIdx === correctIdx;
    triggerRetroNoise(isCorrect);

    // If correct, auto advance to next question after 1.5 seconds
    if (isCorrect) {
      if (currentQuestionIndex < activeQuiz!.questions.length - 1) {
        autoAdvanceTimeoutRef.current = setTimeout(() => {
          nextQuestion();
        }, 1500);
      }
    }
  };

  // CHECK ANSWER (Keep as empty or fallback helper, but logic is handled immediately on click)
  const checkOptionAssertion = () => {
    // No operation needed as verify is now instant and automatic on click
  };

  // JUMP NAVIGATION
  const nextQuestion = () => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    if (currentQuestionIndex < activeQuiz!.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // COMPLETE ATTEMPT AND COMMIT RECORDS
  const handleSubmitQuizForReview = async () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (!activeQuiz || !activeQuiz.questions) return;

    let correctCount = 0;
    const answeredIds: string[] = [];
    const chosenOptions: number[] = [];

    activeQuiz.questions.forEach((q, idx) => {
      const selected = selectedAnswers[idx];
      answeredIds.push(q.id || `fallback-${idx}`);
      chosenOptions.push(selected);
      if (selected === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const calculatedAccuracy = Math.round((correctCount / activeQuiz.questions.length) * 100);

    // Dynamic XP Reward Schema: 10XP per correct answer, 40XP difficulty multiplier bonus, 50XP flawless bonus
    const difficultyMultiplier = quizDifficulty === "Hard" ? 3 : quizDifficulty === "Medium" ? 2 : 1;
    const totalEarnedXP = (correctCount * 12) * difficultyMultiplier + (calculatedAccuracy === 100 ? 55 : 0);
    
    // Accumulate levels
    const updatedXP = userXP + totalEarnedXP;
    const updatedStreak = streakDays + 1;
    setUserXP(updatedXP);
    setStreakDays(updatedStreak);

    // Save user stats in local storage
    const storedUser = localStorage.getItem("quizgenius_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        parsed.xp = updatedXP;
        parsed.streak = updatedStreak;
        localStorage.setItem("quizgenius_user", JSON.stringify(parsed));
      } catch (err) {
        console.error("Failed saving updated stats locally:", err);
      }
    }

    // Save Attempt to back-end PostgreSQL or JSON database
    try {
      await fetch("/api/save-attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          topic: activeQuiz.title || activeQuiz.topic || "Unknown Quiz",
          subject: activeQuiz.subject,
          difficulty: quizDifficulty,
          score: correctCount,
          totalQuestions: activeQuiz.questions.length,
          accuracy: calculatedAccuracy,
          timeSpent: totalTimeSpent,
          questions: answeredIds,
          answers: chosenOptions,
        }),
      });
    } catch (e) {
      console.warn("Failed syncing attempt results with back-end database", e);
    }

    // Transit screen layout
    setCurrentScreen("results");
    fetchUserHistoricalLogs();
    fetchDatabaseStatistics();
  };

  // ADMIN OPERATIONS CORE
  const [adminSearchTerm, setAdminSearchTerm] = useState("");
  const [adminDifficultyFilter, setAdminDifficultyFilter] = useState("All");
  const [questionsPool, setQuestionsPool] = useState<DbQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // --- COMPLETE ADMIN PORTAL STATES ---
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem("admin_logged") === "true";
  });
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoginError, setAdminLoginError] = useState("");

  const [adminStats, setAdminStats] = useState({
    totalSubjects: 0,
    totalQuizzes: 0,
    totalQuestions: 0,
    recentUploads: [] as any[]
  });
  const [adminSubjects, setAdminSubjects] = useState<any[]>([]);
  const [adminQuizzes, setAdminQuizzes] = useState<any[]>([]);
  const [loadingAdminData, setLoadingAdminData] = useState(false);

  const [activeAdminTab, setActiveAdminTab] = useState<"dashboard" | "subjects" | "quizzes" | "upload">("dashboard");

  // Subject management state
  const [newSubjectName, setNewSubjectName] = useState("");
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [editingSubjectName, setEditingSubjectName] = useState("");

  // Quiz upload state
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [parsedQuizPreview, setParsedQuizPreview] = useState<{
    detectedSubject: string;
    detectedDifficulty: string;
    totalFound?: number;
    relevantCount?: number;
    questions: DbQuestion[];
  } | null>(null);
  const [uploadSubjectId, setUploadSubjectId] = useState("");
  const [uploadQuizName, setUploadQuizName] = useState("");
  const [uploadDifficulty, setUploadDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [subjectSearchQuery, setSubjectSearchQuery] = useState("");
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [previewLimit, setPreviewLimit] = useState(6);
  const [uploadMode, setUploadMode] = useState<"file" | "paste">("file");
  const [pastedContent, setPastedContent] = useState("");
  const [pasteFormat, setPasteFormat] = useState<"json" | "html" | "txt">("json");

  // Quiz editing states
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [editingQuizQuestions, setEditingQuizQuestions] = useState<DbQuestion[]>([]);

  // FETCH ADMIN DATA
  const fetchAdminAllData = async () => {
    setLoadingAdminData(true);
    try {
      const statsRes = await fetch("/api/admin/stats");
      const subsRes = await fetch("/api/admin/subjects");
      const quizzesRes = await fetch("/api/admin/quizzes");

      if (statsRes.ok) {
        const stats = await statsRes.json();
        setAdminStats(stats);
      }
      if (subsRes.ok) {
        const subs = await subsRes.json();
        const loadedSubs = subs.subjects || [];
        setAdminSubjects(loadedSubs);
        if (loadedSubs.length > 0 && !uploadSubjectId) {
          setUploadSubjectId(loadedSubs[0].id);
          setSubjectSearchQuery(loadedSubs[0].name);
        }
      }
      if (quizzesRes.ok) {
        const quizzes = await quizzesRes.json();
        setAdminQuizzes(quizzes.quizzes || []);
      }
      // Keep public user-facing views in perfect real-time sync with admin updates
      await fetchPublicSubjectsAndQuizzes();
    } catch (err) {
      console.error("Failed fetching admin data:", err);
    } finally {
      setLoadingAdminData(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });
      if (response.ok) {
        sessionStorage.setItem("admin_logged", "true");
        setIsAdminLoggedIn(true);
        setAdminEmail("");
        setAdminPassword("");
      } else {
        const errData = await response.json();
        setAdminLoginError(errData.error || "Authentication failed.");
      }
    } catch (err) {
      setAdminLoginError("Network connection failed.");
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem("admin_logged");
    setIsAdminLoggedIn(false);
  };

  // --- CRUD SUBJECT ACTIONS ---
  const [isAddingSubject, setIsAddingSubject] = useState(false);

  const handleCreateSubject = async () => {
    if (!newSubjectName.trim()) return;
    setIsAddingSubject(true);
    const targetName = newSubjectName.trim();
    try {
      const response = await fetch("/api/admin/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: targetName }),
      });
      if (response.ok) {
        setNewSubjectName("");
        await fetchAdminAllData();
        await fetchDatabaseStatistics();
        alert(`Subject "${targetName}" successfully added!`);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to add subject.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Failed to add subject.");
    } finally {
      setIsAddingSubject(false);
    }
  };

  const handleUpdateSubject = async () => {
    if (!editingSubjectId || !editingSubjectName.trim()) return;
    try {
      const response = await fetch(`/api/admin/subjects/${editingSubjectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingSubjectName.trim() }),
      });
      if (response.ok) {
        setEditingSubjectId(null);
        setEditingSubjectName("");
        await fetchAdminAllData();
        await fetchDatabaseStatistics();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this subject? All nested quizzes will be deleted permanently!")) return;
    try {
      const response = await fetch(`/api/admin/subjects/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        await fetchAdminAllData();
        await fetchDatabaseStatistics();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- CRUD QUIZ ACTIONS ---
  const handleToggleQuizPublish = async (quiz: any) => {
    try {
      const response = await fetch(`/api/admin/quizzes/${quiz.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !quiz.published }),
      });
      if (response.ok) {
        await fetchAdminAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      const response = await fetch(`/api/admin/quizzes/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        await fetchAdminAllData();
        await fetchDatabaseStatistics();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleParsePastedContent = async () => {
    if (!pastedContent.trim()) {
      setJobError("Please paste some content first");
      return;
    }
    setIsParsingFile(true);
    setPreviewLimit(6);
    setJobError(null);
    setJobStatus("starting");
    setJobProgress(null);

    const selectedSubObj = adminSubjects.find(s => s.id === uploadSubjectId);
    const selectedSubName = selectedSubObj ? selectedSubObj.name : "General Knowledge";
    const extension = pasteFormat; // "json", "html" or "txt"
    const fileName = `pasted_content.${extension}`;

    try {
      const res = await fetch("/api/admin/parse-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileContent: pastedContent,
          fileName: fileName,
          htmlContent: pastedContent,
          subjectName: selectedSubName
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.jobId) {
          setActiveJobId(data.jobId);
          setJobStatus(data.status || "processing");
        } else {
          setParsedQuizPreview(data);
          setUploadQuizName(`${selectedSubName} MCQ Practice Test`);
          setUploadDifficulty("Medium");
          setIsParsingFile(false);
        }
      } else {
        let errMsg = "Error initializing extraction job.";
        try {
          const errData = await res.json();
          if (errData && errData.error) {
            errMsg = errData.error;
          }
        } catch (_) {}
        setJobError(errMsg);
        setIsParsingFile(false);
      }
    } catch (err: any) {
      console.error(err);
      setJobError(err.message || "Failed to establish upload pipeline.");
      setIsParsingFile(false);
    }
  };

  const handleSaveUploadedQuiz = async () => {
    if (!parsedQuizPreview) return;
    const subId = uploadSubjectId || (adminSubjects.length > 0 ? adminSubjects[0].id : "");
    if (!subId) {
      alert("Please select or add a subject first before publishing a quiz!");
      return;
    }
    const name = uploadQuizName.trim() || `${parsedQuizPreview.detectedSubject || "Custom"} Quiz`;

    try {
      const response = await fetch("/api/admin/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: subId,
          name: name,
          difficulty: uploadDifficulty,
          published: true,
          questions: parsedQuizPreview.questions
        })
      });

      if (response.ok) {
        alert("Quiz published successfully!");
        setParsedQuizPreview(null);
        setUploadQuizName("");
        setActiveAdminTab("quizzes");
        await fetchAdminAllData();
        await fetchDatabaseStatistics();
      } else {
        alert("Failed to save quiz.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving quiz.");
    }
  };

  const handleSaveQuizQuestionEdits = async () => {
    if (!editingQuizId) return;
    try {
      const response = await fetch(`/api/admin/quizzes/${editingQuizId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions: editingQuizQuestions }),
      });
      if (response.ok) {
        alert("Quiz questions updated successfully!");
        setEditingQuizId(null);
        setEditingQuizQuestions([]);
        await fetchAdminAllData();
        await fetchDatabaseStatistics();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveQuizDuplicates = (quizId: string) => {
    const quiz = adminQuizzes.find(q => q.id === quizId);
    if (!quiz) return;
    
    // Deduplicate on question string comparison
    const seen = new Set<string>();
    const uniqueQuestions = quiz.questions.filter((q: any) => {
      const normalized = q.question.trim().toLowerCase();
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });

    if (uniqueQuestions.length === quiz.questions.length) {
      alert("No duplicate questions found inside this quiz.");
      return;
    }

    if (window.confirm(`Found ${quiz.questions.length - uniqueQuestions.length} duplicate questions. Remove them?`)) {
      fetch(`/api/admin/quizzes/${quizId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions: uniqueQuestions })
      }).then(res => {
        if (res.ok) {
          alert("Duplicates successfully pruned.");
          fetchAdminAllData();
          fetchDatabaseStatistics();
        }
      });
    }
  };

  // CLEAN CORES
  useEffect(() => {
    if (currentScreen === "admin") {
      if (isAdminLoggedIn) {
        fetchAdminAllData();
      }
    }
  }, [currentScreen, isAdminLoggedIn]);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 relative ${
        theme === "dark" ? "bg-[#0b0f19] text-[#e2e8f0]" : "bg-[#f1f5f9] text-[#1e293b]"
      }`}
    >
      {!userName ? (
        <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden bg-[#0a0d14] text-slate-200">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-sm p-8 rounded-[32px] border border-slate-800 bg-slate-900/65 backdrop-blur-md shadow-2xl text-center space-y-6 relative z-10"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="p-3.5 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight text-white bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent uppercase">
                  QuizGenius AI
                </h3>
                <p className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase">Competitive Assessment Entrance</p>
              </div>
            </div>

            <div className="border-t border-slate-800/85 pt-5 space-y-4">
              <div className="text-left space-y-2">
                <label className="block text-[11px] font-mono font-extrabold uppercase tracking-widest text-slate-400">
                  ⚡ Hero Student Name:
                </label>
                <input
                  type="text"
                  placeholder="Enter dynamic candidate name..."
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl outline-none text-white text-sm placeholder-gray-650 transition-colors font-semibold"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && tempName.trim()) {
                      handleGuestLogin(tempName, tempAvatar);
                    }
                  }}
                />
              </div>

              <div className="text-left space-y-2">
                <label className="block text-[11px] font-mono font-extrabold uppercase tracking-widest text-slate-400">
                  ⚔️ Select 3D Profile Avatar:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "boy", label: "Gamer Boy", img: boyGamingPic },
                    { id: "girl", label: "Gamer Girl", img: girlGamingPic },
                    { id: "topper", label: "Pro Scholar", img: proTopperPic }
                  ].map((av) => (
                    <button
                      type="button"
                      key={av.id}
                      onClick={() => setTempAvatar(av.id)}
                      className={`p-2 py-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center gap-2 ${
                        tempAvatar === av.id
                          ? "bg-indigo-950/45 border-indigo-500 text-white shadow ring-1 ring-indigo-500"
                          : "bg-slate-950/40 border-slate-850 text-slate-450 text-slate-450 hover:border-slate-700"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 shadow-inner">
                        <img src={av.img} alt={av.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <span className="text-[10px] font-bold font-mono text-center leading-none">{av.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                handleGuestLogin(tempName, tempAvatar);
              }}
              disabled={!tempName.trim()}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-550 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-600/20 active:scale-98 transition-all cursor-pointer"
            >
              Sign Assessor Pact & Login
            </button>
          </motion.div>
        </div>
      ) : (
        <>
          {/* PROFESSIONAL CHROME NAVIGATION BAR */}
          <header
            className={`sticky top-0 z-40 border-b px-6 py-4 flex flex-wrap items-center justify-between transition-colors duration-300 ${
              theme === "dark"
                ? "bg-[#0f172a]/95 border-slate-800 text-white"
                : "bg-white/95 border-slate-200 text-slate-900 shadow-sm"
            }`}
          >
        <div className="flex items-center gap-3">
          <div
            onClick={() => setCurrentScreen("home")}
            className="p-2.5 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-xl flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform"
          >
            <Brain className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">
                QuizGenius AI
              </h1>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/20">
                PRO ACTIVE
              </span>
            </div>
            <p className="text-[11px] opacity-75">Grounded Web Research & Persistent Assessment Engine</p>
          </div>
        </div>

        {/* INTERACTION CORNER */}
        <div className="flex items-center gap-3 mt-3 sm:mt-0 flex-wrap">
          {/* PROFILE CARD */}
          <div
            className={`hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
              theme === "dark" ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <div className="text-left font-mono">
              <span className="block text-[10px] opacity-60">Candidate:</span>
              <span className="text-indigo-300 text-[11px] font-bold">{userName || "Guest"}</span>
            </div>
          </div>

          {/* XP DISPLAY WIDGET */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
              theme === "dark" ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>
              XP: <strong className="text-indigo-400">{userXP}</strong>
            </span>
            <span className="text-[10px] opacity-60 font-mono">
              (Lvl {Math.floor(userXP / 150)})
            </span>
          </div>

          {/* FLAME STREAK DISPLAY */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
              theme === "dark" ? "bg-slate-900/90 border-slate-800 text-amber-500 font-mono" : "bg-amber-50 border-amber-200 text-amber-800"
            }`}
            title="Sustain streaks by solving daily assessments to activate multipliers"
          >
            <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
            <span>{streakDays} Days</span>
          </div>

          {/* HISTORICAL LOGS LINK */}
          <button
            onClick={() => {
              setCurrentScreen("history");
              fetchUserHistoricalLogs();
            }}
            className={`p-2 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition-all cursor-pointer ${
              currentScreen === "history"
                ? "bg-indigo-600 border-transparent text-white"
                : theme === "dark"
                ? "bg-slate-800 border-slate-700 hover:bg-slate-755 text-slate-300"
                : "bg-white border-slate-300 hover:bg-slate-100 text-slate-700"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Logs</span>
          </button>

          {/* SOUND FX */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              theme === "dark" ? "hover:bg-slate-850" : "hover:bg-slate-150"
            }`}
            title={soundEnabled ? "Mute Retro Chimes" : "Enable Retro Sound Effects"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-indigo-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {/* THEME TOGGLE */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              theme === "dark" ? "hover:bg-slate-850 text-amber-400" : "hover:bg-slate-150 text-indigo-600"
            }`}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* ADMIN PORT CONTROL BUTTON */}
          <button
            onClick={() => setCurrentScreen("admin")}
            className="p-2 py-1.5 bg-slate-800 hover:bg-slate-705 text-[10px] tracking-wider font-bold text-indigo-300 rounded border border-slate-700 cursor-pointer"
          >
            🛡️ Database
          </button>

          {/* SECURE LOGOUT BUTTON */}
          <button
            onClick={handleSignOut}
            className="p-2 py-1.5 bg-rose-950/20 hover:bg-rose-900/30 text-[10px] tracking-wider font-bold text-rose-300 rounded border border-rose-900/30 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ERROR FEEDBACK BAR */}
      {apiError && (
        <div className="bg-[#e11d48]/15 border-y border-[#e11d48]/25 px-6 py-2 text-xs text-rose-300 flex items-center justify-center gap-2 font-mono">
          <AlertTriangle className="w-4 h-4 text-rose-450 text-rose-400" />
          <span>{apiError}</span>
        </div>
      )}

      {/* PRIMARY WORKSPACE ELEMENT */}
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-8">
        
        {/* VIEW 1: HOME WORKSPACE SCREEN */}
        {currentScreen === "home" && (
          <div className="space-y-12">
            
            {/* AMBIENT HERO SECTION */}
            <div className="text-center space-y-4 py-8 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span>Google Search Grounding enabled for authentic PYQs & Patterns</span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-black font-sans tracking-tight text-white leading-tight">
                Instantly Research & Create <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
                  Targeted Exam Prep Quizzes
                </span>
              </h2>
              
              <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
                Choose from the curated government exam preparation modules below. Our system dynamically searches live official guidelines, books, and past papers to structure a personalized roadmap.
              </p>
            </div>

            {/* SYLLABUS CATALOG GRID */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black tracking-tight text-white">Target Exam Syllabus Subjects</h3>
                  <p className="text-xs text-gray-400">Intelligent curriculums populated in real-time from active pools</p>
                </div>
                <div className="flex items-center gap-2 bg-indigo-500/10 text-indigo-300 px-3 py-1 rounded-lg border border-indigo-500/20 text-xs font-mono font-semibold">
                  <Database className="w-3.5 h-3.5 text-indigo-400" />
                  <span>POOL: {dbStats.totalQuestions} ITEMS STORAGE</span>
                </div>
              </div>

              {/* RESPONSIVE BENTO GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {(showAllSubjects ? enrichedSubjects : enrichedSubjects.slice(0, 5)).map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubjectView(sub);
                      setCurrentScreen("subject");
                    }}
                    className={`group p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                      theme === "dark"
                        ? "bg-slate-905 border-slate-850 hover:border-indigo-500 hover:bg-slate-900"
                        : "bg-white border-slate-200 hover:border-indigo-400 shadow-sm text-slate-900"
                    }`}
                  >
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform origin-left">{sub.icon}</div>
                    <h4 className="font-extrabold text-sm tracking-tight text-white group-hover:text-indigo-400 transition-colors truncate">
                      {sub.name}
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-3 leading-relaxed h-[50px] overflow-hidden">
                      {sub.desc}
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-between text-[10px] font-bold text-indigo-400 font-mono">
                      <span>{sub.count} {sub.count === 1 ? "QUIZ" : "QUIZZES"}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>

              {/* SHOW MORE / LESS TOGGLE CONTROL */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setShowAllSubjects(!showAllSubjects)}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-850 text-indigo-400 hover:text-indigo-300 border border-slate-800 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-lg"
                >
                  <span>{showAllSubjects ? "Show Less Subjects" : "Show More Government Exam Subjects"}</span>
                  {showAllSubjects ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-indigo-400" />}
                </button>
              </div>
            </div>

            {/* METRICS & BENEFITS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* ACCLAIMED PLATFORM HIGHLIGHTS */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Intelligent Generation Pipeline</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-xl text-left space-y-2">
                    <div className="w-8 h-8 rounded bg-teal-500/10 flex items-center justify-center">
                      <Cpu className="text-teal-400 w-4 h-4" />
                    </div>
                    <h5 className="font-bold text-xs text-white">Guaranteed Deduplication Engine</h5>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Your historical attempts log stores every question ID linked to your profile email. The generator filters these out in subsequent queries so you never repeat.
                    </p>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-xl text-left space-y-2">
                    <div className="w-8 h-8 rounded bg-indigo-500/10 flex items-center justify-center">
                      <Shuffle className="text-indigo-400 w-4 h-4" />
                    </div>
                    <h5 className="font-bold text-xs text-white">Hybrid Retrieval Cache</h5>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      To optimize latency under 5 seconds, the engine reuses pre-save questions from our library pool and merges new conceptual topics.
                    </p>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-xl text-left space-y-2">
                    <div className="w-8 h-8 rounded bg-amber-500/10 flex items-center justify-center">
                      <Sparkles className="text-amber-400 w-4 h-4" />
                    </div>
                    <h5 className="font-bold text-xs text-white">Pyq Search Grounding</h5>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Integrates real-world examination papers, syllabus books like NCERT and state boards, and unexpected trick concepts.
                    </p>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-xl text-left space-y-2">
                    <div className="w-8 h-8 rounded bg-rose-500/10 flex items-center justify-center">
                      <Award className="text-rose-400 w-4 h-4" />
                    </div>
                    <h5 className="font-bold text-xs text-white">Gamified Exp and Level Ups</h5>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Accumulate levels by defending streak counts and scoring high-yield difficulty multipliers on harder syllabus questions.
                    </p>
                  </div>
                </div>
              </div>

              {/* INTEGRATION REPORT CARD */}
              <div className="bg-gradient-to-br from-[#12192c] to-[#0a1020] p-6 rounded-2xl border border-indigo-500/20 text-left space-y-4">
                <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full uppercase">
                  ⚡ DAILY MULTIPLIER CHALLENGE
                </span>
                
                <h4 className="text-base font-extrabold text-white">Constitutional Assemblies & Law</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  A targeted multi-tiered assessment testing the Drafting Committee, core amendments, state reorganization acts, and judicial review parameters.
                </p>

                <div className="p-3 bg-indigo-950/30 rounded border border-indigo-500/10 text-[10px] font-mono text-indigo-300 flex items-center justify-between">
                  <span>EXP MULTIPLIER:</span>
                  <span className="font-extrabold text-amber-400 uppercase">⭐ 2.5x MULTIPLIER LIVE</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedTopic("UPSC Constitutional Drafting Committee & Amendments");
                    setIsConfigModalOpen(true);
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs uppercase py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Accept Multiplier Challenge</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* VIEW 6: SUBJECT PAGE SCREEN */}
        {currentScreen === "subject" && selectedSubjectView && (
          <div className="space-y-8 animate-fade-in" id="subjectmapping92">
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <button
                onClick={() => {
                  setCurrentScreen("home");
                  setSelectedSubjectView(null);
                }}
                className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-850 px-3.5 py-2 rounded-xl border border-slate-800 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Exam Subjects</span>
              </button>

              <div className="text-right">
                <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-500/20 font-bold uppercase">
                  {selectedSubjectView.category}
                </span>
              </div>
            </div>

            {/* Subject Info Card */}
            <div className="p-6 md:p-8 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-4xl md:text-5xl">{selectedSubjectView.icon}</span>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                      {selectedSubjectView.name}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                      {selectedSubjectView.desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Generate with AI CTA */}
              <button
                onClick={() => {
                  setSelectedTopic(selectedSubjectView.alias);
                  setIsConfigModalOpen(true);
                }}
                className="w-full md:w-auto px-5 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-550 hover:to-violet-550 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-200 animate-pulse" />
                <span>Generate Custom AI Quiz</span>
              </button>
            </div>

            {/* Quizzes List Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-mono font-bold tracking-wider text-slate-400 uppercase">
                Available Practice Quizzes ({selectedSubjectView.count})
              </h3>

              {(() => {
                const subjectQuizzes = publicQuizzes.filter(
                  (q) => q.subjectId === selectedSubjectView.id && q.published
                );

                if (subjectQuizzes.length === 0) {
                  return (
                    <div className="p-12 text-center bg-slate-900/40 border border-slate-850 border-dashed rounded-2xl space-y-4">
                      <div className="text-3xl">📭</div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">No Curated Quizzes Available Yet</h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                          There are currently no static quizzes uploaded for this subject. You can generate a personalized practice test using the AI generator!
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedTopic(selectedSubjectView.alias);
                          setIsConfigModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-indigo-300 text-xs font-bold rounded-xl border border-slate-700 cursor-pointer transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Launch AI Generator</span>
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subjectQuizzes.map((quiz) => (
                      <div
                        key={quiz.id}
                        className="p-5 bg-slate-900/60 border border-slate-850 hover:border-slate-750 rounded-2xl flex items-center justify-between gap-4 group transition-all"
                      >
                        <div className="space-y-2 truncate">
                          <h4 className="font-extrabold text-sm text-white group-hover:text-indigo-400 transition-colors truncate">
                            {quiz.name}
                          </h4>
                          <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                            <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
                              {quiz.questions?.length || 0} Questions
                            </span>
                            <span className={`px-2 py-0.5 rounded border ${
                              quiz.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                              quiz.difficulty === "Hard" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                              "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}>
                              {quiz.difficulty}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleStartCuratedQuiz(quiz)}
                          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all flex-shrink-0 cursor-pointer animate-fade-in"
                        >
                          <Play className="w-3.5 h-3.5 fill-white text-white" />
                          <span>Start</span>
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* LOADING PROGRESS ENGINE OVERLAY */}
        {isGenerating && (
          <div className="py-20 text-center space-y-6 max-w-lg mx-auto">
            <div className="relative inline-block">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-600 animate-spin" />
              <Brain className="w-6 h-6 text-indigo-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-white animate-pulse">Running AI Research Pipeline</h3>
              <p className="text-xs text-gray-400">
                Crafting targeted, high-quality multiple choice questions matching real examination standards.
              </p>
            </div>

            {/* DYNAMIC PROGRESS TIMELINE STEPS */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-left space-y-2 font-mono text-xs">
              {generationSteps.map((step, sIdx) => {
                const isCompleted = sIdx < activeStepIdx;
                const isActive = sIdx === activeStepIdx;
                return (
                  <div
                    key={sIdx}
                    className={`flex items-start gap-2 transition-opacity duration-300 ${
                      isCompleted ? "text-teal-400" : isActive ? "text-indigo-300 font-bold" : "text-slate-600"
                    }`}
                  >
                    <span>{isCompleted ? "✓" : isActive ? "▶" : "○"}</span>
                    <p className="flex-1 text-[11px] leading-relaxed">{step}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: ACTIVE REVOLUTIONS QUIZ BOARD */}
        {currentScreen === "quiz" && activeQuiz && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT PROFILE & METADATA COLUMN */}
            <div className="hidden lg:block lg:col-span-1 space-y-4">
              <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl text-left space-y-4">
                <div className="flex items-center gap-2 text-indigo-400 font-mono text-[10px] font-bold tracking-widest uppercase">
                  <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping" />
                  <span>ACTIVE ROADMAP DIAGNOSTICS</span>
                </div>

                <div>
                  <h3 className="text-base font-black text-white lines-clamp-2" title={activeQuiz.title}>
                    {activeQuiz.title}
                  </h3>
                  <span className="text-xs font-semibold text-slate-400 font-mono mt-1 block">
                     {activeQuiz.subject}
                  </span>
                </div>

                <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-slate-800/80 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Difficulty:</span>
                    <span className="font-extrabold text-indigo-400 uppercase">{quizDifficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Questions count:</span>
                    <span className="font-mono text-slate-300">{activeQuiz.questions.length} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Timer State:</span>
                    <span className="text-slate-300 font-mono">{timerEnabled ? "Active" : "Disabled"}</span>
                  </div>
                </div>

                {/* TIMER DISPLAY */}
                {timerEnabled && (
                  <div
                    className={`p-4 rounded-xl border text-center font-mono space-y-1 ${
                      secondsRemaining < 25
                        ? "bg-rose-950/25 border-rose-500/40 text-rose-300 animate-pulse"
                        : "bg-slate-950 border-slate-800 text-teal-400"
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold text-slate-400">Time Remaining on diagnostics:</span>
                    <p className="text-2xl font-black">
                      {Math.floor(secondsRemaining / 60)}:
                      {("0" + (secondsRemaining % 60)).slice(-2)}
                    </p>
                  </div>
                )}

                {/* EXIT */}
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to quit? Current diagnostic progress will have to be completely rerun.")) {
                      setCurrentScreen("home");
                    }
                  }}
                  className="w-full p-2 text-center text-xs text-rose-300 hover:text-rose-200 bg-rose-950/10 border border-rose-900/40 rounded-lg hover:bg-rose-950/20 cursor-pointer font-bold transition-all"
                >
                  Exit Diagnostics Room
                </button>
              </div>

              {/* QUICK JUMP AND COMMITTED INDICES TRACKER */}
              <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl text-left space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Questions Matrix overview:</h4>
                <div className="grid grid-cols-5 gap-2">
                  {activeQuiz.questions.map((_, index) => {
                    const isSelected = selectedAnswers[index] !== -1;
                    const isVerified = questionAnswersVerified[index];
                    const isCurrent = currentQuestionIndex === index;

                    let bgStyle = "bg-slate-950 border-slate-800 text-slate-400";
                    if (isCurrent) {
                      bgStyle = "bg-indigo-600 border-indigo-400 text-white font-bold ring-2 ring-indigo-500/20";
                    } else if (isVerified) {
                      bgStyle = "bg-green-600 border-green-500 text-white";
                    } else if (isSelected) {
                      bgStyle = "bg-indigo-950 border-indigo-500 text-indigo-300";
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentQuestionIndex(index)}
                        className={`w-full py-2.5 rounded-lg border text-xs font-mono font-bold transition-colors cursor-pointer ${bgStyle}`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
                <div className="text-[10px] text-slate-500 space-y-1 font-mono leading-relaxed pt-2 border-t border-slate-800">
                  <p className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-600" /> Current Question</p>
                  <p className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-600" /> Answer Checked</p>
                  <p className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-950" /> Unattempted Item</p>
                </div>
              </div>
            </div>

            {/* MAIN QUESTION INTERACTION COLUMN */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* ACCORDION BAR PROGRESS (RESPONSIVE) */}
              <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-bold leading-none">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-505 bg-indigo-500 animate-pulse" />
                  <span>
                    Item <strong className="text-white text-[13px]">{currentQuestionIndex + 1}/{activeQuiz.questions.length}</strong>
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">
                    Checked: <strong className="font-mono">{answeredCount}</strong>
                  </span>
                </div>

                {/* MOBILE DYNAMIC CONVENIENT TIMER DISPLAY */}
                {timerEnabled && (
                  <div className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold flex items-center gap-1 ${
                    secondsRemaining < 25
                      ? "bg-rose-950/20 border-rose-500 text-rose-300 animate-pulse"
                      : "bg-slate-950 border-slate-800 text-teal-400"
                  }`}>
                    ⏱️ {Math.floor(secondsRemaining / 60)}:{("0" + (secondsRemaining % 60)).slice(-2)}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Are you sure you want to quit? Current progress will be lost.")) {
                      setCurrentScreen("home");
                    }
                  }}
                  className="px-2 py-0.5 text-[10px] text-rose-400 hover:text-rose-300 border border-rose-950/40 bg-rose-950/10 hover:bg-rose-950/20 rounded font-mono font-bold transition-all ml-auto lg:hidden"
                >
                  Quit Room
                </button>
              </div>

              {/* CORE CARD FOR QUESTION MATRICES */}
              <div className="bg-slate-900 border border-slate-850 p-6 md:p-8 rounded-2xl text-left space-y-6">
                
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-extrabold tracking-widest uppercase bg-indigo-950 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full">
                    SYLLABUS FIELD {currentQuestionIndex + 1}
                  </span>

                  {/* DISPLAY CUSTOM INVENTIVE BADGES */}
                  {activeQuiz.questions[currentQuestionIndex].importance === "high" && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-900/60 flex items-center gap-1">
                      ⭐ HIGH-YIELD EXAM PATTERN
                    </span>
                  )}
                  {activeQuiz.questions[currentQuestionIndex].importance === "conceptual" && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-900/60 flex items-center gap-1">
                      🧠 CORE TEXTBOOK CONCEPT
                    </span>
                  )}
                  {activeQuiz.questions[currentQuestionIndex].importance === "unexpected" && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-900/60 flex items-center gap-1">
                      ⚡ UNEXPECTED ANOMALY SPEC
                    </span>
                  )}
                </div>

                {/* THE QUESTION */}
                <h4 className="text-lg md:text-xl font-extrabold text-white leading-relaxed">
                  {activeQuiz.questions[currentQuestionIndex].question}
                </h4>

                {/* THE FORBIDDEN CHOICE OPTIONS */}
                <div className="space-y-3">
                  {activeQuiz.questions[currentQuestionIndex].options.map((opt, oIdx) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === oIdx;
                    const isChecked = questionAnswersVerified[currentQuestionIndex];
                    const correctIdx = activeQuiz.questions[currentQuestionIndex].correctOptionIndex;

                    let optionBorder = "border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-300";
                    let outcomeLabel = "";

                    if (isSelected) {
                      optionBorder = "border-indigo-500 bg-indigo-950/20 text-indigo-300 ring-1 ring-indigo-500";
                    }

                    if (isChecked) {
                      if (oIdx === correctIdx) {
                        optionBorder = "border-emerald-500 bg-emerald-950/30 text-emerald-300 ring-1 ring-emerald-500 font-bold";
                        outcomeLabel = "✓ ESTABLISHED ANSWER";
                      } else if (isSelected && oIdx !== correctIdx) {
                        optionBorder = "border-[#e11d48] bg-rose-950/20 text-rose-300 ring-1 ring-[#e11d48]";
                        outcomeLabel = "✗ INCORRECT CHOICE";
                      } else {
                        optionBorder = "border-slate-850 opacity-40 bg-transparent text-slate-500";
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={isChecked}
                        onClick={() => selectOptionIndex(oIdx)}
                        className={`w-full p-4 rounded-xl border text-xs text-left transition-all flex items-center justify-between group cursor-pointer ${optionBorder}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-bold font-mono text-indigo-400 group-hover:border-indigo-500 transition-colors">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="font-semibold text-[13px]">{opt}</span>
                        </div>
                        <span className="text-[10px] font-mono tracking-widest uppercase text-right font-bold">
                          {outcomeLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* VISIBLE EDUCATIONAL explanation SYSTEM */}
                {questionAnswersVerified[currentQuestionIndex] && (
                  <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/20 text-xs text-slate-300 text-left space-y-2.5 animate-fadeIn">
                    <div className="flex items-center gap-1.5 text-indigo-400 font-bold uppercase tracking-widest text-[10px]">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      <span>Conceptual Explanation Context:</span>
                    </div>
                    <p className="leading-relaxed">
                      {activeQuiz.questions[currentQuestionIndex].explanation}
                    </p>
                  </div>
                )}

              </div>

              {/* NAVIGATION CONTROL BAR */}
              <div className="flex items-center justify-between gap-4">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={prevQuestion}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg disabled:opacity-40 select-none cursor-pointer flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]"
                >
                  ← Previous question
                </button>

                <div className="flex items-center gap-2">
                  {!questionAnswersVerified[currentQuestionIndex] ? (
                    <button
                      disabled={selectedAnswers[currentQuestionIndex] === -1}
                      onClick={checkOptionAssertion}
                      className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-550 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wider text-[11px] rounded-lg shadow-md flex items-center gap-2 cursor-pointer scale-102 hover:scale-105 transition-transform"
                    >
                      <CheckCircle className="w-4 h-4 text-indigo-200" />
                      <span>Verify Answer</span>
                    </button>
                  ) : (
                    currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                      <button
                        onClick={nextQuestion}
                        className="px-6 py-2.5 bg-slate-800 hover:bg-slate-755 border border-slate-705 text-white font-bold uppercase tracking-wider text-[11px] rounded-lg cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Next question</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        disabled={answeredCount < activeQuiz.questions.length}
                        onClick={handleSubmitQuizForReview}
                        className="px-8 py-2.5 bg-gradient-to-tr from-green-600 to-green-500 hover:from-green-550 hover:to-green-450 border border-green-500/20 text-white font-black uppercase tracking-widest text-xs rounded-lg shadow-lg disabled:opacity-40 cursor-pointer"
                      >
                        Commit Assessment Diagnostics & Sum XP
                      </button>
                    )
                  )}
                </div>
              </div>

              {answeredCount < activeQuiz.questions.length && (
                <p className="text-[10px] font-mono text-center text-amber-500 py-1 font-semibold bg-amber-950/15 border border-amber-900/10 rounded">
                  * Alert: Please verify and check all {activeQuiz.questions.length} questions before committing scoring. Current verified: ({answeredCount}/{activeQuiz.questions.length})
                </p>
              )}

            </div>

          </div>
        )}

        {/* VIEW 3: COMPREHENSIVE DIAGNOSTIC RESULTS */}
        {currentScreen === "results" && activeQuiz && (
          <div className="max-w-4xl mx-auto space-y-8 text-center pb-12">
            
            {/* HEADER */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-3"
            >
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#22d3ee] bg-[#22d3ee]/10 border border-[#22d3ee]/25 px-4 py-1.5 rounded-full inline-block">
                Assessment Protocol Completed
              </span>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase">Syllabus Performance Report</h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Review your computed gamer stats, level-up achievements, and interactive FIFA-style academic keycard.
              </p>
            </motion.div>

            {/* MAIN RESULTS DISPLAY GRID */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* FIFA CARD UNIT CONTAINER */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                className="md:col-span-5 flex flex-col items-center space-y-4"
              >
                <div className="flex items-center gap-1.5 bg-indigo-505 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  <span className="text-[10px] font-mono font-bold tracking-wider text-indigo-305 text-indigo-300 uppercase">
                    Move cursor over • Rotate in 3D
                  </span>
                </div>
                
                <FifaCard3D
                  name={userName}
                  avatar={userAvatar}
                  score={activeQuiz?.questions ? Math.round((selectedAnswers.filter((a, idx) => a === activeQuiz.questions[idx]?.correctOptionIndex).length / activeQuiz.questions.length) * 100) : 0}
                  level={Math.floor(userXP / 150)}
                  subject={activeQuiz?.subject || "General"}
                  difficulty={quizDifficulty}
                />
              </motion.div>
              
              {/* PERFORMANCES AND RECOMMENDATION DATA */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="md:col-span-7 space-y-6"
              >
                {/* HIGH-END GAMIFIED STAT BOARD */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-left space-y-1 hover:border-indigo-550/30 transition-colors">
                    <span className="text-[9px] uppercase font-mono font-bold text-slate-500 block">TOTAL SCORE ACC</span>
                    <p className="text-2xl font-black text-white font-mono">
                      {activeQuiz?.questions ? selectedAnswers.filter((a, idx) => a === activeQuiz.questions[idx]?.correctOptionIndex).length : 0} / {activeQuiz?.questions?.length || 0}
                    </p>
                    <span className="text-[10px] text-indigo-400 font-bold font-mono uppercase">Answers Correct</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-left space-y-1 hover:border-indigo-550/30 transition-colors">
                    <span className="text-[9px] uppercase font-mono font-bold text-slate-500 block">TIME ELAPSED</span>
                    <p className="text-2xl font-black text-teal-400 font-mono">
                      {Math.floor(totalTimeSpent / 60)}m {totalTimeSpent % 60}s
                    </p>
                    <span className="text-[10px] text-slate-400">Total session duration</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-left space-y-1 hover:border-rose-500/30 transition-colors">
                    <span className="text-[9px] uppercase font-mono font-bold text-slate-500 block">DIFFICULTY BONUS</span>
                    <p className="text-2xl font-black text-rose-450 text-rose-400 uppercase">
                      {quizDifficulty}
                    </p>
                    <span className="text-[10px] text-slate-400">XP Factor: {quizDifficulty === "Hard" ? "3x Multiplier" : quizDifficulty === "Medium" ? "2x Multiplier" : "1x Standard"}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#111827] border border-amber-500/20 text-left space-y-1 hover:border-amber-500/40 transition-colors">
                    <span className="text-[9px] uppercase font-mono font-bold text-amber-500 block">XP REWARD REASSESSED</span>
                    <p className="text-2xl font-black text-amber-400 font-mono">
                      +{activeQuiz?.questions ? selectedAnswers.filter((a, idx) => a === activeQuiz.questions[idx]?.correctOptionIndex).length * 15 * (quizDifficulty === "Hard" ? 3 : quizDifficulty === "Medium" ? 2 : 1) : 0} XP
                    </p>
                    <span className="text-[10px] text-slate-400">Credentialed to profile Level</span>
                  </div>
                </div>

                {/* GAMER PERFORMANCE EVALUATION BLOCK */}
                <div className="p-5 rounded-2xl bg-gradient-to-tr from-indigo-950/20 via-slate-900/40 to-indigo-950/20 border border-indigo-500/10 text-left space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-400 animate-pulse" />
                    <h4 className="text-xs font-mono font-black uppercase tracking-widest text-indigo-300">
                      Syllabus Aptitude Summary:
                    </h4>
                  </div>
                  
                  {/* Dynamic performance assessment commentary */}
                  {(() => {
                    const corrCount = activeQuiz?.questions ? selectedAnswers.filter((a, idx) => a === activeQuiz.questions[idx]?.correctOptionIndex).length : 0;
                    const pct = activeQuiz?.questions?.length ? Math.round((corrCount / activeQuiz.questions.length) * 100) : 0;
                    let title = "RECRUIT IN TRAINING";
                    let comment = "An honest checkpoint but requires deeper homework. Request further research grounding sessions to master this topic fully.";
                    let color = "text-amber-400";

                    if (pct === 100) {
                      title = "🔥 GODLIKE PERFECT MASTERCLASS!";
                      comment = "Flawless operational mastery! You answered every diagnostic perfectly under high-strain countdown variables. Level multipliers activated!";
                      color = "text-teal-400";
                    } else if (pct >= 80) {
                      title = "⚡ SYLLABUS ELITE OVERLORD";
                      comment = "Excellent conceptual performance! Minor errors caught, but overall accuracy maps high-level aptitude on this competitive structure.";
                      color = "text-indigo-400";
                    } else if (pct >= 50) {
                      title = "🛡️ STUDY PALADIN WARRIOR";
                      comment = "Pass rate confirmed! You grasp the skeletal principles of this syllabus topic. Let's patch those weak modules.";
                      color = "text-blue-400";
                    }

                    return (
                      <div className="space-y-1.5">
                        <p className={`text-base font-black tracking-tight ${color}`}>{title}</p>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{comment}</p>
                      </div>
                    );
                  })()}
                </div>

                {/* Level Up Progress Meter */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 text-left space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-slate-400">Scholar rank meter (LVL {Math.floor(userXP / 150)}):</span>
                    <span className="font-mono text-indigo-400 font-bold">{userXP % 150} / 150 XP to Next Level</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${((userXP % 150) / 150) * 100}%` }}
                    />
                  </div>
                </div>

              </motion.div>

            </div>

            {/* SYLLABUS RECOMMENDATION MODULES AND FEEDBACK (Restyled) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* WEAK SYLLABUS MODULES */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-left space-y-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                    Syllabus Area Improvement:
                  </h4>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  The artificial intelligence has highlighted exact textbook segments needing immediate review.
                </p>

                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {activeQuiz?.questions && selectedAnswers.some((a, idx) => a !== activeQuiz.questions[idx]?.correctOptionIndex) ? (
                    activeQuiz.questions.map((q, qIdx) => {
                      if (selectedAnswers[qIdx] !== q.correctOptionIndex) {
                        return (
                          <div key={qIdx} className="p-3 bg-slate-950 rounded-xl border border-rose-950 text-xs text-rose-300 space-y-1">
                            <span className="text-[10px] font-bold text-rose-450 uppercase font-mono">
                              Anomalous choice: Option {String.fromCharCode(65 + q.correctOptionIndex)} is correct
                            </span>
                            <p className="font-bold text-[11px] text-white leading-normal">{q.question}</p>
                            <span className="block text-[10px] text-slate-500 font-mono">Suggested Syllabus Focus: "{q.topic}"</span>
                          </div>
                        );
                      }
                      return null;
                    })
                  ) : (
                    <div className="p-6 bg-teal-950/25 border border-teal-500/20 rounded-xl text-center text-teal-300 space-y-2 my-auto">
                      <GraduationCap className="w-8 h-8 text-teal-400 mx-auto animate-bounce" />
                      <p className="font-extrabold font-mono text-[13px]">ALL PATTERNS UNVEILED!</p>
                      <p className="text-xs text-teal-200">Flawless cognitive scoring verifies complete subject preparedness.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* CHRONOLOGICAL REVIEW LIST */}
              <div className="bg-[#0f172a] border border-slate-850 rounded-2xl p-6 text-left space-y-4">
                <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  Chronological Question Feed Check:
                </h4>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {activeQuiz?.questions?.map((q, idx) => {
                    const selected = selectedAnswers[idx];
                    const isCorrect = selected === q.correctOptionIndex;

                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border space-y-3 text-left transition-all ${
                          isCorrect ? "bg-emerald-950/15 border-emerald-900/35" : "bg-rose-950/15 border-rose-900/35"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
                            ITEM #{idx + 1}
                          </span>
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                              isCorrect ? "bg-emerald-900 text-emerald-300" : "bg-rose-900 text-rose-300"
                            }`}
                          >
                            {isCorrect ? "✓ Clear" : "✗ Flawed"}
                          </span>
                        </div>

                        <p className="text-[12px] font-extrabold text-white leading-relaxed">{q.question}</p>
                        
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                          <div className="p-2 bg-slate-950 rounded">
                            <span className="text-slate-500 block text-[9px] uppercase font-bold">Assert Correct:</span>
                            <span className="font-bold text-teal-400 truncate block">{q.options[q.correctOptionIndex]}</span>
                          </div>
                          <div className="p-2 bg-slate-950 rounded">
                            <span className="text-slate-500 block text-[9px] uppercase font-bold">Your Response:</span>
                            <span className={`font-bold truncate block ${isCorrect ? "text-teal-400" : "text-rose-450 text-rose-400"}`}>
                              {selected === -1 ? "Missing" : q.options[selected]}
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-900 text-xs text-slate-400 leading-normal">
                          <span className="block text-[9px] font-bold font-mono text-indigo-400 uppercase tracking-widest">Aptitude Background:</span>
                          <p className="text-[11px] mt-0.5">{q.explanation}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* ACTION FOOTER */}
            <div className="flex flex-wrap items-center justify-center gap-4 py-6">
              <button
                onClick={() => {
                  setCurrentScreen("home");
                }}
                className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-550 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg hover:scale-102 active:scale-98 cursor-pointer text-center"
              >
                Return to Arena Panel
              </button>
              
              <button
                onClick={() => {
                  setSelectedAnswers(new Array(activeQuiz.questions.length).fill(-1));
                  setQuestionAnswersVerified(new Array(activeQuiz.questions.length).fill(false));
                  setAnsweredCount(0);
                  setSecondsRemaining(activeQuiz.questions.length * 40);
                  setTotalTimeSpent(0);
                  setCurrentScreen("quiz");
                  if (timerEnabled) launchCountdownTimer();
                }}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl cursor-pointer font-bold text-xs uppercase"
              >
                Repeat This Assessment
              </button>
            </div>

          </div>
        )}

        {/* VIEW 4: PERSONALIZED ATTEMPT TIMELINE LOGS */}
        {currentScreen === "history" && (
          <div className="max-w-4xl mx-auto space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-white">Your Personal Exam Timeline Logs</h3>
                <p className="text-xs text-gray-400">Chronological list of all syllabus checkpoints solved</p>
              </div>
              <button
                onClick={() => setCurrentScreen("home")}
                className="p-2 text-xs bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded-lg flex items-center gap-1 cursor-pointer font-bold font-mono uppercase"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Exams Center</span>
              </button>
            </div>

            {loadingHistory ? (
              <div className="py-20 text-center text-slate-400 font-mono animate-pulse">
                [SYSTEM] loading historical attempt indices from PostgreSQL server db...
              </div>
            ) : attemptsList.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/40 space-y-4">
                <ShieldAlert className="w-10 h-10 text-slate-600 mx-auto" />
                <div>
                  <h4 className="font-bold text-sm">No historical attempts recorded!</h4>
                  <p className="text-xs text-slate-500 mt-1">Initiate and complete a quiz research module to index your first checkpoint.</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="bg-slate-950/80 border-b border-slate-800/80 text-slate-400 uppercase tracking-widest text-[10px]">
                        <th className="p-4 font-bold">Exam Title / Subject</th>
                        <th className="p-4 font-bold">Difficulty</th>
                        <th className="p-4 font-bold text-center">Correct rate</th>
                        <th className="p-4 font-bold text-center">Accuracy %</th>
                        <th className="p-4 font-bold text-center">Time Spent</th>
                        <th className="p-4 font-bold">Committed Checkpoint</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {attemptsList.map((rec, idx) => (
                        <tr key={idx} className="hover:bg-slate-850/40 text-slate-300">
                          <td className="p-4">
                            <span className="font-bold text-white block text-[13px] font-sans">{rec.topic}</span>
                            <span className="text-[10px] text-indigo-400 uppercase font-mono">{rec.subject}</span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                rec.difficulty === "Easy"
                                  ? "bg-green-950 text-green-300 border border-green-900/40"
                                  : rec.difficulty === "Medium"
                                  ? "bg-amber-950 text-amber-300 border border-amber-900/40"
                                  : "bg-rose-950 text-rose-300 border border-rose-900/40"
                              }`}
                            >
                              {rec.difficulty}
                            </span>
                          </td>
                          <td className="p-4 text-center font-bold text-white text-[13px]">
                            {rec.score} / {rec.totalQuestions}
                          </td>
                          <td className="p-4 text-center text-teal-400 font-bold">
                            {rec.accuracy}%
                          </td>
                          <td className="p-4 text-center text-slate-400">
                            {Math.floor(rec.timeSpent / 60)}m {rec.timeSpent % 60}s
                          </td>
                          <td className="p-4 text-slate-500 text-[11px]">
                            {new Date(rec.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: ADMIN AND METRIC DATABASE EXPLORER */}
        {currentScreen === "admin" && (
          <div className="max-w-5xl mx-auto space-y-6 text-left">
            {/* Header section */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-2xl font-black text-white flex items-center gap-2">
                  <ShieldAlert className="w-6 h-6 text-indigo-400" />
                  <span>Admin Control Portal</span>
                </h3>
                <p className="text-xs text-gray-400">Manage subjects, nested quizzes, questions, and parse files</p>
              </div>
              <div className="flex gap-2">
                {isAdminLoggedIn && (
                  <button
                    onClick={handleAdminLogout}
                    className="p-2 text-xs bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-900/40 rounded-lg flex items-center gap-1 cursor-pointer font-bold font-mono uppercase"
                  >
                    Logout Admin
                  </button>
                )}
                <button
                  onClick={() => setCurrentScreen("home")}
                  className="p-2 text-xs bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded-lg flex items-center gap-1 cursor-pointer font-bold font-mono uppercase"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Exams Center</span>
                </button>
              </div>
            </div>

            {!isAdminLoggedIn ? (
              /* ADMIN LOGIN CARD */
              <div className="max-w-md mx-auto py-12">
                <div className="bg-slate-900 border border-slate-800 rounded-[24px] p-8 shadow-2xl space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-extrabold text-white">Secure Admin Access Only</h4>
                    <p className="text-xs text-slate-400">Provide credentials to coordinate core quiz pools.</p>
                  </div>

                  {adminLoginError && (
                    <div className="p-3 bg-rose-950/30 border border-rose-900/40 text-xs text-rose-300 rounded-lg text-center font-mono">
                      {adminLoginError}
                    </div>
                  )}

                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Admin Email:</label>
                      <input
                        type="email"
                        placeholder="admin@quizgenius.com"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg outline-none text-white text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Password:</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg outline-none text-white text-xs font-semibold"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-550 text-white font-black uppercase text-xs tracking-wider rounded-lg shadow-lg active:scale-98 transition-transform cursor-pointer"
                    >
                      Authenticate Admin
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              /* MAIN ADMIN INTERFACE */
              <div className="space-y-6">
                {/* Tab buttons */}
                <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-px">
                  {[
                    { id: "dashboard", label: "Dashboard", desc: "Main summary & metrics" },
                    { id: "subjects", label: "Subject Management", desc: "Configure exams hierarchy" },
                    { id: "quizzes", label: "Quiz Management", desc: "Review, prune & deduplicate" },
                    { id: "upload", label: "Upload HTML Quiz", desc: "Automatic parse extractor" }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveAdminTab(tab.id as any)}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                        activeAdminTab === tab.id
                          ? "border-indigo-500 text-indigo-400 font-extrabold"
                          : "border-transparent text-slate-400 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* TAB 1: DASHBOARD VIEW */}
                {activeAdminTab === "dashboard" && (
                  <div className="space-y-6">
                    {/* Metrics grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">TOTAL SUBJECTS</span>
                        <p className="text-3xl font-black text-indigo-400 mt-1">{adminStats.totalSubjects}</p>
                        <p className="text-[10px] text-slate-500 mt-1 font-mono">Core syllabus structures nested</p>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">TOTAL PUBLISHED QUIZZES</span>
                        <p className="text-3xl font-black text-emerald-400 mt-1">{adminStats.totalQuizzes}</p>
                        <p className="text-[10px] text-slate-500 mt-1 font-mono">Custom curated mock exams</p>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">TOTAL POOL QUESTIONS</span>
                        <p className="text-3xl font-black text-amber-400 mt-1">{adminStats.totalQuestions}</p>
                        <p className="text-[10px] text-slate-500 mt-1 font-mono">Total question bank elements</p>
                      </div>
                    </div>

                    {/* Recent Uploads Table */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                      <div>
                        <h4 className="font-extrabold text-white text-sm">Recent Active Uploads</h4>
                        <p className="text-[11px] text-slate-400">Latest administrative additions and live states</p>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse font-mono">
                          <thead>
                            <tr className="bg-slate-950/80 text-slate-400 uppercase tracking-widest text-[9px] border-b border-slate-800/80">
                              <th className="p-3 font-bold">Quiz Name</th>
                              <th className="p-3 font-bold">Subject</th>
                              <th className="p-3 font-bold text-center">Questions</th>
                              <th className="p-3 font-bold text-center font-mono">Status</th>
                              <th className="p-3 font-bold">Committed On</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {adminStats.recentUploads.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="p-6 text-center text-slate-500">
                                  No recent uploads detected. Use "Upload HTML Quiz" to populate!
                                </td>
                              </tr>
                            ) : (
                              adminStats.recentUploads.map((qu, qIdx) => (
                                <tr key={qIdx} className="hover:bg-slate-850/40 text-slate-300">
                                  <td className="p-3 font-bold font-sans text-white text-xs">{qu.name}</td>
                                  <td className="p-3 text-indigo-400">{qu.subject}</td>
                                  <td className="p-3 text-center">{qu.questionsCount} items</td>
                                  <td className="p-3 text-center">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                      qu.published ? "bg-emerald-950 text-emerald-300" : "bg-slate-950 text-slate-400"
                                    }`}>
                                      {qu.published ? "Live" : "Draft"}
                                    </span>
                                  </td>
                                  <td className="p-3 text-slate-500 text-[10px]">
                                    {new Date(qu.createdAt).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: SUBJECT MANAGEMENT VIEW */}
                {activeAdminTab === "subjects" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Add Subject form */}
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 text-left h-fit">
                      <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Add New Subject Hierarchy</h4>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="e.g. UPSC Geography, RAS History"
                          value={newSubjectName}
                          disabled={isAddingSubject}
                          onChange={(e) => setNewSubjectName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !isAddingSubject) {
                              handleCreateSubject();
                            }
                          }}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg outline-none text-white text-xs disabled:opacity-50"
                        />
                        <button
                          onClick={handleCreateSubject}
                          disabled={isAddingSubject || !newSubjectName.trim()}
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-550 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wide rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isAddingSubject ? "Adding..." : "Add Subject"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Subjects list */}
                    <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                      <div>
                        <h4 className="font-extrabold text-white text-sm">Subject Catalog ({adminSubjects.length})</h4>
                        <p className="text-[11px] text-slate-400">Rename or delete curriculum blocks. Deletion cascades to nested quizzes.</p>
                      </div>

                      <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
                        {adminSubjects.length === 0 ? (
                          <div className="text-center py-12 text-slate-500 font-mono text-xs">No subjects recorded. Create one above!</div>
                        ) : (
                          adminSubjects.map((sub) => {
                            const subQuizzes = adminQuizzes.filter(q => q.subjectId === sub.id);
                            const isEditing = editingSubjectId === sub.id;

                            return (
                              <div key={sub.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
                                <div className="flex-1 space-y-1">
                                  {isEditing ? (
                                    <div className="flex gap-2">
                                      <input
                                        type="text"
                                        value={editingSubjectName}
                                        onChange={(e) => setEditingSubjectName(e.target.value)}
                                        className="flex-1 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-white animate-pulse"
                                      />
                                      <button
                                        onClick={handleUpdateSubject}
                                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-555 text-white rounded text-[10px] font-bold uppercase cursor-pointer"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setEditingSubjectId(null)}
                                        className="px-2 py-1 bg-slate-800 hover:bg-slate-705 text-slate-300 rounded text-[10px] font-bold uppercase cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <>
                                      <h5 className="font-bold text-white text-sm">{sub.name}</h5>
                                      <span className="text-[10px] text-indigo-400 uppercase font-mono tracking-wider font-semibold block">
                                        📁 Contains {subQuizzes.length} nested quizzes
                                      </span>
                                    </>
                                  )}
                                </div>

                                <div className="flex gap-2">
                                  {!isEditing && (
                                    <>
                                      <button
                                        onClick={() => {
                                          setEditingSubjectId(sub.id);
                                          setEditingSubjectName(sub.name);
                                        }}
                                        className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded cursor-pointer animate-pulse"
                                        title="Rename subject"
                                      >
                                        <FileText className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteSubject(sub.id)}
                                        className="p-1.5 hover:bg-rose-950 text-rose-450 hover:text-rose-400 rounded cursor-pointer"
                                        title="Delete subject"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: QUIZ MANAGEMENT VIEW */}
                {activeAdminTab === "quizzes" && (
                  <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-left">
                      <div>
                        <h4 className="font-extrabold text-white text-sm">Exam & Mock Quiz Registry</h4>
                        <p className="text-[11px] text-slate-400">Review created tests. Remove duplicate questions or edit question cards inline.</p>
                      </div>

                      {editingQuizId ? (
                        /* INLINE QUESTION EDITOR MODE */
                        <div className="space-y-4 border border-indigo-500/20 bg-slate-950 p-6 rounded-xl animate-fadeIn">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h5 className="font-bold text-white text-xs uppercase tracking-wider text-indigo-300">
                              Editing Questions for: {adminQuizzes.find(q => q.id === editingQuizId)?.name}
                            </h5>
                            <button
                              onClick={() => {
                                setEditingQuizId(null);
                                setEditingQuizQuestions([]);
                              }}
                              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-450 text-xs font-bold rounded uppercase cursor-pointer"
                            >
                              Exit Editor
                            </button>
                          </div>

                          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 divide-y divide-slate-850">
                            {editingQuizQuestions.map((eq, qIdx) => (
                              <div key={qIdx} className="pt-4 first:pt-0 space-y-3 text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-slate-500 font-bold uppercase text-[9px]">Question {qIdx + 1}:</span>
                                  <button
                                    onClick={() => {
                                      const updated = editingQuizQuestions.filter((_, i) => i !== qIdx);
                                      setEditingQuizQuestions(updated);
                                    }}
                                    className="text-rose-450 hover:text-rose-400 font-bold font-mono text-[10px] uppercase cursor-pointer"
                                  >
                                    Delete Question
                                  </button>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">Question text:</label>
                                  <input
                                    type="text"
                                    value={eq.question}
                                    onChange={(e) => {
                                      const updated = [...editingQuizQuestions];
                                      updated[qIdx] = { ...updated[qIdx], question: e.target.value };
                                      setEditingQuizQuestions(updated);
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-slate-905 border border-slate-800 text-white rounded outline-none"
                                  />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {eq.options.map((opt, oIdx) => (
                                    <div key={oIdx} className="space-y-1">
                                      <label className="text-[9px] font-mono text-slate-500 font-bold uppercase font-semibold">Option {String.fromCharCode(65 + oIdx)}:</label>
                                      <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) => {
                                          const updated = [...editingQuizQuestions];
                                          const optCopy = [...updated[qIdx].options];
                                          optCopy[oIdx] = e.target.value;
                                          updated[qIdx] = { ...updated[qIdx], options: optCopy };
                                          setEditingQuizQuestions(updated);
                                        }}
                                        className="w-full px-2 py-1 bg-slate-905 border border-slate-800 text-slate-200 rounded outline-none"
                                      />
                                    </div>
                                  ))}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">Correct Option:</label>
                                    <select
                                      value={eq.correctOptionIndex}
                                      onChange={(e) => {
                                        const updated = [...editingQuizQuestions];
                                        updated[qIdx] = { ...updated[qIdx], correctOptionIndex: parseInt(e.target.value, 10) };
                                        setEditingQuizQuestions(updated);
                                      }}
                                      className="w-full px-2 py-1 bg-slate-905 border border-slate-800 text-white rounded outline-none"
                                    >
                                      {eq.options.map((_, oIdx) => (
                                        <option key={oIdx} value={oIdx}>Option {String.fromCharCode(65 + oIdx)}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">Difficulty:</label>
                                    <select
                                      value={eq.difficulty}
                                      onChange={(e) => {
                                        const updated = [...editingQuizQuestions];
                                        updated[qIdx] = { ...updated[qIdx], difficulty: e.target.value as any };
                                        setEditingQuizQuestions(updated);
                                      }}
                                      className="w-full px-2 py-1 bg-slate-905 border border-slate-800 text-white rounded outline-none"
                                    >
                                      <option value="Easy">Easy</option>
                                      <option value="Medium">Medium</option>
                                      <option value="Hard">Hard</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">Explanation (Bilingual English / Hindi segments):</label>
                                  <textarea
                                    value={eq.explanation}
                                    rows={3}
                                    onChange={(e) => {
                                      const updated = [...editingQuizQuestions];
                                      updated[qIdx] = { ...updated[qIdx], explanation: e.target.value };
                                      setEditingQuizQuestions(updated);
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-slate-905 border border-slate-800 text-slate-300 rounded outline-none"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                            <button
                              onClick={() => {
                                setEditingQuizId(null);
                                setEditingQuizQuestions([]);
                              }}
                              className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-slate-400 rounded text-xs font-bold uppercase cursor-pointer"
                            >
                              Discard Edits
                            </button>
                            <button
                              onClick={handleSaveQuizQuestionEdits}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-550 text-white rounded text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-4 h-4" />
                              <span>Commit & Save Changes</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* QUIZ HIERARCHICAL ACCORDION BY SUBJECT */
                        <div className="space-y-6">
                          {adminSubjects.map((sub) => {
                            const nested = adminQuizzes.filter(q => q.subjectId === sub.id);

                            return (
                              <div key={sub.id} className="space-y-3">
                                <h5 className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest border-b border-indigo-950 pb-1 flex items-center gap-1.5">
                                  <span>🏛️ {sub.name}</span>
                                  <span className="text-[10px] bg-indigo-950/80 px-2 py-0.5 rounded text-indigo-300 border border-indigo-500/10 font-mono">
                                    {nested.length} quizzes inside
                                  </span>
                                </h5>

                                {nested.length === 0 ? (
                                  <p className="text-xs text-slate-500 italic pl-4">No nested quizzes inside this subject. Select "Upload HTML Quiz" to add ones!</p>
                                ) : (
                                  <div className="grid grid-cols-1 gap-3 pl-2 sm:pl-4">
                                    {nested.map((qu) => (
                                      <div key={qu.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
                                        <div className="text-left space-y-1">
                                          <div className="flex items-center gap-2">
                                            <h6 className="font-bold text-white text-xs sm:text-sm">{qu.name}</h6>
                                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                                              qu.difficulty === "Easy" ? "bg-green-950 text-green-300" :
                                              qu.difficulty === "Medium" ? "bg-amber-950 text-amber-300" :
                                              "bg-rose-950 text-rose-300"
                                            }`}>
                                              {qu.difficulty}
                                            </span>
                                          </div>
                                          <span className="text-[10px] text-slate-500 block font-mono">
                                            📋 {qu.questions?.length || 0} questions • Created {new Date(qu.createdAt).toLocaleDateString()}
                                          </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2">
                                          <button
                                            onClick={() => {
                                              setEditingQuizId(qu.id);
                                              setEditingQuizQuestions(qu.questions || []);
                                            }}
                                            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-indigo-300 rounded text-[10px] font-mono font-bold uppercase cursor-pointer"
                                          >
                                            Edit Questions
                                          </button>
                                          <button
                                            onClick={() => handleRemoveQuizDuplicates(qu.id)}
                                            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded text-[10px] font-mono font-bold uppercase cursor-pointer"
                                            title="Clean identical questions inside this quiz"
                                          >
                                            Prune Duplicates
                                          </button>
                                          <button
                                            onClick={() => handleToggleQuizPublish(qu)}
                                            className={`px-2 py-1 rounded text-[10px] font-mono font-bold uppercase cursor-pointer ${
                                              qu.published
                                                ? "bg-emerald-955/60 border border-emerald-900/30 text-emerald-300 hover:bg-emerald-900/40"
                                                : "bg-slate-900 text-slate-400"
                                            }`}
                                          >
                                            {qu.published ? "Live (Unpublish)" : "Draft (Publish)"}
                                          </button>
                                          <button
                                            onClick={() => handleDeleteQuiz(qu.id)}
                                            className="p-1.5 bg-rose-950/20 border border-rose-900/10 text-rose-450 hover:bg-rose-950 rounded cursor-pointer"
                                            title="Delete Quiz"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 4: UPLOAD PDF/HTML QUIZ */}
                {activeAdminTab === "upload" && (
                  <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left space-y-6">
                      <div>
                        <h4 className="font-extrabold text-white text-sm">AI PDF & HTML Quiz Extractor</h4>
                        <p className="text-[11px] text-slate-400">
                          Upload any PDF document, saved exam preparation webpage, or HTML raw content file. The intelligence pipeline extracts all questions, shuffles options, improves grammar, and generates bilingual English/Hindi explanations automatically.
                        </p>
                      </div>

                      {/* 1. Subject Selection: Clean Searchable Dropdown with Arrow */}
                      <div className="space-y-2 relative w-full max-w-md">
                        <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                          Assign Subject Hierarchy (Predefined Government Exams)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Type to search subjects (e.g. UPSC, SSC CGL, Banking)..."
                            value={subjectSearchQuery}
                            onChange={(e) => {
                              setSubjectSearchQuery(e.target.value);
                              setIsSubjectDropdownOpen(true);
                            }}
                            onFocus={() => setIsSubjectDropdownOpen(true)}
                            className="w-full pl-3 pr-10 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-white text-xs rounded-xl outline-none focus:border-indigo-500 transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                          >
                            {isSubjectDropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>

                          {/* Options dropdown panel */}
                          {isSubjectDropdownOpen && (
                            <div className="absolute z-30 w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl max-h-56 overflow-y-auto divide-y divide-slate-900">
                              {(() => {
                                const selectedSub = adminSubjects.find(s => s.id === uploadSubjectId);
                                const isExactMatch = selectedSub && subjectSearchQuery === selectedSub.name;
                                const filtered = isExactMatch 
                                  ? adminSubjects 
                                  : adminSubjects.filter(s => s.name.toLowerCase().includes(subjectSearchQuery.toLowerCase()));
                                
                                return (
                                  <>
                                    {filtered.map(s => (
                                      <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => {
                                          setUploadSubjectId(s.id);
                                          setSubjectSearchQuery(s.name);
                                          setIsSubjectDropdownOpen(false);
                                          // If preview exists, let's update its quiz name automatically
                                          if (parsedQuizPreview) {
                                            setUploadQuizName(`${s.name} MCQ Practice Test`);
                                          }
                                        }}
                                        className={`w-full text-left px-3 py-2 text-xs hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-between ${
                                          uploadSubjectId === s.id ? "bg-indigo-600/20 text-indigo-400 font-bold" : "text-slate-300"
                                        }`}
                                      >
                                        <span>{s.name}</span>
                                        {uploadSubjectId === s.id && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                                      </button>
                                    ))}
                                    {filtered.length === 0 && (
                                      <div className="px-3 py-2.5 text-xs text-slate-500 text-center">
                                        No subjects match. You can create a new subject in the "Subjects" tab.
                                      </div>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 2. Input Mode Selector (File vs Paste) */}
                      <div className="space-y-4">
                        <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                          Choose Input Mode
                        </label>
                        <div className="flex gap-2 p-1 bg-slate-950/60 border border-slate-850 rounded-xl max-w-sm">
                          <button
                            type="button"
                            onClick={() => {
                              setUploadMode("file");
                              setJobError(null);
                            }}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              uploadMode === "file"
                                ? "bg-indigo-600 text-white shadow"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            Upload Document File
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setUploadMode("paste");
                              setJobError(null);
                            }}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              uploadMode === "paste"
                                ? "bg-indigo-600 text-white shadow"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            Paste Content / JSON
                          </button>
                        </div>
                      </div>

                      {uploadMode === "file" ? (
                        /* File Upload drag and drop arena */
                        <div className="p-8 border-2 border-dashed border-slate-800 hover:border-indigo-500 rounded-xl bg-slate-950/40 text-center space-y-4 transition-colors relative">
                          <input
                            type="file"
                            accept=".html,.htm,.txt,.json,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setIsParsingFile(true);
                              setPreviewLimit(6); // reset sample questions limit on new upload
                              setJobError(null);

                              const ext = file.name.split(".").pop()?.toLowerCase() || "";
                              if (!["html", "htm", "txt", "json", "pdf"].includes(ext)) {
                                setJobError("Unsupported file format");
                                setIsParsingFile(false);
                                return;
                              }
                              
                              const selectedSubObj = adminSubjects.find(s => s.id === uploadSubjectId);
                              const selectedSubName = selectedSubObj ? selectedSubObj.name : "General Knowledge";
                              const isPdfFile = ext === "pdf";

                              const reader = new FileReader();
                              reader.onload = async (event) => {
                                const text = event.target?.result as string;
                                try {
                                  setJobError(null);
                                  setJobStatus("starting");
                                  setJobProgress(null);
                                  const res = await fetch("/api/admin/parse-quiz", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                      fileContent: text,
                                      fileName: file.name,
                                      htmlContent: text, // backwards compatibility
                                      subjectName: selectedSubName
                                    })
                                  });
                                  if (res.ok) {
                                    const data = await res.json();
                                    if (data.jobId) {
                                      setActiveJobId(data.jobId);
                                      setJobStatus(data.status || "processing");
                                    } else {
                                      setParsedQuizPreview(data);
                                      setUploadQuizName(`${selectedSubName} MCQ Practice Test`);
                                      setUploadDifficulty("Medium");
                                      setIsParsingFile(false);
                                    }
                                  } else {
                                    let errMsg = "Error initializing extraction job.";
                                    try {
                                      const errData = await res.json();
                                      if (errData && errData.error) {
                                        errMsg = errData.error;
                                      }
                                    } catch (_) {}
                                    setJobError(errMsg);
                                    setIsParsingFile(false);
                                  }
                                } catch (err: any) {
                                  console.error(err);
                                  setJobError(err.message || "Failed to establish upload pipeline.");
                                  setIsParsingFile(false);
                                }
                              };
                              
                              if (isPdfFile) {
                                reader.readAsDataURL(file);
                              } else {
                                reader.readAsText(file);
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="flex flex-col items-center gap-2">
                            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl">
                              {isParsingFile ? (
                                <RefreshCw className="w-8 h-8 animate-spin" />
                              ) : (
                                <FileText className="w-8 h-8 animate-pulse" />
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white uppercase tracking-wider">
                                {isParsingFile ? (
                                  <span>
                                    {jobStatus === "starting" ? "Initializing Job..." : "Analyzing Complete Document..."}
                                  </span>
                                ) : "Drag and drop or Click to choose PDF, HTML, or JSON File"}
                              </p>
                              {isParsingFile && jobProgress && (
                                <p className="text-[11px] text-indigo-300 font-mono mt-1">
                                  Progress: {jobProgress.totalFound || 0} found | {jobProgress.relevantCount || 0} relevant filtered so far...
                                </p>
                              )}
                              {!isParsingFile && jobError && (
                                <p className="text-[11px] text-rose-450 text-rose-400 font-mono mt-1 font-bold">
                                  ⚠️ Error: {jobError}
                                </p>
                              )}
                              <p className="text-[10px] text-slate-500 mt-1">AI reads & cleanses documents. Supports complex government exams and full PDFs.</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Direct Pasted Content Arena */
                        <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 space-y-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                                Content Format Type
                              </label>
                              <div className="flex gap-2">
                                {[
                                  { key: "json", label: "JSON format" },
                                  { key: "html", label: "HTML page source" },
                                  { key: "txt", label: "Plain Text / List" }
                                ].map((fmt) => (
                                  <button
                                    key={fmt.key}
                                    type="button"
                                    onClick={() => setPasteFormat(fmt.key as any)}
                                    className={`px-3 py-1.5 text-[11px] font-bold border rounded-lg tracking-wide cursor-pointer transition-colors ${
                                      pasteFormat === fmt.key
                                        ? "bg-indigo-600/25 border-indigo-500 text-indigo-300"
                                        : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-300"
                                    }`}
                                  >
                                    {fmt.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                              Paste Content
                            </label>
                            <textarea
                              value={pastedContent}
                              onChange={(e) => setPastedContent(e.target.value)}
                              rows={11}
                              placeholder={
                                pasteFormat === "json"
                                  ? `[\n  {\n    "question": "What is the capital of India?",\n    "options": ["Mumbai", "New Delhi", "Kolkata", "Chennai"],\n    "correctOptionIndex": 1,\n    "explanation": "New Delhi is the capital of India."\n  }\n]`
                                  : `Paste your exam preparation HTML, questions, options, or list text directly here...`
                              }
                              className="w-full p-4 bg-slate-950 border border-slate-850 focus:border-indigo-500 text-white rounded-xl outline-none text-xs font-mono leading-relaxed"
                            />
                          </div>

                          {jobError && (
                            <p className="text-xs text-rose-400 font-bold font-mono">
                              ⚠️ Error: {jobError}
                            </p>
                          )}

                          <button
                            type="button"
                            onClick={handleParsePastedContent}
                            disabled={isParsingFile}
                            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-550 disabled:opacity-50 text-white font-extrabold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-101 transition-transform"
                          >
                            {isParsingFile ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>{jobStatus === "starting" ? "Initializing AI Pipeline..." : "Parsing Pasted Content..."}</span>
                              </>
                            ) : (
                              <>
                                <Cpu className="w-4 h-4" />
                                <span>Extract Pasted Questions</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* 3. Extracted preview arena */}
                      {parsedQuizPreview && (
                        <div className="space-y-6 border-t border-slate-800 pt-6 animate-fadeIn">
                          
                          {/* Bento stats & details row */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Total Questions Found</span>
                              <span className="text-3xl font-extrabold text-white mt-1">
                                {parsedQuizPreview.totalFound || parsedQuizPreview.questions.length}
                              </span>
                            </div>
                            <div className="bg-indigo-950/20 p-4 rounded-xl border border-indigo-500/15 flex flex-col justify-between">
                              <span className="text-[10px] font-mono text-indigo-300 uppercase font-bold">Relevant Questions Extracted</span>
                              <span className="text-3xl font-extrabold text-indigo-400 mt-1">
                                {parsedQuizPreview.relevantCount || parsedQuizPreview.questions.length}
                              </span>
                            </div>
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Target Exam Subject</span>
                              <span className="text-sm font-bold text-slate-200 mt-1 truncate">
                                {subjectSearchQuery || parsedQuizPreview.detectedSubject}
                              </span>
                            </div>
                          </div>

                          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
                            <h5 className="text-xs font-extrabold uppercase text-indigo-400 tracking-wider">Configure Practice Quiz Details</h5>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="space-y-1 sm:col-span-2">
                                <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">Quiz Practice Title:</label>
                                <input
                                  type="text"
                                  placeholder="Quiz Title"
                                  value={uploadQuizName}
                                  onChange={(e) => setUploadQuizName(e.target.value)}
                                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-white text-xs rounded outline-none focus:border-indigo-500"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">Difficulty Level:</label>
                                <select
                                  value={uploadDifficulty}
                                  onChange={(e) => setUploadDifficulty(e.target.value as any)}
                                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-white text-xs rounded outline-none font-bold"
                                >
                                  <option value="Easy">Easy</option>
                                  <option value="Medium">Medium</option>
                                  <option value="Hard">Hard</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Questions sample list */}
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h5 className="font-extrabold text-white text-xs uppercase tracking-wider">
                                Preview Extracted Questions (Showing {Math.min(previewLimit, parsedQuizPreview.questions.length)} of {parsedQuizPreview.questions.length})
                              </h5>
                              <span className="text-[10px] font-mono text-slate-500">
                                Unselected questions will still be extracted and published!
                              </span>
                            </div>

                            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 divide-y divide-slate-850 scrollbar-thin">
                              {parsedQuizPreview.questions.slice(0, previewLimit).map((q, qIdx) => (
                                <div key={qIdx} className={`pt-4 ${qIdx === 0 ? "pt-0" : ""} space-y-3`}>
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-mono text-indigo-400 uppercase font-extrabold">Question {qIdx + 1}</span>
                                    <button
                                      onClick={() => {
                                        const filtered = parsedQuizPreview.questions.filter((_, idx) => idx !== qIdx);
                                        setParsedQuizPreview({ ...parsedQuizPreview, questions: filtered });
                                      }}
                                      className="text-rose-450 hover:text-rose-400 font-bold font-mono text-[10px] uppercase flex items-center gap-1 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      <span>Discard Item</span>
                                    </button>
                                  </div>

                                  <div className="space-y-1">
                                    <input
                                      type="text"
                                      value={q.question}
                                      onChange={(e) => {
                                        const updatedQs = [...parsedQuizPreview.questions];
                                        updatedQs[qIdx] = { ...updatedQs[qIdx], question: e.target.value };
                                        setParsedQuizPreview({ ...parsedQuizPreview, questions: updatedQs });
                                      }}
                                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-white text-xs rounded outline-none focus:border-indigo-500 font-semibold"
                                    />
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    {q.options.map((opt, oIdx) => (
                                      <div key={oIdx} className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-900">
                                        <input
                                          type="radio"
                                          name={`preview-correct-${qIdx}`}
                                          checked={q.correctOptionIndex === oIdx}
                                          onChange={() => {
                                            const updatedQs = [...parsedQuizPreview.questions];
                                            updatedQs[qIdx] = { ...updatedQs[qIdx], correctOptionIndex: oIdx };
                                            setParsedQuizPreview({ ...parsedQuizPreview, questions: updatedQs });
                                          }}
                                          className="text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-800 cursor-pointer"
                                        />
                                        <span className="text-slate-500 font-mono font-bold mr-1">{String.fromCharCode(65 + oIdx)}.</span>
                                        <input
                                          type="text"
                                          value={opt}
                                          onChange={(e) => {
                                            const updatedQs = [...parsedQuizPreview.questions];
                                            const optCopy = [...updatedQs[qIdx].options];
                                            optCopy[oIdx] = e.target.value;
                                            updatedQs[qIdx] = { ...updatedQs[qIdx], options: optCopy };
                                            setParsedQuizPreview({ ...parsedQuizPreview, questions: updatedQs });
                                          }}
                                          className="flex-1 px-1.5 py-0.5 bg-transparent border-none text-slate-200 text-xs rounded outline-none focus:ring-1 focus:ring-indigo-500"
                                        />
                                      </div>
                                    ))}
                                  </div>

                                  <div className="space-y-1">
                                    <label className="text-[9px] font-mono text-slate-500 font-bold uppercase">Bilingual Explanation (English & Hindi paragraphs):</label>
                                    <textarea
                                      value={q.explanation}
                                      rows={2}
                                      onChange={(e) => {
                                        const updatedQs = [...parsedQuizPreview.questions];
                                        updatedQs[qIdx] = { ...updatedQs[qIdx], explanation: e.target.value };
                                        setParsedQuizPreview({ ...parsedQuizPreview, questions: updatedQs });
                                      }}
                                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded outline-none focus:border-indigo-500 font-mono"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Show More button to paginate sample list */}
                            {parsedQuizPreview.questions.length > previewLimit && (
                              <div className="flex justify-center pt-2">
                                <button
                                  type="button"
                                  onClick={() => setPreviewLimit(prev => prev + 6)}
                                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <span>Show More Questions</span>
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-4 pt-4 border-t border-slate-800 justify-end">
                            <button
                              onClick={() => setParsedQuizPreview(null)}
                              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-400 text-xs font-bold uppercase rounded-lg cursor-pointer"
                            >
                              Discard Upload
                            </button>
                            <button
                              onClick={handleSaveUploadedQuiz}
                              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white text-xs font-bold uppercase rounded-lg flex items-center gap-1 cursor-pointer shadow-lg shadow-indigo-600/10"
                            >
                              <Check className="w-4 h-4" />
                              <span>Approve & Publish Quiz</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </main>

      {/* QUICK PRE-START DISPATCH MODAL OVERLAYS */}
      {isConfigModalOpen && selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div
            className={`w-full max-w-md rounded-2xl border p-6 text-left space-y-6 shadow-2xl ${
              theme === "dark" ? "bg-[#0f172a] border-slate-800" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            {/* COMPONENT HEADER */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-indigo-400">Pre-Exam Settings Matrix:</span>
                <h4 className="text-lg font-black text-white truncate max-w-[280px]" title={selectedTopic}>
                  {selectedTopic}
                </h4>
              </div>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="p-1 hover:bg-slate-800 rounded-full text-slate-400 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* SELECTION CHANNELS */}
            <div className="space-y-4">
              
              {/* DIFFICULTY SELECTOR */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Configure Rigor Gradient:</span>
                <div className="grid grid-cols-3 gap-2">
                  {(["Easy", "Medium", "Hard"] as const).map((dif) => (
                    <button
                      key={dif}
                      onClick={() => setQuizDifficulty(dif)}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        quizDifficulty === dif
                          ? "bg-indigo-600 border-indigo-400 text-white shadow"
                          : theme === "dark"
                          ? "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {dif}
                    </button>
                  ))}
                </div>
              </div>

              {/* QUESTIONS COUNT SLIDER */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Syllabus question intensity:</span>
                  <span className="font-mono text-indigo-400">{quizCount} questions</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[3, 5, 8, 10, 15].map((cnt) => (
                    <button
                      key={cnt}
                      onClick={() => setQuizCount(cnt)}
                      className={`py-2 rounded font-mono text-xs font-bold border cursor-pointer transition-all ${
                        quizCount === cnt
                          ? "bg-indigo-600 border-indigo-400 text-white"
                          : theme === "dark"
                          ? "bg-slate-900 border-slate-800 text-slate-400"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>
              </div>

              {/* TIMING CONFIG */}
              <div className="flex items-center justify-between py-2 border-t border-b border-slate-800/60 my-2">
                <div className="text-left">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Countdown timer:</span>
                  <span className="text-[10px] text-slate-500 font-mono">40 seconds allocated per question</span>
                </div>
                <button
                  onClick={() => setTimerEnabled(!timerEnabled)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold border cursor-pointer transition-all ${
                    timerEnabled
                      ? "bg-teal-950/40 border-teal-500 text-teal-300"
                      : "bg-slate-900 border-slate-800 text-slate-400"
                  }`}
                >
                  {timerEnabled ? "ACTIVE (Ticking)" : "DISABLED"}
                </button>
              </div>

            </div>

            {/* LAUNCH ENGINE BUTTON */}
            <button
              onClick={() => generateQuizAssessment(selectedTopic)}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-555 text-white font-extrabold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-102 transition-transform"
            >
              <Cpu className="w-4 h-4 text-indigo-200" />
              <span>Generate Diagnostics roadmap</span>
            </button>
          </div>
        </div>
      )}

      {/* FOOTER METRIC BRAND */}
      <footer className="py-8 mt-12 border-t border-slate-850/60 text-center text-xs text-slate-500 font-mono bg-slate-950/20">
        <p>© 2026 QuizGenius AI. Built with persistent database caching & Google Search Grounding pipelines.</p>
        <p className="opacity-60 text-[10px] mt-1">Status: live • Connected as Scholars • Pool: {dbStats.totalQuestions} questions stored</p>
      </footer>
        </>
      )}
    </div>
  );
}
