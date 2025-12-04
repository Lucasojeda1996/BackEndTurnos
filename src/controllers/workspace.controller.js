//Las funciones que se encargaran de manejar la consulta y la respuesta
import ENVIRONMENT from '../config/environment.config.js'
import MemberWorkspaceRepository from "../repositories/memberWorkspace.repository.js"
import WorkspacesRepository from "../repositories/workspace.repository.js"
import { ServerError } from "../utils/customError.utils.js"
import { validarId } from "../utils/validations.utils.js"
import UserRepository from "../repositories/user.repository.js"
import jwt from 'jsonwebtoken'
import transporter from "../config/mailer.config.js"
class WorkspaceController {
     static async getAll(request, response) {
        try {
            const workspaces = await MemberWorkspaceRepository.getAllWorkspacesByUserId(request.user.id)
            response.json(
                {
                    status: 'OK',
                    message: 'Lista de espacios de trabajo obtenida correctamente',
                    data: {
                        workspaces: workspaces
                    }
                }
            )
        }
        catch (error) {
            console.log(error)
            //Evaluamos si es un error que nosotros definimos
            if (error.status) {
                return response.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                return response.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: 'Error interno del servidor'
                    }
                )
            }
        }

    }
    static async getById(request, response) {
        try {
            const workspace_id = request.params.workspace_id

            if (validarId(workspace_id)) {
                const workspace = await WorkspacesRepository.getById(workspace_id)

                if (!workspace) {

                    throw new ServerError(
                        400,
                        `Workspace con id ${workspace_id} no encontrado`
                    )
                }
                else {

                    return response.json(
                        {
                            ok: true,
                            message: `Workspace con id ${workspace._id} obtenido`,
                            data: {
                                workspace: workspace
                            }
                        }
                    )
                }
            }
            else {
                throw new ServerError(
                    400,
                    'el workspace_id debe ser un id valido'
                )
            }
        }
        catch (error) {
            console.log(error)
            //Evaluamos si es un error que nosotros definimos
            if (error.status) {
                return response.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                return response.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: 'Error interno del servidor'
                    }
                )
            }
        }


    }
    static async post(request, response) {
        try {

            //request.body es donde esta la carga util enviada por el cliente
            //si aplicamos express.json() en nuestra app body siempre sera de tipo objeto
            const name = request.body.name
            const url_image = request.body.url_image
            //Validar que name este y que sea valido (por ejemplo un string no VACIO de no mas de 30 caracteres)
            if (!name || typeof (name) !== 'string' || name.length > 30) {
                throw new ServerError(
                    400,
                    "el campo 'name' debe ser un string de menos de 30 caracteres"
                )
            }
            else if (url_image && typeof url_image !== 'string') {
                 throw new ServerError(400, "el campo 'url_image' debe ser un string");
}
            else {
                //Creamos el workspace con el repository
                const workspace_id_created=await WorkspacesRepository.createWorkspace(name, url_image)
                if(!workspace_id_created){
                    throw new ServerError (500, 'Error al crear el workspace')
                }
                await MemberWorkspaceRepository.create( request.user.id,workspace_id_created,'admin')
                //Si todo salio bien respondemos con {ok: true, message: 'Workspace creado con exito'}
                return response.status(201).json({
                    ok: true,
                    status: 201,
                    message: 'Workspace creado con exito'
                })
            }
        }
        catch (error) {
            console.log(error)
            //Evaluamos si es un error que nosotros definimos
            if (error.status) {
                return response.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                return response.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: 'Error interno del servidor'
                    }
                )
            }
        }

    }
    static async inviteMember(request, response) {
        try {
            const { member, workspace, user } = request
            const { invited_email } = request.body        
            //Buscar al usuario y validar que exista y este activo
            const user_invited = await UserRepository.getByEmail(invited_email)
            console.log({ user_invited })
            if (!user_invited) {
                throw new ServerError(404, 'Usuario no encontrado')
            }
            
            const member_data = await MemberWorkspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(
                user_invited._id, workspace._id
            )
            if (member_data) {
                throw new ServerError(409, `Usuario con email ${invited_email} ya es miembro del workspace`)
            }
            const id_inviter = member._id
            const invite_token = jwt.sign(
                {
                    id_invited: user_invited._id,
                    email_invited: invited_email,
                    id_workspace: workspace._id,
                    id_inviter: id_inviter
                },
                ENVIRONMENT.JWT_SECRET_KEY,
                {
                    expiresIn: '7d'
                }
            )
            await transporter.sendMail(
                {
                    from: "lucaskappo22@gmail.com",
                    to: invited_email,
                    subject: 'Invitacion al workspace',
                    html: `<h1>El usuario: ${user.email} te ha enviado una invitación
                            al workspace ${workspace.name}<h1/>
                        <a href="${ENVIRONMENT.URL_API_BACKEND}/api/members/confirm-invitation/${invite_token}">
                         Click para aceptar
                        </a>`
                }
            )
            response.status(200).json({
                ok: true,
                status: 200,
                message:'Usuario invitado con exito',
                data: null
            })
        }
        catch (error) {
            console.log(error)
            if (error.status) {
                return response.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                return response.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: 'Error interno del servidor'
                    }
                )
            }
        }
    }
}

export default WorkspaceController