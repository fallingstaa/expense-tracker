// import { useMemo, useState } from "react";
// import Analytic from "../../components/dashboard/analytic";
// import Filter from "../../components/dashboard/filter";

// import Header from "../../components/dashboard/header";
// import States from "../../components/dashboard/states";
// import Transaction from "../../components/dashboard/transaction/transaction";
// import { useGetCategoriesQuery } from "../../redux/feature/transactions/categoriesApi";
// import { useGetTagsQuery } from "../../redux/feature/transactions/tagApi";
// import { useGetTransactionsQuery } from "../../redux/feature/transactions/transactionsAPI";

// const initialFilters = {
//   type: "all",
//   category: "",
//   tag: "",
//   startDate: "",
//   endDate: "",
//   minAmount: "",
//   maxAmount: "",
// };

// const DashboardPage = () => {
//   const [filters, setFilters] = useState(initialFilters);

//   const queryParams = useMemo(() => {
//     const params = {};

//     if (filters.type && filters.type !== "all") {
//       params.type = filters.type;
//     }

//     if (filters.category) {
//       params.category = filters.category;
//     }

//     if (filters.tag?.trim()) {
//       params.tags = filters.tag.trim();
//     }

//     if (filters.startDate) {
//       params.startDate = filters.startDate;
//     }

//     if (filters.endDate) {
//       params.endDate = filters.endDate;
//     }

//     if (filters.minAmount !== "") {
//       params.minAmount = filters.minAmount;
//     }

//     if (filters.maxAmount !== "") {
//       params.maxAmount = filters.maxAmount;
//     }

//     return params;
//   }, [filters]);

//   const { data } = useGetTransactionsQuery(queryParams);
//   const { data: categoriesData, isLoading: isLoadingCategories } =
//     useGetCategoriesQuery();
//   const { data: tagsData, isLoading: isLoadingTags } = useGetTagsQuery();

//   const transactions = data?.transactions ?? [];
//   const categories = categoriesData?.categories ?? [];
//   const tags = tagsData?.tags ?? [];

//   return (
//     <div className="pt-0 pb-10">
//       <Header />
//       <States transactions={transactions} />
//       <Analytic transactions={transactions} />
//       <Filter
//         filters={filters}
//         onFilterChange={setFilters}
//         onReset={() => setFilters(initialFilters)}
//         categories={categories}
//         tags={tags}
//         isLoadingCategories={isLoadingCategories}
//         isLoadingTags={isLoadingTags}
//       />
//       <Transaction queryParams={queryParams} />
//     </div>
//   );
// };

// export default DashboardPage;

import Analytic from "../../components/dashboard/analytic";
import Filter from "../../components/dashboard/filter";
import Header from "../../components/dashboard/header";
import States from "../../components/dashboard/states";
import Transaction from "../../components/dashboard/transaction/transaction";

import { useGetCategoriesQuery } from "../../redux/feature/transactions/categoriesApi";
import { useGetTagsQuery } from "../../redux/feature/transactions/tagApi";
import { useGetTransactionsQuery } from "../../redux/feature/transactions/transactionsAPI";

import useTransactionFilters from "../../hooks/useFilter";

const DashboardPage = () => {
  const { filters, setFilters, queryParams, resetFilters } =
    useTransactionFilters();

  const { data } = useGetTransactionsQuery(queryParams);
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetCategoriesQuery();
  const { data: tagsData, isLoading: isLoadingTags } = useGetTagsQuery();

  const transactions = data?.transactions ?? [];
  const categories = categoriesData?.categories ?? [];
  const tags = tagsData?.tags ?? [];

  return (
    <div className="pt-0 pb-10">
      <Header />
      <States transactions={transactions} />
      <Analytic transactions={transactions} />

      <Filter
        filters={filters}
        onFilterChange={setFilters}
        onReset={resetFilters}
        categories={categories}
        tags={tags}
        isLoadingCategories={isLoadingCategories}
        isLoadingTags={isLoadingTags}
      />

      <Transaction queryParams={queryParams} />
    </div>
  );
};

export default DashboardPage;
