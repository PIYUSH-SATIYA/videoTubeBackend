import express from "express";
import cors from "cors"; // This is to specify who will be able to talk to out app
import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

// All middlewares

// Another middlewares from express to convert in json data and encode the url, with data limit of 16 kb
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public")); // to serve static files like imgs videos etc. usually kept in static folder, here public
app.use(cookieParser());

// Import routes
import healthCheckRouter from "./routes/healthCheck.routes.js";
import userRouter from "./routes/user.routes.js"; // it is automatic alias for Router() method exported from given file path

// routes
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/users", userRouter);

export {app};
