import express from "express"
import { addToCart, getCart, updateCart, deleteCart } from "../controllers/cart-controller";
import { isAuthorizedUser } from "../middlewares/auth-middleware";
const route = express.Router();

route.post("/add",isAuthorizedUser,addToCart);
route.get("/", isAuthorizedUser, getCart);
route.put("/update-cart/:itemId", isAuthorizedUser, updateCart);
route.delete("/delete-cart/:id", isAuthorizedUser, deleteCart);






export default route;