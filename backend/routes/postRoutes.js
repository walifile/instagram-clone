const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const upload = require("../middleware/uploadMiddleware");
const verifyJWT = require("../middleware/verifyJWT");

// router.use(verifyJWT); // Using verifyJWT middleware for all routes

router.get("/allpost", postController.getAllPosts);
router.get("/getsubpost", postController.getSubscribedPosts);
router.post("/createpost", upload, postController.createPost);
router.get("/mypost", postController.getMyPosts);
router.put("/like", postController.likePost);
router.put("/unlike", postController.unlikePost);
router.put("/comment", postController.addComment);
router.delete("/deletepost/:postId", postController.deletePost);

module.exports = router;
