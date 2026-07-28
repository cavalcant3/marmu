import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as orcamentoController from "../controllers/orcamentoController.js";

const router = Router();

router.use(authMiddleware);

router.post("/", orcamentoController.create);
router.get("/", orcamentoController.list);
router.get("/:id", orcamentoController.getById);

export default router;
