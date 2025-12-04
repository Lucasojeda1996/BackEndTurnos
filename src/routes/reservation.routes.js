import express from "express";
import { createReservation, listMyReservations, cancelReservation } from "../controllers/reservation.controller.js";
import { getAvailableSlots, generateSlots } from "../controllers/slot.controller.js"; // ajustar export names
import authMiddleware from "../middleware/auth.middleware.js";
import requireAdmin from "../middleware/requireAdmin.middleware.js";

const router = express.Router();

router.get("/slots", authMiddleware, getAvailableSlots); // ?date=YYYY-MM-DD
router.post("/slots/generate", authMiddleware, requireAdmin, generateSlots); // admin genera slots

router.post("/reservations", authMiddleware, createReservation);
router.get("/reservations/me", authMiddleware, listMyReservations);
router.put("/reservations/:id/cancel", authMiddleware, cancelReservation);

// payments
// router.post("/payments", authMiddleware, createPayment);

export default router;
