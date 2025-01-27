// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require('express');


// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();

// ##############################################################
// DEFINE ROUTES
// ##############################################################
const userRoutes = require('./userRoutes');
const fitnessRoutes = require('./fitnessRoutes');
const petRoutes = require('./petRoutes');
const friendshipRoutes = require('./friendshipRoutes');
const messageRoutes = require('./messageRoutes');
const userController = require('../controller/userController');
const jwtMiddleware = require('../middleware/jwtMiddleware');





router.use("/users", userRoutes);
router.use("/challenges", fitnessRoutes);
router.use("/pets", petRoutes);
router.use("/friendship", friendshipRoutes);
router.use("/message", messageRoutes);



router.post("/jwt/generate", userController.preTokenGenerate, jwtMiddleware.generateToken, userController.beforeSendToken, jwtMiddleware.sendToken);
router.get("/jwt/verify", jwtMiddleware.verifyToken, userController.showTokenVerified);



// ##############################################################
// EXPORT ROUTER
// ##############################################################
module.exports = router;