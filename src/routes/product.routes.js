import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

import { validateSchema } from "../middlewares/validator.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { productSchema } from "../schemas/product.schema.js";

const productRouter = Router();

productRouter.get("/", getAllProducts);

productRouter.get("/:id", getProductById);

// Ruta protegida: Solo usuarios autenticados pueden crear productos
productRouter.post("/", verifyToken, validateSchema(productSchema), createProduct);

// Ruta protegida: Solo usuarios autenticados pueden actualizar productos
productRouter.put("/:id", verifyToken, validateSchema(productSchema), updateProduct);

// Ruta protegida: Solo usuarios autenticados pueden eliminar productos
productRouter.delete("/:id", verifyToken, deleteProduct);

export default productRouter;
