
import { ArrowRight, BadgeCheck, BookOpen, Filter, Search, ShieldCheck, Upload, Wallet, Sparkles, TrendingUp, FileUp } from 'lucide-react'

import { Link } from 'react-router-dom'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import LedgerTable from '../components/shared/LedgerTable'
import workflow from '../constants/workFlow'
import transactions from '../constants/sampleTransactions'
import features from '../constants/features'

function featureIcon(feature) {
  if (feature === 'Privacy First') return <ShieldCheck size={18} />
  if (feature === 'Fast Filtering') return <Filter size={18} />
  if (feature === 'Smart Search') return <Search size={18} />
  if (feature === 'CSV & PDF Uploads') return <FileUp size={18} />
  if (feature === 'Custom Categories') return <Wallet size={18} />

  return <BadgeCheck size={18} />
}

function LandingPage() {
  return (
    <div className="text-[#201a17]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-14 h-72 w-72 rounded-full bg-emerald-200/35 blur-3xl" />
        <div className="absolute -right-24 top-44 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute left-1/3 top-[30rem] h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
      </div>

      <section className="flex min-h-[88vh] flex-col items-center justify-center text-center">
        <div className="max-w-5xl">

          <h1 className="mx-auto mt-1 max-w-5xl font-heading text-5xl font-bold leading-[0.95] tracking-[-0.06em] text-[#1e1814] sm:text-6xl lg:text-7xl">
            Your bank statement,
          </h1>

          <h1 className="mx-auto max-w-5xl font-heading text-5xl font-bold leading-[0.95] tracking-[-0.06em] text-[#6E605A] sm:text-6xl lg:text-7xl">
            organized your way.
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-[#5f534c]">
            Upload your statements. Transactions get cleaned automatically.
            Organize spending with your own categories and explore everything in
            one elegant ledger.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/upload">
              <Button size="lg" className="rounded-2xl px-6">
                <Upload size={18} />
                Upload Statement
              </Button>
            </Link>

            <Link to="/ledger">
              <Button variant="outline" size="lg" className="rounded-2xl px-6">
                <BookOpen size={18} />
                View Ledger
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="ledger" className="pb-32">
        <div className="rounded-[2rem] border border-[#e4dbd1] bg-white/55 p-6 shadow-[0_20px_60px_rgba(30,20,10,0.06)] backdrop-blur-xl md:p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-[-0.04em] text-[#1f1815]">
                Clean, organized transactions
              </h2>

              <p className="mt-2 text-[#6a5d55]">
                Search, filter, and understand your spending instantly.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-[#e7ddd2] bg-white px-3 py-2 text-sm text-[#6d6058] shadow-sm">
                <Search size={14} />
                Search transactions...
              </div>

              <div className="rounded-xl border border-[#e7ddd2] bg-white px-3 py-2 text-sm shadow-sm">
                Food
              </div>

              <div className="rounded-xl border border-[#e7ddd2] bg-white px-3 py-2 text-sm shadow-sm">
                Shopping
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-[#e7ddd2] bg-white px-3 py-2 text-sm shadow-sm transition-colors hover:bg-[#faf6f1]">
                <Filter size={14} className="text-[#7a6c63]" />
                Filters
              </div>
            </div>
          </div>

          <LedgerTable data={transactions} />
        </div>
      </section>

      <div className="border-t border-[#ebe2d8]" />

      <section className="py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-[-0.03em] text-[#1f1915] sm:text-4xl">
              Messy bank descriptions become readable instantly.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-[#665952]">
              Ledgerly intelligently detects merchants and cleans raw banking
              data into readable transactions.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <Card className="rounded-[2rem] border-[#e0d7cc] bg-white/72 p-7 shadow-[0_10px_30px_rgba(40,28,20,0.04)]">
              <p className="text-xs uppercase tracking-[0.18em] text-[#867a72]">
                Before
              </p>

              <div className="mt-4 rounded-2xl bg-[#f5f0ea] p-5">
                <p className="font-mono text-sm leading-relaxed text-[#594f49] sm:text-base">
                  UPI/23987123/AMAZON SELLER PAYM
                </p>
              </div>
            </Card>

            <Card className="flex min-h-[220px] items-center justify-center rounded-[2rem] border-[#eadfce] bg-gradient-to-b from-[#fffaf2] to-[#faf5ef] p-8 shadow-[0_20px_45px_rgba(255,190,90,0.18)]">
              <div className="inline-flex items-center gap-3 rounded-full border border-[#e7dccf] bg-white px-5 py-3 text-sm font-semibold text-[#524843] shadow-sm">
                <Sparkles size={16} className="text-amber-500" />
                Auto Cleanup
                <ArrowRight size={16} />
              </div>
            </Card>

            <Card className="rounded-[2rem] border-[#e0d7cc] bg-white/72 p-7 shadow-[0_10px_30px_rgba(40,28,20,0.04)]">
              <p className="text-xs uppercase tracking-[0.18em] text-[#867a72]">
                After
              </p>

              <div className="mt-4 rounded-2xl bg-emerald-50 p-5">
                <p className="text-base font-semibold text-emerald-900">
                  Amazon
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section id="workflow" className="pb-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-[-0.03em]">
            Simple workflow. Powerful results.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {workflow.map((item) => (
            <Card
              key={item.step}
              className="group rounded-2xl border-[#ded5ca] bg-white/72 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(50,35,20,0.08)]"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#f4eee6] text-[#2e2520]">
                <item.icon size={20} />
              </div>

              <p className="text-xs font-semibold tracking-wide text-[#8b7d74]">
                STEP {item.step}
              </p>

              <h3 className="mt-1 text-xl font-semibold text-[#1f1915]">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-[#61544c]">
                {item.desc}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-[-0.03em] text-[#1f1915] sm:text-4xl">
            Insights at a glance
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          <Card className="rounded-[2rem] border-[#e2d8cd] bg-white/72 p-6 lg:col-span-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#7b6f66]">Monthly spending</p>

                <p className="mt-2 text-4xl font-bold tracking-[-0.04em] text-[#1f1915]">
                  ₹42,780
                </p>
              </div>

              <div className="rounded-2xl bg-[#f5efe7] p-3 text-[#8d735d]">
                <TrendingUp size={20} />
              </div>
            </div>

            <div className="mt-8 h-3 overflow-hidden rounded-full bg-[#efe7dc]">
              <div className="h-full w-[64%] rounded-full bg-[#9a7a60]" />
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-[#7b6f66]">64% of monthly budget used</span>
              <span className="font-semibold text-[#2a221d]">+8%</span>
            </div>
          </Card>

          <Card className="rounded-[2rem] border-[#e2d8cd] bg-white/72 p-6 lg:col-span-3">
            <p className="text-sm text-[#7b6f66]">Largest category</p>

            <p className="mt-3 text-3xl font-bold tracking-[-0.04em] text-[#1f1915]">
              Shopping
            </p>

            <p className="mt-4 text-sm text-[#6a5d55]">
              37% of total monthly spending detected across online purchases.
            </p>
          </Card>

          <Card className="rounded-[2rem] border-[#e2d8cd] bg-white/72 p-6 lg:col-span-2">
            <p className="text-sm text-[#7b6f66]">Total income</p>

            <p className="mt-3 text-3xl font-bold tracking-[-0.04em] text-emerald-700">
              ₹95K
            </p>

            <p className="mt-4 text-sm text-[#6a5d55]">
              Salary credit detected.
            </p>
          </Card>

          <Card className="rounded-[2rem] border-[#e2d8cd] bg-white/72 p-6 lg:col-span-2">
            <p className="text-sm text-[#7b6f66]">Savings</p>

            <p className="mt-3 text-3xl font-bold tracking-[-0.04em] text-[#1f1915]">
              ₹52K
            </p>

            <p className="mt-4 text-sm font-medium text-emerald-700">
              +12% vs last month
            </p>
          </Card>
        </div>
      </section>

      <div className="border-t border-[#ebe2d8]" />

      <section id="features" className="py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-[-0.03em] text-[#1f1915]">
            Built for trust, speed, and clarity
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature}
              className="group rounded-2xl border-[#dfd5ca] bg-white/78 p-4 transition-all duration-300 hover:border-[#cfc3b6] hover:shadow-[0_12px_28px_rgba(50,35,20,0.08)]"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4eee6] text-[#302722]">
                {featureIcon(feature)}
              </div>

              <h3 className="text-lg font-semibold text-[#251f1b]">
                {feature}
              </h3>

              <p className="mt-2 text-[13px] leading-relaxed text-[#685c54]">
                Designed with thoughtful interactions and clean organization to
                make financial management effortless.
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section id="cta" className="pb-8 pt-10">
        <Card className="relative overflow-hidden rounded-[2rem] border-[#ded4c8] bg-gradient-to-br from-[#fff9f1] to-[#eef7f2] p-12 text-center shadow-[0_14px_30px_rgba(50,35,20,0.07)] md:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.7),_transparent_35%)]" />

          <div className="relative z-10">
            <h2 className="text-4xl font-bold tracking-[-0.04em] text-[#1f1915]">
              Take control of your financial history.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-[#5e524b]">
              Stop scrolling through raw statements. Start understanding your
              money with a cleaner, smarter financial workspace.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/upload">
                <Button size="lg" className="rounded-xl px-6">
                  Upload Your Statement
                </Button>
              </Link>

              <Link to="/ledger">
                <Button variant="outline" size="lg" className="rounded-xl px-6">
                  Explore Ledger
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

export default LandingPage
