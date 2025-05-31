import React from "react";
import moment from "moment";
import TransactionInfoCard from "../Cards/TransactionInfoCard";

// Keep name for now, will rename later if successful
const RecentTransactions = ({ transactions, title = "Recent Transactions", type }) => {
  return (
    // Ensure card takes full height of its grid area and children can flex
    <div className="card h-full flex flex-col"> 
      <div className="flex-shrink-0 flex items-center justify-between mb-4"> {/* Prevent header shrinking, add margin */} 
        <h5 className="text-lg">{title}</h5>
      </div>

      {/* Scrollable container */}
      {/* Adjust max-h-XX class as needed. Example: max-h-[400px] or max-h-96 */}
      <div className="flex-grow overflow-y-auto space-y-2 pr-1"> {/* Added flex-grow, scroll, spacing, padding */} 
        {transactions?.map((item) => ( // Removed slice
          <TransactionInfoCard
            key={item._id}
            title={item.type === "income" ? item.source : item.category}
            date={item.date}
            amount={item.amount}
            type={item.type}
            hideDeleteBtn
          />
        ))}
        {/* Optional: Add message if transactions array is empty */}
        {(!transactions || transactions.length === 0) && (
          <p className="text-center text-gray-500 text-sm py-4">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
