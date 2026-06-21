import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"




const app = express()

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

//routes declaration

app.use("/users", userRoutes)
app.use("/rooms", roomRoutes)
app.use("/code", codeRoutes)
app.use("/snippets", snippetRoutes)


export {app}

