
import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    business_hours: {
        start: { type: String, default: "08:00" },
        end: { type: String, default: "21:00" },
        interval: { type: Number, default: 30 } // minutos
    },

    created_at: { type: Date, default: Date.now }
    }
)

const Workspaces = mongoose.model('Workspace', workspaceSchema)

export default Workspaces