"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dbConnect = () => {
    const db = process.env.CONNECTION_STRING;
    if (!db) {
        throw new Error("connectin string not provided...");
    }
    try {
        mongoose_1.default.connect(db);
        console.log("Database connected successfully...");
    }
    catch (err) {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    }
};
exports.default = dbConnect;
//# sourceMappingURL=db.js.map