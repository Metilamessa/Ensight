import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/lib/constants";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization");
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!type) {
      return NextResponse.json(
        { message: "type query parameter is required" },
        { status: 400 }
      );
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = token;
    }

    const response = await fetch(`${BASE_URL}/resources/type?type=${type}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        {
          message:
            error.detail || error.message || "Failed to fetch resources by type",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
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

