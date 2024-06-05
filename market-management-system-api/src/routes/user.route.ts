import { Router } from "express";
import userController from "../controllers/user.controller";
import accessPermissionMiddleware from "../middlewares/accessPermission.middleware";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/self", authMiddleware.authenticateToken, userController.self);
router.put(
  "/self",
  authMiddleware.authenticateToken,
  userController.updateSelf
);
router.get(
  "/",
  authMiddleware.authenticateToken,
  userController.getUsers
);
//wait for update middleware
router.get(
  '/:id', 
  authMiddleware.authenticateToken
  ,userController.getUserById
);
//wait for update middleware
router.get(
  '/store/:id', 
  authMiddleware.authenticateToken
  ,userController.getUserByStoreId
)

//for owner edit child 
router.put(
  "/",
  authMiddleware.authenticateToken,
  // accessPermissionMiddleware.accessPermission,
  userController.updateUser
);

export default router;
