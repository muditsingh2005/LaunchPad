import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../../services/axiosInstance";
import "./PublicProfile.css";

const PublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchStudentProfile();
  }, [id]);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(
        `/api/v2/student/public-profile/${id}`
      );

      if (response.data?.success) {
        setStudent(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching student profile:", err);
      setError(err.response?.data?.message || "Failed to load student profile");
    } finally {
      setLoading(false);
    }
  };

  const handleViewResume = () => {
    if (student?.resumeUrl) {
      window.open(student.resumeUrl, "_blank");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="public-profile-page">
        <div className="public-profile-container">
          <div className="profile-loading">
            <div className="loading-spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="public-profile-page">
        <div className="public-profile-container">
          <div className="profile-error">
            <div className="error-icon">⚠️</div>
            <h3>Unable to load profile</h3>
            <p>{error}</p>
            <button onClick={handleGoBack} className="back-button">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="public-profile-page">
        <div className="public-profile-container">
          <div className="profile-error">
            <div className="error-icon">👤</div>
            <h3>Student not found</h3>
            <button onClick={handleGoBack} className="back-button">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="public-profile-page">
      <motion.div
        className="public-profile-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Button */}
        <button onClick={handleGoBack} className="back-btn">
          ← Back
        </button>

        {/* Profile Header */}
        <motion.div
          className="profile-header-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="profile-avatar-large">
            {student.profilePicture ? (
              <img src={student.profilePicture} alt={student.name} />
            ) : (
              <div className="avatar-placeholder-large">
                {student.name?.charAt(0).toUpperCase() || "S"}
              </div>
            )}
          </div>
          <div className="profile-header-info">
            <h1 className="profile-name">{student.name || "Student"}</h1>
            <div className="profile-meta-info">
              <span className="meta-item">
                <span className="meta-icon">🎓</span>
                {student.department || "N/A"}
              </span>
              <span className="meta-divider">•</span>
              <span className="meta-item">
                <span className="meta-icon">📚</span>
                Year {student.year || "N/A"}
              </span>
              <span className="meta-divider">•</span>
              <span className="meta-item">
                <span className="meta-icon">✉️</span>
                {student.email || "N/A"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* About Section */}
        {student.about && (
          <motion.div
            className="profile-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="section-title">About</h2>
            <p className="about-text">{student.about}</p>
          </motion.div>
        )}

        {/* Skills Section */}
        {student.skills && student.skills.length > 0 && (
          <motion.div
            className="profile-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="section-title">Skills</h2>
            <div className="skills-container">
              {student.skills.map((skill, index) => (
                <motion.span
                  key={index}
                  className="skill-chip"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Education Section */}
        {student.education && student.education.length > 0 && (
          <motion.div
            className="profile-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="section-title">Education</h2>
            <div className="education-list">
              {student.education.map((edu, index) => (
                <motion.div
                  key={index}
                  className="education-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                >
                  <div className="edu-icon">🎓</div>
                  <div className="edu-content">
                    <h3 className="edu-degree">{edu.degree || "Degree"}</h3>
                    <p className="edu-institution">
                      {edu.institution || "Institution"}
                    </p>
                    {edu.year && <span className="edu-year">{edu.year}</span>}
                    {edu.grade && (
                      <span className="edu-grade">Grade: {edu.grade}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Resume Section */}
        {student.resumeUrl && (
          <motion.div
            className="profile-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="section-title">Resume</h2>
            <div className="resume-section">
              <div className="resume-info">
                <div className="resume-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <div className="resume-details">
                  <h3>Resume Available</h3>
                  <p>Click to view or download</p>
                </div>
              </div>
              <motion.button
                className="view-resume-btn"
                onClick={handleViewResume}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="btn-icon">👁️</span>
                View Resume
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Empty State if no additional info */}
        {!student.about &&
          (!student.skills || student.skills.length === 0) &&
          (!student.education || student.education.length === 0) &&
          !student.resumeUrl && (
            <motion.div
              className="profile-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="empty-profile-state">
                <p>This student hasn't added additional information yet.</p>
              </div>
            </motion.div>
          )}
      </motion.div>
    </div>
  );
};

export default PublicProfile;
