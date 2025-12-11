import express from "express"
import { createUser, loginUser, logoutUser, getUserProfile, updateUser, updateProfilePic, changePassword,forgotPassword,resetPassword } from "../controllers/user-controller";
import { isAuthorizedUser } from "../middlewares/auth-middleware";
import { upload } from "../middlewares/upload";
const route = express.Router();

route.post("/register", createUser);
route.post("/login", loginUser);
route.post("/logout", logoutUser);
route.get("/get-profile", isAuthorizedUser,getUserProfile);
route.put("/update-profile", isAuthorizedUser, updateUser);
route.put("/change-profilePic", isAuthorizedUser, upload.single("profilePic"), updateProfilePic);
route.put("/change-password", isAuthorizedUser,changePassword);
route.post("/forgot-password", forgotPassword);
route.post("/reset-password/:token", resetPassword);


export default route;