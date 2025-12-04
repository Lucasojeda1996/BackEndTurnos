import Channels from "../models/Channel.model.js";

class ChannelRepository {
    static async create(name, description, workspace_id) {
        const new_channel = new Channels({
            name,
            description,
            workspace_id
        });

        await new_channel.save();
        return new_channel;
    }

    static async getAllByWorkspace(workspace_id) {
        return await Channels.find({ workspace_id });
    }

    static async getById(channel_id) {
        return await Channels.findById(channel_id);
    }
static async getAllByWorkspaceAndName(workspace_id, name) {
        return await Channels.findOne({ workspace_id, name });
    }

}

export default ChannelRepository;
