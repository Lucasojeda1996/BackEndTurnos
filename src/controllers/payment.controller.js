import Payment from "../models/Payment.model.js";
import Reservation from "../models/Reservation.model.js";

/**
 * POST /payments
 * Body: { reservationId, amount, provider }
 * -> aquí integrarías Stripe / MercadoPago / etc
 */
export async function createPayment(req, res) {
  try {
    const { reservationId, amount, provider } = req.body;
    // realizar integración con provider externo...
    // guardar Payment con status pending y luego actualizar según callback
    const payment = new Payment({
      reservation: reservationId,
      amount,
      provider,
      status: "pending"
    });
    await payment.save();

    // devolver info para checkout
    return res.json({ ok: true, data: { payment }});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, message: "Error creando pago" });
  }
}
