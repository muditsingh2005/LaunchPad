import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import axiosInstance from "../../services/axiosInstance";
import "./EditProfileModal.css";

// Modal for editing student profile (name, department, year, skills)
const EditProfileModal = ({ isOpen, onClose, userProfile, onSuccess }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    skills: [],
    department: "",
    year: 1,
  });
  const [originalData, setOriginalData] = useState(null);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    if (isOpen && userProfile) {
      const profileData = {
        name: userProfile.name || "",
        skills: userProfile.skills || [],
        department: userProfile.department || "",
        year: userProfile.year || 1,
      };
      setFormData(profileData);
      setOriginalData(profileData);
    }
  }, [isOpen, userProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" ? parseInt(value) : value,
    }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const getChangedFields = () => {
    if (!originalData) return formData;

    const changes = {};
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        if (
          JSON.stringify(formData[key]) !== JSON.stringify(originalData[key])
        ) {
          changes[key] = formData[key];
        }
      } else if (formData[key] !== originalData[key]) {
        changes[key] = formData[key];
      }
    });
    return changes;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!formData.department.trim()) {
      setError("Department is required");
      return;
    }

    try {
      setSaving(true);

      const changedFields = getChangedFields();

      if (Object.keys(changedFields).length === 0) {
        setError("No changes detected");
        setSaving(false);
        return;
      }

      const response = await axiosInstance.put(
        "/api/v2/student/profile/update",
        changedFields
      );

      if (response.data.success) {
        onSuccess(response.data.data);
        onClose();
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="edit-profile-overlay" onClick={onClose}>
        <div
          className="edit-profile-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="edit-profile-header">
            <h2>Edit Profile</h2>
            <button className="close-btn" onClick={onClose} disabled={saving}>
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="edit-profile-form">
            {error && (
              <div className="form-error">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <div className="form-scroll">
              {/* Name */}
              <div className="form-group">
                <label htmlFor="name">
                  Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                  disabled={saving}
                />
              </div>

              {/* Department & Year Row */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="department">
                    Department <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="e.g., Computer Science"
                    required
                    disabled={saving}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="year">
                    Year <span className="required">*</span>
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    disabled={saving}
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                  </select>
                </div>
              </div>

              {/* Skills */}
              <div className="form-group">
                <label>Skills</label>
                <div className="tag-input-container">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Type a skill and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAddSkill(e);
                      }
                    }}
                    disabled={saving}
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="add-tag-btn"
                    disabled={saving}
                  >
                    Add
                  </button>
                </div>
                <div className="tags-container">
                  {formData.skills.map((skill, index) => (
                    <span key={index} className="tag">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="remove-tag-btn"
                        disabled={saving}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="edit-profile-footer">
              <button
                type="button"
                className="cancel-btn"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </button>
              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default EditProfileModal;
