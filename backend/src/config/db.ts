import mongoose from "mongoose"

const dbConnect = () => {
    const db = process.env.CONNECTION_STRING;
    if(!db){
        throw new Error("connectin string not provided...");
    }
    try {
        mongoose.connect(db);
        console.log("Database connected successfully...");

    } catch (err:any) {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    }
}
 export default dbConnect