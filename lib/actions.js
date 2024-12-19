"use server";
import { connectDB } from "./connectDB";
import { Calculator } from "./models";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export const getCalculator = async () => {
  try {
    connectDB();
    let calculator = null;
    calculator = await Calculator.find();
    const data = JSON.parse(JSON.stringify(calculator));
    return data;
  } catch (err) {
    console.log(err);
    throw new Error("Fail to fetch All posts data!!");
  }
};

export const addCalculator = async (formData) => {
  const result = Object.fromEntries(formData);
  const { id, monitor_number, monitor_result } = result;
  try {
    connectDB();
    const newCalculation = new Calculator({
      id,
      monitor_number,
      monitor_result,
    });
    console.log("newCalculation", newCalculation);
    await newCalculation.save();
  } catch (err) {
    console.log(err);
    throw new Error("Fail to save Post!");
  }

  // revalidatePath("/");
  // redirect("/");
};
