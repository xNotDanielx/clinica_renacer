export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-blue-900">Clínica Renacer</h1>
          <p className="text-blue-600 font-medium">Sistema de Gestión de Citas</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bloque 1: Paciente */}
          <section className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white">
            <h2 className="text-xl font-bold mb-4 text-gray-800">1. Datos del Paciente</h2>
            <div className="space-y-4">
              <input className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Identificación" />
              <input className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nombre completo" />
            </div>
          </section>

          {/* Bloque 2: Procedimientos */}
          <section className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white">
            <h2 className="text-xl font-bold mb-4 text-gray-800">2. Procedimientos</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg cursor-pointer transition">
                <input type="checkbox" className="w-5 h-5 accent-blue-600" /> Limpieza Facial
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg cursor-pointer transition">
                <input type="checkbox" className="w-5 h-5 accent-blue-600" /> Botox
              </label>
            </div>
          </section>

          {/* Bloque 3: Programación */}
          <section className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white">
            <h2 className="text-xl font-bold mb-4 text-gray-800">3. Programación</h2>
            <input type="date" className="w-full p-3 rounded-lg border border-gray-200 mb-3" />
            <div className="flex gap-3">
              <input type="time" className="w-full p-3 rounded-lg border border-gray-200" />
              <input type="time" className="w-full p-3 rounded-lg border border-gray-200" />
            </div>
          </section>

          {/* Bloque 4: Resumen */}
          <section className="bg-blue-600 p-6 rounded-2xl shadow-xl text-white">
            <h2 className="text-xl font-bold mb-4">4. Resumen</h2>
            <div className="space-y-2 mb-6 opacity-90">
              <p>Subtotal: $0</p>
              <p className="text-3xl font-bold mt-2">Total: $0</p>
            </div>
            <button className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg">
              Guardar Cita
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}