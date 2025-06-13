import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Check against environment variables
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_SECRET
    ) {
      return new Response("Invalid credentials", { status: 401 });
    }

    // Set cookie with user info
    (await cookies()).set(
      "auth_token",
      JSON.stringify({ email, isAdmin: true }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 1 week
      }
    );

    return new Response("Logged in successfully", { status: 200 });
  } catch (error) {
    console.error("sign-in error:", error);
    return new Response("Invalid request", { status: 400 });
  }
}
