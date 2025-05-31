import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import InfoCard from "../../components/Cards/InfoCard";
import { LuWalletMinimal } from "react-icons/lu";
import { addThousandsSeparator } from "../../utils/helper";
import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import FinanceOverview from "../../components/Dashboard/FinanceOverview";
import AddIncomeForm from "../../components/Forms/AddIncomeForm";
import TransactionList from "../../components/Dashboard/TransactionList";

const Income = () => {
  useUserAuth();

  const [incomeData, setIncomeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deleteError, setDeleteError] = useState("");

  const fetchIncomeData = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);

      if (response.data) {
        // Backend now returns the correct structure, so use it directly
        setIncomeData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong fetching income. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncomeAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDeleteTransaction = async (id, type) => {
    if (type !== 'income') return;
    
    setDeleteError("");
    
    try {
      const response = await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      
      if (response.data) {
        console.log("Income deleted successfully:", id);
        handleIncomeAdded();
      }
    } catch (err) {
      console.error("Error deleting income:", err);
      setDeleteError(err.response?.data?.message || "Failed to delete income.");
    }
  };

  useEffect(() => {
    fetchIncomeData();
  }, [refreshTrigger]);

  // Default values for rendering before data loads
  const totalIncome = incomeData?.totalIncome || 0;
  const monthlyIncome = incomeData?.monthlyIncome || 0;
  const allTransactions = incomeData?.transactions || [];

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousandsSeparator(totalIncome)}
            color="bg-orange-500"
          />
          <InfoCard
            icon={<LuWalletMinimal />}
            label="This Month's Income"
            value={addThousandsSeparator(monthlyIncome)}
            color="bg-green-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <AddIncomeForm onIncomeAdded={handleIncomeAdded} />
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <TransactionList
              transactions={allTransactions}
              title="Income Transactions"
              type="income"
              onDelete={handleDeleteTransaction}
            />

            <FinanceOverview
              pageType="income"
              totalIncome={totalIncome}
              monthlyIncome={monthlyIncome}
            />
          </div>
        </div>

        {deleteError && <p className="text-red-500 text-sm mt-4 text-center">{deleteError}</p>}
      </div>
    </DashboardLayout>
  );
};

export default Income;
