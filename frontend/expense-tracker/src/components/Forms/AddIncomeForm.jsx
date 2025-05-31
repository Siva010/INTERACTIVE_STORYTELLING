import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

// Simple reusable Input component (or use a library like Tailwind Forms)
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

const AddIncomeForm = ({ onIncomeAdded }) => {
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!source || !amount || !date) {
      setError("Please fill in all fields.");
      return;
    }

    const incomeAmount = parseFloat(amount);
    if (isNaN(incomeAmount) || incomeAmount <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount: incomeAmount,
        date,
        // icon: "some-default-icon-url-if-needed" // Optional: add default icon if backend requires
      });

      if (response.data) {
        // Clear form
        setSource("");
        setAmount("");
        setDate(new Date().toISOString().split("T")[0]);
        // Notify parent component to refresh data
        if (onIncomeAdded) {
          onIncomeAdded();
        }
        // TODO: Add a success notification (e.g., using react-toastify)
        console.log("Income added successfully!");
      }
    } catch (err) {
      console.error("Error adding income:", err);
      setError(err.response?.data?.message || "Failed to add income. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h5 className="text-lg mb-4">Add New Income</h5>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Income Source (Name)"
          id="income-source"
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="e.g., Salary, Freelance Project"
          required
        />

        <Input
          label="Amount (Money)"
          id="income-amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g., 1500"
          min="0.01" // Basic validation
          step="0.01" // Allow decimals
          required
        />

        <Input
          label="Date"
          id="income-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Adding..." : "Add Income"}
        </button>
      </form>
    </div>
  );
};

export default AddIncomeForm; 