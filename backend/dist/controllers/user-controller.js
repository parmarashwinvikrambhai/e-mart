"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const user_repositories_1 = __importDefault(require("../repositories/user-repositories"));
const user_validator_1 = require("../validators/user-validator");
const user_model_1 = __importDefault(require("../models/user-model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const createUser = async (req, res) => {
    try {
        const validateData = user_validator_1.createUserSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({ message: validateData.error.issues[0].message });
        }
        const { name, email, password } = validateData.data;
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "email already exist..." });
        }
        const hashPassword = await bcrypt_1.default.hash(password, 10);
        const user = await user_repositories_1.default.createUser({
            name,
            email,
            password: hashPassword,
            isAdmin: false
        });
        res.status(200).json({
            id: user._id,
            name: user.name,
            message: "User created..."
        });
    }
    catch (error) {
        return res.status(error instanceof zod_1.ZodError ? 400 : 500).json({ message: error instanceof zod_1.ZodError ? error.issues[0].message : "Internal Server Error" });
    }
};
exports.createUser = createUser;
//# sourceMappingURL=user-controller.js.map