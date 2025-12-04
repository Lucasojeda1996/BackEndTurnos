import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  reservation: { type: mongoose.Schema.Types.ObjectId, ref: "Reservation", required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "ARS" },
  status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  provider: { type: String }, // 'stripe', 'mercadopago', etc
  providerResponse: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
