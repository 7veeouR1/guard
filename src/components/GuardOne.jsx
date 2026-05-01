import { useEffect, useState } from "react";

const sessionTypes = [
  "Deep Work",
  "Business",
  "Sport",
  "Apprentissage",
  "Admin",
  "Récupération",
];

const durations = [15, 25, 45, 60, 90];

const qualityMap = {
  Claire: 100,
  Correcte: 75,
  Dispersée: 45,
  Interrompue: 20,
};

const creditMultiplierMap = {
  Claire: 1,
  Correcte: 0.8,
  Dispersée: 0.5,
  Interrompue: 0.2,
};

export default function GuardOne() {
  const [step, setStep] = useState("setup");
  const [sessionType, setSessionType] = useState("Business");
  const [duration, setDuration] = useState(45);
  const [remainingSeconds, setRemainingSeconds] = useState(duration * 60);
  const [startedAt, setStartedAt] = useState(null);
  const [endedAt, setEndedAt] = useState(null);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const storedSessions = localStorage.getItem("guard_sessions");

    if (storedSessions) {
      setSessions(JSON.parse(storedSessions));
    }
  }, []);

  useEffect(() => {
    if (step !== "active") return;

    const interval = setInterval(() => {
      setRemainingSeconds((previousSeconds) => {
        if (previousSeconds <= 1) {
          clearInterval(interval);
          finishSession();
          return 0;
        }

        return previousSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  function startSession() {
    setRemainingSeconds(duration * 60);
    setStartedAt(new Date().toISOString());
    setEndedAt(null);
    setStep("active");
  }

  function finishSession() {
    setEndedAt(new Date().toISOString());
    setStep("review");
  }

  function saveSession(selectedQuality) {
    const finalEndedAt = endedAt || new Date().toISOString();

    const actualDuration = Math.max(
      1,
      Math.round(
        (new Date(finalEndedAt).getTime() - new Date(startedAt).getTime()) /
          1000 /
          60
      )
    );

    const creditsEarned = calculateCredits(actualDuration, selectedQuality);

    const newSession = {
      id: crypto.randomUUID(),
      type: sessionType,
      plannedDuration: duration,
      actualDuration,
      quality: selectedQuality,
      qualityScore: qualityMap[selectedQuality],
      startedAt,
      endedAt: finalEndedAt,
    };

    const updatedSessions = [newSession, ...sessions];

    setSessions(updatedSessions);
    localStorage.setItem("guard_sessions", JSON.stringify(updatedSessions));

    resetSession();
  }

  function resetSession() {
    setStep("setup");
    setRemainingSeconds(duration * 60);
    setStartedAt(null);
    setEndedAt(null);
  }

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  function calculateCredits(actualDuration, selectedQuality) {
    const multiplier = creditMultiplierMap[selectedQuality] || 0;
    return Math.round(actualDuration * multiplier);
  }

  function calculateSessionScore(session) {
    const durationRespect =
      Math.min(session.actualDuration / session.plannedDuration, 1) * 100;

    return Math.round(durationRespect * 0.4 + session.qualityScore * 0.6);
  }

  function getTodaySessions() {
    const today = new Date().toDateString();

    return sessions.filter((session) => {
      return new Date(session.startedAt).toDateString() === today;
    });
  }

  function getTodayStats() {
    const todaySessions = getTodaySessions();

    const protectedTime = todaySessions.reduce((total, session) => {
      return total + session.actualDuration;
    }, 0);

    const creditsToday = todaySessions.reduce((total, session) => {
      return total + (session.creditsEarned || 0);
    }, 0);

    const guardScore =
      todaySessions.length > 0
        ? Math.round(
            todaySessions.reduce((total, session) => {
              return total + calculateSessionScore(session);
            }, 0) / todaySessions.length
          )
        : 0;

    return {
      protectedTime,
      creditsToday,
      sessionsCount: todaySessions.length,
      guardScore,
    };
  }

  function clearHistory() {
    localStorage.removeItem("guard_sessions");
    setSessions([]);
  }

  const stats = getTodayStats();
  const todaySessions = getTodaySessions();

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        {step === "setup" && (
          <section style={styles.section}>
            <div>
              <p style={styles.kicker}>Guard One</p>
              <h1 style={styles.title}>Déclare une zone protégée.</h1>
              <p style={styles.subtitle}>
                Pendant cette session, ton temps n’est plus disponible pour le
                bruit.
              </p>
            </div>

            <TodayStats stats={stats} />

            <div style={styles.block}>
              <h2 style={styles.blockTitle}>
                Que veux-tu protéger maintenant ?
              </h2>

              <div style={styles.grid}>
                {sessionTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSessionType(type)}
                    style={{
                      ...styles.choiceButton,
                      ...(sessionType === type ? styles.choiceButtonActive : {}),
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.block}>
              <h2 style={styles.blockTitle}>
                Combien de temps veux-tu protéger ?
              </h2>

              <div style={styles.durationRow}>
                {durations.map((value) => (
                  <button
                    key={value}
                    onClick={() => {
                      setDuration(value);
                      setRemainingSeconds(value * 60);
                    }}
                    style={{
                      ...styles.durationButton,
                      ...(duration === value ? styles.durationButtonActive : {}),
                    }}
                  >
                    {value} min
                  </button>
                ))}
              </div>
            </div>

            <button onClick={startSession} style={styles.primaryButton}>
              Activer Guard
            </button>

            {todaySessions.length > 0 && (
              <div style={styles.historyBlock}>
                <div style={styles.historyHeader}>
                  <h2 style={styles.blockTitle}>Historique du jour</h2>
                  <button onClick={clearHistory} style={styles.clearButton}>
                    Effacer
                  </button>
                </div>

                <div style={styles.historyList}>
                  {todaySessions.map((session) => (
                    <div key={session.id} style={styles.historyItem}>
                      <div>
                        <strong>{session.type}</strong>
                        <p style={styles.historyMeta}>
                          {session.actualDuration} min · {session.quality} · +{session.creditsEarned || 0} credits
                        </p>
                      </div>
                      <div style={styles.sessionScore}>
                        {calculateSessionScore(session)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {step === "active" && (
          <section style={styles.activeSection}>
            <p style={styles.kicker}>Zone protégée active</p>

            <h1 style={styles.activeType}>{sessionType}</h1>

            <div style={styles.timer}>{formatTime(remainingSeconds)}</div>

            <p style={styles.activeText}>
              Reste dans le bloc. Une décision protégée vaut mieux qu’une
              journée subie.
            </p>

            <button onClick={finishSession} style={styles.stopButton}>
              Terminer la zone
            </button>
          </section>
        )}

        {step === "review" && (
          <section style={styles.reviewSection}>
            <p style={styles.kicker}>Zone terminée</p>

            <h1 style={styles.title}>Tu as protégé ton temps.</h1>

            <p style={styles.subtitle}>
              Comment était la qualité de cette zone ?
            </p>

            <div style={styles.grid}>
              {Object.keys(qualityMap).map((quality) => (
                <button
                  key={quality}
                  onClick={() => saveSession(quality)}
                  style={styles.choiceButton}
                >
                  {quality}
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function TodayStats({ stats }) {
  return (
    <section style={styles.statsCard}>
      <p style={styles.statsKicker}>Aujourd’hui</p>

      <div style={styles.statsGrid}>
        <div>
          <p style={styles.statsValue}>{stats.guardScore}</p>
          <p style={styles.statsLabel}>Guard Score</p>
        </div>

        <div>
          <p style={styles.statsValue}>{stats.protectedTime}</p>
          <p style={styles.statsLabel}>Minutes protégées</p>
        </div>

        <div>
          <p style={styles.statsValue}>{stats.creditsToday}</p>
          <p style={styles.statsLabel}>Guard Credits</p>
        </div>
      </div>
    </section>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, #1f1f1f 0%, #050505 45%, #000 100%)",
    color: "white",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
    padding: "40px 20px",
  },

  container: {
    maxWidth: "860px",
    margin: "0 auto",
  },

  section: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
  },

  kicker: {
    textTransform: "uppercase",
    letterSpacing: "0.28em",
    color: "rgba(255,255,255,0.45)",
    fontSize: "12px",
    margin: "0 0 16px",
  },

  title: {
    fontSize: "clamp(40px, 7vw, 72px)",
    lineHeight: "0.95",
    margin: 0,
    letterSpacing: "-0.06em",
  },

  subtitle: {
    fontSize: "18px",
    lineHeight: "1.6",
    color: "rgba(255,255,255,0.68)",
    maxWidth: "620px",
    margin: "20px 0 0",
  },

  block: {
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "28px",
    padding: "24px",
  },

  blockTitle: {
    margin: "0 0 18px",
    fontSize: "20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "12px",
  },

  choiceButton: {
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    borderRadius: "20px",
    padding: "18px",
    fontSize: "16px",
    textAlign: "left",
    cursor: "pointer",
  },

  choiceButtonActive: {
    background: "white",
    color: "black",
    borderColor: "white",
  },

  durationRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },

  durationButton: {
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    borderRadius: "999px",
    padding: "14px 20px",
    fontSize: "15px",
    cursor: "pointer",
  },

  durationButtonActive: {
    background: "white",
    color: "black",
    borderColor: "white",
  },

  primaryButton: {
    width: "100%",
    border: "none",
    background: "white",
    color: "black",
    borderRadius: "24px",
    padding: "22px",
    fontSize: "18px",
    fontWeight: "800",
    cursor: "pointer",
  },

  statsCard: {
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "28px",
    padding: "24px",
  },

  statsKicker: {
    textTransform: "uppercase",
    letterSpacing: "0.24em",
    color: "rgba(255,255,255,0.42)",
    fontSize: "12px",
    margin: "0 0 20px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
  },

  statsValue: {
    fontSize: "36px",
    fontWeight: "900",
    margin: 0,
    letterSpacing: "-0.05em",
  },

  statsLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: "13px",
    margin: "6px 0 0",
  },

  activeSection: {
    minHeight: "78vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },

  activeType: {
    fontSize: "28px",
    margin: "10px 0 0",
  },

  timer: {
    fontSize: "clamp(84px, 18vw, 170px)",
    fontWeight: "950",
    letterSpacing: "-0.08em",
    margin: "34px 0",
  },

  activeText: {
    color: "rgba(255,255,255,0.62)",
    maxWidth: "460px",
    fontSize: "18px",
    lineHeight: "1.6",
    margin: "0 0 34px",
  },

  stopButton: {
    border: "1px solid rgba(255,255,255,0.24)",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    borderRadius: "999px",
    padding: "16px 24px",
    fontSize: "16px",
    cursor: "pointer",
  },

  reviewSection: {
    minHeight: "78vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "26px",
  },

  historyBlock: {
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "28px",
    padding: "24px",
  },

  historyHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },

  clearButton: {
    border: "1px solid rgba(255,255,255,0.14)",
    background: "transparent",
    color: "rgba(255,255,255,0.7)",
    borderRadius: "999px",
    padding: "8px 12px",
    cursor: "pointer",
  },

  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  historyItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.22)",
    borderRadius: "18px",
    padding: "14px 16px",
  },

  historyMeta: {
    margin: "4px 0 0",
    color: "rgba(255,255,255,0.5)",
    fontSize: "14px",
  },

  sessionScore: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "white",
    color: "black",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
  },
};