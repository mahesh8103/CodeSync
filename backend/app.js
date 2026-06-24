import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import http from "http"
import { Server } from "socket.io"


const app = express()



const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        methods: ["GET", "POST"],
        credentials: true
    }
})


app.use(cors({
    origin: process.env.CORS_ORIGIN,
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
initializeSocket(io);

//routes declaration

app.use("/users", userRoutes)
app.use("/rooms", roomRoutes)
app.use("/code", codeRoutes)
app.use("/snippets", snippetRoutes)


export {app, server}

