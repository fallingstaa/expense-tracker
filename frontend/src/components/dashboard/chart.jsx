import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function buildLastSixMonthsData(transactions = []) {
  const now = new Date();
  const months = [];

  for (let index = 5; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    months.push({
      key,
      month: date.toLocaleString("en-US", { month: "long" }),
      income: 0,
      expense: 0,
    });
  }

  const monthMap = new Map(months.map((item) => [item.key, item]));

  transactions.forEach((item) => {
    const date = new Date(item.date || item.createdAt || item.created_at);
    if (Number.isNaN(date.getTime())) {
      return;
    }

    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const target = monthMap.get(key);
    if (!target) {
      return;
    }

    const amount = Number(item.amount || 0);
    if (item.type === "income") {
      target.income += amount;
    } else {
      target.expense += amount;
    }
  });

  return months;
}

export function Chart({ transactions = [] }) {
  const chartData = buildLastSixMonthsData(transactions);

  return (
    <section>
      <div className="bg-gray-800/50 border border-mutes/20 rounded-lg p-5">
        <div className="mb-4">
          <h2 className="text-mutes font-semibold text-lg">Income vs Expense</h2>
          <p className="text-mutes/50 text-sm">Last 6 months</p>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#e5e7eb",
              }}
            />
            <Legend />
            <Bar dataKey="income" fill="#22c55e" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 flex flex-col gap-1 text-sm">
          <div className="flex items-center gap-2 text-mutes font-medium">
            Track how much you earn and spend <TrendingUp className="h-4 w-4" />
          </div>
          <p className="text-mutes/50">
            Each bar uses your real transaction records
          </p>
        </div>
      </div>
    </section>
  );
}
