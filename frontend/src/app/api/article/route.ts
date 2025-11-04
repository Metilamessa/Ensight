import { NextResponse, NextRequest } from "next/server";
import { BASE_URL } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization");
  
  // Extract query parameters
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const author = searchParams.get("author");
  const tag = searchParams.get("tag");
  
  // Build query string
  const queryParams = new URLSearchParams();
  if (status) queryParams.append("status", status);
  if (author) queryParams.append("author", author);
  if (tag) queryParams.append("tag", tag);
  
  const queryString = queryParams.toString();
  const url = `${BASE_URL}/articles${queryString ? `?${queryString}` : ""}`;
  
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    if (token) {
      headers.Authorization = token;
    }
    
    const response = await fetch(url, {
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { message: error.detail || error.message || "Failed to fetch articles" },
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

    const response = await fetch(`${BASE_URL}/articles/`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: formData,
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
