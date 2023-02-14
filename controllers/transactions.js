const jwt = require("jsonwebtoken");
const Transaction = require("../models/transaction");

// @desc: Get all transactions
// @route: GET /api/v1/transactions
// @access: Public
exports.getTransactions = async (req, res, next) => {
  try {
    const user = req.user;
    const transactions = await Transaction.find({ user: user._id }).populate(
      "user",
      ["name", "email"]
    );
    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc: Add transactions
// @route: POST /api/v1/transactions
// @access: Public
exports.addTransactions = async (req, res, next) => {
  try {
    const user = req.user;
    const transaction = await Transaction.create({
      ...req.body,
      user: user.id,
    });
    return res.status(201).json({
      data: transaction,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);

      return res.status(400).json({
        error: messages,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  }
};

// @desc: Delete transactions
// @route: DELETE /api/v1/transactions/:id
// @access: Public
exports.deleteTransactions = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: "No transaction found",
      });
    }

    await transaction.remove();

    return res.status(200).json({
      success: true,
      message: "Transaction removed",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};
