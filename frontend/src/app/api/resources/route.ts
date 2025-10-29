import { NextResponse, NextRequest } from "next/server";
import { BASE_URL } from "@/lib/constants";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BASE_URL}/resources`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: request.headers.get("Authorization") || "",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { message: error.message || "Failed to fetch resources" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
    //eslint-disable-next-line
  } catch (error: any) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
