import { useState } from 'react'
import { Brain } from 'lucide-react'

import AnalysisTab from './AnalysisTab'
import InsightsTab from './InsightsTab'

function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('analysis')

  return (
    <div className="pb-6 text-[#1f1814]">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e2d5c5]/90 bg-white/72 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a6657] shadow-[0_8px_20px_rgba(40,28,20,0.05)] backdrop-blur-xl">
              <Brain size={13} />
              Financial Intelligence
            </div>

            <h1 className="mt-7 text-4xl font-bold tracking-[-0.05em] text-[#1f1814] sm:text-5xl">
              Analysis & Insights
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6a5d55] sm:text-base">
              Understand where your money goes and how your financial habits
              evolve over time.
            </p>
          </div>

          <div className="inline-flex rounded-xl border border-[#ded1c3] bg-white/75 p-1 shadow-[0_8px_18px_rgba(40,28,20,0.06)]">
            <TabButton
              active={activeTab === 'analysis'}
              onClick={() => setActiveTab('analysis')}
            >
              Analysis
            </TabButton>

            <TabButton
              active={activeTab === 'insights'}
              onClick={() => setActiveTab('insights')}
            >
              Insights
            </TabButton>
          </div>
        </div>

        {activeTab === 'analysis' ? <AnalysisTab /> : <InsightsTab />}
      </section>
    </div>
  )
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
        active
          ? 'bg-[#2f2621] text-white shadow-[0_4px_12px_rgba(40,28,20,0.16)]'
          : 'text-[#6c5f56] hover:bg-[#f4ede5] hover:text-[#2f2621]'
      }`}
    >
      {children}
    </button>
  )
}

export default AnalyticsPage
