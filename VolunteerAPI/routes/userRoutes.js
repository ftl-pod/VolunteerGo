const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

// get all users 
router.get("/", controller.getAllUsers);
// get user by id 
router.get("/:id", controller.getUserById);
// create user 
router.post("/", controller.createUser);
// add opp to user history 
// router.post("/id/opps", controller.addOppToUser); // do last 
// update user 
router.put("/:id", controller.updateUser);
// delete user 
router.delete("/:id", controller.deleteUser);
// login user
router.post("/login", controller.loginUser);

module.exports = router;