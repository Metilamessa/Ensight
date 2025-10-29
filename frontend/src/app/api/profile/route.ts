import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { message: "Request body cannot be empty" },
        { status: 400 }
      );
    }

    const response = await fetch(`${BASE_URL}/Profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.get("authorization") || "",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || "Failed to create profile" },
        { status: response.status }
      );
    }

    const createdProfile = await response.json();
    return NextResponse.json(createdProfile, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
export async function GET(req: NextRequest) {
  try {
    const response = await fetch(`${BASE_URL}/Profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.get("authorization") || "",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || "Failed to fetch profiles" },
        { status: response.status }
      );
    }

    const profiles = await response.json();
    return NextResponse.json(profiles, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
