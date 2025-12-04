import Reservation from "../models/Reservation.model.js";
import Slot from "../models/Slot.model.js";
import mongoose from "mongoose";

/**
 * Regla: un usuario solo puede reservar 1 turno por semana.
 * POST /reservations
 * Body: { slotId }
 * Auth: req.user (user id)
 */
export async function createReservation(req, res) {
  try {
    const userId = req.user?.id || req.user?._id;
    const { slotId } = req.body;
    if (!userId) return res.status(401).json({ ok: false, message: "No autorizado" });
    if (!slotId) return res.status(400).json({ ok: false, message: "slotId requerido" });

    // Verificar slot existente y disponible
    const slot = await Slot.findById(slotId);
    if (!slot) return res.status(404).json({ ok: false, message: "Slot no encontrado" });
    if (!slot.isAvailable) return res.status(409).json({ ok: false, message: "Slot no disponible" });

    // Validación: 1 reserva por semana
    // Obtenemos inicio y fin de la semana del slot.startsAt (ISO week: usamos domingo-lunes simple)
    const startsAt = new Date(slot.startsAt);
    // calculo: semana que contiene startsAt (lunes como inicio)
    const day = startsAt.getDay(); // 0..6 domingo..sabado
    const diffToMonday = (day + 6) % 7; // 0->Monday offset
    const monday = new Date(startsAt);
    monday.setDate(startsAt.getDate() - diffToMonday);
    monday.setHours(0,0,0,0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23,59,59,999);

    const existing = await Reservation.findOne({
      user: mongoose.Types.ObjectId(userId),
      createdAt: { $gte: monday, $lte: sunday },
      status: { $ne: "cancelled" }
    });

    if (existing) {
      return res.status(409).json({ ok: false, message: "Solo se permite una reserva por semana" });
    }

    // Guardar reserva, marcar slot no disponible
    const reservation = new Reservation({
      user: mongoose.Types.ObjectId(userId),
      slot: slot._id,
      status: "confirmed",
      createdAt: new Date()
    });

    // atomizar: actualizar slot + crear reserva
    const session = await Reservation.startSession();
    session.startTransaction();
    try {
      slot.isAvailable = false;
      await slot.save({ session });
      await reservation.save({ session });
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }

    return res.status(201).json({ ok: true, message: "Reserva creada", data: { reservation }});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, message: "Error creando reserva" });
  }
}

/**
 * GET /reservations/me
 */
export async function listMyReservations(req, res) {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ ok: false, message: "No autorizado" });

    const reservations = await Reservation.find({ user: userId }).populate({
      path: "slot",
      select: "date time startsAt endsAt"
    }).sort({ createdAt: -1 });

    return res.json({ ok: true, data: { reservations }});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, message: "Error listando reservas" });
  }
}

/**
 * PUT /reservations/:id/cancel
 */
export async function cancelReservation(req, res) {
  try {
    const reservationId = req.params.id;
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ ok: false, message: "No autorizado" });

    const reservation = await Reservation.findById(reservationId).populate("slot");
    if (!reservation) return res.status(404).json({ ok: false, message: "Reserva no encontrada" });

    // Solo quien reservó o admin puede cancelar
    if (reservation.user.toString() !== userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({ ok: false, message: "No autorizado a cancelar" });
    }

    reservation.status = "cancelled";
    await reservation.save();

    // Reabrir slot
    const slot = await Slot.findById(reservation.slot._id);
    if (slot) {
      slot.isAvailable = true;
      await slot.save();
    }

    return res.json({ ok: true, message: "Reserva cancelada" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, message: "Error cancelando reserva" });
  }
}
