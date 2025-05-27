import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = await req.json();
    if (email !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { walletAddress: true },
    });

    if (!user?.walletAddress) {
      return NextResponse.json({ error: "No wallet found" }, { status: 404 });
    }

    return NextResponse.json({ address: user.walletAddress });
  } catch (error) {
    console.error("Error getting wallet address:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
