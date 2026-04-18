import { useState } from "react";
import { TrendingUp, X } from "lucide-react";
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

const renderLabel = ({ name, value }) => {
  return `${name}`;
};

function CategoryModal({ category, transactions, onClose }) {
  const categoryTransactions = transactions.filter(
    (t) => t.type === "expense" && t.category === category
  );
  
  const total = categoryTransactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-mutes/20 rounded-lg max-w-2xl w-full max-h-96 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-mutes/20">
          <div>
            <h3 className="text-mutes font-semibold text-lg">{category}</h3>
            <p className="text-mutes/50 text-sm">Total: ${total.toFixed(2)}</p>
          </div>
          <button
            onClick={onClose}
            className="text-mutes/50 hover:text-mutes transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5">
          <div className="space-y-2">
            {categoryTransactions.map((transaction, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-mutes/10"
              >
                <div>
                  <p className="text-mutes font-medium text-sm">
                    {transaction.title}
                  </p>
                  <p className="text-mutes/50 text-xs">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-red-400 font-semibold">
                  -${Number(transaction.amount || 0).toFixed(2)}
                </span>
              </div>
            ))}
            {categoryTransactions.length === 0 && (
              <p className="text-mutes/50 text-center py-8">
                No transactions found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PieChartComponent({ transactions = [] }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const pieData = buildExpenseByCategoryData(transactions);

  const handlePieClick = (data) => {
    setSelectedCategory(data.name);
  };

  return (
    <section>
      <div className="bg-gray-800/50 border border-mutes/20 rounded-lg p-5">
        <div className="mb-4">
          <h2 className="text-mutes font-semibold text-lg">Expense by Category</h2>
          <p className="text-mutes/50 text-sm">Top 6 categories (click to view details)</p>
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
              label={renderLabel}
              labelLine={false}
              onClick={(data) => handlePieClick(data)}
              style={{ cursor: "pointer" }}
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

      {selectedCategory && (
        <CategoryModal
          category={selectedCategory}
          transactions={transactions}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </section>
  );
}
