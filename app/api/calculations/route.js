import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("calculatorDB");
    const { monitor_number, result } = await request.json();

    const calculation = await db.collection("calculations").insertOne({
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
    const client = await clientPromise;
    const db = client.db("calculatorDB");

    const calculations = await db
      .collection("calculations")
      .find({})
      .sort({ timestamp: -1 })
      .toArray();

    return Response.json({ success: true, data: calculations });
  } catch (e) {
    return Response.json({ success: false, error: e.message });
  }
}
