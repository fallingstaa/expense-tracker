import Analytic from "../../components/dashboard/analytic";
import Filter from "../../components/dashboard/filter";

import Header from "../../components/dashboard/header";
import States from "../../components/dashboard/states";
import Transection from "../../components/dashboard/transection";

const DashboardPage = () => {
  return (
    <>
      <Header />
      <States />
      <Analytic />
      <Filter />

      <Transection />
    </>
  );
};

export default DashboardPage;
