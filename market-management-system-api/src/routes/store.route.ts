import { Router } from "express";
import storeController from "../controllers/store.controller";
import authMiddleware from "../middlewares/auth.middleware";
import accessPermissionMiddleware from "../middlewares/accessPermission.middleware";
const router = Router();
router.post(
  "/create-store",
  authMiddleware.authenticateToken,
  storeController.createStoreAndUser
);

router.get(
  "/get-stores",
  authMiddleware.authenticateToken,
  storeController.getStore
);

//for owner edit store child 
router.put(
  "/update-store",
  authMiddleware.authenticateToken,
  // accessPermissionMiddleware.accessPermission,
  storeController.updateStore
);

//for owner edit store child 
router.put(
  "/self",
  authMiddleware.authenticateToken,
  // accessPermissionMiddleware.accessPermission,
  storeController.updateStoreSelf
);
//for owner edit store child 
router.put(
  "/update-rent-price",
  authMiddleware.authenticateToken,
  // accessPermissionMiddleware.accessPermission,
  storeController.updateRentPrice
);
//for owner delete store child 
router.delete(
  "/delete-store",
  authMiddleware.authenticateToken,
  // accessPermissionMiddleware.accessPermission,
  storeController.deleteStore
);

router.get(
  '/:id', 
  authMiddleware.authenticateToken
  ,storeController.getStoreById
);

export default router;
