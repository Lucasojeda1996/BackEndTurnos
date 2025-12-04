
import MessageService from "../services/message.service.js"

class MessageController {
    static async create(request, response) {
        const {channel_id} = request.params
        const {content} = request.body
        const member_id = request.member._id
        const messages_list = await MessageService.create(content, member_id, channel_id)
        response.status(201).json(
            {
                ok: true,
                status: 201, 
                message:'Mensaje creado',
                data: {
                    messages: messages_list
                }
            }
        )
    }

    static async getAllByChannel(request, response) {
        const { channel_id } = request.params
        const messages_list = await MessageService.getAllByChannelId(channel_id)
        response.status(200).json(
            {
                ok: true,
                status: 200, 
                message:'Mensajes obtenidos',
                data: {
                    messages: messages_list
                }
            }
        )
    }   
}

export default MessageController