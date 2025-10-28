import type { Transaction } from "../types/transactions";

export interface MonthlyPoint {
  name: string;
  receita: number;
  despesa: number;
  lucro: number;
}

const CURRENT_YEAR = new Date().getFullYear();

export function calculateMonthlyData(transactions: Transaction[]): MonthlyPoint[] {
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const monthlyData: MonthlyPoint[] = [];

  for (let month = 0; month < 12; month++) {
    const monthTransactions = transactions.filter(t => new Date(t.date).getMonth() === month && new Date(t.date).getFullYear() === CURRENT_YEAR);
    const receita = monthTransactions
      .filter(t => t.category.type === 'receita')
      .reduce((sum, t) => sum + t.amount, 0);
    const despesa = Math.abs(
      monthTransactions
        .filter(t => t.category.type === 'despesa')
        .reduce((sum, t) => sum + t.amount, 0)
    );
    const lucro = receita - despesa;

    monthlyData.push({
      name: monthNames[month],
      receita,
      despesa,
      lucro,
    });
  }
  return monthlyData;
}

export interface PieSlice { name: string; value: number, [key: string]: any }

export function calculateRevenueDistribution(transactions: Transaction[]): PieSlice[] {
  const revenueTransactions = transactions.filter(t => t.category.type === 'receita');

  const revenuesByCategory: { [key: string]: number } = {};
  revenueTransactions.forEach(t => {
    const categoryName = t.category.name;
    if (!revenuesByCategory[categoryName]) {
      revenuesByCategory[categoryName] = 0;
    }
    revenuesByCategory[categoryName] += t.amount;
  });

  return Object.entries(revenuesByCategory).map(([name, value]) => ({ name, value, }));
}

export interface CurrentMetrics {
  receita: number;
  despesa: number;
  lucro: number;
  margem: number;
  receitaGrowth: number;
  despesaGrowth: number;
  lucroGrowth: number;
  margemGrowth: number;
}

export function calculateCurrentMetrics(transactions: Transaction[]): CurrentMetrics {
  const currentMonth = new Date().getMonth(); // Junho
  const previousMonth = currentMonth === 0 ? 5 : currentMonth - 1; // Maio

  const currentTransactions = transactions.filter(t => new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === CURRENT_YEAR);
  const previousTransactions = transactions.filter(t => new Date(t.date).getMonth() === previousMonth && new Date(t.date).getFullYear() === CURRENT_YEAR); 

  const currentReceita = currentTransactions
    .filter(t => t.category.type === 'receita')
    .reduce((sum, t) => sum + t.amount, 0);


  const currentDespesa = Math.abs(
    currentTransactions
      .filter(t => t.category.type === 'despesa')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const previousReceita = previousTransactions
    .filter(t => t.category.type === 'receita')
    .reduce((sum, t) => sum + t.amount, 0);

  const previousDespesa = Math.abs(
    previousTransactions
      .filter(t => t.category.type === 'despesa')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const currentLucro = currentReceita - currentDespesa;
  const previousLucro = previousReceita - previousDespesa;
  const currentMargem = currentReceita > 0 ? (currentLucro / currentReceita) * 100 : 0;
  const previousMargem = previousReceita > 0 ? (previousLucro / previousReceita) * 100 : 0;

  const receitaGrowth = previousReceita > 0 ? ((currentReceita - previousReceita) / previousReceita) * 100 : 0;
  const despesaGrowth = previousDespesa > 0 ? ((currentDespesa - previousDespesa) / previousDespesa) * 100 : 0;
  const lucroGrowth = previousLucro > 0 ? ((currentLucro - previousLucro) / previousLucro) * 100 : 0;
  const margemGrowth = currentMargem - previousMargem;

  return {
    receita: currentReceita,
    despesa: currentDespesa,
    lucro: currentLucro,
    margem: currentMargem,
    receitaGrowth,
    despesaGrowth,
    lucroGrowth,
    margemGrowth,
  };
}