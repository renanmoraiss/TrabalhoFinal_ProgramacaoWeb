import { Router } from "express";
import { CreateUserController } from "./Controller/User/CreateUserController";
import { AuthController } from "./Controller/Auth/AuthController";
import { EditUserController } from "./Controller/User/EditUserController";
import { isAuthenticated } from "./middleware/MiddlewareAuth";
import { ListUserController } from "./Controller/User/ListUserController";
import { DeleteUserController } from "./Controller/User/DeleteUserController";

const router = Router();

//User Routes
router.post("/user/create", new CreateUserController().handle);
router.post("/user/session", new AuthController().handle);
router.put("/user/edit", isAuthenticated, new EditUserController().handle);
router.get("/user/list", isAuthenticated, new ListUserController().handle);
router.delete("/user/delete", isAuthenticated, new DeleteUserController().handle);


export {router};