import { useState } from "react";

const AUDIT_QUESTIONS = [
  {
    id: "main_problem",
    question: "Aujourd’hui, ton plus gros problème avec le temps, c’est plutôt :",
    options: [
      { label: "Je procrastine avant de commencer", value: "startup_friction" },
      { label: "Je me fais aspirer par mon téléphone", value: "attention_leak" },
      { label: "Mes journées sont trop fragmentées", value: "fragmentation" },
      { label: "Je n’arrive pas à protéger mes projets perso", value: "priority_leak" },
      { label: "Je manque d’énergie / je suis fatigué", value: "energy_leak" },
    ],
  },
  {
    id: "free_time_shape",
    question: "Ton temps libre ressemble le plus souvent à :",
    options: [
      { label: "Un vrai bloc exploitable", value: "large_block" },
      { label: "Quelques créneaux de 30 à 60 min", value: "medium_blocks" },
      { label: "Plein de petits morceaux", value: "fragmented" },
      { label: "Je ne sais même pas où il passe", value: "unclear" },
    ],
  },
  {
    id: "main_leak",
    question: "Ta fuite la plus fréquente, c’est plutôt :",
    options: [
      { label: "Réseaux sociaux", value: "social_scroll" },
      { label: "YouTube / Netflix", value: "passive_content" },
      { label: "Messages / notifications", value: "interruptions" },
      { label: "Snooze / réveil difficile", value: "morning_leak" },
      { label: "Hésitation / manque de clarté", value: "decision_leak" },
      { label: "Fatigue / récupération passive", value: "recovery_leak" },
    ],
  },
  {
    id: "priority",
    question: "Ce que tu veux protéger en priorité :",
    options: [
      { label: "Business / argent", value: "business" },
      { label: "Sport / santé", value: "sport" },
      { label: "Création", value: "creation" },
      { label: "Formation / apprentissage", value: "learning" },
      { label: "Vie sociale / présence", value: "presence" },
      { label: "Repos réel", value: "recovery" },
    ],
  },
  {
    id: "daily_goal",
    question: "Ton objectif réaliste pour les 7 prochains jours :",
    options: [
      { label: "Protéger 15 min par jour", value: 15 },
      { label: "Protéger 25 min par jour", value: 25 },
      { label: "Protéger 45 min par jour", value: 45 },
      { label: "D’abord comprendre où mon temps part", value: 0 },
    ],
  },
];

function buildGuardProfile(answers) {
  const mainProblem = answers.main_problem;
  const mainLeak = answers.main_leak;
  const freeTimeShape = answers.free_time_shape;
  const priority = answers.priority;
  const dailyGoal = Number(answers.daily_goal) || 25;

  let profileName = "Profil à clarifier";
  let profileDescription =
    "Ton système manque encore de données. Commence par protéger une première zone courte.";

  if (mainProblem === "attention_leak" || mainLeak === "social_scroll" || mainLeak === "passive_content") {
    profileName = "Fuite d’attention";
    profileDescription =
      "Ton temps ne disparaît pas d’un coup : il se fragmente dans les contenus, les scrolls et les transitions non protégées.";
  }

  if (mainProblem === "startup_friction" || mainLeak === "decision_leak") {
    profileName = "Fuite de démarrage";
    profileDescription =
      "Le point critique n’est pas seulement l’exécution. C’est le moment avant de commencer, quand l’énergie se disperse.";
  }

  if (mainProblem === "fragmentation" || freeTimeShape === "fragmented") {
    profileName = "Temps fragmenté";
    profileDescription =
      "Tu peux avoir du temps disponible, mais sous une forme trop éclatée pour vraiment avancer sans système.";
  }

  if (mainProblem === "energy_leak" || mainLeak === "recovery_leak") {
    profileName = "Fuite d’énergie";
    profileDescription =
      "Ton temps disponible existe, mais il arrive souvent au mauvais moment : quand ton énergie est déjà trop basse.";
  }

  const priorityLabels = {
    business: "Business",
    sport: "Sport",
    creation: "Création",
    learning: "Apprentissage",
    presence: "Présence",
    recovery: "Récupération",
  };

  return {
    profileName,
    profileDescription,
    mainLeak,
    freeTimeShape,
    priority,
    priorityLabel: priorityLabels[priority] || "Temps important",
    recommendedMinutes: dailyGoal > 0 ? dailyGoal : 25,
    createdAt: new Date().toISOString(),
  };
}

export default function GuardAudit({ onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const currentQuestion = AUDIT_QUESTIONS[currentQuestionIndex];
  const progress = Math.round(((currentQuestionIndex + 1) / AUDIT_QUESTIONS.length) * 100);

  function selectAnswer(questionId, value) {
    const nextAnswers = {
      ...answers,
      [questionId]: value,
    };

    setAnswers(nextAnswers);

    const isLastQuestion = currentQuestionIndex === AUDIT_QUESTIONS.length - 1;

    if (isLastQuestion) {
      const profile = buildGuardProfile(nextAnswers);

      const auditData = {
        answers: nextAnswers,
        profile,
        completedAt: new Date().toISOString(),
      };

      localStorage.setItem("guard_audit", JSON.stringify(auditData));
      onComplete(auditData);
      return;
    }

    setCurrentQuestionIndex((index) => index + 1);
  }

  function goBack() {
    setCurrentQuestionIndex((index) => Math.max(0, index - 1));
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-5 py-12">
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-indigo-300">
              Audit Guard
            </p>

            <p className="text-sm font-bold text-neutral-500">
              {currentQuestionIndex + 1}/{AUDIT_QUESTIONS.length}
            </p>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-neutral-950 via-indigo-950/30 to-neutral-950 p-6 shadow-2xl shadow-indigo-950/20 md:p-8">
          <h1 className="text-3xl font-black tracking-tight md:text-5xl">
            {currentQuestion.question}
          </h1>

          <div className="mt-8 grid gap-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => selectAnswer(currentQuestion.id, option.value)}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left text-base font-bold text-white transition hover:border-indigo-400/40 hover:bg-white/10"
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={currentQuestionIndex === 0}
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-neutral-400 transition hover:bg-white/10 disabled:opacity-30"
            >
              ← Retour
            </button>

            <p className="text-sm text-neutral-500">
              2 minutes pour calibrer ton système.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}