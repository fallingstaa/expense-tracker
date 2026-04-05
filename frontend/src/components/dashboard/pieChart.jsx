import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Tooltip, ResponsiveContainer, Cell } from "recharts";

const pieData = [
  { name: "January", value: 186 },
  { name: "February", value: 305 },
  { name: "March", value: 237 },
  { name: "April", value: 73 },
  { name: "May", value: 209 },
  { name: "June", value: 214 },
];

const COLORS = [
  "#8b5cf6",
  "#7c3aed",
  "#a78bfa",
  "#6d28d9",
  "#c4b5fd",
  "#4c1d95",
];

export function PieChartComponent() {
  return (
    <section>
      <div className="bg-gray-800 border border-mutes/20 rounded-lg p-5">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-mutes font-semibold text-lg">Pie Chart</h2>
          <p className="text-mutes/50 text-sm">January - June 2024</p>
        </div>

        {/* Chart */}
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

        {/* Footer */}
        <div className="mt-4 flex flex-col gap-1 text-sm">
          <div className="flex items-center gap-2 text-mutes font-medium">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <p className="text-mutes/50">
            Showing total visitors for the last 6 months
          </p>
        </div>
      </div>
    </section>
  );
}
