import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import StudentModel from "../models/Student.model.js";
import StartupModel from "../models/Startup.model.js";

const generateAccessAndRefreshTokens = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { role, email, password, ...otherDetails } = req.body;

  if (!role || !email || !password) {
    throw new ApiError(400, "Role, email, and password are required");
  }

  let model;
  switch (role) {
    case "student":
      model = StudentModel;
      break;
    case "startup":
      model = StartupModel;
      break;
    default:
      throw new ApiError(400, "Invalid user role");
  }

  const existedUser = await model.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  // Normalize form-data fields
  const normalizedDetails = { ...otherDetails };
  if (normalizedDetails.year !== undefined) {
    const yearNum = Number(normalizedDetails.year);
    normalizedDetails.year = Number.isNaN(yearNum)
      ? normalizedDetails.year
      : yearNum;
  }
  if (normalizedDetails.skills !== undefined) {
    if (Array.isArray(normalizedDetails.skills)) {
      // keep as-is
    } else if (typeof normalizedDetails.skills === "string") {
      try {
        const parsed = JSON.parse(normalizedDetails.skills);
        normalizedDetails.skills = Array.isArray(parsed)
          ? parsed
          : [normalizedDetails.skills];
      } catch {
        normalizedDetails.skills = [normalizedDetails.skills];
      }
    } else {
      normalizedDetails.skills = [];
    }
  }

  // Validate required fields based on role
  if (role === "student") {
    const { name, year, department } = normalizedDetails;
    if (!name || !year || !department) {
      throw new ApiError(
        400,
        "Name, year, and department are required for students"
      );
    }
  } else if (role === "startup") {
    const { name, founderName, description } = normalizedDetails;
    if (!name || !founderName || !description) {
      throw new ApiError(
        400,
        "Name, founderName, and description are required for startups"
      );
    }
  }

  // Handle logo upload for startups if present
  let logoUrl;
  if (role === "startup" && req.files?.logo) {
    const { uploadOnCloudinary } = await import("../utils/cloudinary.js");
    const file = Array.isArray(req.files.logo)
      ? req.files.logo[0]
      : req.files.logo;
    if (!file?.path) {
      throw new ApiError(400, "Logo file not received");
    }
    const uploadResponse = await uploadOnCloudinary(file.path, file.mimetype);
    if (!uploadResponse) {
      throw new ApiError(400, "Logo upload failed");
    }
    logoUrl = uploadResponse.secure_url;
  }

  const user = await model.create({
    email,
    password,
    ...normalizedDetails,
    ...(logoUrl && { logoUrl }),
  });

  if (!user) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user
  );

  const userData = user.toObject();
  delete userData.password;
  delete userData.refreshToken;

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: userData,
        accessToken,
        refreshToken,
      },
      "User registered successfully"
    )
  );
});

const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Resume file is required");
  }

  // Get student ID from authenticated user
  const studentId = req.user._id;

  // Verify the user exists and is a student
  const student = await StudentModel.findById(studentId);
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  if (student.role !== "student") {
    throw new ApiError(403, "Only students can upload resumes");
  }

  // Upload resume to Cloudinary
  const { uploadOnCloudinary } = await import("../utils/cloudinary.js");
  const uploadResponse = await uploadOnCloudinary(
    req.file.path,
    req.file.mimetype
  );

  if (!uploadResponse) {
    throw new ApiError(400, "Resume upload failed");
  }

  // Update student's resumeUrl
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

export { registerUser, uploadResume };
