import { useMemo, useState } from "react";

const procedures = [
  { name: "Aumento de senos", price: 5500 },
  { name: "Liposucción", price: 6800 },
  { name: "Gluteoplastia", price: 7200 },
  { name: "Transferencia de grasa", price: 7900 },
  { name: "Abdominoplastia", price: 8400 },
  { name: "Levantamiento de glúteos", price: 6900 },
  { name: "Marcación abdominal", price: 5800 },
  { name: "Mastopexia", price: 6100 },
];

export default function App() {
  const [selected, setSelected] = useState<string[]>([]);
  const [blockedProcedure, setBlockedProcedure] = useState<string | null>(null);
  const [showLimitMessage, setShowLimitMessage] = useState(false);

  const totalApprox = useMemo(() => {
    return procedures
      .filter((p) => selected.includes(p.name))
      .reduce((sum, p) => sum + p.price, 0);
  }, [selected]);

  const toggleProcedure = (name: string) => {
    if (selected.includes(name)) {
      setSelected((prev) => prev.filter((item) => item !== name));
      return;
    }

    if (selected.length >= 3) {
      setBlockedProcedure(name);
      setShowLimitMessage(true);

      window.clearTimeout((window as Window & { __limitTimer?: number }).__limitTimer);
      (window as Window & { __limitTimer?: number }).__limitTimer = window.setTimeout(() => {
        setBlockedProcedure(null);
        setShowLimitMessage(false);
      }, 1400);

      return;
    }

    setSelected((prev) => [...prev, name]);
  };

  const usd = (value: number) =>
    value.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-x-hidden">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.22),transparent_30%),radial-gradient(circle_at_right,rgba(56,189,248,0.16),transparent_28%),linear-gradient(180deg,#050816_0%,#090b1a_100%)]" />
      <div className="fixed inset-0 -z-10 opacity-25 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div className="w-[300px] shrink-0">
            <p className="text-sm md:text-base font-semibold uppercase tracking-[0.35em] text-cyan-300 whitespace-nowrap">
              Clínica estética
            </p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white whitespace-nowrap">
              Clínica Renacer
            </h1>
          </div>

          <nav className="hidden md:flex flex-1 justify-center items-center gap-8 text-lg font-semibold">
            <a className="nav-link px-6 py-3" href="#inicio">Inicio</a>
            <a className="nav-link px-6 py-3" href="#procedimientos">Procedimientos</a>
            <a className="nav-link px-6 py-3" href="#galeria">Galería</a>
            <a className="nav-link px-6 py-3" href="#contacto">Contacto</a>
          </nav>

          <div className="hidden md:block w-[300px] shrink-0" />
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <section id="inicio" className="py-20 md:py-28 scroll-mt-28">
          <div className="grid items-center gap-12 xl:grid-cols-[1.08fr_0.92fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
                  Clínica de medicina estética
                </span>
              </div>

              <h2 className="max-w-4xl text-6xl md:text-8xl font-black tracking-tight text-white">
                Clínica Renacer
              </h2>

              <p className="mt-5 text-3xl md:text-4xl font-semibold text-cyan-200">
                Doctor Miguel Mendoza
              </p>

              <p className="mt-8 max-w-2xl text-lg md:text-2xl leading-9 text-slate-300">
                Un espacio especializado en procedimientos corporales, atención personalizada y una experiencia moderna.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <a href="#contacto" className="btn-primary">
                  Agendar consulta
                </a>
                <a href="#procedimientos" className="btn-secondary">
                  Ver procedimientos
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-tr from-violet-600/20 via-cyan-500/15 to-transparent blur-2xl" />
              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
                <div className="aspect-[4/5] w-full rounded-[2rem] bg-black flex items-center justify-center text-lg text-white/45">
                  Espacio para la foto del doctor
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        <section className="py-20 md:py-28 scroll-mt-28">
          <div className="grid gap-6 lg:grid-cols-3">
            <article className="glass-card">
              <p className="section-kicker">Información</p>
              <h3 className="card-title">Sobre la clínica</h3>
              <p className="card-text">
                Clínica Renacer ofrece una experiencia estética elegante, segura y orientada a resultados naturales.
              </p>
            </article>

            <article className="glass-card">
              <p className="section-kicker">Atención</p>
              <h3 className="card-title">Consulta personalizada</h3>
              <p className="card-text">
                Cada paciente recibe valoración para definir los procedimientos más adecuados según sus objetivos.
              </p>
            </article>

            <article className="glass-card">
              <p className="section-kicker">Resultados</p>
              <h3 className="card-title">Enfoque premium</h3>
              <p className="card-text">
                Combinamos experiencia, estética y tecnología para lograr una atención moderna y profesional.
              </p>
            </article>
          </div>
        </section>

        <Separator glow="violet" />

        <section id="procedimientos" className="py-20 md:py-28 scroll-mt-28">
          <div className="mb-10">
            <p className="section-kicker">Procedimientos</p>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight">
              Servicios corporales disponibles
            </h3>
            <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-4xl">
              Selecciona máximo 3 procedimientos. El valor mostrado es aproximado y luego se confirma en consulta con el doctor.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {procedures.map((item) => {
              const active = selected.includes(item.name);
              const blocked = blockedProcedure === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => toggleProcedure(item.name)}
                  className={`procedure-card text-left transition-all duration-300 ${
                    active ? "ring-2 ring-cyan-400 bg-white/15" : ""
                  } ${blocked ? "ring-2 ring-red-500 bg-red-500/20 border-red-400/50" : ""}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-white">{item.name}</p>
                      <p className="mt-2 text-base text-slate-300">Valor aproximado</p>
                    </div>
                    <span className="rounded-full bg-black/30 px-3 py-1 text-sm font-bold text-cyan-200">
                      {usd(item.price)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {showLimitMessage && (
            <div className="mt-8 rounded-3xl border border-red-500/40 bg-red-500/10 p-5 md:p-6 text-red-100 backdrop-blur-xl">
              <p className="text-lg md:text-xl font-semibold">
                Máximo 3 procedimientos por consulta.
              </p>
              <p className="mt-2 text-base md:text-lg text-red-100/80">
                Para más información sobre combinaciones o procedimientos adicionales, consulta con el doctor.
              </p>
            </div>
          )}

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300 font-semibold">
                Precio aproximado
              </p>
              <h4 className="mt-2 text-4xl md:text-5xl font-black">
                {usd(totalApprox)}
              </h4>
              <p className="mt-3 text-base md:text-lg text-slate-300 max-w-2xl">
                Este valor es referencial y puede cambiar después de la consulta médica.
              </p>
            </div>

            <button className="btn-primary text-lg md:text-xl">
              Agendar consulta
            </button>
          </div>
        </section>

        <Separator />

        <section id="galeria" className="py-20 md:py-28 scroll-mt-28">
          <div className="mb-10">
            <p className="section-kicker">Galería</p>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight">Antes y después</h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="photo-card">
              <div className="photo-placeholder">Espacio para imagen antes</div>
            </div>

            <div className="photo-card">
              <div className="photo-placeholder">Espacio para imagen después</div>
            </div>
          </div>
        </section>

        <Separator glow="violet" />

        <section id="contacto" className="py-20 md:py-28 scroll-mt-28">
          <div className="grid gap-6 lg:grid-cols-2 items-stretch">
            <div className="contact-card">
              <p className="section-kicker">Contacto</p>
              <h3 className="text-4xl md:text-5xl font-black tracking-tight">Contáctanos</h3>

              <div className="mt-8 space-y-6 text-slate-300 leading-8 text-lg md:text-xl">
                <p><span className="font-semibold text-white">Ubicación:</span> Santiago de Chile</p>
                <p><span className="font-semibold text-white">Dirección:</span> Hernando De Aguirre 128, Consultorio 805, Edificio Copiapó, Providencia. Metro Tobalaba</p>
                <p><span className="font-semibold text-white">Correo:</span> contacto@clinicarenacer.com</p>
                <p><span className="font-semibold text-white">Teléfono:</span> +56 9 0000 0000</p>
              </div>
            </div>

            <div className="map-card">
              <iframe
                title="Ubicación Clínica Renacer"
                src="https://www.google.com/maps?q=Hernando%20De%20Aguirre%20128%20Consultorio%20805%20Edificio%20Copiap%C3%B3%20Providencia%20Metro%20Tobalaba%20Santiago%20de%20Chile&output=embed"
                className="h-[560px] w-full rounded-[1.3rem] border-0 grayscale-[0.1]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Separator({ glow = "cyan" }: { glow?: "cyan" | "violet" }) {
  const glowClass =
    glow === "cyan"
      ? "from-cyan-400/35 via-cyan-300/15 to-transparent"
      : "from-violet-400/35 via-violet-300/15 to-transparent";

  return (
    <div className="relative my-8 h-28 w-full overflow-visible">
      <div className={`absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r ${glowClass}`} />
      <div className={`absolute inset-x-[4%] top-1/2 h-20 -translate-y-1/2 bg-gradient-to-r ${glowClass} blur-3xl opacity-70`} />
      <div className="absolute inset-x-[14%] top-1/2 h-12 -translate-y-1/2 rounded-full bg-white/5 blur-2xl" />
      <div className="absolute inset-x-[8%] top-1/2 h-px -translate-y-1/2 bg-white/10" />
    </div>
  );
}