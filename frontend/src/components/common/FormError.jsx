import React from "react";
import "./FormError.css";

const FormError = ({ message }) => {
  if (!message) return null;

  return (
    <div className="form-error">
      <span className="form-error-icon">⚠️</span>
      <span className="form-error-message">{message}</span>
    </div>
  );
};

export default FormError;
