import { Router } from "express";
import landController from "../controllers/land.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();
router.get(
  "/",
  authMiddleware.authenticateToken,
  landController.getLandByOwner
);

router.put(
  "/",
  authMiddleware.authenticateToken,
  landController.updateWaterPriceElectricityPriceUnitLandById
);

export default router;
