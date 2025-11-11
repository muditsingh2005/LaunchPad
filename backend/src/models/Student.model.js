import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^[\w-\.]+@bennett\.edu\.in$/, " @bennett.edu.in emails allowed"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    year: {
      type: Number,
      enum: [1, 2, 3, 4],
      required: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    resumeUrl: {
      type: String, // Link to uploaded resume (e.g., Cloudinary / Drive)
    },

    appliedProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project", // reference to projects they applied for
      },
    ],

    role: {
      type: String,
      default: "student",
    },

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (!this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

studentSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      year: this.year,
      department: this.department,
      skills: this.skills,
      resumeUrl: this.resumeUrl,
      appliedProjects: this.appliedProjects,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRT,
    }
  );
};
studentSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export default mongoose.model("Student", studentSchema);
