const User = require("../models/User");

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Follow a user
const followUser = async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(
      req.body.followId,
      { $push: { followers: req.user._id } },
      { new: true }
    );
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { following: req.body.followId } },
      { new: true }
    ).select("-password");
    res.json(result);
  } catch (err) {
    res.status(422).json({ error: err.message });
  }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(
      req.body.unfollowId,
      { $pull: { followers: req.user._id } },
      { new: true }
    );
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { following: req.body.unfollowId } },
      { new: true }
    ).select("-password");
    res.json(result);
  } catch (err) {
    res.status(422).json({ error: err.message });
  }
};

// Update user profile picture
const updateUserPic = async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { pic: req.body.pic } },
      { new: true }
    );
    res.json(result);
  } catch (err) {
    res.status(422).json({ error: "Cannot update profile picture" });
  }
};

// Search users
const searchUsers = async (req, res) => {
  try {
    const userPattern = new RegExp("^" + req.body.query);
    const users = await User.find({ email: { $regex: userPattern } }).select(
      "_id email"
    );
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getUserById,
  followUser,
  unfollowUser,
  updateUserPic,
  searchUsers,
};
