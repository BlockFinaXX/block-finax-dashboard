import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { connectDB } from "../../../../lib/db";

import User from "../../../../models/user";
import { signJwt } from "../../../../utils/jwt";

export async function POST(req: NextRequest) {
  try {
    const { email, password, ownerAddress } = await req.json();

    if (!email || !password || !ownerAddress) {
      return NextResponse.json(
        { error: "Email, password, and owner address are required" },
        { status: 400 }
      );
    }

    // Create wallet first
    const walletResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wallet/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ownerAddress }),
      }
    );

    if (!walletResponse.ok) {
      const error = await walletResponse.json();
      return NextResponse.json(
        { error: error.message || "Failed to create wallet" },
        { status: walletResponse.status }
      );
    }

    const { walletAddress } = await walletResponse.json();

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hash(password, 12);

    // Create new user
    const user = await User.create({
      email,
      passwordHash,
      walletAddress,
      address: ownerAddress,
    });

    // Generate JWT token
    const token = signJwt({ userId: user._id });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        walletAddress: user.walletAddress,
        address: user.address,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
