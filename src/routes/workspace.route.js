import express from 'express'
import WorkspacesRepository from '../repositories/workspace.repository.js'
import { validarId } from '../utils/validations.utils.js'
import { ServerError } from '../utils/customError.utils.js'
import WorkspaceController from '../controllers/workspace.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import workspaceMiddleware from '../middleware/workspace.middleware.js'
import ChannelController from '../controllers/channel.controller.js'
import channelMiddleware from '../middleware/channel.middleware.js'
import MessageController from '../controllers/message.controller.js'

const workspace_router = express.Router()
workspace_router.use(authMiddleware)

// Obtener todos los workspaces
workspace_router.get('/',WorkspaceController.getAll)
// Obtener workspace por ID
workspace_router.get('/:workspace_id', WorkspaceController.getById)
// Crear workspace
workspace_router.post('/',WorkspaceController.post)

//Crear los controladores para crear mensajes y obtener mensajes
//Siempre que se cree o obtenga la lista el servidor debera responder con la lista de mensajes
workspace_router.post('/:workspace_id/invite',authMiddleware,
     workspaceMiddleware(['admin']),
     WorkspaceController.inviteMember)

workspace_router.post('/:workspace_id/channels/',
    workspaceMiddleware([]),//Cualquier miembro puede hacer esta consulta
    ChannelController.create)

workspace_router.post(
    '/:workspace_id/channels/:channel_id/messages',
    workspaceMiddleware([]),//Cualquier miembro puede hacer esta consulta
    channelMiddleware,
    MessageController.create)


workspace_router.get(
    '/:workspace_id/channels/',
    workspaceMiddleware([]),//Cualquier miembro puede hacer esta consulta
    ChannelController.getAllByWorkspace)

workspace_router.get(
    '/:workspace_id/channels/:channel_id/messages',
    workspaceMiddleware([]),//Cualquier miembro puede hacer esta consulta
    channelMiddleware,
    MessageController.getAllByChannel)

    


export default workspace_router

/* */  
