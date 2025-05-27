import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  walletAddress: { type: String, default: null },
  address: { type: String, required: true }, // Owner's address
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
