import ChannelRepository from "../repositories/channel.repository.js";

class ChannelController {
    static async create(request, response) {
        try {
            const { name } = request.body;
            const { workspace_id } = request.params;

            if (!name || !workspace_id) {
                return response.status(400).json({
                    ok: false,
                    status: 400,
                    message: "Nombre del canal y workspace_id son requeridos",
                });
            }

            // 🔥 Antes: workspaceChannels.length → rompía si era null
            const workspaceChannel = await ChannelRepository.getAllByWorkspaceAndName(
                workspace_id,
                name
            );

            // Si existe un canal con ese nombre → error
            if (workspaceChannel) {
                return response.status(409).json({
                    ok: false,
                    status: 409,
                    message: "Ya existe un canal con este nombre en el workspace",
                });
            }

            const isPrivate = false;

            await ChannelRepository.create(
                name,
                isPrivate,
                workspace_id
            );

            const updatedChannels = await ChannelRepository.getAllByWorkspace(workspace_id);

            return response.status(201).json({
                ok: true,
                status: 201,
                message: "Canal creado con éxito",
                data: {
                    channels: updatedChannels,
                },
            });
        } catch (error) {
            console.error("Error creating channel:", error);
            return response.status(500).json({
                ok: false,
                status: 500,
                message: "Error interno del servidor al crear el canal",
            });
        }
    }

    static async getAllByWorkspace(request, response) {
        try {
            const { workspace_id } = request.params;

            const channels = await ChannelRepository.getAllByWorkspace(workspace_id);

            return response.json({
                ok: true,
                status: 200,
                message: "Lista de canales obtenida",
                data: {
                    channels: channels,
                },
            });

        } catch (error) {
            console.error("Error al listar channels:", error);
            return response.status(500).json({
                ok: false,
                status: 500,
                message: "Error interno del servidor al listar los canales",
            });
        }
    }
}

export default ChannelController;
