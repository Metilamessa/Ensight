import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/lib/constants";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ plan_id: string }> }
) {
  try {
    const params = await context.params;
    const token = request.headers.get("Authorization");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = token;
    }

    const response = await fetch(`${BASE_URL}/subscribe/${params.plan_id}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        {
          message:
            error.detail ||
            error.message ||
            "Failed to fetch subscription plan",
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

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ plan_id: string }> }
) {
  try {
    const params = await context.params;
    const token = request.headers.get("Authorization");

    if (!token) {
      return NextResponse.json(
        { message: "Authorization token is required" },
        { status: 401 }
      );
    }

    const response = await fetch(`${BASE_URL}/subscribe/${params.plan_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        {
          message:
            error.detail ||
            error.message ||
            "Failed to delete subscription plan",
        },
        { status: response.status }
      );
    }

    // DELETE returns 204 No Content
    return new NextResponse(null, { status: 204 });
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

