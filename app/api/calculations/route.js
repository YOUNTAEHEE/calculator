import { connectDB } from "./mongodb";

export async function POST(request) {
  try {
    connectDB();
    const { monitor_number, result } = await request.json();
    const calculation = await db.collection("study").insertOne({
      formula: monitor_number,
      result: result,
      timestamp: new Date(),
    });

    return Response.json({ success: true, data: calculation });
  } catch (e) {
    return Response.json({ success: false, error: e.message });
  }
}

export async function GET() {
  try {
    connectDB();

    const calculations = await db
      .collection("study")
      .find({})
      .sort({ timestamp: -1 })
      .toArray();

    return Response.json({ success: true, data: calculations });
  } catch (e) {
    return Response.json({ success: false, error: e.message });
  }
}
