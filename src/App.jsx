import DashboardApiExample from './pages/DashboardApiExample'

function App() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <h1 className="text-3xl font-semibold">Ledgerly API Architecture</h1>
          <p className="mt-2 text-slate-600">
            {'Component/Page -> API files -> plugins/axios.js -> Backend API'}
          </p>
        </header>

        <DashboardApiExample />
      </div>
    </main>
  )
}

export default App