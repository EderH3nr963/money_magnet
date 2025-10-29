import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import DropdownTimerPeriod from "./DropdownTimePeriod";
import type { Transaction } from "../types/transactions";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { calculateMonthlyData } from "../services/analytics";
import { getTransactionByYear } from "../services/transactionService";

export default function GraficoFluxoFinanceiro() {
  const { user } = useAuth();
  const [transaction, setTransaction] = useState<Transaction[]>([]);

  const [timePeriod, setTimePeriod] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    getTransactionByYear(timePeriod).then((res) => {
      setTransaction(res || []);
    });
  }, [user?.id, timePeriod]);

  const data = calculateMonthlyData(transaction || []);

  return (
    <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
      <div className="flex justify-between items-center">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Fluxo Financeiro</h3>
        <DropdownTimerPeriod timePeriod={timePeriod} setTimePeriod={setTimePeriod} />
      </div>
      <div className="w-full h-[250px] md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                color: '#fff'
              }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend />
            <Line
              type="linear"
              dataKey="receita"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Receita"
            />
            <Line
              type="linear"
              dataKey="despesa"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Despesa"
            />
            <Line
              type="linear"
              dataKey="lucro"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Lucro"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
