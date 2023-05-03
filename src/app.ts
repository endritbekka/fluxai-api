import express, { Express, NextFunction, Request, Response } from "express";
import "express-async-errors";
import cors from "cors";
import Database from "./utils/Database";
import BaseResponse from "./Http/Responses/BaseResponse";
import UserRoutes from "./Http/Routes/UserRoute";
import OrganizationRoute from "./Http/Routes/OrganizationRoute";
import EmailTemplateRoute from "./Http/Routes/EmailTemplateRoute";

Database.connect();

const app: Express = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", UserRoutes);
app.use("/api/users/organizations", OrganizationRoute);
app.use("/api/users/organizations/templates", EmailTemplateRoute);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  BaseResponse(res).error(error);
});

app.use((req, res) => {
  BaseResponse(res).routeNotFound();
});

export default app;
