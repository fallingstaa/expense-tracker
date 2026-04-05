import Analytic from "../../components/dashboard/analytic";
import Filter from "../../components/dashboard/filter";

import Header from "../../components/dashboard/header";
import States from "../../components/dashboard/states";
import Transaction from "../../components/dashboard/transection/transaction";

const DashboardPage = () => {
  return (
    <>
      <Header />
      <States />
      <Analytic />
      <Filter />

      <Transaction />
    </>
  );
};

export default DashboardPage;
