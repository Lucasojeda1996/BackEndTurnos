import connectMongoDB from "./config/mongoDB.config.js"
import express from "express"
import mongoose from "mongoose"
import workspace_router from "./routes/workspace.route.js"
import user_router from "./routes/users.router.js"
import auth_router from "./routes/auth.route.js"
import jwt from 'jsonwebtoken'
import cors from 'cors'
import authMiddleware from "./middleware/auth.middleware.js"
import MemberWorkspaceRepository from "./repositories/memberWorkspace.repository.js"
import member_router from "./routes/member.router.js"
import slotRoutes from "./routes/slot.routes.js"
import businessHourRoutes from "./routes/businessHour.routes.js"


connectMongoDB()
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/workspaces', workspace_router)
app.use('/api/users', user_router)
app.use('/api/auth', auth_router)
app.use('/api/members', member_router)
app.use("/api/slots", slotRoutes);
app.use("/api/business-hours", businessHourRoutes);


app.listen(8080, () => {
    console.log("Esto está funcionando")
})
 
