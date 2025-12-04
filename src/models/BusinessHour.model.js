import mongoose from "mongoose";

const BusinessHourSchema = new mongoose.Schema({
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true
  },

  dayOfWeek: { type: Number, required: true }, // 0=domingo
  openTime: { type: String, required: true },
  closeTime: { type: String, required: true },
  intervalMinutes: { type: Number, default: 30 }
});

// un solo horario por día por workspace
BusinessHourSchema.index({ workspace: 1, dayOfWeek: 1 }, { unique: true });

export default mongoose.model("BusinessHour", BusinessHourSchema);
