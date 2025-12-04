import { Router } from "express";
import {
  createBusinessHour,
  getBusinessHours,
  updateBusinessHour,
  deleteBusinessHour
} from "../controllers/businessHour.controller.js";

const router = Router();

router.post("/", createBusinessHour);
router.get("/", getBusinessHours);
router.put("/:id", updateBusinessHour);
router.delete("/:id", deleteBusinessHour);

export default router;
