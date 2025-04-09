import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAnswer,sendAnswer } from "../controllers/answer.controller.js";

const router = express.Router();

router.get("/:id",protectRoute,getAnswer);
router.post("/send/:id",protectRoute,sendAnswer);

export default router;

