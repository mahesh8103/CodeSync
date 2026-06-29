import dotenv from "dotenv"
dotenv.config({
    path: './.env'
})
import connectDB from "./src/db/index.js";

import { server, app } from "./app.js";

const port = process.env.PORT || 5000;

connectDB()
.then(() => {
    server.listen(port, () => {
        console.log(` Server is running at port : ${port}`);
        console.log(` Socket.IO ready for connections`);
        console.log(` Health check: http://localhost:${port}/api/health`);
        
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})




