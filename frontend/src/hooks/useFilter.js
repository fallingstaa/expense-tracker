import { useMemo, useState } from "react";

const initialFilters = {
  type: "all",
  category: "",
  tag: "",
  startDate: "",
  endDate: "",
  minAmount: "",
  maxAmount: "",
};

const useTransactionFilters = () => {
  const [filters, setFilters] = useState(initialFilters);

  const queryParams = useMemo(() => {
    const params = {};

    if (filters.type && filters.type !== "all") {
      params.type = filters.type;
    }

    if (filters.category) {
      params.category = filters.category;
    }

    if (filters.tag?.trim()) {
      params.tags = filters.tag.trim();
    }

    if (filters.startDate) {
      params.startDate = filters.startDate;
    }

    if (filters.endDate) {
      params.endDate = filters.endDate;
    }

    if (filters.minAmount !== "") {
      params.minAmount = filters.minAmount;
    }

    if (filters.maxAmount !== "") {
      params.maxAmount = filters.maxAmount;
    }

    return params;
  }, [filters]);

  const resetFilters = () => setFilters(initialFilters);

  return {
    filters,
    setFilters,
    queryParams,
    resetFilters,
  };
};

export default useTransactionFilters;
