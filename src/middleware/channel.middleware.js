import ChannelRepository from "../repositories/channel.repository.js";

export default async function channelMiddleware(req, res, next) {
    try {
        const { channel_id } = req.params;

        if (!channel_id) {
            return res.status(400).json({
                ok: false,
                status: 400,
                message: "Falta el channel_id en la ruta"
            });
        }

        const channel = await ChannelRepository.getById(channel_id);

        if (!channel) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "El canal no existe"
            });
        }

        req.channel = channel; // lo guardamos para usar después
        next();
    } catch (error) {
        console.error("Error en channelMiddleware:", error);
        return res.status(500).json({
            ok: false,
            status: 500,
            message: "Error interno del servidor al validar el canal"
        });
    }
}
