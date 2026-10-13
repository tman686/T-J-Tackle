import { NextResponse } from "next/server";

// Lightweight health check for Render's health probe. Intentionally does NOT
// import the database client so the endpoint (and the deploy) stays green even
// before a database is connected. Reports whether a DB URL is configured.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "jt-tackle-website",
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    time: new Date().toISOString(),
  });
}
