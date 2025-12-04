import BusinessHour from "../models/BusinessHour.model.js";
import Slot from "../models/Slot.model.js";

export async function generateSlots(req, res) {
  try {
    const { workspace_id } = req.params;
    const { dateFrom, dateTo } = req.body;

    if (!workspace_id) {
      return res.status(400).json({ ok: false, message: "workspace_id requerido" });
    }

    if (!dateFrom || !dateTo) {
      return res.status(400).json({ ok: false, message: "dateFrom y dateTo requeridos" });
    }

    const startDate = new Date(dateFrom);
    const endDate = new Date(dateTo);

    const businessHours = await BusinessHour.find({ workspace: workspace_id });
    const bhByDay = {};
    businessHours.forEach(bh => { bhByDay[bh.dayOfWeek] = bh });

    const created = [];

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const day = d.getDay();
      const bh = bhByDay[day];
      if (!bh) continue;

      const [openH, openM] = bh.openTime.split(":").map(Number);
      const [closeH, closeM] = bh.closeTime.split(":").map(Number);
      const interval = bh.intervalMinutes;

      const base = new Date(d);
      base.setHours(openH, openM, 0, 0);

      const close = new Date(d);
      close.setHours(closeH, closeM, 0, 0);

      for (let cur = new Date(base); cur < close; cur.setMinutes(cur.getMinutes() + interval)) {
        const startsAt = new Date(cur);
        const endsAt = new Date(cur);
        endsAt.setMinutes(endsAt.getMinutes() + interval);

        const dateKey = startsAt.toISOString().slice(0, 10);
        const timeKey = startsAt.toTimeString().slice(0, 5);

        try {
          const slot = await Slot.create({
            workspace: workspace_id,
            date: dateKey,
            time: timeKey,
            startsAt,
            endsAt,
            isAvailable: true
          });

          created.push(slot);
        } catch (err) {
          continue;
        }
      }
    }

    return res.json({
      ok: true,
      message: "Slots generados",
      data: { createdCount: created.length }
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: "Error interno generando slots" });
  }
}

export async function getAvailableSlots(req, res) {
  try {
    const { workspace_id } = req.params;
    const { date } = req.query;

    if (!workspace_id) {
      return res.status(400).json({ ok: false, message: "workspace_id requerido" });
    }

    const dateKey = date || new Date().toISOString().slice(0, 10);

    const slots = await Slot.find({
      workspace: workspace_id,
      date: dateKey,
      isAvailable: true
    }).sort({ startsAt: 1 });

    return res.json({ ok: true, data: { slots } });
  } catch (error) {
    return res.status(500).json({ ok: false, message: "Error obteniendo slots" });
  }
}
