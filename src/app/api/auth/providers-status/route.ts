import { NextResponse } from "next/server";
import { isRegistrationEnabled } from "@/lib/env";

export async function GET() {
  return NextResponse.json({
    registrationEnabled: isRegistrationEnabled(),
    googleEnabled:
      !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET,
  });
}
