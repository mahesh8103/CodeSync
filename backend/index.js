import dotenv from "dotenv"
import connectDB from "./src/db/index.js";

import { server, app } from "./app.js";

const port = process.env.PORT || 8000;

dotenv.config({
    path: './.env'
})



connectDB()
.then(() => {
    server.listen(port, () => {
        console.log(`⚙️ Server is running at port : ${port}`);
        
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})




