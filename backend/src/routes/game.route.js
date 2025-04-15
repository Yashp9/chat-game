import express from "express";
import { gameRequest } from "../controllers/game.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/game_req/:id",protectRoute,gameRequest);

export default router;