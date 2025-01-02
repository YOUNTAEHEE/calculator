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
  const { id, monitor_number, monitor_result, monitor_date } = result;
  try {
    connectDB();
    const newCalculator = new Standard({
      id,
      monitor_number,
      monitor_result,
      monitor_date,
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
  const { id, monitor_number, monitor_result, monitor_date } = result;
  try {
    connectDB();
    const newCalculator = new Programmer({
      id,
      monitor_number,
      monitor_result,
      monitor_date,
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
    // 'date'를 한국시간(KST) 기준으로 0시부터 23시59분59초 설정
    const startOfDayKST = new Date(`${date}T00:00:00+09:00`);
    const endOfDayKST = new Date(`${date}T23:59:59.999+09:00`);

    const calculator = await Programmer.find({
      createdAt: {
        $gte: startOfDayKST,
        $lte: endOfDayKST,
      },
    })
      .sort({ createdAt: -1 }) // 최신 데이터 먼저
      .lean();

    const data = JSON.parse(JSON.stringify(calculator));
    return data;
  } catch (err) {
    console.log(err);
    throw new Error("해당 날짜의 기록을 가져오는데 실패했습니다.");
  }
};

export const getStandardByDate = async (date) => {
  try {
    connectDB();
    // 'date'를 한국시간(KST) 기준으로 0시부터 23시59분59초 설정
    const startOfDayKST = new Date(`${date}T00:00:00+09:00`);
    const endOfDayKST = new Date(`${date}T23:59:59.999+09:00`);

    const calculator = await Standard.find({
      createdAt: {
        $gte: startOfDayKST,
        $lte: endOfDayKST,
      },
    })
      .sort({ createdAt: -1 }) // 최신 데이터 먼저
      .lean();

    const data = JSON.parse(JSON.stringify(calculator));
    return data;
  } catch (err) {
    console.log(err);
    throw new Error("해당 날짜의 기록을 가져오는데 실패했습니다.");
  }
};
