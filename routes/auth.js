const express = require('express');
const router = express.Router();

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

router.post("/register", authController.signup);
router.post("/login", authController.login); 

router
    .route('/teste')
    .get(userController.getAllUsers);

/** proteje todas rotas após essa linha */
router.use(authController.protect);

/** Apenas o administrador tem permissão para acessar as APIs após essa linha */
router.use(authController.restrictTo('admin'));
 
module.exports = router;