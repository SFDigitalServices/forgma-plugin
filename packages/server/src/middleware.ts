import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest)
{
	if (request.method === "OPTIONS") {
		return NextResponse.json({});
	}

	return NextResponse.next();
}

export const config = {
	matcher: "/api/:path*",
};
