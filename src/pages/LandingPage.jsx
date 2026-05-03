import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* HERO */}
      <section className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-[0.95fr_1.05fr]">
        {/* Texte hero */}
        <div className="text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-neutral-300">
            <span className="text-lg font-black text-white">G</span>
            <span>GUARD</span>
            <span className="h-1 w-1 rounded-full bg-neutral-600" />
            <span className="text-neutral-500">Beta</span>
          </div>

          <h1 className="text-5xl font-black tracking-tight md:text-7xl">
            Arrête de vivre par défaut.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-300 md:text-xl lg:mx-0">
          Ton temps est soit consommé, soit investi.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
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

        {/* Image hero à droite */}
        <div className="relative">
          <div className="absolute inset-0 rounded-[2rem] bg-indigo-600/20 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2rem] border border-indigo-500/20 bg-white/5 shadow-2xl shadow-indigo-950/40">
            <img
              src="/guard_dashboard.png"
              alt="Interface Guard sur desktop avec le tableau de bord Aujourd’hui"
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>

{/* VISUS HUMAINS */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16">
  <div className="mb-12 max-w-3xl">
    <p className="text-xs font-black uppercase tracking-[0.22em] text-indigo-300">
      Guard dans la vraie vie
    </p>
    <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
      Le temps investi ne sert pas à faire plus.
      Il sert à vivre mieux.
    </h2>
    <p className="mt-4 text-lg leading-8 text-neutral-400">
      Guard ne mesure pas seulement ce que tu perds.
      Il t’aide à récupérer de l’espace pour ton focus, ta présence et ton énergie.
    </p>
  </div>

  <div className="grid gap-6">
    <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10">
      <img
        src="/guard_friends_banner.png"
        alt="Personne active incarnant une vie plus intentionnelle"
        className="h-[420px] w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-8 md:p-10">
        <div className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur">
          Temps précieux
        </div>
        <h3 className="max-w-3xl text-3xl font-black leading-tight md:text-5xl">
          Ne te contente pas d’être occupé.
          Redeviens disponible pour ce qui compte.
        </h3>
      </div>
    </div>

    <div className="grid gap-6 md:grid-cols-2">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10">
        <img
          src="/guard_focus.png"
          alt="Moment de concentration et de calme"
          className="h-[520px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <div className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur">
            Focus
          </div>
          <h3 className="max-w-md text-3xl font-light leading-tight md:text-4xl">
            Capitalise sur tes heures utiles. Les plus productives.
          </h3>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-white/10">
        <img
          src="/guard_health.png"
          alt="Moment de présence et de qualité de vie"
          className="h-[520px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <div className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur">
            Présence
          </div>
          <h3 className="max-w-md text-3xl font-light leading-tight md:text-4xl">
            Ce que tu mets en place aujourd’hui façonne demain.
          </h3>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* METHODE */}
      <section
        id="method"
        className="mx-auto w-full max-w-6xl px-5 py-16"
      >
        <div className="mb-10 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-indigo-300">
            La méthode Guard
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
            Voir. Protéger. Décider.
          </h2>
          <p className="mt-4 text-lg leading-8 text-neutral-400">
            Une méthode simple pour transformer une journée floue en système
            visible.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
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

      {/* MOBILE / GUARD ONE */}
      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-300">
            Guard One
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
            Transforme une intention en zone protégée.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-neutral-400">
            Lance une session, protège ton attention, puis laisse Guard
            mesurer ce que tu reprends réellement.
          </p>

          <Link
            to="/app"
            className="mt-8 inline-flex rounded-2xl bg-white px-6 py-4 text-sm font-black text-neutral-950 transition hover:bg-neutral-200"
          >
            Activer Guard One
          </Link>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-[2rem] bg-violet-600/20 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2rem] border border-violet-500/20 bg-white/5 shadow-2xl shadow-violet-950/40">
            <img
              src="/guard_mobile.png"
              alt="Interface Guard One mobile avec zone protégée et progression"
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-20">
  <div className="overflow-hidden rounded-[2.5rem] border border-indigo-500/20 bg-gradient-to-br from-neutral-950 via-indigo-950/40 to-neutral-950 p-8 text-center shadow-2xl shadow-indigo-950/30 md:p-14">
    <p className="text-xs font-black uppercase tracking-[0.24em] text-indigo-300">
      Commencer maintenant
    </p>

    <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
      Tu ne peux pas protéger ce que tu ne vois pas.
    </h2>

    <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-neutral-300">
      Découvre ton Guard Score, identifie tes fuites de temps et lance ta première zone protégée.
    </p>

    <div className="mt-8 flex justify-center">
      <Link
        to="/app"
        className="rounded-2xl bg-white px-7 py-4 text-sm font-black text-neutral-950 transition hover:bg-neutral-200"
      >
        Découvrir mon Guard Score
      </Link>
    </div>

    <p className="mt-4 text-sm text-neutral-500">
      Bêta gratuite — aucun compte nécessaire pour tester.
    </p>
  </div>
</section>

    </main>
  );
}