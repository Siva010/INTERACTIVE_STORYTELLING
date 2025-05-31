const xlsx = require("xlsx");
const Income = require("../models/Income");
const moment = require("moment"); // Added moment for date calculations

//Add Income source
exports.addIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, source, amount, date } = req.body;

    // Validation: Check for missing fields
    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date),
      type: "income", // Ensure type is set
    });
    await newIncome.save();
    res.status(200).json(newIncome);
  } catch (error) {
    console.error("Error adding income:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Get All Income source with Aggregates
exports.getAllIncome = async (req, res) => {
  const userId = req.user.id;
  try {
    // Sort by createdAt descending to get newest first reliably
    const allIncome = await Income.find({ userId }).sort({ createdAt: -1 });

    // Calculate Total Income
    const totalIncome = allIncome.reduce((sum, item) => sum + item.amount, 0);

    // Calculate Monthly Income (Based on the month of the MOST RECENT transaction)
    let monthlyIncome = 0;
    if (allIncome.length > 0) {
      const mostRecentDate = moment(allIncome[0].date);
      const startOfMonth = mostRecentDate.clone().startOf('month').toDate();
      const endOfMonth = mostRecentDate.clone().endOf('month').toDate();

      monthlyIncome = allIncome
        .filter(item => moment(item.date).isBetween(startOfMonth, endOfMonth, null, '[]')) // '[]' includes start and end dates
        .reduce((sum, item) => sum + item.amount, 0);
    }

    // Rename allIncome to transactions and remove recentIncomes slice
    res.json({
      totalIncome,
      monthlyIncome, // Now calculated based on most recent transaction's month
      transactions: allIncome // Return the full list
    });

  } catch (error) {
    console.error("Error fetching incomes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//deleteIncome  source
exports.deleteIncome = async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    console.error("Error deleting income:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//download IncomeExcel
exports.downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id;
  try {
    const income = await Income.find({ userId }).sort({ date: -1 });

    // Prepare data for Excel
    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date,
    }));
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");
    xlsx.writeFile(wb, "income_details.xlsx");
    res.download("income_details.xlsx");
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
