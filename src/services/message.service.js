import ChannelMessageRepository from "../repositories/channelMessage.repository.js";

class MessageService {

    static async create(content, member_id, channel_id) {

        // 1. Crear mensaje
        await ChannelMessageRepository.create({
            content,
            member_id,
            channel_id
        });

        // 2. Devolver lista completa actualizada
        const messages_list = await ChannelMessageRepository.getAllByChannel(channel_id);

        return messages_list;
    }


    static async getAllByChannelId(channel_id) {
        const messages_list = await ChannelMessageRepository.getAllByChannel(channel_id);
        return messages_list;
    }

}

export default MessageService;
