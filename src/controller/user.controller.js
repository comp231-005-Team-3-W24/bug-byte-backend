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
    const users = data.map((user) => buildUserData(user, null));
    res.json({ message: "Get all users", data: users });
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
      if (registerResult) {
        passport.authenticate("local", (err, user, info) => {
          if (err) throw err;
          if (!user) {
            res.status(400).json({
              success: false,
              message: "Login failed, please try again.",
            });
          } else {
            const token = jwt.sign({ user }, process.env.JWT_SECRET);
            const userData = buildUserData(user, token);
            res.status(200).json({
              success: true,
              data: userData,
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
        const userData = buildUserData(user, token);
        res.json({
          success: true,
          data: userData,
        });
      });
    }
  })(req, res, next);
}

function buildUserData(user, token) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    projects: user.projects,
    role: user.role,
    token,
  };
}

module.exports = {
  httpGetAllUsers,
  httpPostRegisterUser,
  httpPostLogin,
  httpGetLogout,
};
