import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../services/axiosInstance";
import "./EditProjectModal.css";

const EditProjectModal = ({ projectId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requiredSkills: [],
    stipend: 0,
    duration: "",
    deadline: "",
    status: "open",
  });
  const [skillInput, setSkillInput] = useState("");
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(`/api/v4/project/${projectId}`);
      const project = response.data.data;

      const projectData = {
        title: project.title || "",
        description: project.description || "",
        requiredSkills: project.requiredSkills || [],
        stipend: project.stipend || 0,
        duration: project.duration || "",
        deadline: project.deadline
          ? new Date(project.deadline).toISOString().split("T")[0]
          : "",
        status: project.status || "open",
      };

      setFormData(projectData);
      setOriginalData(projectData);
    } catch (err) {
      console.error("Error fetching project:", err);
      setError(err.response?.data?.message || "Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "stipend" ? Number(value) : value,
    }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const skill = skillInput.trim();
    if (skill && !formData.requiredSkills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skill],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(
        (skill) => skill !== skillToRemove
      ),
    }));
  };

  const getChangedFields = () => {
    const changedFields = {};

    Object.keys(formData).forEach((key) => {
      if (key === "requiredSkills") {
        // Compare arrays
        const original = JSON.stringify(originalData[key]?.sort());
        const current = JSON.stringify(formData[key]?.sort());
        if (original !== current) {
          changedFields[key] = formData[key];
        }
      } else if (formData[key] !== originalData[key]) {
        changedFields[key] = formData[key];
      }
    });

    return changedFields;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get only changed fields
    const changedFields = getChangedFields();

    if (Object.keys(changedFields).length === 0) {
      setError("No changes detected");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await axiosInstance.put(
        `/api/v4/project/update/${projectId}`,
        changedFields
      );

      onSuccess({
        ...originalData,
        ...changedFields,
        _id: projectId,
      });
      onClose();
    } catch (err) {
      console.error("Error updating project:", err);
      setError(err.response?.data?.message || "Failed to update project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="edit-modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="edit-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="edit-modal-header">
            <h2>Edit Project</h2>
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>
          </div>

          {loading ? (
            <div className="edit-modal-loading">
              <div className="loading-spinner"></div>
              <p>Loading project details...</p>
            </div>
          ) : error && !formData.title ? (
            <div className="edit-modal-error">
              <div className="error-icon">⚠️</div>
              <p>{error}</p>
              <button className="retry-btn" onClick={fetchProjectDetails}>
                Retry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="edit-form">
              {error && (
                <div className="form-error">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <div className="form-scroll">
                {/* Title */}
                <div className="form-group">
                  <label htmlFor="title">
                    Project Title <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Full Stack Web Developer"
                    required
                  />
                </div>

                {/* Description */}
                <div className="form-group">
                  <label htmlFor="description">
                    Description <span className="required">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the project requirements and responsibilities..."
                    rows="5"
                    required
                  />
                </div>

                {/* Skills */}
                <div className="form-group">
                  <label htmlFor="skills">Required Skills</label>
                  <div className="skills-input-container">
                    <input
                      type="text"
                      id="skills"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Type a skill and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAddSkill(e);
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="add-skill-btn"
                      onClick={handleAddSkill}
                    >
                      Add
                    </button>
                  </div>
                  {formData.requiredSkills.length > 0 && (
                    <div className="skills-tags">
                      {formData.requiredSkills.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="remove-skill-btn"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Stipend & Duration */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="stipend">
                      Stipend (₹) <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      id="stipend"
                      name="stipend"
                      value={formData.stipend}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="duration">Duration</label>
                    <input
                      type="text"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="e.g., 3 months, 6 weeks"
                    />
                  </div>
                </div>

                {/* Deadline & Status */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="deadline">Deadline</label>
                    <input
                      type="date"
                      id="deadline"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="status">
                      Status <span className="required">*</span>
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="edit-modal-footer">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={onClose}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-btn"
                  disabled={saving || loading}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditProjectModal;
