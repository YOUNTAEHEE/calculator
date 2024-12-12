const mongoose = require("mongoose");

const calculatorSchema = new mongoose.Schema(
  {
    monitor_number: { type: String, required: true },
    result: { type: String, required: true },
  },
  { timestamps: true }
);

export const Calculator =
  mongoose.models.Calculator || mongoose.model("Calculator", calculatorSchema);
