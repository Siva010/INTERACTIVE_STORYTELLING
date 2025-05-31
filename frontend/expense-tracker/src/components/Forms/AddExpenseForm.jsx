import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useDashboard } from "../../context/DashboardContext";

// Simple reusable Input component (can be moved to its own file)
const Input = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={id}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
      {...props}
    />
  </div>
);

// Simple reusable Select component
const Select = ({ label, id, children, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      id={id}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white"
      {...props}
    >
      {children}
    </select>
  </div>
);

// --- ICON OPTIONS --- 
// IMPORTANT: Replace these placeholder URLs with actual, publicly accessible image URLs!
const iconOptions = [
  { value: "", label: "Select an Icon (Optional)" },
  { value: "https://example.com/icons/food.png", label: "Food" },           // Replace URL
  { value: "https://example.com/icons/transport.png", label: "Transport" },  // Replace URL
  { value: "https://example.com/icons/bills.png", label: "Bills" },        // Replace URL
  { value: "https://example.com/icons/shopping.png", label: "Shopping" },   // Replace URL
  { value: "https://example.com/icons/entertainment.png", label: "Entertainment" }, // Replace URL
  { value: "https://example.com/icons/health.png", label: "Health" },       // Replace URL
  { value: "https://example.com/icons/other.png", label: "Other" },        // Replace URL
];
// --- END ICON OPTIONS ---

const AddExpenseForm = ({ onExpenseAdded }) => {
  const { refreshDashboard } = useDashboard();
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation without icon
    if (!category || !amount || !date) {
      setError("Please fill in Category, Amount, and Date.");
      return;
    }

    const expenseAmount = parseFloat(amount);
    if (isNaN(expenseAmount) || expenseAmount <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }

    setLoading(true);

    try {
      // Payload without icon
      const payload = {
        category,
        amount: expenseAmount,
        date,
      };

      const response = await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, payload);

      if (response.data) {
        setCategory("");
        setAmount("");
        setDate(new Date().toISOString().split("T")[0]);
        if (onExpenseAdded) {
          onExpenseAdded();
        }
        refreshDashboard(); // Use the context function to refresh dashboard
        console.log("Expense added successfully!");
      }
    } catch (err) {
      console.error("Error adding expense:", err);
      setError(err.response?.data?.message || "Failed to add expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h5 className="text-lg mb-4">Add New Expense</h5>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Expense Category"
          id="expense-category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g., Food, Transport, Bills"
          required
        />

        <Input
          label="Amount (Money)"
          id="expense-amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g., 50.75"
          min="0.01"
          step="0.01"
          required
        />

        <Input
          label="Date"
          id="expense-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Adding..." : "Add Expense"}
        </button>
      </form>
    </div>
  );
};

export default AddExpenseForm; 