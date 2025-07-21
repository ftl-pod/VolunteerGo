const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const { verifyFirebaseToken } = require('../middleware/auth');
// get all users 
router.get("/", controller.getAllUsers);
// get user by id 
router.get("/:id", controller.getUserById);
// get user by clerkId
router.get("/by-uid/:uid", controller.getUserByFirebaseUid);
// create user 
router.post("/", controller.createUser);
// add opp to user history 
// router.post("/id/opps", controller.addOppToUser); // do last 
//get saved opps by userid
router.get("/:id/saved-opportunities", controller.getSavedOpportunitiesByUserId);
// add saved opportunity for user
router.post("/:id/saved-opportunities/add", controller.addSavedOpportunity);
// remove saved opportunity for user
router.post("/:id/saved-opportunities/remove", controller.removeSavedOpportunity);
// update user 
router.put("/:id", controller.updateUser);
// delete user 
router.delete("/:id", controller.deleteUser);
// login user
router.post("/onboarding", controller.onboarding);

module.exports = router;
