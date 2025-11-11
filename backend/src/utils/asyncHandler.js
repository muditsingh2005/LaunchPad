const asyncHandler = (fn) => async (req, res, next) => {
  try {
    return await fn(req, res, next);
  } catch (error) {
    let status = 500;
    let message = error?.message || "Something went wrong";

    if (typeof error?.statusCode === "number") {
      status = error.statusCode;
    }

    if (error?.name === "MongoServerError" && error?.code === 11000) {
      status = 409;
      const fields = Object.keys(error.keyValue || {});
      const fieldList = fields.length ? ` (${fields.join(", ")})` : "";
      message = `Duplicate value${fieldList}. Please use a different value.`;
    }

    if (error?.code === "LIMIT_FILE_SIZE") {
      status = 413;
      message = "File too large (max 5MB)";
    }

    if (!Number.isInteger(status) || status < 100 || status >= 600) {
      status = 500;
    }

    return res.status(status).json({
      success: false,
      message,
    });
  }
};

export { asyncHandler };
