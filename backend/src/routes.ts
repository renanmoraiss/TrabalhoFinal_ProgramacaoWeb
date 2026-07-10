import { Router } from "express";
import { CreateUserController } from "./Controller/User/CreateUserController";
import { AuthController } from "./Controller/Auth/AuthController";
import { EditUserController } from "./Controller/User/EditUserController";

const router = Router();

//User Routes
router.post("/user/create", new CreateUserController().handle);
router.post("/user/session", new AuthController().handle);
router.put("/user/edit/:userId", new EditUserController().handle);


export {router};