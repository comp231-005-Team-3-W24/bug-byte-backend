const { Schema, model } = require("mongoose");
// Define schema for Project entity
const projectSchema = new Schema({
  name: String,
  description: String,
  company: String,
  users: [
    {
      user_id: String,
      user_name: String,
    },
  ],
  reports: [String],
});

const Project = model("Project", projectSchema);

async function allProjects() {
  const projects = await Project.find();
  return projects;
}
async function allProjectsByUser(userId) {
  const projects = await Project.find({ "users.user_id": userId });
  return projects;
}
async function findProject(filter) {
  const project = await Project.findOne(filter);
  return project;
}

async function createProject(project) {
  const newProject = new Project(project);
  await newProject.save();
  return newProject;
}

async function updateProjectUsers(id, user) {
  try {
    const newUser = {
      user_id: user._id,
      user_name: user.name,
    };
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { $push: { users: newUser } },
      { new: true }
    );
    return updatedProject;
  } catch (error) {
    // Handle error
    console.error("Error updating project users:", error);
    throw error; // Re-throw the error for handling at a higher level
  }
}

async function removeUserFromProject(projectId, userId) {
  try {
    const test = await Project.findById(projectId);
    const result = await Project.findByIdAndUpdate(
      projectId,
      {
        $pull: { users: { user_id: userId } },
      },
      { new: true }
    );
    return result; // This object contains information about the operation's outcome.
  } catch (error) {
    console.error("Error removing user from project:", error);
    throw error; // Rethrow or handle error appropriately.
  }
}

module.exports = {
  allProjects,
  findProject,
  createProject,
  updateProjectUsers,
  allProjectsByUser,
  removeUserFromProject,
};
