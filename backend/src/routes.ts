import { Router } from "express";
import { CreateUserController } from "./Controller/User/CreateUserController";
import { AuthController } from "./Controller/Auth/AuthController";
import { EditUserController } from "./Controller/User/EditUserController";
import { isAuthenticated } from "./middleware/MeddlewareAuth";
import { ListUserController } from "./Controller/User/ListUserController";

const router = Router();

//User Routes
router.post("/user/create", new CreateUserController().handle);
router.post("/user/session", new AuthController().handle);
router.put("/user/edit", isAuthenticated, new EditUserController().handle);
router.get("/user/list", isAuthenticated, new ListUserController().handle);


export {router};