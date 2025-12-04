import mongoose from "mongoose";

const SlotSchema = new mongoose.Schema({
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true
  },

  date: { type: String, required: true },
  time: { type: String, required: true },

  startsAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },

  isAvailable: { type: Boolean, default: true }
});

// evitar duplicados
SlotSchema.index({ workspace: 1, date: 1, time: 1 }, { unique: true });

export default mongoose.model("Slot", SlotSchema);
