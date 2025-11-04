import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/lib/constants";

export async function DELETE(
  req: NextRequest,
  context: {
    params: Promise<{ user_id: string; article_id: string }>;
  }
) {
  try {
    const params = await context.params;
    const { user_id, article_id } = params;
    const token = req.headers.get("authorization");

    if (!token) {
      return NextResponse.json(
        { message: "Authorization token is required" },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${BASE_URL}/profiles/${user_id}/saved_articles/${article_id}`,
      {
        method: "DELETE",
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
            "Failed to remove saved article",
        },
        { status: response.status }
      );
    }

    // DELETE returns 204 No Content, but NextResponse needs a body
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

