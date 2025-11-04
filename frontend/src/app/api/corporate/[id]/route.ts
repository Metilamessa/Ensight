import { NextResponse, NextRequest } from "next/server";
import { BASE_URL } from "@/lib/constants";

export async function GET(
  request: NextRequest,
 context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const { id } = params;

  try {
    const response = await fetch(`${BASE_URL}/corporate/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { message: error.message || "Failed to fetch corporate article" },
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

export async function PATCH(
  request: NextRequest,
 context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const formData = await request.formData();
    const token = request.headers.get("Authorization");
    const { id } = params;

    if (!token) {
      return NextResponse.json(
        { message: "Authorization token is required" },
        { status: 401 }
      );
    }

    const response = await fetch(`${BASE_URL}/corporate/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: token,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { message: error.message || "Failed to update corporate article" },
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

export async function DELETE(
  request: NextRequest,
 context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const token = request.headers.get("Authorization");
    const { id } = params;

    if (!token) {
      return NextResponse.json(
        { message: "Authorization token is required" },
        { status: 401 }
      );
    }

    const response = await fetch(`${BASE_URL}/corporate/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { message: error.message || "Failed to delete corporate article" },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Corporate article deleted successfully" },
      { status: 200 }
    );
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
