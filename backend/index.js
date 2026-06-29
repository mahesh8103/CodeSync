import dotenv from "dotenv"
import connectDB from "./src/db/index.js";

import { server, app } from "./app.js";

const port = process.env.PORT || 5000;

dotenv.config({
    path: './.env'
})



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




