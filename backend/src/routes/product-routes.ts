 import express from "express"
import { createProduct, getProduct, getProductById, filterProducts } from "../controllers/product-controller";
import { upload } from "../middlewares/upload";
const route = express.Router();

route.post("/create", upload.array("images", 4), createProduct);
route.get("/", getProduct);
route.get("/filter", filterProducts);
route.get("/:id", getProductById);




export default route;