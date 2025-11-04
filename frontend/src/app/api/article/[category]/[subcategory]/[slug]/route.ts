import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/lib/constants";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params:  Promise<{ category: string; subcategory: string; slug: string }>;
  }
) {
  const { category, subcategory, slug } = await params;

  if (!category || !subcategory || !slug) {
    return NextResponse.json(
      { message: "Category, subcategory, and slug are required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${BASE_URL}/articles/${category}/${subcategory}/${slug}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: req.headers.get("authorization") || "",
        },
      }
    );

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
