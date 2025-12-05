 import express from "express"
import { createOrder, getOrder  } from "../controllers/order-controller";
import { isAuthorizedUser } from "../middlewares/auth-middleware";
const route = express.Router();

route.post("/create-order", isAuthorizedUser,createOrder);
route.get("/", isAuthorizedUser, getOrder);


export default route;