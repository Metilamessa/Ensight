import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/lib/constants";

export async function GET(
  req: NextRequest,
 context: { params: Promise<{ user_id: string }> }
) {
  const params = await context.params;
  const { user_id } = params;

  try {
    const response = await fetch(`${BASE_URL}/Profile/${user_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.get("authorization") || "",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || "User not found" },
        { status: response.status }
      );
    }

    const userData = await response.json();
    return NextResponse.json(userData, { status: 200 });
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

export async function PATCH(
  req: NextRequest,
 context: { params: Promise<{ user_id: string }> }
) {
  const params = await context.params;
  const { user_id } = params;

  try {
    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { message: "Request body cannot be empty" },
        { status: 400 }
      );
    }

    const response = await fetch(`${BASE_URL}/Profile/${user_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.get("authorization") || "",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || "Failed to update user" },
        { status: response.status }
      );
    }

    const updatedUserData = await response.json();
    return NextResponse.json(updatedUserData, { status: 200 });
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
