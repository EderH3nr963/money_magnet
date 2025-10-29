import type { Transaction } from "../types/transactions";
import { calculateRevenueDistribution } from "../services/analytics";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
export default function GraficoFonteReceita({ transaction }: { transaction: Transaction[] }) {
  const data = calculateRevenueDistribution(transaction || []);

  console.log(data)

  return (
    <div className="w-full lg:w-1/2">
      <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Fontes de Receita</h3>
      <div className="w-full h-[300px] md:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              fill="#8884d8"
              label
            >
              <Cell fill="#8b5cf6" />
              <Cell fill="#3b82f6" />
              <Cell fill="#10b981" />
              <Cell fill="#f59e0b" />
            </Pie>
            <Tooltip
              contentStyle={{
                border: 'none',
                borderRadius: '8px',
                padding: '10px',
                outline: 0
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconSize={16} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

  )
}