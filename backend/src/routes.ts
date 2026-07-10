import { Router } from "express";
import { CreateUserController } from "./Controller/User/CreateUserController";

const router = Router();

//User Routes
router.post("/user/create", new CreateUserController().handle);



export {router};