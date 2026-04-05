import { TrendingDown, TrendingUp, WalletIcon } from "lucide-react";
export const data = [
  {
    id: 1,
    lable: "Total Balance",
    value: "$0.00",
    icons: <WalletIcon className="w-7 h-7 text-indigo-500" />,
  },
  {
    id: 2,
    lable: "Total Incomes",
    value: "$0.00",
    icons: <TrendingUp className="w-7 h-7 text-green-400" />,
  },
  {
    id: 3,
    lable: "Total Expense",
    value: "$0.00",
    icons: <TrendingDown className="w-7 h-7 text-red-400" />,
  },
];

export const cardStyles = {
  1: {
    card: "bg-indigo-900/20 border-indigo-700/40",
    icon: "bg-indigo-800/40 border-indigo-700/40",
  },
  2: {
    card: "bg-green-900/20 border-green-700/40",
    icon: "bg-green-800/40 border-green-700/40",
  },
  3: {
    card: "bg-red-900/20 border-red-700/40",
    icon: "bg-red-800/40 border-red-700/40",
  },
};

export const pieData = [
  { name: "January", value: 186 },
  { name: "February", value: 305 },
  { name: "March", value: 237 },
  { name: "April", value: 73 },
  { name: "May", value: 209 },
  { name: "June", value: 214 },
];

export const COLORS = [
  "#8b5cf6",
  "#7c3aed",
  "#a78bfa",
  "#6d28d9",
  "#c4b5fd",
  "#4c1d95",
];

export const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];
