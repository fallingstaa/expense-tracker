import Analytic from "../../components/dashboard/analytic";
import Filter from "../../components/dashboard/filter";

import Header from "../../components/dashboard/header";
import States from "../../components/dashboard/states";
import Transaction from "../../components/dashboard/transaction/transaction";
import { useGetTransactionsQuery } from "../../redux/feature/transactions/transactionsAPI";

const DashboardPage = () => {
  const { data } = useGetTransactionsQuery();
  const transactions = data?.transactions ?? [];

  return (
    <div className="pt-0 pb-10">
      <Header />
      <States transactions={transactions} />
      <Analytic transactions={transactions} />
      <Filter />
      <Transaction />
    </div>
  );
};

export default DashboardPage;
