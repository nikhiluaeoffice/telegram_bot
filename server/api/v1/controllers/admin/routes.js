import express from "express";
import { AdminController } from "./controller";
import auth from "../../../../helper/auth";

const router = express.Router();
const controller = new AdminController();

// router.use(auth.verifyToken);

router.post("/createEmployeeId", (req, res, next) => controller.createEmployeeId(req, res, next));

export default router;
