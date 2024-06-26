const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const login = async (req, res) => {
  try {
    const { user, pwd } = req.body;
    if (!user || !pwd)
      return res
        .status(400)
        .json({ message: "Username and password are required." });

    const foundUser = await User.findOne({ username: user }).exec();

    if (!foundUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const match = await bcrypt.compare(pwd, foundUser.password);

    if (!match) return res.status(401).json({ message: "Unauthorized" });
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: foundUser.roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15s" }
    );

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "20s" }
    );

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    // Send accessToken containing username and roles
    res.json({ accessToken, roles: foundUser.roles });
  } catch (error) {
    // Handle any errors that occur during asynchronous operations
    console.error("Error in login route:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const register = async (req, res) => {
  const { name, password, email } = req.body;
  console.log("req", req.body, email);
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Email and password are required." });

  // check for duplicate usernames in the db

  const duplicate = await User.findOne({ email: email }).exec();
  if (duplicate) return res.status(409).json({ message: "User Exist." });

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);

    //create and store the new user
    const result = await User.create({
      name: name,
      password: hashedPwd,
      email: email,
    });

    console.log(result);

    res.status(201).json({ success: `New user ${name} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const foundUser = await User.findOne({
        username: decoded.username,
      }).exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "20s" }
      );

      res.json({ accessToken });
    })
  );
};

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};
