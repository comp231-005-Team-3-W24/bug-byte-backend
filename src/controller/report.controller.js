const {
  createReport,
  updateReportStatus,
  updateDevResponsible,
  updateStakeholderResponsible,
  findAcceptedReport,
  findReportsByProjectId,
  findReportsByStatusProgressSolved,
  uploadMedia,
} = require("../model/report.model");
const { getRolefromToken } = require("../utils/getUserRole");

async function postUploadMedia(req, res, next) {
  try {
    const { reportId } = req.params; // Extract reportId from URL parameters
    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    // Prepare files for uploadMedia function
    // Note: This assumes the uploadMedia function is adapted to handle the file structure provided by multer
    const mediaFiles = req.files.map((file) => ({
      name: file.originalname,
      buffer: file.buffer,
    }));

    // Call uploadMedia to upload files and update the report document
    const updatedReport = await uploadMedia(reportId, mediaFiles);

    // Send back the updated report or a success message
    res.status(200).json({
      message: "Media uploaded successfully",
      updatedReport,
    });
  } catch (error) {
    console.error("Error uploading media:", error);
    res.status(500).send("Error uploading media.");
  }
}
async function postCreateReport(req, res, next) {
  const authorized = getRolefromToken(req.headers.authorization) === "tester";
  const reportData = req.body;
  if (authorized) {
    try {
      const newReport = await createReport(reportData);
      res.status(201).json(newReport);
    } catch (error) {
      // Handle error
      console.error("Error creating report:", error);
      res.status(500).json({ error: "Failed to create report" });
    }
  } else {
    res.status(401).json({
      success: false,
      message: "Unathorized, need tester",
    });
  }
}

async function putUpdateReportStatus(req, res, next) {
  const authorized =
    getRolefromToken(req.headers.authorization) === "developer" ||
    getRolefromToken(req.headers.authorization) === "stakeholder";
  const reportId = req.params.reportId;
  const status = req.body.status;
  if (authorized) {
    try {
      const updatedReport = await updateReportStatus(reportId, status);
      res.status(200).json(updatedReport);
    } catch (error) {
      // Handle error
      console.error("Error updating report status:", error);
      res.status(500).json({ error: "Failed to update report status" });
    }
  } else {
    res.status(401).json({
      success: false,
      message: "Unathorized, need developer or stakeholder",
    });
  }
}

async function putUpdateDevResponsible(req, res, next) {
  const authorized = getRolefromToken(req.headers.authorization) === "developer";
  if (authorized) {
    try {
      const reportId = req.params.reportId; // Extracting reportId from request parameters
      const { devId } = req.body; // Extracting devId from request body

      // Call the updateDevResponsible function to update the report's developer responsible
      const updatedReport = await updateDevResponsible(reportId, devId);

      // Respond with status 200 (OK) and the updated report
      res.status(200).json(updatedReport);
    } catch (error) {
      // Handle error
      console.error("Error updating developer responsible:", error);
      // Respond with status 500 (Internal Server Error) and an error message
      res.status(500).json({ error: "Failed to update developer responsible" });
    }
  } else {
    res.status(401).json({
      success: false,
      message: "Unathorized, need developer",
    });
  }
}
async function putUpdateStakeholderResponsible(req, res, next) {
  const authorized = getRolefromToken(req.headers.authorization) === "stakeholder";
  if (authorized) {
    try {
      const reportId = req.params.reportId; // Extracting reportId from request parameters
      const { stakeholderId } = req.body; // Extracting stakeholderId from request body

      // Call the updateStakeholderResponsible function to update the report's stakeholder responsible
      const updatedReport = await updateStakeholderResponsible(reportId, stakeholderId);

      // Respond with status 200 (OK) and the updated report
      res.status(200).json(updatedReport);
    } catch (error) {
      // Handle error
      console.error("Error updating stakeholder responsible:", error);
      // Respond with status 500 (Internal Server Error) and an error message
      res.status(500).json({ error: "Failed to update stakeholder responsible" });
    }
  } else {
    res.status(401).json({
      success: false,
      message: "Unathorized, need stakeholder",
    });
  }
}

async function getFindAcceptedReport(req, res, next) {
  const authorized = getRolefromToken(req.headers.authorization) === "developer";
  if (authorized) {
    try {
      // Call the findAcceptedReport function to retrieve accepted reports
      const acceptedReports = await findAcceptedReport();

      // Respond with status 200 (OK) and the retrieved accepted reports
      res.status(200).json(acceptedReports);
    } catch (error) {
      // Handle error
      console.error("Error finding accepted reports:", error);
      // Respond with status 500 (Internal Server Error) and an error message
      res.status(500).json({ error: "Failed to find accepted reports" });
    }
  } else {
    res.status(401).json({
      success: false,
      message: "Unathorized, need developer",
    });
  }
}

async function getFindReportByProjectId(req, res, next) {
  const authorized = getRolefromToken(req.headers.authorization) === "stakeholder";
  if (authorized) {
    try {
      const projectId = req.params.projectId; // Extracting projectId from request parameters

      // Call the findReportsByProjectId function to retrieve reports for the project
      const reports = await findReportsByProjectId(projectId);

      // Respond with status 200 (OK) and the retrieved reports
      res.status(200).json(reports);
    } catch (error) {
      // Handle error
      console.error("Error finding reports by project id:", error);
      // Respond with status 500 (Internal Server Error) and an error message
      res.status(500).json({ error: "Failed to find reports by project id" });
    }
  } else {
    res.status(401).json({
      success: false,
      message: "Unathorized, need stakeholder",
    });
  }
}

async function getReportsByStatusProgressSolved(req, res, next) {
  const authorized = getRolefromToken(req.headers.authorization) === "developer";
  if (authorized) {
    try {
      // Call the findReportsByStatusProgressSolved function to retrieve reports with statuses "Solved" or "In Progress"
      const reports = await findReportsByStatusProgressSolved();

      // Respond with status 200 (OK) and the retrieved reports
      res.status(200).json(reports);
    } catch (error) {
      // Handle error
      console.error("Error finding reports by status 'Solved' or 'In Progress':", error);
      // Respond with status 500 (Internal Server Error) and an error message
      res.status(500).json({
        error: "Failed to find reports by status 'Solved' or 'In Progress'",
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: "Unathorized, need developer",
    });
  }
}
module.exports = {
  postCreateReport,
  putUpdateReportStatus,
  putUpdateDevResponsible,
  putUpdateStakeholderResponsible,
  getFindAcceptedReport,
  getFindReportByProjectId,
  getReportsByStatusProgressSolved,
  postUploadMedia
};
