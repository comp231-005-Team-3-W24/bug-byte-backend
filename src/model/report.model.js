const { Schema, model } = require("mongoose");
const { findUser } = require("./user.model");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
require("dotenv").config();
const firebaseConfig = {
  apiKey: process.env.GOOGLE_FIREBASE_API_KEY,
  authDomain: "silent-scanner-416518.firebaseapp.com",
  projectId: "silent-scanner-416518",
  storageBucket: "silent-scanner-416518.appspot.com",
  messagingSenderId: "251364493327",
  appId: "1:251364493327:web:04adc8aaeec28552cd3b7a",
  measurementId: "G-K77PTM990J",
};
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
// Define schema for Report entity
const reportSchema = new Schema({
  description: String,
  project_id: String,
  tester: {
    user_id: String,
    user_name: String,
  },
  severity: String,
  status: String,
  stakeholder_responsible: {
    user_id: String,
    user_name: String,
  },
  dev_responsible: {
    user_id: String,
    user_name: String,
  },
  media: {
    image: [String],
    video: [String],
  },
});
const Report = model("Report", reportSchema);
function getFileExtension(url) {
  const urlWithoutQueryParams = url.split("?")[0];
  const extension = urlWithoutQueryParams.split(".").pop();
  return extension.toLowerCase();
}
function cleanFirebaseStorageUrl(url) {
  const parsedUrl = new URL(url);
  const decodedPathname = decodeURIComponent(parsedUrl.pathname);
  const cleanedUrl = `${parsedUrl.protocol}//${parsedUrl.host}${decodedPathname}`;
  return cleanedUrl;
}
async function uploadMedia(reportId, mediaFiles) {
  try {
    const report = await Report.findById(reportId);
    if (!report) {
      throw new Error("Report not found");
    }

    const uploadPromises = mediaFiles.map(async (file) => {
      const storageRef = ref(storage, `media/${reportId}/${file.name}`);
      await uploadBytes(storageRef, file.buffer, { contentType: "image" });
      return getDownloadURL(storageRef);
    });

    const urls = await Promise.all(uploadPromises);

    "url", urls;
    urls.forEach((url) => {
      const extension = getFileExtension(url);

      if (extension === "jpg" || extension === "png") {
        report.media.image.push(url);
      } else if (extension === "mp4") {
        report.media.video.push(url);
      }
    });

    await report.save();
    return report;
  } catch (error) {
    console.error("Failed to upload media:", error);
    throw error;
  }
}
async function createReport(report) {
  try {
    const newReport = new Report(report);
    const savedReport = await newReport.save();
    return savedReport;
  } catch (error) {
    // Handle error
    console.error("Error creating report:", error);
    throw error; // Re-throw the error for handling at a higher level
  }
}
async function updateReportStatus(reportId, status) {
  try {
    const updatedReport = await Report.findByIdAndUpdate(
      reportId,
      { status: status },
      { new: true }
    );
    return updatedReport;
  } catch (error) {
    // Handle error
    console.error("Error updating report status:", error);
    throw error; // Re-throw the error for handling at a higher level
  }
}

async function updateDevResponsible(reportId, devId) {
  try {
    const user = await findUser({ _id: devId });
    const updatedReport = await Report.findByIdAndUpdate(
      reportId,
      {
        dev_responsible: { user_id: devId, user_name: user.name },
        status: "In Progress",
      },
      { new: true }
    );
    return updatedReport;
  } catch (error) {
    // Handle error
    console.error("Error updating device responsible:", error);
    throw error; // Re-throw the error for handling at a higher level
  }
}

async function updateStakeholderResponsible(
  reportId,
  stakeholderId,
  status,
  severity
) {
  try {
    const user = await findUser({ _id: stakeholderId });
    const updatedReport = await Report.findByIdAndUpdate(
      reportId,
      {
        stakeholder_responsible: {
          user_id: stakeholderId,
          user_name: user.name,
        },
        status,
        severity,
      },
      { new: true }
    );
    return updatedReport;
  } catch (error) {
    // Handle error
    console.error("Error updating stakeholder responsible:", error);
    throw error; // Re-throw the error for handling at a higher level
  }
}

async function findAcceptedReport() {
  try {
    const reports = await Report.find({ status: "Accepted" }).sort({
      priority: -1,
    }); // Sort by priority descending
    return reports;
    return reports;
  } catch (error) {
    // Handle error
    console.error("Error finding accepted reports:", error);
    throw error; // Re-throw the error for handling at a higher level
  }
}

async function findReportsByProjectId(projectId) {
  try {
    const reports = await Report.find({ project_id: projectId });
    return reports;
  } catch (error) {
    // Handle error
    console.error("Error finding reports by project id:", error);
    throw error; // Re-throw the error for handling at a higher level
  }
}

async function findReportsByStatusProgressSolved() {
  try {
    const reports = await Report.find({
      status: { $in: ["Solved", "In Progress"] },
    });
    return reports;
  } catch (error) {
    // Handle error
    console.error(
      "Error finding reports by status 'Solved' or 'In Progress':",
      error
    );
    throw error; // Re-throw the error for handling at a higher level
  }
}

module.exports = {
  createReport,
  updateReportStatus,
  updateDevResponsible,
  updateStakeholderResponsible,
  findAcceptedReport,
  findReportsByProjectId,
  findReportsByStatusProgressSolved,
  uploadMedia,
};
