import { TrendingDown, TrendingUp, WalletIcon } from "lucide-react";

const data = [
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
    icons: <TrendingUp className="w-7 h-7 text-green-600" />,
  },
  {
    id: 3,
    lable: "Total Expense",
    value: "$0.00",
    icons: <TrendingDown className="w-7 h-7 text-red-700 " />,
  },
];

const States = () => {
  return (
    <div className="pt-21  mr-5 ml-5 ">
      <div className="max-w-8xl mx-auto">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 ">
          {data.map((items) => (
            <div
              key={items.id}
              className="bg-gray-800 border border-mutes/20 rounded-lg p-4 flex items-center gap-3 justify-between"
            >
              <div>
                <h1 className="text-sm mb-7 text-mutes-foreground">
                  {items.lable}
                </h1>
                <p className="text-5xl text-mutes">{items.value}</p>
              </div>
              <div className="mr-5 bg-mutes/20 text-mutes rounded-lg border border-mutes/20 p-3">
                {items.icons}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default States;
