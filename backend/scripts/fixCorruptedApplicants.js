import mongoose from "mongoose";
import dotenv from "dotenv";
import ProjectModel from "../src/models/Project.model.js";

dotenv.config();

const fixCorruptedApplicants = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/work-app"
    );
    console.log("Connected to MongoDB");

    // Find all projects with corrupted applicants
    const projects = await ProjectModel.find({});
    let fixedCount = 0;

    for (const project of projects) {
      let hasCorrupted = false;
      const cleanedApplicants = [];

      for (const applicant of project.applicants) {
        // Check if applicant has buffer (corrupted)
        if (applicant.buffer) {
          console.log(`Found corrupted applicant in project ${project._id}`);
          hasCorrupted = true;
          continue; // Skip corrupted entries
        }

        // Check if it has proper structure
        if (applicant.student && applicant.status !== undefined) {
          // Good structure
          cleanedApplicants.push(applicant);
        } else if (
          typeof applicant === "object" &&
          !applicant.student &&
          !applicant.status
        ) {
          // Possibly old format or corrupted
          console.log(
            `Skipping anomalous applicant in project ${project._id}:`,
            applicant
          );
          hasCorrupted = true;
          continue;
        } else if (applicant.student) {
          // Has student field but missing status
          cleanedApplicants.push({
            student: applicant.student,
            status: applicant.status || "pending",
            appliedAt: applicant.appliedAt || new Date(),
          });
        }
      }

      // Update project if changes were made
      if (hasCorrupted) {
        project.applicants = cleanedApplicants;
        await project.save();
        fixedCount++;
        console.log(
          `Fixed project ${project._id}. Cleaned ${
            project.applicants.length - cleanedApplicants.length
          } corrupted entries`
        );
      }
    }

    console.log(`\nFixed ${fixedCount} projects total`);
    process.exit(0);
  } catch (error) {
    console.error("Error fixing applicants:", error);
    process.exit(1);
  }
};

fixCorruptedApplicants();
