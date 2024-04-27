const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");

// router.use(verifyJWT); // Using verifyJWT middleware for all routes
router.get("/user/:id", userController.getUserById);
router.put("/follow", userController.followUser);
router.put("/unfollow", userController.unfollowUser);
router.put("/updatepic", userController.updateUserPic);
router.post("/search-users", userController.searchUsers);

module.exports = router;
