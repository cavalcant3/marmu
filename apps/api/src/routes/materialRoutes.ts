import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as materialController from "../controllers/materialController.js";

const router = Router();

router.use(authMiddleware);

router.post("/", materialController.create);
router.get("/", materialController.list);
router.get("/:id", materialController.getById);
router.put("/:id", materialController.update);
router.delete("/:id", materialController.remove);

export default router;
