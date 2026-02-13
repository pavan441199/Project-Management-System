import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "cookie-session";
import { config } from "./config/app-config";
import connectToDatabase from "./config/database-config";
import { errorMiddleware } from "./middlewares/error-middleware";
import { HTTPSTATUS } from "./config/http-config";
import { asyncHandler } from "./middlewares/async-handler";
import { BadRequestException } from "./utils/app-error";
import { ErrorCodeEnum } from "./enums/error-code-enum";
import "./config/passport-config";
import passport from "passport";
import authRoutes from "./routes/auth-router";
import userRoutes from "./routes/user-router";
import isAuthenticated from "./middlewares/isAuthenticated-middleware";
import workspaceRouter from "./routes/workspace-router";
import memberRoutes from "./routes/member-router";
import projectRoutes from "./routes/project-router";

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        name: "session",
        keys: [config.SESSION_SECRET],
        maxAge: 24 * 60 * 60 * 1000,
        secure: config.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",

    })
)

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,

}))

app.get("/", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(HTTPSTATUS.OK).json({
        message: "Hello World!"
    })

}))

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/users`, isAuthenticated, userRoutes);
app.use(`${BASE_PATH}/workspaces`, isAuthenticated, workspaceRouter);
app.use(`${BASE_PATH}/members`, isAuthenticated, memberRoutes);
app.use(`${BASE_PATH}/projects`, isAuthenticated, projectRoutes);
app.use(errorMiddleware)

app.listen(config.PORT, async () => {
    console.log(`Server is running on port ${config.PORT} in ${config.NODE_ENV} mode`);
    console.log(`Frontend Origin: ${config.FRONTEND_ORIGIN}`);
    await connectToDatabase();
})