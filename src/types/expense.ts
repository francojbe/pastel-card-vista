
export interface Expense {
  fecha: string;
  comercio: string;
  tarjeta: string;
  monto: number;
  medio: string;
  hora: string;
}

export interface ExpenseData {
  total_mes: number;
  gastos: Expense[];
  resumen_semanal: number[];
}
