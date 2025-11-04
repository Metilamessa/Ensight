import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");

    if (!token) {
      return NextResponse.json(
        { message: "Authorization token is required" },
        { status: 401 }
      );
    }

    // Get FormData from request
    const incomingFormData = await req.formData();

    // Validate required fields
    const firstName = incomingFormData.get("first_name");
    const lastName = incomingFormData.get("last_name");
    const email = incomingFormData.get("email");
    const password = incomingFormData.get("password");
    const role = incomingFormData.get("role");
    const profileImage = incomingFormData.get("profile_image");

    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { message: "Missing required fields: first_name, last_name, email, password, role" },
        { status: 400 }
      );
    }

    // Use native FormData (same pattern as article route which works)
    const formDataToSend = new FormData();
    formDataToSend.append("first_name", firstName as string);
    formDataToSend.append("last_name", lastName as string);
    formDataToSend.append("email", email as string);
    formDataToSend.append("password", password as string);
    formDataToSend.append("role", role as string);
    
    // Handle file upload if present
    if (profileImage && profileImage instanceof File) {
      formDataToSend.append("profile_image", profileImage);
    }

    // Log what we're sending for debugging (remove in production)
    console.log("Creating user:", { firstName, lastName, email, role });

    let response;
    try {
      response = await fetch(`${BASE_URL}/profiles/`, {
        method: "POST",
        headers: {
          Authorization: token,
          // Don't set Content-Type - fetch will set it with boundary automatically
        },
        body: formDataToSend,
      });
      
      console.log("Response status:", response.status, response.statusText);
    } catch (fetchError) {
      console.error("Fetch error:", fetchError);
      return NextResponse.json(
        {
          message: "Failed to connect to backend server",
          error: fetchError instanceof Error ? fetchError.message : String(fetchError),
        },
        { status: 503 }
      );
    }

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `Server returned ${response.status}` };
      }
      
      // Handle validation errors from FastAPI
      if (response.status === 422 && errorData.detail) {
        const details = Array.isArray(errorData.detail) 
          ? errorData.detail.map((d: any) => `${d.loc?.join('.')}: ${d.msg}`).join(', ')
          : errorData.detail;
        return NextResponse.json(
          { 
            message: details || errorData.message || "Validation error" 
          },
          { status: response.status }
        );
      }
      
      return NextResponse.json(
        { 
          message: errorData.detail || errorData.message || "Failed to create profile" 
        },
        { status: response.status }
      );
    }

    const createdProfile = await response.json();
    return NextResponse.json(createdProfile, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
export async function GET(req: NextRequest) {
  try {
    const response = await fetch(`${BASE_URL}/profiles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.get("authorization") || "",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || "Failed to fetch profiles" },
        { status: response.status }
      );
    }

    const profiles = await response.json();
    return NextResponse.json(profiles, { status: 200 });
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
