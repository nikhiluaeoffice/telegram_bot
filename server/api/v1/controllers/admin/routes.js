import express from "express";
import { AdminController } from "./controller";
import auth from "../../../../helper/auth";

const router = express.Router();
const controller = new AdminController();
router.post("/signup", (req, res, next) => controller.signup(req, res, next));
router.post("/login", (req, res, next) => controller.login(req, res, next));

router.use(auth.verifyToken).get("/getAllAttendaceData", (req, res, next) => controller.getAllAttendaceData(req, res, next));;
router.post("/createEmployeeId", (req, res, next) => controller.createEmployeeId(req, res, next));
router.get("/getEmployeeId", (req, res, next) => controller.getEmployeeId(req, res, next));
router.put("/updateEmployeeId", (req, res, next) => controller.updateEmployeeId(req, res, next));
router.get("/getAllEmployeeID", (req, res, next) => controller.getAllEmployeeID(req, res, next));
router.get("/getAllBreakData", (req, res, next) => controller.getAllBreakData(req, res, next));
router.get("/getAllHelpQueries", (req, res, next) => controller.getAllHelpQueries(req, res, next));
export default router;
