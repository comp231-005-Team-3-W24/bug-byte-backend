const {
  allProjects,
  updateProjectUsers,
  createProject,
  allProjectsByUser,
  removeUserFromProject,
} = require("../model/project.model");
const { findUser } = require("../model/user.model");
const {
  getRolefromToken,
  getUserIdFromToken,
} = require("../utils/getUserRole");

async function getAllProejcts(req, res, next) {
  const authorized =
    getRolefromToken(req.headers.authorization) === "administrator";
  if (authorized) {
    const projects = await allProjects();
    if (projects) {
      return res.status(200).json(projects);
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Unathorized, need administrator",
    });
  }
}
async function getAllProjectsByUserId(req, res, next) {
  const authorized =
    getRolefromToken(req.headers.authorization) === "stakeholder" ||
    getRolefromToken(req.headers.authorization) === "tester" ||
    getRolefromToken(req.headers.authorization) === "developer";

  if (authorized) {
    const userId = getUserIdFromToken(req.headers.authorization);
    const projects = await allProjectsByUser(userId);
    if (projects) {
      return res.status(200).json(projects);
    }
  } else {
    res.status(401).json({
      success: false,
      message: "Unathorized, need stakeholder, tester or developer",
    });
  }
}
async function postCreateProject(req, res, next) {
  const authorized =
    getRolefromToken(req.headers.authorization) === "administrator";
  if (authorized) {
    const project = req.body;
    const newProject = await createProject(project);
    if (newProject) {
      return res.status(200).json(newProject);
    } else {
      return res.status(500).json({
        success: false,
        message: "Project creation failed",
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Unathorized, need tester or administrator",
    });
  }
}

async function putUpdateProjectUsers(req, res, next) {
  const projectId = req.params.projectId;
  const newUserId = req.body.userId;
  const authorized =
    getRolefromToken(req.headers.authorization) === "administrator";
  if (authorized) {
    try {
      const user = await findUser({ _id: newUserId });
      const updatedProject = await updateProjectUsers(projectId, user);
      res.status(200).json(updatedProject);
    } catch (error) {
      // Handle error
      console.error("Error updating project users:", error);
      res.status(500).json({ error: "Failed to update project users" });
    }
  } else {
    res.status(401).json({
      success: false,
      message: "Unathorized, need administrator",
    });
  }
}
async function putRemoveUserFromProject(req, res, next) {
  const authorization =
    getRolefromToken(req.headers.authorization) === "administrator";
  if (authorization) {
    const { userId, projectId } = req.body;
    const result = await removeUserFromProject(userId, projectId);
    res.status(200).json(result);
  } else {
    res.status(401).json({
      success: false,
      message: "Unathorized, need administrator",
    });
  }
}
module.exports = {
  getAllProejcts,
  postCreateProject,
  putUpdateProjectUsers,
  getAllProjectsByUserId,
  putRemoveUserFromProject,
};
