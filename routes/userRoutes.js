import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import * as userController from '../controllers/userController.js';
import * as urlSeoController from '../controllers/urlSeoController.js';
import * as clientController from '../controllers/clientController.js';

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
router.get("/seo/:id", urlSeoController.getUrlSeo);
router.post("/seo/", urlSeoController.createUrlSeo);

//clients
router.post("/clients", clientController.clientRegister);
router.get("/clients/:id", clientController.getClients);




export default router;
