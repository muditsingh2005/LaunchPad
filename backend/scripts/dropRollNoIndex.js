import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const dropIndex = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const collection = mongoose.connection.collection("students");
    const indexes = await collection.indexes();
    const rollNoIndex = indexes.find((idx) => idx.name.includes("rollNo"));

    if (!rollNoIndex) {
      console.log("No rollNo index found; nothing to drop.");
    } else {
      await collection.dropIndex(rollNoIndex.name);
      console.log(`Dropped index: ${rollNoIndex.name}`);
    }
  } catch (error) {
    console.error("Error dropping index:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

await dropIndex();
