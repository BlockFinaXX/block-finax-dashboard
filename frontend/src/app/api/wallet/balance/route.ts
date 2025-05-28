import { NextResponse } from "next/server";

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY!;
const ALCHEMY_BASE_URL = "https://base-sepolia.g.alchemy.com/v2";

export async function GET(request: Request) {
  try {
    // Get the full URL and parse it
    const url = new URL(request.url);
    const address = url.searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    if (!ALCHEMY_API_KEY) {
      console.error("Alchemy API key is missing");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    console.log("Fetching balance for address:", address);

    // Use Alchemy's REST API directly
    const response = await fetch(`${ALCHEMY_BASE_URL}/${ALCHEMY_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [address, "latest"],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || "Failed to fetch balance");
    }

    if (!data.result) {
      throw new Error("Invalid response format");
    }

    const balance = BigInt(data.result);
    console.log("Balance fetched successfully:", balance.toString());

    return NextResponse.json({
      balance: balance.toString(),
      address: address,
      network: "base-sepolia",
    });
  } catch (error) {
    console.error("Error fetching balance:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch balance",
        details: error instanceof Error ? error.message : "Unknown error",
        code:
          error instanceof Error && "code" in error ? error.code : undefined,
      },
      { status: 500 }
    );
  }
}
