import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/lib/constants";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ user_id: string }> }
) {
  try {
    const params = await context.params;
    const { user_id } = params;
    const token = req.headers.get("authorization");

    if (!token) {
      return NextResponse.json(
        { message: "Authorization token is required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { article_id } = body;

    if (!article_id) {
      return NextResponse.json(
        { message: "article_id is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${BASE_URL}/profiles/${user_id}/saved_articles`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ article_id }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          message:
            errorData.detail || errorData.message || "Failed to save article",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
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

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ user_id: string }> }
) {
  try {
    const params = await context.params;
    const { user_id } = params;
    const token = req.headers.get("authorization");

    if (!token) {
      return NextResponse.json(
        { message: "Authorization token is required" },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${BASE_URL}/profiles/${user_id}/saved_articles`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          message:
            errorData.detail ||
            errorData.message ||
            "Failed to fetch saved articles",
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

