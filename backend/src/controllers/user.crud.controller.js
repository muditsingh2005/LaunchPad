import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import StudentModel from "../models/Student.model.js";

const getStudentProfile = asyncHandler(async (req, res) => {
  // Get student ID from authenticated user or params
  const studentId = req.user?._id || req.params?.id;

  if (!studentId) {
    throw new ApiError(400, "Student ID is required");
  }

  // Fetch student profile, excluding password and refreshToken
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

export { getStudentProfile };
