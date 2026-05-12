export default function HomePage(): React.ReactNode {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Bebras Bolivia</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <section className="p-6 bg-white rounded-lg shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-2">Administradores</h2>
          <p className="text-sm text-gray-600">Gestión global de la competencia.</p>
        </section>

        <section className="p-6 bg-white rounded-lg shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-2">Docentes</h2>
          <p className="text-sm text-gray-600">Inscribe a sus estudiantes.</p>
        </section>

        <section className="p-6 bg-white rounded-lg shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-2">Examinadores</h2>
          <p className="text-sm text-gray-600">Control de pruebas y evaluaciones.</p>
        </section>
      </div>
    </main>
  );
}
