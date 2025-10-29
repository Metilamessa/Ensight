import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email, password, and confirm password are required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || "Signup failed" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(
      {
        user: data.user,
        token: data.access_token,
      },
      { status: 200 }
    );
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
