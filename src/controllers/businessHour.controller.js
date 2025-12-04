import BusinessHour from "../models/BusinessHour.model.js";

/**
 * Crear horario de atención por día
 * Body:
 * {
 *   dayOfWeek: 1,          // 0=Dom, 1=Lun...
 *   openTime: "08:00",
 *   closeTime: "21:00",
 *   intervalMinutes: 30
 * }
 */
export async function createBusinessHour(req, res) {
  try {
    const { dayOfWeek, openTime, closeTime, intervalMinutes } = req.body;

    if (dayOfWeek === undefined || !openTime || !closeTime) {
      return res.status(400).json({ ok: false, message: "Campos obligatorios: dayOfWeek, openTime, closeTime" });
    }

    const exists = await BusinessHour.findOne({ dayOfWeek });
    if (exists) {
      return res.status(400).json({ ok: false, message: "Ya existe horario para este día" });
    }

    const bh = await BusinessHour.create({
      dayOfWeek,
      openTime,
      closeTime,
      intervalMinutes: intervalMinutes || 30
    });

    return res.json({ ok: true, data: { businessHour: bh }});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, message: "Error creando BusinessHour" });
  }
}

/**
 * Obtener todos los horarios configurados
 */
export async function getBusinessHours(req, res) {
  try {
    const list = await BusinessHour.find().sort({ dayOfWeek: 1 });
    return res.json({ ok: true, data: { businessHours: list }});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, message: "Error obteniendo BusinessHours" });
  }
}

/**
 * Actualizar un horario por ID
 */
export async function updateBusinessHour(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await BusinessHour.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ ok: false, message: "BusinessHour no encontrado" });
    }

    return res.json({ ok: true, data: { businessHour: updated }});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, message: "Error actualizando BusinessHour" });
  }
}

/**
 * Eliminar un horario por ID
 */
export async function deleteBusinessHour(req, res) {
  try {
    const { id } = req.params;

    const deleted = await BusinessHour.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ ok: false, message: "BusinessHour no encontrado" });
    }

    return res.json({ ok: true, message: "BusinessHour eliminado" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, message: "Error eliminando BusinessHour" });
  }
}
