const mongoose = require("mongoose");

const IncomeScheme = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    icon: { type: String },
    source: { type: String, required: true }, // Example: Salary, Freelance, etc.
    amount: { type: Number, required: true }, // Example: 5000
    date: { type: Date, default: Date.now }, // Example: 2023-10-01
    type: { type: String, default: "income" }, // Added type field
  },
  { timestamps: true }
);

module.exports = mongoose.model("Income", IncomeScheme);
