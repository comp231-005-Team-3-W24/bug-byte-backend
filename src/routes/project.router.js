const express = require("express");
const {
  getAllProejcts,
  getAllProjectsByUserId,
  postCreateProject,
  putUpdateProjectUsers,
  putRemoveUserFromProject,
} = require("../controller/project.controller");
const projectRouter = express.Router();

projectRouter
  .get("/all", getAllProejcts)
  .get("/allByUser", getAllProjectsByUserId);
projectRouter.post("/create", postCreateProject);
projectRouter
  .put("/updateUsers/:projectId", putUpdateProjectUsers)
  .put("/removeUserFromProject/:userId/:projectId", putRemoveUserFromProject);

module.exports = projectRouter;
