const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      trim: true,
      required: [true, "Please add some text"],
    },
    amount: {
      type: Number,
      required: [true, "Please add a positive or a negative amount"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
