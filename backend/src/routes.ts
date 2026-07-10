import { Router } from "express";
import { CreateUserController } from "./Controller/User/CreateUserController";
import { AuthController } from "./Controller/Auth/AuthController";
import { EditUserController } from "./Controller/User/EditUserController";
import { isAuthenticated } from "./middleware/MiddlewareAuth";
import { ListUserController } from "./Controller/User/ListUserController";
import { DeleteUserController } from "./Controller/User/DeleteUserController";
import { CreateCollectionController } from "./Controller/Collection/CreateCollectionController";
import { GetCollectionController } from "./Controller/Collection/GetCollectionController";
import { UpdateCollectionController } from "./Controller/Collection/UpdateCollectionController";
import { ListCollectionController } from "./Controller/Collection/ListCollectionController";
import { DeleteCollectionController } from "./Controller/Collection/DeleteCollectionController";
import { AddStickerToCollectionController } from "./Controller/Collection/AddStickerToCollectionController";
import { RemoveStickerFromCollectionController } from "./Controller/Collection/RemoveStickerFromCollectionController";
import { ListUserStickersController } from "./Controller/Sticker/ListUserStickersController";
import { GetBrasilAlbumController } from "./Controller/Album/GetBrasilAlbumController";

const router = Router();

//User Routes
router.post("/user/create", new CreateUserController().handle);
router.post("/user/session", new AuthController().handle);
router.put("/user/edit", isAuthenticated, new EditUserController().handle);
router.get("/user/list", isAuthenticated, new ListUserController().handle);
router.delete("/user/delete", isAuthenticated, new DeleteUserController().handle);
router.post("/collections", isAuthenticated, new CreateCollectionController().handle);
router.get("/collections", isAuthenticated, new ListCollectionController().handle);
router.get("/collections/:id", isAuthenticated, new GetCollectionController().handle);
router.put("/collections/:id", isAuthenticated, new UpdateCollectionController().handle);
router.delete("/collections/:id", isAuthenticated, new DeleteCollectionController().handle);
router.post("/collections/:id/stickers", isAuthenticated, new AddStickerToCollectionController().handle);
router.delete("/collections/:id/stickers/:userStickerId", isAuthenticated, new RemoveStickerFromCollectionController().handle);
router.get("/stickers/me", isAuthenticated, new ListUserStickersController().handle);
router.get("/album/brasil", isAuthenticated, new GetBrasilAlbumController().handle);

export {router};