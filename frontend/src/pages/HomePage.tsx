import { useState, useEffect } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000";

const galleryPairs = Array.from({ length: 9 }).map((_, index) => ({
  before: `Antes ${index + 1}`,
  after: `Después ${index + 1}`,
  beforeImage: `https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80&sig=${index + 1}`,
  afterImage: `https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80&sig=${index + 20}`,
}));

export default function HomePage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [blockedProcedure, setBlockedProcedure] = useState<string | null>(null);
  const [showLimitMessage, setShowLimitMessage] = useState(false);
  const [proceduresData, setProceduresData] = useState<any[] | null>(null);

  const toggleProcedure = (name: string) => {
    if (selected.includes(name)) {
      setSelected((prev) => prev.filter((item) => item !== name));
      return;
    }

    if (selected.length >= 2) {
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

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch(`${BACKEND}/procedimientos/activos`);
        if (!res.ok) {
          console.error("Failed fetching procedimientos", res.status);
          if (mounted) setProceduresData([]);
          return;
        }
        const data = await res.json();
        if (mounted) setProceduresData(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        if (mounted) setProceduresData([]);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-x-hidden">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.22),transparent_30%),radial-gradient(circle_at_right,rgba(56,189,248,0.16),transparent_28%),linear-gradient(180deg,#050816_0%,#090b1a_100%)]" />
      <div className="fixed inset-0 -z-10 opacity-25 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/35 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="w-[320px] shrink-0 leading-tight">
            <p className="text-sm md:text-base font-semibold uppercase tracking-[0.35em] text-cyan-300 whitespace-nowrap">
              CLÍNICA ESTÉTICA
            </p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white whitespace-nowrap">
              Renacer
            </h1>
          </div>

          <nav className="hidden md:flex flex-1 justify-center items-center gap-10 text-base md:text-lg font-bold">
            <a className="nav-link-ghost text-base md:text-lg uppercase tracking-[0.16em]" href="#inicio">INICIO</a>
            <a className="nav-link-ghost text-base md:text-lg uppercase tracking-[0.16em]" href="#procedimientos">PROCEDIMIENTOS</a>
            <a className="nav-link-ghost text-base md:text-lg uppercase tracking-[0.16em]" href="#galeria">ANTES Y DESPUÉS</a>
            <a className="nav-link-ghost text-base md:text-lg uppercase tracking-[0.16em]" href="#contacto">CONTÁCTANOS</a>
          </nav>

          <div className="hidden md:flex items-center justify-end gap-3 w-[320px] shrink-0">
            <a href="#admin" className="rounded-full bg-violet-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-400">
              Panel admin
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pt-28">
        <section id="inicio" className="py-20 md:py-28 scroll-mt-28">
          <div className="grid items-start gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 md:p-10 backdrop-blur-xl">
              <p className="section-kicker">Clínica estética</p>
              <h2 className="mt-3 text-5xl md:text-7xl font-black tracking-tight text-white">
                Clínica Renacer
              </h2>
              <p className="mt-4 text-2xl md:text-3xl font-semibold text-cyan-200">
                Doctor Miguel Mendoza
              </p>

              <p className="mt-4 text-lg md:text-xl font-medium text-violet-200 italic">
                “Belleza, confianza y acompañamiento en cada etapa del proceso.”
              </p>

              <p className="mt-6 text-lg md:text-xl leading-8 text-slate-300 max-w-2xl">
                Un espacio especializado en procedimientos corporales, atención personalizada y una experiencia moderna. El doctor Miguel Mendoza brinda valoración individual, enfoque estético y seguimiento cercano para cada paciente.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#contacto" className="btn-primary">
                  Agendar consulta
                </a>
                <a href="#procedimientos" className="btn-secondary">
                  Ver procedimientos
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-tr from-violet-600/20 via-cyan-500/15 to-transparent blur-2xl" />
              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
                <div className="aspect-[4/5] w-full rounded-[2rem] bg-black flex items-center justify-center text-lg text-white/45">
                  Foto del doctor
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Experiencia", "Atención profesional con enfoque en resultados naturales."],
              ["Seguridad", "Valoración previa y acompañamiento médico en cada proceso."],
              ["Acompañamiento", "Seguimiento cercano antes y después de la cirugía."],
              ["Confianza", "Información clara para ayudarte a tomar la mejor decisión."],
            ].map(([title, text]) => (
              <article key={title} className="glass-card hover:scale-[1.03] hover:-translate-y-2 hover:bg-white/10">
                <p className="section-kicker">{title}</p>
                <h3 className="card-title">{title}</h3>
                <p className="card-text">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <Separator />

        <section id="procedimientos" className="py-20 md:py-28 scroll-mt-28">
          <div className="mb-10">
            <p className="section-kicker">Procedimientos</p>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight">
              Servicios corporales disponibles
            </h3>
            <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-4xl">
              Selecciona máximo 2 cirugías por día o consulta. Luego se confirma la combinación más adecuada con el doctor.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {proceduresData === null ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 h-56 animate-pulse" />
              ))
            ) : proceduresData.length === 0 ? (
              <p className="text-slate-300">No hay procedimientos disponibles.</p>
            ) : (
              proceduresData.map((p: any) => {
                const name = p.nombre ?? p.name ?? "";
                const info = p.descripcion ?? p.info ?? "";
                const image = p.url_imagen
                  ? p.url_imagen.startsWith("http")
                    ? p.url_imagen
                    : `${BACKEND}/${p.url_imagen.replace(/^\/+/, "")}`
                  : "";

                const active = selected.includes(name);
                const blocked = blockedProcedure === name;

                return (
                  <button
                    key={p.id ?? name}
                    onClick={() => toggleProcedure(name)}
                    className={`procedure-hover-card p-8 ${active ? "ring-2 ring-cyan-400" : ""} ${blocked ? "ring-2 ring-red-500 bg-red-500/20 border-red-400/50" : ""}`}
                  >
                    <div className="procedure-hover-front h-full flex flex-col items-center text-center">
                      <p className="text-2xl font-black text-white uppercase tracking-[0.06em] leading-tight text-center">
                        {name}
                      </p>

                      <p className="mt-6 text-lg md:text-xl text-slate-200 leading-8 text-center md:text-justify max-w-[28rem]">
                        {info}
                      </p>
                    </div>

                    <div className="procedure-hover-image">
                      <img src={image} alt={name} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/35" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-lg font-bold text-white">{name}</p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {showLimitMessage && (
            <div className="mt-8 rounded-3xl border border-red-500/40 bg-red-500/10 p-5 md:p-6 text-red-100 backdrop-blur-xl">
              <p className="text-lg md:text-xl font-semibold">
                Máximo 2 cirugías por consulta.
              </p>
              <p className="mt-2 text-base md:text-lg text-red-100/80">
                Para más información sobre combinaciones o procedimientos adicionales, consulta con el doctor.
              </p>
            </div>
          )}

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300 font-semibold">
                Procedimientos seleccionados
              </p>
              <h4 className="mt-2 text-2xl md:text-3xl font-black leading-tight">
                {selected.length > 0
                  ? selected.join(" + ")
                  : "Sin procedimientos seleccionados"}
              </h4>
              <p className="mt-3 text-base md:text-lg text-slate-300 max-w-2xl">
                Los valores se confirman directamente con el doctor durante la consulta, ya que pueden variar según promociones, valoración médica y características del procedimiento.
              </p>
            </div>

            <button className="btn-primary text-lg md:text-xl">
              Agendar consulta
            </button>
          </div>
        </section>

        <Separator glow="violet" />

        <section id="galeria" className="py-20 md:py-28 scroll-mt-28">
          <div className="mb-10">
            <p className="section-kicker">Galería</p>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight">
              Antes y después
            </h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {galleryPairs.map((pair, idx) => (
              <div key={idx} className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="gallery-card">
                    <img src={pair.beforeImage} alt={pair.before} className="h-full w-full object-cover" />
                    <div className="gallery-label">ANTES</div>
                  </div>
                  <div className="gallery-card">
                    <img src={pair.afterImage} alt={pair.after} className="h-full w-full object-cover" />
                    <div className="gallery-label">DESPUÉS</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator />

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
