import { supabase } from "./supabaseClient";

function safeJsonParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error("Impossible de parser le JSON local", error);
    return fallback;
  }
}

export async function syncLocalGuardDataToSupabase(userId) {
  if (!userId) return;

  const localAudit = safeJsonParse(localStorage.getItem("guard_audit"), null);
  const localSessions = safeJsonParse(localStorage.getItem("guard_sessions"), []);

  if (localAudit?.profile) {
    const { error: profileError } = await supabase
      .from("guard_profiles")
      .upsert(
        {
          user_id: userId,
          profile_name: localAudit.profile.profileName,
          profile_description: localAudit.profile.profileDescription,
          priority: localAudit.profile.priority,
          priority_label: localAudit.profile.priorityLabel,
          recommended_minutes: localAudit.profile.recommendedMinutes,
          answers_json: localAudit.answers || {},
          profile_json: localAudit.profile || {},
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      );

    if (profileError) {
      console.error("Erreur sync guard_profiles:", profileError);
    }
  }

  if (Array.isArray(localSessions) && localSessions.length > 0) {
    const sessionsToSave = localSessions.map((session) => ({
      user_id: userId,
      local_id: String(session.id),
      type: session.type,
      planned_duration: session.plannedDuration,
      actual_duration: session.actualDuration,
      quality: session.quality,
      quality_score: session.qualityScore,
      credits_earned: session.creditsEarned || 0,
      started_at: session.startedAt,
      ended_at: session.endedAt,
    }));

    const { error: sessionsError } = await supabase
      .from("guard_sessions")
      .upsert(sessionsToSave, {
        onConflict: "user_id,local_id",
      });

    if (sessionsError) {
      console.error("Erreur sync guard_sessions:", sessionsError);
    }
  }
}

export async function loadGuardDataFromSupabase(userId) {
  if (!userId) return;

  const { data: profileData, error: profileError } = await supabase
    .from("guard_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (profileError) {
    console.error("Erreur chargement guard_profiles:", profileError);
  }

  const { data: sessionsData, error: sessionsError } = await supabase
    .from("guard_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("started_at", { ascending: false });

  if (sessionsError) {
    console.error("Erreur chargement guard_sessions:", sessionsError);
  }

  return {
    profile: profileData,
    sessions: sessionsData || [],
  };
}