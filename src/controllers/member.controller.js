import jwt from 'jsonwebtoken'
import ENVIRONMENT from '../config/environment.config.js'
import { ServerError } from '../utils/customError.utils.js'
import MemberWorkspaceRepository from '../repositories/memberWorkspace.repository.js'

class MemberController {
    static async confirmInvitation(request, response) {
        try {
            const { token } = request.params
            const {
                id_invited,
                email_invited,
                id_workspace,
                id_inviter
            } = jwt.verify(token, ENVIRONMENT.JWT_SECRET_KEY)

            await MemberWorkspaceRepository.create(id_invited, id_workspace, 'member')

            /* 
            El usuario viene via mail a este endpoint 
            Si todo esta bien, el endpoint lo redirecciona al frontend
            */
            response.redirect(`${ENVIRONMENT.URL_FRONTEND}`)
        }
        catch (error) {
            console.log(error)
            if(error instanceof jwt.JsonWebTokenError) {
                response.status(400).json({ ok: false, status: 400, message: 'Token invalido' })
            }
            else if( error instanceof jwt.TokenExpiredError) {
                //En caso de que se quiera, se puede enviar una notificacion
                //Al invitador de que vuelva a invitar al usuario ya que su token expiro
                response.status(400).json({ ok: false, status: 400, message: 'Token expirado' })
            }
            else if( error.status ){
                response.status(error.status).json({ ok: false, status: error.status, message: error.message })
            }
            else {
                response.status(500).json({ ok: false, status: 500, message: 'Error interno del servidor' })
            }
        }
    }
}
export default MemberController