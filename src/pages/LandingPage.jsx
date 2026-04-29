import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-16">
        <div className="max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-neutral-300">
            <span className="text-lg font-black text-white">G</span>
            <span>GUARD</span>
            <span className="h-1 w-1 rounded-full bg-neutral-600" />
            <span className="text-neutral-500">Beta</span>
          </div>

          <h1 className="max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
            Arrête de vivre par défaut.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300 md:text-xl">
            Guard révèle où ton temps fuit, mesure tes zones protégées et
            t’aide à décider ce que tu fais de l’espace qu’il te reste.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/app"
              className="rounded-2xl bg-white px-6 py-4 text-sm font-black text-neutral-950 transition hover:bg-neutral-200"
            >
              Découvrir mon Guard Score
            </Link>

            <a
              href="#method"
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-black text-white transition hover:bg-white/10"
            >
              Comprendre la méthode
            </a>
          </div>
        </div>

        <div
          id="method"
          className="mt-20 grid gap-4 md:grid-cols-3"
        >
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-300">
              Measure
            </p>
            <h2 className="mt-4 text-2xl font-black">Voir ce qui fuit.</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-400">
              Identifie les habitudes qui avalent ton espace disponible sans
              que tu t’en rendes compte.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
              Protect
            </p>
            <h2 className="mt-4 text-2xl font-black">Protéger ton temps.</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-400">
              Active Guard One et transforme une intention floue en zone
              protégée.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-300">
              Design
            </p>
            <h2 className="mt-4 text-2xl font-black">Décider du reste.</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-400">
              Recompose ta journée autour de ce qui mérite vraiment ton
              attention.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}