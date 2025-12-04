import express, { response } from "express"
import UserRepository from "../repositories/user.repository.js"
import { validarId } from "../utils/validations.utils.js"
import workspace_router from "./workspace.route.js"

const user_router = express.Router()

// Todos los usuarios
user_router.get("/", async (req, res) => {
    try {
        const users = await UserRepository.getAll()
        res.json({ ok: true, message: "Usuarios obtenidos", users })
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message })
    }
})

// Usuario por ID
user_router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id
        if (!validarId(id)) {
            return res.status(400).json({ ok: false, message: "ID inválido" })
        }

        const user = await UserRepository.getById(id)
        if (!user) {
            return res.status(404).json({ ok: false, message: "Usuario no encontrado" })
        }

        res.json({ ok: true, message: "Usuario obtenido", user })
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message })
    }
})



export default user_router
