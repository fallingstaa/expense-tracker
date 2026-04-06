import Analytic from "../../components/dashboard/analytic";
import Filter from "../../components/dashboard/filter";

import Header from "../../components/dashboard/header";
import States from "../../components/dashboard/states";
import Transaction from "../../components/dashboard/transection/transaction";

const DashboardPage = () => {
  return (
    <div className="pt-0 pb-10">
      <Header />
      <States />
      <Analytic />
      <Filter />
      <Transaction />
    </div>
  );
};

export default DashboardPage;
