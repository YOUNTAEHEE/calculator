const mongoose = require("mongoose");

const calculatorSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    monitor_number: { type: String, required: true },
    monitor_result: { type: String, required: true },
  },
  { timestamps: true, collection: "calculators" }
);

export const Calculator =
  mongoose.models.Calculator || mongoose.model("Calculator", calculatorSchema);
