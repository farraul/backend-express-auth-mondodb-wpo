import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router.post('/register', userController.userRegister);
router.post('/login', userController.userLogin);
router.route('/profile').get(protect, userController.getUserProfile);
router.post('/searchgoogle', userController.getSearchGoogle);
//products routes
router.get("/products/:id", userController.getProducts);
router.post("/products", userController.createProduct);
router.put("/product/:id", userController.updateProduct);
router.get("/product/:id", userController.getProduct);
router.delete("/products/:id", userController.deleteProduct);
//seo routes
router.post("/seo", userController.getUrlSeo);
router.post("/seo", userController.createUrlSeo);



export default router;
