import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const startupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    founderName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    website: {
      type: String,
    },

    logoUrl: {
      type: String,
    },

    postedProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],

    verified: {
      type: Boolean,
      default: false, // Admin verification
    },

    role: {
      type: String,
      default: "startup",
    },

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

startupSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (!this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

startupSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      founderName: this.founderName,
      description: this.description,
      website: this.website,
      logoUrl: this.logoUrl,
      postedProjects: this.postedProjects,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRT,
    }
  );
};
startupSchema.methods.generateRefreshToken = function () {
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

export default mongoose.model("Startup", startupSchema);
