import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { connectDB } from "../../../../lib/db";
import User from "../../../../models/user";
import { signJwt } from "../../../../utils/jwt";

export async function POST(req: NextRequest) {
  try {
    const { email, password, ownerAddress } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // If ownerAddress is provided, verify it matches the user's address
    if (
      ownerAddress &&
      ownerAddress.toLowerCase() !== user.address.toLowerCase()
    ) {
      return NextResponse.json(
        { error: "Invalid wallet address" },
        { status: 401 }
      );
    }

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
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
