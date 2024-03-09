const { findAllUsers, register, findUser } = require("../model/user.model");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { getRolefromToken } = require("../utils/getUserRole");
require("dotenv").config();
async function httpGetAllUsers(req, res) {
  const authorized =
    getRolefromToken(req.headers.authorization) === "administrator";
  if (authorized) {
    data = await findAllUsers();
    res.json({ message: "Get all users", data });
  } else {
    res.status(401).json({
      success: false,
      message: "Unathorized, need administrator",
    });
  }
}
async function httpGetLogout(req, res, next) {
  req.logout(function (err) {
    if (err) {
      res.status(400).json({
        success: false,
        message: err,
      });
    }
    res.status(200).json({
      success: true,
    });
  });
}
async function httpPostRegisterUser(req, res, next) {
  const { name, email, password, role } = req.body;
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const userToSave = {
      name,
      email,
      password: hashedPassword,
      role,
    };
    const same = await findUser({ name });
    if (same != null) {
      res.status(400).json({
        success: false,
        message: "username already existed, try using different username.",
      });
    } else {
      const registerResult = await register(userToSave);
      console.log("registerResult", registerResult);
      if (registerResult) {
        passport.authenticate("local", (err, user, info) => {
          if (err) throw err;
          console.log("user", user);
          if (!user) {
            res.status(400).json({
              success: false,
              message: "Login failed, please try again.",
            });
          } else {
            const token = jwt.sign({ user }, process.env.JWT_SECRET);
            res.status(200).json({
              success: true,
              userData: user,
              token,
            });
          }
        })(req, res, next);
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function httpPostLogin(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      next(err);
    }
    if (!user) {
      res.json({
        success: false,
        status: "Login Unsuccessful",
      });
    } else {
      req.login(user, (err) => {
        if (err) return next(err);
        const token = jwt.sign({ user }, process.env.JWT_SECRET);
        res.json({
          success: true,
          status: "Login Successfully",
          userData: user,
          role: user.role,
          token,
        });
      });
    }
  })(req, res, next);
}

module.exports = {
  httpGetAllUsers,
  httpPostRegisterUser,
  httpPostLogin,
  httpGetLogout,
};
