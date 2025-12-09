const express = require("express");
const { authMiddleware } = require("../middlewares/auth");
const Project = require("../models/Project");

const projectRouter = express.Router();

// Protect all routes
projectRouter.use(authMiddleware);

/**
 * GET /api/projects
 */
projectRouter.get("/", async (req, res) => {
  try {
    const userProjects = await Project.find({ user: req.user._id });
    res.json(userProjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/projects/:projectId
 */
projectRouter.get("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: `Project with id: ${projectId} not found!` });
    }

    if (project.user.toString() !== req.user._id) {
      return res.status(403).json({ message: "User is not authorized!" });
    }

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/projects
 */
projectRouter.post("/", async (req, res) => {
  try {
    const newProject = await Project.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/projects/:projectId
 */
projectRouter.put("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.user.toString() !== req.user._id) {
      return res.status(403).json({ message: "User is not authorized!" });
    }

    project.name = req.body.name || project.name;
    project.description = req.body.description || project.description;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/projects/:projectId
 */
projectRouter.delete("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.user.toString() !== req.user._id) {
      return res.status(403).json({ message: "User is not authorized!" });
    }

    await project.deleteOne();
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = projectRouter;
