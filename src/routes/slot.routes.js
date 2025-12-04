// routes/slot.routes.js
import { Router } from "express";
import { generateSlots, getAvailableSlots } from "../controllers/slot.controller.js";

const router = Router();

export default router;


router.post("/workspaces/:workspace_id/generate-slots", generateSlots);
router.get("/workspaces/:workspace_id/slots", getAvailableSlots);