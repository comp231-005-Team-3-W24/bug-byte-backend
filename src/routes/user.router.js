const express = require("express");
const {
  httpGetAllUsers,
  httpPostRegisterUser,
  httpPostLogin,
  httpGetLogout,
} = require("../controller/user.controller");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
function requireAuth(req, res, next) {
  const token = req.headers.authentication.split(" ")[1];
  resolvedToken = jwt.verify(token, process.env.JWT_SECRET);
  req.user = resolvedToken.user;
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    success: false,
    message: "Unathorized",
  });
}

// Route to get all points
userRouter.get("/logout", httpGetLogout);
userRouter.get("/all", httpGetAllUsers);
userRouter.post("/register", httpPostRegisterUser);
userRouter.post("/login", httpPostLogin);

// Route to calculate population and income

module.exports = {
  requireAuth,
  userRouter,
};
