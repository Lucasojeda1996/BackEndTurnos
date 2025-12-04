import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },

    slot: { type: mongoose.Schema.Types.ObjectId, ref: "Slot", required: true },

    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "confirmed"
    },

    created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Reservation", ReservationSchema);
