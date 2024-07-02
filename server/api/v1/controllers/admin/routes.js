import express from "express";
import { AdminController } from "./controller";
import auth from "../../../../helper/auth";

const router = express.Router();
const controller = new AdminController();

// router.use(auth.verifyToken);

router.post("/createEmployeeId", (req, res, next) => controller.createEmployeeId(req, res, next));
router.get("/getEmployeeId", (req, res, next) => controller.getEmployeeId(req, res, next));
router.put("/updateEmployeeId", (req, res, next) => controller.updateEmployeeId(req, res, next));
router.get("/getAllEmployeeID", (req, res, next) => controller.getAllEmployeeID(req, res, next));
router.get("/getAllBreakData", (req, res, next) => controller.getAllBreakData(req, res, next));
router.get("/getAllAttendaceData", (req, res, next) => controller.getAllAttendaceData(req, res, next));




export default router;
