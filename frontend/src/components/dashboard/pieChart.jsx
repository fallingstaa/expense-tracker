import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { COLORS } from "../../data/data";

function buildExpenseByCategoryData(transactions = []) {
  const categoryTotals = new Map();

  transactions.forEach((item) => {
    if (item.type !== "expense") {
      return;
    }

    const category = item.category || "Uncategorized";
    const current = categoryTotals.get(category) || 0;
    categoryTotals.set(category, current + Number(item.amount || 0));
  });

  return [...categoryTotals.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
}

export function PieChartComponent({ transactions = [] }) {
  const pieData = buildExpenseByCategoryData(transactions);

  return (
    <section>
      <div className="bg-gray-800/50 border border-mutes/20 rounded-lg p-5">
        <div className="mb-4">
          <h2 className="text-mutes font-semibold text-lg">Expense by Category</h2>
          <p className="text-mutes/50 text-sm">Top 6 categories</p>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#e5e7eb",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-4 flex flex-col gap-1 text-sm">
          <div className="flex items-center gap-2 text-mutes font-medium">
            Spending distribution overview <TrendingUp className="h-4 w-4" />
          </div>
          <p className="text-mutes/50">
            Built from your expense transactions only
          </p>
        </div>
      </div>
    </section>
  );
}
