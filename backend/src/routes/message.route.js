import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/users",protectRoute);
router.get("/:id",protectRoute);

router.post("/send/:id",protectRoute);

export default router;