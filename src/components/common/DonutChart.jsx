import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from 'recharts'

import Card from './Card'
import { formatAmount } from '../../utils/transactionUtils'

const COLORS = [
  '#c27a35',
  '#2f8f76',
  '#356ea8',
  '#8b5aa8',
  '#b74f6b',
  '#64748b',
]

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null
  }

  const item = payload[0].payload

  return (
    <div className="rounded-xl border border-[#e7ddd2] bg-white p-3 shadow-lg">
      <p className="font-medium text-[#1f1814]">
        {item.name}
      </p>

      <p className="text-sm text-[#6f6258]">
        ₹{formatAmount(item.amount)}
      </p>

      <p className="text-sm text-[#6f6258]">
        {item.percentage}%
      </p>
    </div>
  )
}

function DountChart({
  title,
  subtitle,
  data,
  emptyText,
}) {
  const chartData = (data || [])
  .map(item => ({
    ...item,
    amount: Number(item.amount) || 0,
  }))
  .filter(item => item.amount > 0)

  return (
    <Card
      title={title}
      subtitle={subtitle}
    >
      {!chartData.length ? (
        <p className="rounded-xl border border-[#e9ded1] bg-[#fbf8f4] px-4 py-3 text-sm text-[#76685f]">
          {emptyText}
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:items-center">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="amount"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {chartData.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-xl border border-[#eee5dc] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor:
                        COLORS[index % COLORS.length],
                    }}
                  />

                  <span className="font-medium text-[#1f1814]">
                    {item.name}
                  </span>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-[#1f1814]">
                    ₹{formatAmount(item.amount)}
                  </div>

                  <div className="text-xs text-[#6f6258]">
                    {item.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

export default DountChart