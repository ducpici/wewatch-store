import dotenv from "dotenv";
import fs from "fs";
import https from "https";
dotenv.config();
import app from "./app.js";
const port = process.env.PORT;
// https
//     .createServer(
//         {
//             key: fs.readFileSync("./admin.wewatch.com-key.pem"),
//             cert: fs.readFileSync("./admin.wewatch.com.pem"),
//         },
//         app
//     )
//     .listen(port, () => {
//         console.log(`Server running at port:${port}`);
//     });
app.listen(port, () => {
    console.log(`Server running at port:${port}`);
});
