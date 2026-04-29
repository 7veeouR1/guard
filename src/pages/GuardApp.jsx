import React, { useEffect, useMemo, useState } from "react";
import GuardOne from "../components/GuardOne";


const PRESETS = [
  { name: "Scroll réseaux sociaux", minutes: 45 },
  { name: "Snooze du réveil", minutes: 15 },
  { name: "Téléphone au lit", minutes: 30 },
  { name: "YouTube / Netflix en pilote automatique", minutes: 60 },
  { name: "Procrastination avant de commencer", minutes: 40 },
  { name: "Notifications et messages", minutes: 25 },
  { name: "Rangement / dispersion inutile", minutes: 20 },
  { name: "Discussions inutiles", minutes: 30 },
  { name: "Micro-pauses qui dérapent", minutes: 25 },
  { name: "Temps perdu à choisir quoi faire", minutes: 20 },
];

const PERIODS = [
  { label: "1 semaine", days: 7 },
  { label: "1 mois", days: 30 },
  { label: "6 mois", days: 182 },
  { label: "1 an", days: 365 },
];

const DAY_TOTAL_HOURS = 24;
const STANDARD_SLEEP_HOURS = 8;
const STANDARD_WORK_HOURS = 8;

function Card({ className = "", children }) {
  return <div className={`rounded-3xl border ${className}`}>{children}</div>;
}

function CardContent({ className = "", children }) {
  return <div className={className}>{children}</div>;
}

function Button({ className = "", children, ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

function IconBadge({ children, className = "" }) {
  return (
    <span aria-hidden="true" className={`inline-flex items-center justify-center ${className}`}>
      {children}
    </span>
  );
}

function ProductBadge() {
  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-s font-semibold uppercase tracking-[0.18em] text-neutral-300 shadow-lg shadow-black/20 backdrop-blur">
     <span className="flex h-10 w-10 items-center justify-center">
  <span className="text-4xl font-black leading-none tracking-[-0.12em] text-white">
    G
  </span>
</span>
      <span>GUARD</span>
      <span className="h-1 w-1 rounded-full bg-neutral-600" />
      <span className="text-neutral-500">Beta</span>
    </div>
  );
}

function createId() {
  if (
    typeof globalThis !== "undefined" &&
    globalThis.crypto &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  return `habit-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function normalizeMinutes(value) {
  return Math.max(0, Number(value) || 0);
}

export function normalizeHours(value) {
  return Math.max(0, Number(value) || 0);
}

export function calculateTotalMinutesPerDay(habits) {
  if (!Array.isArray(habits)) return 0;
  return habits.reduce((sum, habit) => sum + normalizeMinutes(habit?.minutes), 0);
}

export function getStoredGuardSessions() {
  if (typeof window === "undefined") return [];

  try {
    const storedSessions = localStorage.getItem("guard_sessions");
    return storedSessions ? JSON.parse(storedSessions) : [];
  } catch (error) {
    console.error("Impossible de lire les sessions Guard", error);
    return [];
  }
}

export function getTodayGuardSessions(sessions) {
  if (!Array.isArray(sessions)) return [];

  const today = new Date().toDateString();

  return sessions.filter((session) => {
    return new Date(session.startedAt).toDateString() === today;
  });
}

export function formatDuration(totalMinutes) {
  const safeMinutes = normalizeMinutes(totalMinutes);
  const hours = safeMinutes / 60;
  const days = hours / 24;

  if (hours < 24) {
    return `${hours.toFixed(1)} h`;
  }

  return `${days.toFixed(1)} jours`;
}

export function formatHours(value) {
  const safeHours = normalizeHours(value);
  const rounded = Math.round(safeHours * 10) / 10;
  return `${rounded.toLocaleString("fr-FR", { maximumFractionDigits: 1 })}h`;
}

export function formatImpactLine(totalMinutes) {
  const safeMinutes = normalizeMinutes(totalMinutes);
  const hours = safeMinutes / 60;
  const days = hours / 24;

  if (safeMinutes === 0) {
    return "Aucune fuite mesurée pour l’instant.";
  }

  if (hours < 2) {
    return "Ce n’est pas grand-chose aujourd’hui. Mais c’est exactement comme ça qu’une fuite commence.";
  }

  if (hours < 24) {
    return "Assez long pour faire une vraie séance, avancer un projet ou récupérer du sommeil.";
  }

  if (days < 7) {
    return "Plusieurs journées entières disparues dans une habitude automatique.";
  }

  if (days < 30) {
    return "Une vraie portion de mois avalée par une routine que tu ne choisis probablement même plus.";
  }

  if (days < 365) {
    return "Là, on ne parle plus de minutes perdues. On parle de mois de vie fragmentés.";
  }

  return "À cette échelle, ce n’est plus une habitude. C’est une trajectoire de vie.";
}

// Alias conservés pour éviter un crash si une ancienne partie du bundle ou du composant
// appelle encore les anciens noms de fonction.
export function formatActiveLifePercentage(totalMinutes) {
  return formatImpactLine(totalMinutes);
}

export function formatPercentageImpact(totalMinutes) {
  return formatImpactLine(totalMinutes);
}

export function getImpactSentence(minutesPerDay) {
  const safeMinutes = normalizeMinutes(minutesPerDay);

  if (safeMinutes === 0) return "Aucune fuite détectée pour l’instant. Ajoute une habitude pour commencer.";
  if (safeMinutes < 15) return "Petit leak, mais répété tous les jours il devient réel.";
  if (safeMinutes < 45) return "C’est discret au quotidien, violent sur l’année.";
  if (safeMinutes < 90) return "Là, ce n’est plus une habitude. C’est une fuite de potentiel.";
  return "Tu es en train de brûler des semaines entières sans t’en rendre compte.";
}

export function getTimeControlScore(leakShareOfFreeTime) {
  const leakShare = Math.min(100, Math.max(0, Number(leakShareOfFreeTime) || 0));
  return Math.round(100 - leakShare);
}

export function getTimeControlLabel(score) {
  if (score >= 90) return "Maîtrise forte";
  if (score >= 75) return "Bon contrôle";
  if (score >= 55) return "Attention aux fuites";
  if (score >= 35) return "Temps libre fragilisé";
  if (score >= 15) return "Fuite critique";
  return "Temps libre en danger";
}

export function getTimeControlMessage(score) {
  if (score >= 90) return "Ton espace libre est encore largement sous contrôle.";
  if (score >= 75) return "Quelques fuites existent, mais tu gardes la main.";
  if (score >= 55) return "Tes habitudes commencent à grignoter une vraie part de ton temps disponible.";
  if (score >= 35) return "Ton temps libre est sérieusement attaqué.";
  if (score >= 15) return "Tes fuites prennent presque toute la place.";
  return "Ton espace disponible est quasiment avalé.";
}

export function buildDayBreakdown({ sleepHours, workHours, leakMinutes }) {
  const sleep = Math.min(DAY_TOTAL_HOURS, normalizeHours(sleepHours));
  const work = Math.min(DAY_TOTAL_HOURS - sleep, normalizeHours(workHours));
  const availableFreeHours = Math.max(0, DAY_TOTAL_HOURS - sleep - work);
  const rawLeakHours = normalizeMinutes(leakMinutes) / 60;
  const leakHours = Math.min(rawLeakHours, availableFreeHours);
  const remainingFreeHours = Math.max(0, availableFreeHours - leakHours);
  const overflowHours = Math.max(0, rawLeakHours - availableFreeHours);
  const leakShareOfFreeTime = availableFreeHours === 0 ? 0 : (leakHours / availableFreeHours) * 100;

  return {
    sleepHours: sleep,
    workHours: work,
    availableFreeHours,
    leakHours,
    remainingFreeHours,
    overflowHours,
    leakShareOfFreeTime,
  };
}

export function formatMinutesAsHoursMinutes(totalMinutes) {
  const safeMinutes = normalizeMinutes(totalMinutes);
  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;

  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours}h`;

  return `${hours}h${minutes.toString().padStart(2, "0")}`;
}

function polarToCartesian(cx, cy, r, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    cx,
    cy,
    "L",
    start.x,
    start.y,
    "A",
    r,
    r,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    "Z",
  ].join(" ");
}

function PieChart({ segments, size = 260 }) {
  const total = segments.reduce((sum, segment) => sum + normalizeHours(segment.value), 0);
  const radius = size / 2 - 10;
  const center = size / 2;
  let currentAngle = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto max-w-full">
      {segments.map((segment) => {
        const value = normalizeHours(segment.value);
        if (value <= 0 || total <= 0) return null;

        const angle = (value / total) * 360;
        const path = describeArc(center, center, radius, currentAngle, currentAngle + angle);
        currentAngle += angle;

        return (
          <path
            key={segment.label}
            d={path}
            fill={segment.color}
            stroke="#0a0a0a"
            strokeWidth="2"
          />
        );
      })}

      <circle cx={center} cy={center} r={size * 0.18} fill="#0a0a0a" />
      <text x="50%" y="48%" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">
        Journée
      </text>
      <text x="50%" y="56%" textAnchor="middle" fill="#a3a3a3" fontSize="12">
        24h
      </text>
    </svg>
  );
}

function runCalculationTests() {
  const tests = [
    {
      name: "formatDuration returns hours below 24h",
      actual: formatDuration(90),
      expected: "1.5 h",
    },
    {
      name: "formatDuration returns days from 24h",
      actual: formatDuration(1440),
      expected: "1.0 jours",
    },
    {
      name: "formatImpactLine handles zero minutes",
      actual: formatImpactLine(0),
      expected: "Aucune fuite mesurée pour l’instant.",
    },
    {
      name: "formatImpactLine handles short leaks",
      actual: formatImpactLine(60),
      expected: "Ce n’est pas grand-chose aujourd’hui. Mais c’est exactement comme ça qu’une fuite commence.",
    },
    {
      name: "formatImpactLine handles one day or more",
      actual: formatImpactLine(1440),
      expected: "Plusieurs journées entières disparues dans une habitude automatique.",
    },
    {
      name: "formatPercentageImpact remains backward-compatible",
      actual: formatPercentageImpact(1440),
      expected: "Plusieurs journées entières disparues dans une habitude automatique.",
    },
    {
      name: "getImpactSentence handles zero minutes",
      actual: getImpactSentence(0),
      expected: "Aucune fuite détectée pour l’instant. Ajoute une habitude pour commencer.",
    },
    {
      name: "getImpactSentence handles high leaks",
      actual: getImpactSentence(120),
      expected: "Tu es en train de brûler des semaines entières sans t’en rendre compte.",
    },
    {
      name: "normalizeMinutes rejects negative values",
      actual: normalizeMinutes(-30),
      expected: 0,
    },
    {
      name: "normalizeMinutes rejects invalid values",
      actual: normalizeMinutes("not-a-number"),
      expected: 0,
    },
    {
      name: "calculateTotalMinutesPerDay sums valid habits",
      actual: calculateTotalMinutesPerDay([
        { name: "A", minutes: 10 },
        { name: "B", minutes: "20" },
        { name: "C", minutes: -5 },
      ]),
      expected: 30,
    },
    {
      name: "calculateTotalMinutesPerDay handles non-array input",
      actual: calculateTotalMinutesPerDay(null),
      expected: 0,
    },
    {
      name: "calculateTotalMinutesPerDay handles empty array",
      actual: calculateTotalMinutesPerDay([]),
      expected: 0,
    },
    {
      name: "buildDayBreakdown standard day keeps 8h free before leaks",
      actual: buildDayBreakdown({ sleepHours: 8, workHours: 8, leakMinutes: 0 }).availableFreeHours,
      expected: 8,
    },
    {
      name: "buildDayBreakdown subtracts leaks from available free time",
      actual: buildDayBreakdown({ sleepHours: 8, workHours: 8, leakMinutes: 120 }).remainingFreeHours,
      expected: 6,
    },
    {
      name: "buildDayBreakdown caps leaks at available free time",
      actual: buildDayBreakdown({ sleepHours: 8, workHours: 8, leakMinutes: 600 }).leakHours,
      expected: 8,
    },
    {
      name: "buildDayBreakdown tracks leak overflow",
      actual: buildDayBreakdown({ sleepHours: 8, workHours: 8, leakMinutes: 600 }).overflowHours,
      expected: 2,
    },
    {
      name: "buildDayBreakdown prevents sleep and work from exceeding 24h",
      actual: buildDayBreakdown({ sleepHours: 20, workHours: 10, leakMinutes: 60 }).workHours,
      expected: 4,
    },
    {
      name: "getTimeControlScore returns 100 when no free time is lost",
      actual: getTimeControlScore(0),
      expected: 100,
    },
    {
      name: "getTimeControlScore returns 75 when 25 percent of free time is lost",
      actual: getTimeControlScore(25),
      expected: 75,
    },
    {
      name: "getTimeControlScore never goes below 0",
      actual: getTimeControlScore(140),
      expected: 0,
    },
    {
      name: "getTimeControlScore never goes above 100",
      actual: getTimeControlScore(-20),
      expected: 100,
    },
  ];

  tests.forEach((test) => {
    if (test.actual !== test.expected) {
      console.error(`[TimeLeak test failed] ${test.name}`, {
        expected: test.expected,
        actual: test.actual,
      });
    }
  });
}

if (typeof window !== "undefined") {
  runCalculationTests();
}

export default function GuardApp() {
  const [currentView, setCurrentView] = useState("calculator");
  const [guardSessions, setGuardSessions] = useState([]);

  const [habits, setHabits] = useState([
    //{ id: createId(), name: "Scroll réseaux sociaux", minutes: 45 },//
  ]);

  const [customName, setCustomName] = useState("");
  const [customMinutes, setCustomMinutes] = useState(30);
  const [dayMode, setDayMode] = useState("standard");
  const [customSleepHours, setCustomSleepHours] = useState(8);
  const [customWorkHours, setCustomWorkHours] = useState(8);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  useEffect(() => {
    setGuardSessions(getStoredGuardSessions());
  }, [currentView]);

  const totalMinutesPerDay = useMemo(() => calculateTotalMinutesPerDay(habits), [habits]);
  
  const todayGuardSessions = useMemo(
    () => getTodayGuardSessions(guardSessions),
    [guardSessions]
  );
  
  const protectedMinutesToday = useMemo(() => {
    return todayGuardSessions.reduce((total, session) => {
      return total + normalizeMinutes(session.actualDuration);
    }, 0);
  }, [todayGuardSessions]);

  const yearlyMinutes = totalMinutesPerDay * 365;
  const tenYearMinutes = totalMinutesPerDay * 3650;
  const canAddCustomHabit = customName.trim().length > 0 && normalizeMinutes(customMinutes) > 0;

  const sleepHours = dayMode === "standard" ? STANDARD_SLEEP_HOURS : customSleepHours;
  const workHours = dayMode === "standard" ? STANDARD_WORK_HOURS : customWorkHours;
  const dayBreakdown = buildDayBreakdown({
    sleepHours,
    workHours,
    leakMinutes: totalMinutesPerDay,
  });



const availableMinutesToday = Math.round(dayBreakdown.availableFreeHours * 60);

const leakedMinutesToday = Math.min(
  totalMinutesPerDay,
  availableMinutesToday
);

const cappedProtectedMinutesToday = Math.min(
  protectedMinutesToday,
  Math.max(0, availableMinutesToday - leakedMinutesToday)
);

const undecidedMinutesToday = Math.max(
  0,
  availableMinutesToday - leakedMinutesToday - cappedProtectedMinutesToday
);

const protectedShare =
  availableMinutesToday === 0
    ? 0
    : Math.min(cappedProtectedMinutesToday / availableMinutesToday, 1);

const nonLeakedShare =
  availableMinutesToday === 0
    ? 1
    : Math.max(0, 1 - leakedMinutesToday / availableMinutesToday);

const hasLeakData = totalMinutesPerDay > 0;
const hasProtectedData = cappedProtectedMinutesToday > 0;
const hasGuardData = hasLeakData || hasProtectedData;

const timeControlScore = hasGuardData
? Math.round(protectedShare * 60 + nonLeakedShare * 40)
: null;

const recommendedGuardMinutes = 45;

const rawPotentialGain =
  availableMinutesToday === 0
    ? 0
    : Math.round((recommendedGuardMinutes / availableMinutesToday) * 60);

const potentialGain =
  timeControlScore === null
    ? null
    : Math.min(rawPotentialGain, 100 - timeControlScore);

const potentialScore =
  timeControlScore === null
    ? null
    : Math.min(100, timeControlScore + potentialGain);

const timeControlLabel = hasGuardData
  ? getTimeControlLabel(timeControlScore)
  : "Diagnostic en attente";

const timeControlMessage = hasGuardData
  ? getTimeControlMessage(timeControlScore)
  : "Ajoute une fuite ou protège une zone pour calculer ton Guard Score.";

  const daySegments = [
  { label: "Sommeil", value: dayBreakdown.sleepHours, color: "#0A043B" },
  { label: "Travail", value: dayBreakdown.workHours, color: "#6366f1" },
  { label: "Fuites", value: leakedMinutesToday / 60, color: "#fb7185" },
  { label: "Temps protégé", value: cappedProtectedMinutesToday / 60, color: "#22c55e" },
  { label: "Temps à décider", value: undecidedMinutesToday / 60, color: "#FB82FF" },
];

  function addHabit(name, minutes) {
    const cleanName = String(name || "").trim();
    const cleanMinutes = normalizeMinutes(minutes);

    if (!cleanName || cleanMinutes <= 0) return;

    setHabits((current) => [
      ...current,
      {
        id: createId(),
        name: cleanName,
        minutes: cleanMinutes,
      },
    ]);

    setCustomName("");
    setCustomMinutes(30);
  }

  function removeHabit(id) {
    setHabits((current) => current.filter((habit) => habit.id !== id));
  }

  function clearHabits() {
    setHabits([]);
  }

  function buildShareText() {
    if (totalMinutesPerDay === 0) {
      return "J'ai effectué mon diagnostic Time Leak. Objectif : voir où mon temps m’échappe vraiment.";
    }
  
    return `Mon score de maîtrise du temps est de ${timeControlScore}/100. Je perds ${totalMinutesPerDay} min par jour dans des habitudes automatiques. Sur 10 ans, ça représente ${formatDuration(tenYearMinutes)}.`;
  }

  async function copyResultToClipboard() {
    const textToCopy = `Je perds ${totalMinutesPerDay} min par jour dans des habitudes automatiques. Sur 10 ans, ça représente ${formatDuration(tenYearMinutes)}.`;
  
    try {
      await navigator.clipboard.writeText(textToCopy);
  
      setShowCopiedToast(true);
  
      window.setTimeout(() => {
        setShowCopiedToast(false);
      }, 2200);
    } catch (error) {
      console.error("Impossible de copier le résultat", error);
    }
  }

  function getShareUrl() {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }
  
  function getEncodedShareText() {
    return encodeURIComponent(buildShareText());
  }
  
  function getEncodedShareUrl() {
    return encodeURIComponent(getShareUrl());
  }
  
  async function openNativeShare() {
    const shareData = {
      title: "Time Leak Calculator",
      text: buildShareText(),
      url: getShareUrl(),
    };
  
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Partage annulé ou impossible", error);
      }
    } else {
      setShowShareModal(true);
    }
  }

  if (currentView === "guard-one") {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="fixed left-4 top-4 z-50">
          <button
            type="button"
            onClick={() => setCurrentView("calculator")}
            className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
          >
            ← Retour au diagnostic
          </button>
        </div>

        <GuardOne />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 md:py-16">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div>
          <div className="text-center md:text-left">
  <div className="flex justify-center md:justify-start">
    <ProductBadge />
  </div>

            <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
              <span className="text-white">Tu ne manques pas de temps, tu le laisses s'échapper.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-300">
              Ajoute une habitude, indique combien de minutes elle te coûte chaque jour,
              et découvre ce que cette fuite représente vraiment sur une semaine, un mois, un an ou dix ans.
            </p>
            </div>
                  <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
        <button
          type="button"
          onClick={() => setCurrentView("guard-one")}
          className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-neutral-950 transition hover:bg-neutral-200"
        >
          Activer Guard One
        </button>

        <button
          type="button"
          className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
        >
            Découvrir mon Guard Score
          </button>
          <div className="mt-8 rounded-[2rem] border border-indigo-500/20 bg-gradient-to-br from-neutral-950 via-indigo-950/30 to-neutral-950 p-6 shadow-2xl shadow-indigo-950/20">
  <div className="flex items-center justify-between gap-4">
    <p className="text-xs font-black uppercase tracking-[0.28em] text-indigo-300">
      Aujourd’hui
    </p>

    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-neutral-300">
      Guard Status
    </span>
  </div>

  <div className="mt-8">
    <p className="text-7xl font-black leading-none tracking-tight text-white md:text-8xl">
      {formatMinutesAsHoursMinutes(undecidedMinutesToday)}
    </p>

    <p className="mt-2 text-2xl font-black text-neutral-400">
      à décider
    </p>
  </div>

  <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
    Sur les{" "}
    <span className="font-black text-white">
      {formatMinutesAsHoursMinutes(availableMinutesToday)}
    </span>{" "}
    disponibles aujourd’hui, tu as laissé fuir{" "}
    <span className="font-black text-rose-300">
      {leakedMinutesToday} min
    </span>{" "}
    et tu as protégé{" "}
    <span className="font-black text-emerald-300">
      {cappedProtectedMinutesToday} min
    </span>
    .
  </p>

  <div className="mt-6 overflow-hidden rounded-full bg-white/10">
    <div className="flex h-4 w-full">
      <div
        className="bg-rose-400"
        style={{
          width: `${
            availableMinutesToday === 0
              ? 0
              : (leakedMinutesToday / availableMinutesToday) * 100
          }%`,
        }}
      />

      <div
        className="bg-emerald-400"
        style={{
          width: `${
            availableMinutesToday === 0
              ? 0
              : (cappedProtectedMinutesToday / availableMinutesToday) * 100
          }%`,
        }}
      />

      <div
        className="bg-gradient-to-r from-indigo-500 to-violet-500"
        style={{
          width: `${
            availableMinutesToday === 0
              ? 0
              : (undecidedMinutesToday / availableMinutesToday) * 100
          }%`,
        }}
      />
    </div>
  </div>

  <div className="mt-4 grid gap-3 sm:grid-cols-3">
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
        Fuites
      </p>
      <p className="mt-2 text-2xl font-black text-rose-300">
        {leakedMinutesToday} min
      </p>
    </div>

    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
        Protégé
      </p>
      <p className="mt-2 text-2xl font-black text-emerald-300">
        {cappedProtectedMinutesToday} min
      </p>
    </div>

    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
        Disponible
      </p>
      <p className="mt-2 text-2xl font-black text-indigo-300">
        {formatMinutesAsHoursMinutes(availableMinutesToday)}
      </p>
    </div>
  </div>

  <div className="mt-6 flex flex-wrap items-center gap-3">
    <button
      type="button"
      onClick={() => setCurrentView("guard-one")}
      className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-neutral-950 transition hover:bg-neutral-200"
    >
      Protéger une zone maintenant
    </button>

    <p className="text-sm font-medium text-neutral-500">
      Ce que tu ne protèges pas finit souvent par être perdu.
    </p>
  </div>
</div>
        </div>

          </div>

          <Card className="border-indigo-500/20 bg-gradient-to-br from-white via-indigo-50 to-indigo-100 text-neutral-950 shadow-2xl shadow-indigo-950/20">
  <CardContent className="p-6">
    <div className="flex items-center justify-between gap-3">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-indigo-700">
        Next Guard Move
      </p>

      <span className="rounded-full bg-neutral-950 px-3 py-1 text-xs font-black text-white">
        +{potentialGain ?? "—"} pts
      </span>
    </div>

    <div className="mt-8">
      <p className="text-6xl font-black leading-none tracking-tight">
        {recommendedGuardMinutes}
        <span className="ml-2 text-2xl">min</span>
      </p>

      <p className="mt-2 text-lg font-black text-neutral-500">
        à optimiser dès maintenant
      </p>
    </div>

    <div className="mt-6 rounded-3xl bg-white/70 p-4">
      <p className="text-sm font-bold text-neutral-500">
        Récompense potentielle
      </p>

      <p className="mt-2 text-4xl font-black text-indigo-700">
        {potentialGain === null ? "—" : `+${potentialGain}`}
        <span className="text-lg text-neutral-500"> pts</span>
      </p>

      <p className="mt-2 text-sm text-neutral-500">
        Score potentiel :{" "}
        <span className="font-black text-neutral-950">
          {potentialScore === null ? "—" : potentialScore}/100
        </span>
      </p>
    </div>

    <p className="mt-5 text-sm leading-6 text-neutral-600">
      Protège une zone courte. La récompense dépend de la part de ton espace disponible que tu transformes en temps protégé.
    </p>

    <button
      type="button"
      onClick={() => setCurrentView("guard-one")}
      className="mt-6 w-full rounded-2xl bg-neutral-950 px-5 py-4 text-sm font-black text-white transition hover:bg-neutral-800"
    >
      Activer Guard One
    </button>

    <p className="mt-3 text-center text-xs font-medium text-neutral-500">
      Récompense estimée si la zone est complétée.
    </p>
  </CardContent>
</Card>
        </div>

        <Card className="border-indigo-500/20 bg-gradient-to-br from-neutral-950 via-indigo-950/90 to-violet-900/70 text-white shadow-2xl shadow-indigo-950/30 backdrop-blur">
          <CardContent className="p-6">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">
                  Journée type
                </div>

                <h2 className="text-2xl font-bold">Comment tes 24h se répartissent ?</h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-400">
                  Les fuites ne mangent pas toute ta journée. Elles attaquent surtout ton espace de manœuvre :
                  le temps qu’il te reste une fois le sommeil et le travail posés.
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-neutral-950 p-2">
                  <button
                    onClick={() => setDayMode("standard")}
                    className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                      dayMode === "standard"
                        ? "bg-white text-neutral-950"
                        : "text-neutral-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => setDayMode("custom")}
                    className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                      dayMode === "custom"
                        ? "bg-white text-neutral-950"
                        : "text-neutral-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Personnalisé
                  </button>
                </div>

                {dayMode === "custom" && (
                  <div className="mt-4 grid gap-4 rounded-3xl border border-white/10 bg-neutral-950 p-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="sleep-hours" className="text-sm font-medium text-neutral-300">
                        Sommeil par jour
                      </label>
                      <input
                        id="sleep-hours"
                        type="number"
                        min="0"
                        max="24"
                        step="0.5"
                        value={customSleepHours}
                        onChange={(event) => setCustomSleepHours(event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/30"
                      />
                    </div>

                    <div>
                      <label htmlFor="work-hours" className="text-sm font-medium text-neutral-300">
                        Travail / obligations
                      </label>
                      <input
                        id="work-hours"
                        type="number"
                        min="0"
                        max="24"
                        step="0.5"
                        value={customWorkHours}
                        onChange={(event) => setCustomWorkHours(event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/30"
                      />
                    </div>
                  </div>
                )}

                {dayBreakdown.overflowHours > 0 && (
                  <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    Tes fuites dépassent ton temps disponible hors sommeil et travail de {formatHours(dayBreakdown.overflowHours)}.
                    Le graphique les limite donc à l’espace réellement disponible.
                  </div>
                )}

                <div className="mt-6 grid gap-3">
                  {daySegments.map((segment) => (
                    <div
                      key={segment.label}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: segment.color }}
                        />
                        <span className="font-medium">{segment.label}</span>
                      </div>
                      <span className="text-sm text-neutral-300">{formatHours(segment.value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <PieChart segments={daySegments} />

                <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
  <div className="flex items-end justify-between gap-4">
    <div>
      <p className="text-xs uppercase tracking-wide text-neutral-400">
        Guard Score
      </p>
      <p className="mt-2 text-5xl font-black">
       {timeControlScore === null ? "—" : timeControlScore}
<span className="text-xl text-neutral-500">/100</span>
      </p>
    </div>

    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-neutral-300">
      {timeControlLabel}
    </div>
  </div>

  <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
    <div
      className="h-full rounded-full bg-gradient-to-r from-rose-400 via-violet-500 to-indigo-500 transition-all"
      style={{ width: `${timeControlScore ?? 0}%` }}
    />
  </div>

  <p className="mt-3 text-sm text-neutral-400">
    {timeControlMessage}
  </p>
</div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-wide text-neutral-400">Fuites / temps libre</p>
                    <p className="mt-2 text-2xl font-black">
                      {dayBreakdown.availableFreeHours === 0
                        ? "0%"
                        : `${Math.round(dayBreakdown.leakShareOfFreeTime)}%`}
                    </p>
                    <p className="mt-1 text-sm text-neutral-400">de ton espace disponible</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-wide text-neutral-400">Temps libre restant</p>
                    <p className="mt-2 text-2xl font-black">{formatHours(dayBreakdown.remainingFreeHours)}</p>
                    <p className="mt-1 text-sm text-neutral-400">encore récupérable aujourd’hui</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="border-white/10 bg-white/5 text-white backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">Ajoute tes habitudes</h2>
                  <p className="mt-2 text-sm text-neutral-400">
                    Commence avec un exemple ou crée ton propre “leak”.
                  </p>
                </div>

                <button
                  onClick={clearHabits}
                  className="rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-neutral-300 transition hover:bg-white/10 hover:text-white"
                >
                  Reset
                </button>
              </div>

              <div className="mt-5 grid gap-3">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => addHabit(preset.name, preset.minutes)}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10"
                  >
                    <span className="font-medium">{preset.name}</span>
                    <span className="text-sm text-neutral-400">{preset.minutes} min/j</span>
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-white/10 bg-neutral-950 p-4">
                <label className="text-sm font-medium text-neutral-300" htmlFor="habit-name">
                  Habitude personnalisée
                </label>
                <input
                  id="habit-name"
                  value={customName}
                  onChange={(event) => setCustomName(event.target.value)}
                  placeholder="Ex : regarder mon téléphone au lit"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-neutral-500 focus:border-white/30"
                />

                <label className="mt-4 block text-sm font-medium text-neutral-300" htmlFor="habit-minutes">
                  Minutes par jour
                </label>
                <input
                  id="habit-minutes"
                  type="number"
                  min="1"
                  value={customMinutes}
                  onChange={(event) => setCustomMinutes(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/30"
                />

                <Button
                  onClick={() => addHabit(customName, customMinutes)}
                  disabled={!canAddCustomHabit}
                  className="mt-4 w-full rounded-2xl bg-white py-4 font-bold text-neutral-950 hover:bg-neutral-200"
                >
                  <span className="mr-2 text-lg">+</span>
                  Ajouter
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card className="border-white/10 bg-white/5 text-white backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">Tes fuites actuelles</h2>
                    <p className="mt-2 text-sm text-neutral-400">
                      {getImpactSentence(totalMinutesPerDay)}
                    </p>
                  </div>
                  <IconBadge className="h-5 w-5 text-lg text-neutral-400">✦</IconBadge>
                </div>

                <div className="mt-5 grid gap-3">
                  {habits.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-neutral-400">
                      Ajoute une habitude pour voir son impact.
                    </div>
                  ) : (
                    habits.map((habit) => (
                      <div
                        key={habit.id}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                      >
                        <div>
                          <p className="font-semibold">{habit.name}</p>
                          <p className="text-sm text-neutral-400">{habit.minutes} minutes par jour</p>
                        </div>
                        <button
                          onClick={() => removeHabit(habit.id)}
                          className="rounded-xl p-2 text-neutral-400 transition hover:bg-white/10 hover:text-white"
                          aria-label={`Supprimer ${habit.name}`}
                          title={`Supprimer ${habit.name}`}
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {PERIODS.map((period) => {
                const periodMinutes = totalMinutesPerDay * period.days;

                return (
                  <div
                    key={period.label}
                    className="rounded-3xl border border-white/10 bg-white p-5 text-neutral-950"
                  >
                    <p className="inline-flex rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-900">{period.label}</p>
                    <p className="mt-3 text-3xl font-black">{formatDuration(periodMinutes)}</p>
                    <p className="mt-2 text-sm text-neutral-500">{formatImpactLine(periodMinutes)}</p>
                  </div>
                );
              })}
            </div>

            <Card className="border-white/10 bg-white/5 text-white backdrop-blur">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold">Tu sais quoi ?</h2>
                <p className="mt-3 text-2xl font-black leading-snug md:text-3xl">
                  En 10 ans, ces habitudes peuvent te coûter {formatDuration(tenYearMinutes)}.
                </p>
                <p className="mt-3 text-neutral-400">
                  Ce n’est pas une impression. Ce sont des semaines, parfois des mois, qui disparaissent dans des habitudes que tu n’as même pas forcément choisies.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
  <button
    onClick={copyResultToClipboard}
    className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-neutral-950 transition hover:bg-neutral-200"
  >
    Copier mon résultat
  </button>

  <button
    type="button"
    onClick={() => setShowShareModal(true)}
    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
  >
    Partager
  </button>
</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {showShareModal && (
  <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 px-4 py-6 backdrop-blur-sm sm:items-center">
    <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-neutral-950 p-5 text-white shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
            Partage
          </p>
          <h3 className="mt-2 text-2xl font-black">
            Partage ton leak.
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setShowShareModal(false)}
          className="rounded-full border border-white/10 px-3 py-1 text-sm text-neutral-400 transition hover:bg-white/10 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-neutral-300">
        {buildShareText()}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={copyResultToClipboard}
          className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-neutral-950 transition hover:bg-neutral-200"
        >
          Copier le texte
        </button>

        <a
          href={`https://twitter.com/intent/tweet?text=${getEncodedShareText()}&url=${getEncodedShareUrl()}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10"
        >
          X / Twitter
        </a>

        <a
          href={`https://wa.me/?text=${getEncodedShareText()}%20${getEncodedShareUrl()}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10"
        >
          WhatsApp
        </a>

        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${getEncodedShareUrl()}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10"
        >
          LinkedIn
        </a>
      </div>
    </div>
  </div>
)}
    </main>
  );
}