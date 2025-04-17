import express from "express";
import { gameRequest } from "../controllers/game.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { gameResponseToRequest } from "../controllers/game.controller.js";

const router = express.Router();

router.get("/game_req/:id",protectRoute,gameRequest);

router.get("/game_res/:id",protectRoute,gameResponseToRequest);

export default router;