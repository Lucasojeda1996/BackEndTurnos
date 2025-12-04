import jwt from "jsonwebtoken";
import ENVIRONMENT from "../config/environment.config.js";
import { ServerError } from "../utils/customError.utils.js";

const verifyRecoveryTokenMiddleware = (req, res, next) => {
  try {
    const { recovery_token } = req.params;

    if (!recovery_token) {
      throw new ServerError(400, "Token de recuperación no proporcionado");
    }

    // Verifica el token con la clave exclusiva para recuperación
    const user_data = jwt.verify(recovery_token, ENVIRONMENT.JWT_RECOVERY_SECRET_KEY);

    // Guarda los datos del usuario en la request (por si el controller los necesita)
    req.user = user_data;

    next();
  } catch (error) {
    console.error("Error al verificar el token de recuperación:", error.message);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        ok: false,
        message: "El token de recuperación ha expirado",
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        ok: false,
        message: "Token de recuperación inválido",
      });
    }

    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor",
    });
  }
};

export default verifyRecoveryTokenMiddleware;
