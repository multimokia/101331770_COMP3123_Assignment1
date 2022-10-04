import express from "express";
import dotenv from "dotenv";
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
const PORT = process.env.PORT || 8000;

// Connect the db
connect("mongodb://127.0.0.1:27017/comp3123_assigment1")
    .then(() => {
        // Finally, begin listening once the db has been connected
        app.listen(PORT, () => {
            console.log(`App listening on port ${PORT}`);
        });
    })
    .catch(console.error);
