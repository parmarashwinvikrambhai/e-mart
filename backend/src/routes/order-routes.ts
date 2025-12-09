 import express from "express"
import { createOrder, getOrder, updateOrderStatus, getSingleOrder  } from "../controllers/order-controller";
import { isAuthorizedUser } from "../middlewares/auth-middleware";
const route = express.Router();

route.post("/create-order", isAuthorizedUser,createOrder);
route.get("/", isAuthorizedUser, getOrder);
route.get("/:orderId", isAuthorizedUser, getSingleOrder);
route.patch("/update-status/:orderId", isAuthorizedUser,updateOrderStatus);



export default route;