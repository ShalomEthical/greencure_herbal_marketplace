import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, email, phone, date, time, message } = await req.json();

    if (!name || !email || !phone || !date || !time || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const consultation = await db.consultation.create({
      data: {
        name,
        email,
        phone,
        date,
        time,
        message,
        status: "PENDING",
      },
    });

    return NextResponse.json(consultation, { status: 201 });
  } catch (error: any) {
    console.error("Book consultation error:", error);
    return NextResponse.json(
      { error: "Failed to book consultation" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // Admin checking can be added
    const consultations = await db.consultation.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(consultations);
  } catch (error: any) {
    console.error("Fetch consultations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch consultations" },
      { status: 500 }
    );
  }
}
