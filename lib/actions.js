"use server";
import { connectDB } from "./connectDB";
import { Standard } from "./models";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export const getStandard = async () => {
  try {
    connectDB();
    let calculator = null;
    calculator = await Standard.find().sort({ createdAt: -1 });
    const data = JSON.parse(JSON.stringify(calculator));
    return data;
  } catch (err) {
    console.log(err);
    throw new Error("Fail to fetch All posts data!!");
  }
};

export const addStandard = async (formData) => {
  const result = Object.fromEntries(formData);
  const { id, monitor_number, monitor_result } = result;
  try {
    connectDB();
    const newCalculator = new Standard({
      id,
      monitor_number,
      monitor_result,
    });
    console.log("newCalculator", newCalculator);
    await newCalculator.save();
  } catch (err) {
    console.log(err);
    throw new Error("Fail to save Post!");
  }
};

export const deleteStandard = async (formData) => {
  const ids = formData.getAll("id");
  try {
    connectDB();
    await Standard.deleteMany({
      id: { $in: ids },
    });
  } catch (err) {
    console.log(err);
    throw new Error("Fail to save Post!");
  }
};
