const mongoose = require("mongoose");

const standardSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    monitor_number: { type: String, required: true },
    monitor_result: { type: String, required: true },
  },
  { timestamps: true, collection: "standard" }
);

export const Standard =
  mongoose.models.Standard || mongoose.model("Standard", standardSchema);
