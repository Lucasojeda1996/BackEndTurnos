import ChannelMessage from "../models/ChannelMessage.model.js";

class ChannelMessageRepository {

    static async create({ channel_id, member_id, content }) {
        const newMessage = new ChannelMessage({
            channel: channel_id,
            member: member_id,
            content
        });

        await newMessage.save();
        return newMessage;
    }

    static async getAllByChannel(channel_id) {
        return await ChannelMessage
            .find({ channel: channel_id })
            .populate("member", "name email") // si member apunta a Member, esto trae user? depende tu modelo
            .sort({ created_at: 1 });
    }

}

export default ChannelMessageRepository;
