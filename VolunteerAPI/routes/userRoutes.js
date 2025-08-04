const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const { verifyFirebaseToken } = require('../middleware/auth');

router.get("/", controller.getAllUsers); // get all users 

router.get("/:id", controller.getUserById); // get user by id 

router.get("/by-uid/:uid", controller.getUserByFirebaseUid); // get user by firebaseID

router.post("/", controller.createUser); // create user 

router.get("/:id/saved-opportunities", controller.getSavedOpportunitiesByUserId); //get saved opps by userid

router.get("/:id/opportunities", controller.getUserOppsById); // get user's opps

router.post("/:id/saved-opportunities/add", controller.addSavedOpportunity); // add saved opportunity for user

router.put("/:id/opportunities/add", controller.AddOpportunity); // add opportunity 

router.post("/:id/saved-opportunities/remove", controller.removeSavedOpportunity); // remove saved opportunity for user

router.put("/points",  verifyFirebaseToken, controller.updateUserPoints); // update user's points

router.delete("/:id", controller.deleteUser); // delete user 

router.post("/onboarding", verifyFirebaseToken, controller.onboarding); // login user

router.post('/send-confirmation-email', verifyFirebaseToken, controller.sendApplicationConfirmation);  // send user confirmation email



module.exports = router;
