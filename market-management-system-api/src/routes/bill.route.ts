import { Router } from "express";
import billController from "../controllers/bill.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();
router.get("/", authMiddleware.authenticateToken, billController.getBills);
router.get(
  "/date-all",
  authMiddleware.authenticateToken,
  billController.getDateTimeBills
);
router.get(
  "/date-all-store",
  authMiddleware.authenticateToken,
  billController.getDateTimeBillsByStore
);
router.get(
  "/owner",
  authMiddleware.authenticateToken,
  billController.getBillsByOwner
);
router.get("/:id", authMiddleware.authenticateToken, billController.getBill);
router.put(
  "/update-water-electricity-unit/:id",
  authMiddleware.authenticateToken,
  billController.updateWaterElectricityUnitBill
);
router.get(
  "/confirm/:id",
  authMiddleware.authenticateToken,
  billController.confirmBill
);

router.get('/generate-bills', billController.generateBillsForAllStores);

export default router;
