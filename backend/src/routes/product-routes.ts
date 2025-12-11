import express from "express"
import { createProduct, getProduct, getProductById, filterProducts, deleteProduct,updateProduct } from "../controllers/product-controller";
import { upload } from "../middlewares/upload";
import { isAuthorizedUser } from "../middlewares/auth-middleware";
const route = express.Router();

route.post("/create", upload.array("images", 4), createProduct);
route.get("/filter", filterProducts);
route.get("/:id", getProductById);
route.get("/", getProduct);
route.delete("/:id",isAuthorizedUser,deleteProduct);
route.put("/:id",isAuthorizedUser,updateProduct);


export default route;