import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/lib/constants";

export async function GET(
  req: NextRequest,
 context: { params: Promise<{ user_id: string }> }
) {
  const params = await context.params;
  const { user_id } = params;

  try {
    const response = await fetch(`${BASE_URL}/profiles/${user_id}`, {
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
    const formData = await req.formData();
    const token = req.headers.get("authorization");

    if (!token) {
      return NextResponse.json(
        { message: "Authorization token is required" },
        { status: 401 }
      );
    }

    // Build FormData for backend - handle all fields
    const formDataToSend = new FormData();
    
    // Add form fields if they exist
    const first_name = formData.get("first_name");
    const last_name = formData.get("last_name");
    const email = formData.get("email");
    const enable_personalization = formData.get("enable_personalization");
    const track_reading_progress = formData.get("track_reading_progress");
    const content_update_notifications = formData.get("content_update_notifications");
    const topics = formData.get("topics");
    const profile_image = formData.get("profile_image");

    if (first_name) formDataToSend.append("first_name", first_name as string);
    if (last_name) formDataToSend.append("last_name", last_name as string);
    if (email) formDataToSend.append("email", email as string);
    if (enable_personalization !== null) {
      formDataToSend.append("enable_personalization", enable_personalization as string);
    }
    if (track_reading_progress !== null) {
      formDataToSend.append("track_reading_progress", track_reading_progress as string);
    }
    if (content_update_notifications !== null) {
      formDataToSend.append("content_update_notifications", content_update_notifications as string);
    }
    if (topics) {
      // If topics is a string, use it; if it's already JSON, stringify it
      if (typeof topics === "string") {
        formDataToSend.append("topics", topics);
      } else {
        formDataToSend.append("topics", JSON.stringify(topics));
      }
    }
    if (profile_image && profile_image instanceof File) {
      formDataToSend.append("profile_image", profile_image);
    }

    const response = await fetch(`${BASE_URL}/profiles/${user_id}`, {
      method: "PATCH",
      headers: {
        Authorization: token,
      },
      body: formDataToSend,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.detail || errorData.message || "Failed to update profile" },
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
