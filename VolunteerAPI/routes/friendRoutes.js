const express = require("express");
const router = express.Router();
const friendController = require("../controllers/friendController");

const authenticate = require("../middleware/authenticate");

router.use(authenticate);

router.post("/request", friendController.sendFriendRequest);
router.get("/requests", friendController.getFriendRequests);
router.post("/accept", friendController.acceptFriendRequest);
router.post("/reject", friendController.rejectFriendRequest);
router.post("/unfriend", friendController.unfriend);
router.get("/list", friendController.getFriends);

module.exports = router;
