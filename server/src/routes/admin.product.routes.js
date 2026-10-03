import { Router } from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
    createProductSchema,
    updateProductSchema,
} from "../validators/product.validator.js";

const router = Router();

// All routes require admin
router.use(verifyJWT);
router.use(authorize("admin"));

// List
router.get("/", getAllProducts);

// Create
router.post("/", validate(createProductSchema), createProduct);

// Read one
router.get("/:id", getProductById);

// Update
router.patch("/:id", validate(updateProductSchema), updateProduct);

// Delete
router.delete("/:id", deleteProduct);

export default router;