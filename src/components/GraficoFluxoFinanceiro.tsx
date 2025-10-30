import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DropdownTimerPeriod from "./DropdownTimePeriod";
import type { Transaction } from "../types/transactions";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { calculateMonthlyData } from "../services/analytics";
import { getTransactionByYear } from "../services/transactionService";
import { useTheme } from "../context/ThemeContext";

export default function GraficoFluxoFinanceiro() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [transaction, setTransaction] = useState<Transaction[]>([]);
  const [timePeriod, setTimePeriod] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    getTransactionByYear(timePeriod).then((res) => {
      setTransaction(res || []);
    });
  }, [user?.id, timePeriod, theme]);  


  const data = calculateMonthlyData(transaction || []);

  // 🎨 Cores corretas de acordo com o tema
  const textColor = theme === "light" ? "#1f2937" : "#e5e7eb"; // gray-800 / gray-200
  const gridColor = theme === "light" ? "#e5e7eb" : "#374151"; // gray-200 / gray-700
  const tooltipBg = theme === "light" ? "#f9fafb" : "#1f2937"; // gray-50 / gray-800
  const tooltipText = theme === "light" ? "#1f2937" : "#f9fafb"; // gray-800 / gray-50

  return (
    <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
      <div className="flex justify-between items-center">
        <h3 className={`text-xl md:text-2xl font-bold mb-4 dark:text-gray-200`}>
          Fluxo Financeiro
        </h3>
        <DropdownTimerPeriod timePeriod={timePeriod} setTimePeriod={setTimePeriod} />
      </div>

      <div className="w-full h-[250px] md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={textColor} tick={{ fill: textColor }} />
            <YAxis stroke={textColor} tick={{ fill: textColor }} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: "none",
                borderRadius: "8px",
                color: tooltipText,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
              }}
              itemStyle={{ color: tooltipText }}
            />
            <Legend
              wrapperStyle={{
                color: textColor,
              }}
            />
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
  );
}
