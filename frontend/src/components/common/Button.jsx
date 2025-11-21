import React from "react";
import "./Button.css";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  size = "medium",
  icon,
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${
        fullWidth ? "btn-full-width" : ""
      } ${loading ? "btn-loading" : ""}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <span className="btn-spinner"></span>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
