import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as pedidoController from "../controllers/pedidoController.js";

const router = Router();

router.use(authMiddleware);

router.post("/", pedidoController.create);
router.get("/", pedidoController.list);
router.get("/:id", pedidoController.getById);
router.put("/:id/entregue", pedidoController.entregar);

export default router;
