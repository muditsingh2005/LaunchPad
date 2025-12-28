import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import StudentModel from "../models/Student.model.js";
import StartupModel from "../models/Startup.model.js";
import ProjectModel from "../models/Project.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

//controllers for student role
// Private profile - for students viewing their own profile
const getStudentProfile = asyncHandler(async (req, res) => {
  const studentId = req.user?._id;

  if (!studentId) {
    throw new ApiError(400, "Student ID is required");
  }

  const student = await StudentModel.findById(studentId).select(
    "-password -refreshToken"
  );

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, student, "Student profile fetched successfully")
    );
});

// Public profile - for any authenticated user viewing a student's profile
const getPublicStudentProfile = asyncHandler(async (req, res) => {
  const studentId = req.params?.id;

  if (!studentId) {
    throw new ApiError(400, "Student ID is required");
  }

  const student = await StudentModel.findById(studentId).select(
    "-password -refreshToken"
  );

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        student,
        "Public student profile fetched successfully"
      )
    );
});

const updateStudentProfile = asyncHandler(async (req, res) => {
  const studentId = req.user?._id;

  if (!studentId) {
    throw new ApiError(401, "Unauthorized - Student ID not found");
  }

  const allowedFields = [
    "name",
    "skills",
    "about",
    "education",
    "department",
    "year",
  ];

  const updateData = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined && req.body[field] !== null) {
      updateData[field] = req.body[field];
    }
  });

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "At least one field is required for update");
  }

  if (updateData.name && typeof updateData.name !== "string") {
    throw new ApiError(400, "Name must be a string");
  }

  if (updateData.name && updateData.name.trim().length === 0) {
    throw new ApiError(400, "Name cannot be empty");
  }

  if (updateData.skills && !Array.isArray(updateData.skills)) {
    throw new ApiError(400, "Skills must be an array");
  }

  if (updateData.about && typeof updateData.about !== "string") {
    throw new ApiError(400, "About must be a string");
  }

  if (updateData.education && !Array.isArray(updateData.education)) {
    throw new ApiError(400, "Education must be an array");
  }

  if (updateData.department && typeof updateData.department !== "string") {
    throw new ApiError(400, "Department must be a string");
  }

  if (updateData.year && !Number.isInteger(updateData.year)) {
    throw new ApiError(400, "Year must be an integer");
  }

  if (updateData.year && ![1, 2, 3, 4].includes(updateData.year)) {
    throw new ApiError(400, "Year must be between 1 and 4");
  }

  const updatedStudent = await StudentModel.findByIdAndUpdate(
    studentId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!updatedStudent) {
    throw new ApiError(404, "Student not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedStudent,
        "Student profile updated successfully"
      )
    );
});

const uploadStudentProfilePicture = asyncHandler(async (req, res) => {
  const studentId = req.user?._id;

  if (!studentId) {
    throw new ApiError(401, "Unauthorized - Student ID not found");
  }

  if (!req.file) {
    throw new ApiError(400, "Profile picture file is required");
  }

  const allowedImageMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (!allowedImageMimes.includes(req.file.mimetype)) {
    throw new ApiError(
      400,
      "Invalid file type. Only image files (JPEG, PNG, GIF, WebP) are allowed."
    );
  }

  const uploadResponse = await uploadOnCloudinary(
    req.file.path,
    req.file.mimetype
  );

  if (!uploadResponse) {
    throw new ApiError(400, "Failed to upload profile picture to Cloudinary");
  }

  const profilePictureUrl = uploadResponse.secure_url || uploadResponse.url;

  if (!profilePictureUrl) {
    throw new ApiError(400, "No URL returned from Cloudinary upload");
  }

  const updatedStudent = await StudentModel.findByIdAndUpdate(
    studentId,
    { $set: { profilePicture: profilePictureUrl } },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!updatedStudent) {
    throw new ApiError(404, "Student not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        profilePictureUrl: updatedStudent.profilePicture,
      },
      "Profile picture uploaded successfully"
    )
  );
});

const deleteStudentAccount = asyncHandler(async (req, res) => {
  const studentId = req.user?._id;

  if (!studentId) {
    throw new ApiError(401, "Unauthorized - Student ID not found");
  }

  const student = await StudentModel.findById(studentId);

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  await StudentModel.findByIdAndDelete(studentId);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        deletedEmail: student.email,
        deletedAt: new Date().toISOString(),
      },
      "Student account deleted successfully"
    )
  );
});

const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Resume file is required");
  }
  const studentId = req.user._id;

  const student = await StudentModel.findById(studentId);
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  if (student.role !== "student") {
    throw new ApiError(403, "Only students can upload resumes");
  }

  const { uploadOnCloudinary } = await import("../utils/cloudinary.js");
  const uploadResponse = await uploadOnCloudinary(
    req.file.path,
    req.file.mimetype
  );

  if (!uploadResponse) {
    throw new ApiError(400, "Resume upload failed");
  }
  student.resumeUrl = uploadResponse.secure_url;
  await student.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { resumeUrl: student.resumeUrl },
        "Resume uploaded successfully"
      )
    );
});

//controllers for startup role
const getStartupProfile = asyncHandler(async (req, res) => {
  const startupId = req.user?._id || req.params?.id;

  if (!startupId) {
    throw new ApiError(400, "Startup ID is required");
  }

  const startup = await StartupModel.findById(startupId).select(
    "-password -refreshToken"
  );

  if (!startup) {
    throw new ApiError(404, "Startup not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, startup, "Startup profile fetched successfully")
    );
});

const uploadStartupLogo = asyncHandler(async (req, res) => {
  const startupId = req.user?._id;

  if (!startupId) {
    throw new ApiError(401, "Unauthorized - Startup ID not found");
  }

  if (!req.file) {
    throw new ApiError(400, "Logo file is required");
  }
  const allowedImageMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (!allowedImageMimes.includes(req.file.mimetype)) {
    throw new ApiError(
      400,
      "Invalid file type. Only image files (JPEG, PNG, GIF, WebP) are allowed."
    );
  }

  const uploadResponse = await uploadOnCloudinary(
    req.file.path,
    req.file.mimetype
  );

  if (!uploadResponse) {
    throw new ApiError(400, "Failed to upload logo to Cloudinary");
  }

  const logoUrl = uploadResponse.secure_url || uploadResponse.url;

  if (!logoUrl) {
    throw new ApiError(400, "No URL returned from Cloudinary upload");
  }
  const updatedStartup = await StartupModel.findByIdAndUpdate(
    startupId,
    { $set: { logoUrl } },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!updatedStartup) {
    throw new ApiError(404, "Startup not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { logoUrl: updatedStartup.logoUrl },
        "Logo uploaded successfully"
      )
    );
});

const updateStartupProfile = asyncHandler(async (req, res) => {
  const startupId = req.user?._id;

  if (!startupId) {
    throw new ApiError(401, "Unauthorized - Startup ID not found");
  }

  const allowedFields = ["name", "founderName", "description", "website"];

  const updateData = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined && req.body[field] !== null) {
      updateData[field] = req.body[field];
    }
  });

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "At least one field is required for update");
  }

  if (updateData.name && typeof updateData.name !== "string") {
    throw new ApiError(400, "Name must be a string");
  }

  if (updateData.name && updateData.name.trim().length === 0) {
    throw new ApiError(400, "Name cannot be empty");
  }

  if (updateData.founderName && typeof updateData.founderName !== "string") {
    throw new ApiError(400, "Founder name must be a string");
  }

  if (updateData.founderName && updateData.founderName.trim().length === 0) {
    throw new ApiError(400, "Founder name cannot be empty");
  }

  if (updateData.description && typeof updateData.description !== "string") {
    throw new ApiError(400, "Description must be a string");
  }

  if (updateData.description && updateData.description.trim().length === 0) {
    throw new ApiError(400, "Description cannot be empty");
  }

  if (updateData.description && updateData.description.length > 500) {
    throw new ApiError(400, "Description cannot exceed 500 characters");
  }

  if (updateData.website && typeof updateData.website !== "string") {
    throw new ApiError(400, "Website must be a string");
  }

  if (updateData.website) {
    const urlRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+/;
    if (!urlRegex.test(updateData.website)) {
      throw new ApiError(400, "Website must be a valid URL");
    }
  }

  // Find and update startup
  const updatedStartup = await StartupModel.findByIdAndUpdate(
    startupId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!updatedStartup) {
    throw new ApiError(404, "Startup not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedStartup,
        "Startup profile updated successfully"
      )
    );
});

const deleteStartupAccount = asyncHandler(async (req, res) => {
  const startupId = req.user?._id;

  if (!startupId) {
    throw new ApiError(401, "Unauthorized - Startup ID not found");
  }

  const startup = await StartupModel.findById(startupId);

  if (!startup) {
    throw new ApiError(404, "Startup not found");
  }

  const deletedProjectsResult = await ProjectModel.deleteMany({
    startup: startupId,
  });

  await StartupModel.findByIdAndDelete(startupId);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        deletedEmail: startup.email,
        deletedCompanyName: startup.name,
        deletedProjectsCount: deletedProjectsResult.deletedCount,
        deletedAt: new Date().toISOString(),
      },
      "Startup account and associated projects deleted successfully"
    )
  );
});

export {
  getStudentProfile,
  getPublicStudentProfile,
  updateStudentProfile,
  uploadStudentProfilePicture,
  deleteStudentAccount,
  getStartupProfile,
  updateStartupProfile,
  deleteStartupAccount,
  uploadResume,
  uploadStartupLogo,
};
