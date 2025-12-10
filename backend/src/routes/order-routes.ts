 import express from "express"
import { createOrder, getOrder, updateOrder, getSingleOrder  } from "../controllers/order-controller";
import { isAuthorizedUser } from "../middlewares/auth-middleware";
const route = express.Router();

route.post("/create-order", isAuthorizedUser,createOrder);
route.get("/", isAuthorizedUser, getOrder);
route.get("/:orderId", isAuthorizedUser, getSingleOrder);
route.put("/update-status/:orderId", isAuthorizedUser, updateOrder);



export default route;