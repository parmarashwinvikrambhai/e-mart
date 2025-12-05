import express from "express"
import dbConnect from "./config/db"
import dotenv from "dotenv"
import userRoute from "./routes/user-routes"
import productRoute from "./routes/product-routes"
import cartRoute from "./routes/cart-routes"
import orderRoute from "./routes/order-routes"

import cookieParser from "cookie-parser";
import cors from "cors"


dotenv.config();
dbConnect();

const app = express();

const allowedOrigins = [
   "http://localhost:5173",
];
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.use((req, res, next) => {
    const origin = req.headers.origin as string | undefined;
    if (origin && allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});


app.use(express.json());
app.use(cookieParser());
// disable cache
app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
});


app.use("/api/v1/auth",userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/order", orderRoute);




const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`your server is Running on http://localhost:${PORT}`);
    
})
