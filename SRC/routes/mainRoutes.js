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




router.use("/users", userRoutes);
router.use("/challenges", fitnessRoutes);
router.use("/pets", petRoutes);
router.use("/friendship", friendshipRoutes);
router.use("/message", messageRoutes);



// ##############################################################
// EXPORT ROUTER
// ##############################################################
module.exports = router;