import { NextResponse, NextRequest } from "next/server";
import { BASE_URL } from "@/lib/constants";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params:  Promise<{ category: string; subcategory: string }>;
  }
) {
  const { category, subcategory } = await params;

  if (!category || !subcategory) {
    return NextResponse.json(
      { message: "Category and subcategory are required" },
      { status: 400 }
    );
  }
  
  console.log("Fetching articles for:", category, subcategory);

  try {
    const response = await fetch(
      `${BASE_URL}/articles/${category}/${subcategory}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: req.headers.get("authorization") || "",
        },
      }
    );

    console.log("Fetch response status:", response.status);

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
