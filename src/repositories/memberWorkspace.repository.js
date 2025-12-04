import MemberWorkspace from "../models/MemberWorkspace.model.js";
import { ServerError } from "../utils/customError.utils.js";

class MemberWorkspaceRepository {
    static async getAllWorkspacesByUserId (user_id){
        //Traer todos los workspace de los que soy miembro
        const workspaces_que_soy_miembro = await MemberWorkspace
        .find({user: user_id})
        .populate({
            path: 'workspace',
            match: {active: true}
        }) //Expandimos la propiedad de workspace, para que nos traiga el workspace completo

        console.log(workspaces_que_soy_miembro)
        return workspaces_que_soy_miembro
    }
    static async getMemberWorkspaceByUserIdAndWorkspaceId(user_id, workspace_id){
        const member_workspace = await MemberWorkspace.findOne({user: user_id, workspace: workspace_id})
        return member_workspace
    }
    static async create (user_id, workspace_id, role = 'member') {
    const member = await MemberWorkspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(
        user_id,
        workspace_id
    );

    if (member) {
        throw new ServerError(400, 'El usuario ya es miembro del workspace');
    }

    // ✅ Usar create() permite que populate funcione
    await MemberWorkspace.create({
        user: user_id,
        workspace: workspace_id,
        role
    });
}
  /*  static async create(req, res) {
    try {
        const { name, url_image } = req.body;
        const user_id = req.user.id; // viene del token JWT

        // Crear el workspace
        const workspace = await WorkspacesRepository.createWorkspace(name, url_image);

        // Agregar al creador como miembro (rol admin)
        await MemberWorkspaceRepository.create(user_id, workspace._id, 'admin');

        return res.status(201).json({
            ok: true,
            message: 'Workspace creado correctamente',
            workspace
        });
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({
            ok: false,
            message: error.message || 'Error al crear el workspace'
        });
    }
}
*/
}
//ACA MEDIANTE CREATE AGREGAMOS 2 PARAMETROS, 1 ID DE USUARIO, 1 ID DE REPOSITORI 


export default MemberWorkspaceRepository