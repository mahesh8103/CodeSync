import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import http from "http"
import { Server } from "socket.io"


const app = express()



const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
})


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json({limit: "16000kb"}))
app.use(express.urlencoded({extended: true, limit: "50000kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//router import 
import userRoutes from "../backend/src/routes/user.routes.js"
import roomRoutes from "../backend/src/routes/room.routes.js"
import codeRoutes from "./src/routes/code.routes.js";
import snippetRoutes from "./src/routes/snippet.routes.js";
import { initializeSocket } from "./src/socket/socketHandler.js";
import { socketAuthMiddleware } from "./src/socket/socketAuth.middleware.js";
import healthRoutes from "./src/routes/health.routes.js"; 




io.use(socketAuthMiddleware);
initializeSocket(io);
//routes declaration

app.use("/api/auth", userRoutes)
app.use("/api/rooms", roomRoutes)
app.use("/api/code", codeRoutes)
app.use("/api/snippets", snippetRoutes)
app.use("/api/health", healthRoutes)

export {app, server}

