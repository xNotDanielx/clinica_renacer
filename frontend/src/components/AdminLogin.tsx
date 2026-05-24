import type { FormEvent } from "react";

interface AdminLoginProps {
  username: string;
  password: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onForgotPassword: () => void;
}

export default function AdminLogin({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  onForgotPassword,
}: AdminLoginProps) {
  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-x-hidden">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.22),transparent_30%),radial-gradient(circle_at_right,rgba(56,189,248,0.16),transparent_28%),linear-gradient(180deg,#050816_0%,#090b1a_100%)]" />
      <div className="fixed inset-0 -z-10 opacity-25 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
        <section className="mx-auto max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10 text-3xl text-violet-300">
              🔐
            </div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Administración</p>
            <h1 className="mt-3 text-4xl font-black text-white">Acceso administrador</h1>
            <p className="mt-4 text-slate-300">
              Ingresa tu usuario y contraseña para acceder al panel de administración.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(event) => onUsernameChange(event.target.value)}
                placeholder="Nombre de usuario"
                className="w-full rounded-3xl border border-white/10 bg-black/40 px-4 py-4 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(event) => onPasswordChange(event.target.value)}
                placeholder="Contraseña"
                className="w-full rounded-3xl border border-white/10 bg-black/40 px-4 py-4 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                className="btn-primary w-full rounded-3xl py-4 text-base font-semibold sm:w-auto"
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={onForgotPassword}
                className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/30 hover:bg-white/10"
              >
                Olvidé contraseña
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
