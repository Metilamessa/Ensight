import { NextResponse, NextRequest } from "next/server";
import { BASE_URL } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization");

  if (!token) {
    return NextResponse.json(
      { message: "Authorization token is required" },
      { status: 401 }
    );
  }
  try {
    const response = await fetch(`${BASE_URL}/articles`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { message: error.message || "Failed to fetch articles" },
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const articleData = formData.get("article_data");
    const image = formData.get("image");
    const token = request.headers.get("Authorization");

    if (!token) {
      return NextResponse.json(
        { message: "Authorization token is required" },
        { status: 401 }
      );
    }

    if (!articleData || !image) {
      return NextResponse.json(
        { message: "article_data and image are required" },
        { status: 400 }
      );
    }

    const formDataToSend = new FormData();
    formDataToSend.append("article_data", articleData);
    formDataToSend.append("image", image);

    const response = await fetch(`${BASE_URL}/articles/`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: formDataToSend,
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { message: error.detail || "Failed to create article" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
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
