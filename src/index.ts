import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import https from "https";
import { connect } from "mongoose";

// Import routers
import { router as userRouter } from "./routes/user.js";
import { router as employeeRouter } from "./routes/employee.js";

const app = express();

// Add routers
app.use("/api/user", userRouter);
app.use("/api/emp/employees", employeeRouter);

// Parse conf
dotenv.config();
// Get hosting/connection info
const PORT = process.env.PORT || 8000;
const DB_URI = process.env.DB_URI;

// Check if we're using SSL
const KEY_FILE = process.env.SSL_KEY_FP;
const CERT_FILE = process.env.SSL_CERT_FP;

// Get the API secret
export const API_SECRET = process.env.API_SECRET;

let is_https = true;
let key: Buffer | undefined, cert: Buffer | undefined = undefined;

if (DB_URI === undefined) {
    throw new Error("No database URL supplied to DB_URI");
}

else if (API_SECRET === undefined) {
    throw new Error("Missing API_SECRET");
}

// Now handle optional props
if (KEY_FILE === undefined || CERT_FILE === undefined) {
    console.log("No SSL keys/certs found, using http.");
    is_https = false;
}

else {
    // Read in our keys
    try {
        key = fs.readFileSync(KEY_FILE);
        cert = fs.readFileSync(CERT_FILE);
    }

    catch (err) {
        console.error(`Failed to read key files: ${err}`);
        is_https = false;
    }
}

// Connect the db
connect(DB_URI)
    .then(() => {
        if (is_https) {
            // Finally, begin listening once the db has been connected
            const server = https.createServer({key , cert }, app);

            server.listen(PORT, () => {
                console.log(`App listening on port https://localhost:${PORT}/`);
            });
        }

        else {
            app.listen(PORT, () => {
                console.log(`App listening on port http://localhost:${PORT}/`);
            });
        }
    })
    .catch(console.error);
