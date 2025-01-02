"use server";
import { connectDB } from "./connectDB";
import { Standard, Programmer } from "./models";
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

export const getProgrammer = async () => {
  try {
    connectDB();
    let calculator = null;
    calculator = await Programmer.find().sort({ createdAt: -1 });
    const data = JSON.parse(JSON.stringify(calculator));
    return data;
  } catch (err) {
    console.log(err);
    throw new Error("Fail to fetch All posts data!!");
  }
};

export const addProgrammer = async (formData) => {
  const result = Object.fromEntries(formData);
  const { id, monitor_number, monitor_result } = result;
  try {
    connectDB();
    const newCalculator = new Programmer({
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

export const deleteProgrammer = async (formData) => {
  const ids = formData.getAll("id");
  try {
    connectDB();
    await Programmer.deleteMany({
      id: { $in: ids },
    });
  } catch (err) {
    console.log(err);
    throw new Error("Fail to save Post!");
  }
};

export const getProgrammerByDate = async (date) => {
  try {
    connectDB();
    const selectDate = new Date(date);
    selectDate.setHours(0, 0, 0, 0);

    const calculator = await Programmer.find({
      createdAt: {
        $gte: selectDate,
        $lt: new Date(selectDate.getTime() + 24 * 60 * 60 * 1000),
      },
    }).sort({ createdAt: -1 });

    const data = JSON.parse(JSON.stringify(calculator));
    return data;
  } catch (err) {
    console.log(err);
    throw new Error("해당 날짜의 기록을 가져오는데 실패했습니다.");
  }
};
