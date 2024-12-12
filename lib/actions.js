"use server";
import { connectDB } from "./connectDB";

export const getCalculator = async (id) => {
  try {
    connectDB();
    let calculator = null;
    if (id) calculator = await Calculator.findById(id);
    return calculator;
  } catch (err) {
    console.log(err);
    throw new Error("Fail to fetch All posts data!!");
  }
};

export const addCalculator = async (formData) => {
  const result = Object.fromEntries(formData);
  const { monitor_number, monitor_result } = result;

  try {
    connectDB();
    const newCalculation = new Calculation({ monitor_number, monitor_result });
    console.log("newPost", newPost);
    await newCalculation.save();
  } catch (err) {
    console.log(err);
    throw new Error("Fail to save Post!");
  }

  revalidatePath("/");
  redirect("/");
};
