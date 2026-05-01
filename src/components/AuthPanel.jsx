import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AuthPanel({ onAuthSuccess }) {
  const [mode, setMode] = useState("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");

  const isSignup = mode === "signup";

  async function handleSubmit(event) {
    event.preventDefault();

    setStatusMessage("");
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Ajoute ton email et ton mot de passe.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (isSignup && username.trim().length < 2) {
        setErrorMessage("Ajoute un nom d’utilisateur d’au moins 2 caractères.");
        return;
      }

    setIsLoading(true);

    try {
        const response = isSignup
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                username: username.trim(),
              },
            },
          })
        : await supabase.auth.signInWithPassword({
            email,
            password,
          });

      if (response.error) {
        setErrorMessage(response.error.message);
        return;
      }

      setStatusMessage(
        isSignup
          ? "Espace Guard créé. Vérifie ton email si une confirmation est demandée."
          : "Connexion réussie."
      );

      if (onAuthSuccess) {
        onAuthSuccess(response.data.session, response.data.user);
      }
    } catch (error) {
      setErrorMessage("Une erreur est survenue. Réessaie dans un instant.");
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-[2rem] border border-indigo-500/20 bg-gradient-to-br from-neutral-950 via-indigo-950/40 to-neutral-950 p-6 shadow-2xl shadow-indigo-950/30 md:p-8">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-indigo-300">
        Espace Guard
      </p>

      <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-4xl">
        {isSignup ? "Créer mon espace Guard" : "Me connecter"}
      </h2>

      <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-400">
        Sauvegarde ton profil, ton historique, tes zones protégées et ton
        Capital Guard.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
      {isSignup && (
  <div>
    <label
      className="text-sm font-bold text-neutral-300"
      htmlFor="username"
    >
      Nom d’utilisateur
    </label>

    <input
      id="username"
      type="text"
      autoComplete="username"
      value={username}
      onChange={(event) => setUsername(event.target.value)}
      placeholder="Ex : Kevin"
      className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-neutral-600 focus:border-indigo-400/60"
    />
  </div>
)}
        <div>
          <label className="text-sm font-bold text-neutral-300" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="toi@email.com"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-neutral-600 focus:border-indigo-400/60"
          />
        </div>

        <div>
          <label
            className="text-sm font-bold text-neutral-300"
            htmlFor="password"
          >
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimum 6 caractères"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-neutral-600 focus:border-indigo-400/60"
          />
        </div>

        {errorMessage && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </div>
        )}

        {statusMessage && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {statusMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-2xl bg-white px-5 py-4 text-sm font-black text-neutral-950 transition hover:bg-neutral-200 disabled:opacity-60"
        >
          {isLoading
            ? "Chargement..."
            : isSignup
              ? "Créer mon espace Guard"
              : "Me connecter"}
        </button>
      </form>

      <div className="mt-5 text-center">
        <button
          type="button"
          onClick={() => {
            setMode(isSignup ? "signin" : "signup");
            setStatusMessage("");
            setErrorMessage("");
          }}
          className="text-sm font-bold text-neutral-400 underline decoration-white/20 underline-offset-4 transition hover:text-white"
        >
          {isSignup
            ? "J’ai déjà un espace Guard"
            : "Créer un nouvel espace Guard"}
        </button>
      </div>
    </div>
  );
}