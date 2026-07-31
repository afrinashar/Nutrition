export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-700 bg-slate-900/80 p-10 shadow-xl shadow-slate-900/30">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-5xl font-semibold text-emerald-300">NutriAI</h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-300">
              An enterprise-grade AI nutrition ecosystem built for modern product portfolios.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/dashboard" className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
              View Dashboard
            </a>
            <a href="/login" className="rounded-2xl border border-slate-700 px-5 py-3 text-sm text-slate-100 transition hover:bg-slate-800">
              Optional Sign In
            </a>
          </div>
        </header>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
            <h2 className="text-xl font-semibold text-slate-100">AI Meal Planner</h2>
            <p className="mt-2 text-slate-400">Personalized meal plans, local cuisine support, pantry-based recipes.</p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
            <h2 className="text-xl font-semibold text-slate-100">Nutrition Dashboard</h2>
            <p className="mt-2 text-slate-400">Explore calories, macros, progress, and health insights without signing in.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
