const mongoose = require("mongoose");

const koreaTimestamp = {
  currentTime: () => {
    const now = new Date();
    const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    return koreaTime;
  },
};

const standardSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    monitor_number: { type: String, required: true },
    monitor_result: { type: String, required: true },
    createdAt: {
      type: Date,
      default: koreaTimestamp.currentTime,
    },
    updatedAt: {
      type: Date,
      default: koreaTimestamp.currentTime,
    },
  },
  {
    timestamps: {
      currentTime: koreaTimestamp.currentTime,
    },
    collection: "standard",
  }
);

const programmerSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    monitor_number: { type: String, required: true },
    monitor_result: { type: String, required: true },
    createdAt: {
      type: Date,
      default: koreaTimestamp.currentTime,
    },
    updatedAt: {
      type: Date,
      default: koreaTimestamp.currentTime,
    },
  },
  {
    timestamps: {
      currentTime: koreaTimestamp.currentTime,
    },
    collection: "programmer",
  }
);

export const Standard =
  mongoose.models.Standard || mongoose.model("Standard", standardSchema);

export const Programmer =
  mongoose.models.Programmer || mongoose.model("Programmer", programmerSchema);
