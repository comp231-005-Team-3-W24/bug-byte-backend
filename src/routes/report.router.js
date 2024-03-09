const express = require("express");
const {
  postCreateReport,
  putUpdateReportStatus,
  putUpdateDevResponsible,
  putUpdateStakeholderResponsible,
  getFindAcceptedReport,
  getFindReportByProjectId,
  getReportsByStatusProgressSolved,
  postUploadMedia,
} = require("../controller/report.controller");
const reportRouter = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

reportRouter.get("/acceptedReport", getFindAcceptedReport);
reportRouter.get("/reportByProjectId/:projectId", getFindReportByProjectId);
reportRouter.get("/reportsByStatusProgressSolved", getReportsByStatusProgressSolved);
reportRouter.post("/create", postCreateReport);
reportRouter.post("/upload-media/:reportId", upload.any(), postUploadMedia);
reportRouter.put("/updateStatus/:reportId", putUpdateReportStatus);
reportRouter.put("/updateDevResponsible/:reportId", putUpdateDevResponsible);
reportRouter.put("/updateStakeholderResponsible/:reportId", putUpdateStakeholderResponsible);

module.exports = reportRouter;
