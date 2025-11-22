import api from "./api";

// Student Dashboard APIs
export const studentDashboardAPI = {
  // Get student profile
  getProfile: async () => {
    const response = await api.get("/api/v2/student/profile");
    return response.data;
  },

  // Get all available projects
  getAllProjects: async () => {
    const response = await api.get("/api/v4/project/all-projects");
    return response.data;
  },

  // Get student's applied projects
  getAppliedProjects: async () => {
    const response = await api.get("/api/v4/project/applied-projects");
    return response.data;
  },

  // Apply to a project
  applyToProject: async (projectId) => {
    const response = await api.post(`/api/v4/project/apply/${projectId}`);
    return response.data;
  },

  // Update student profile
  updateProfile: async (profileData) => {
    const response = await api.put(
      "/api/v2/student/profile/update",
      profileData
    );
    return response.data;
  },

  // Upload profile picture
  uploadProfilePicture: async (formData) => {
    const response = await api.post(
      "/api/v2/student/profile/picture/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  // Upload resume
  uploadResume: async (formData) => {
    const response = await api.post("/api/v2/student/upload-resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};

// Startup Dashboard APIs
export const startupDashboardAPI = {
  // Get startup profile
  getProfile: async () => {
    const response = await api.get("/api/v3/startup/profile");
    return response.data;
  },

  // Get startup's posted projects
  getMyProjects: async () => {
    const response = await api.get("/api/v4/project/my-projects");
    return response.data;
  },

  // Get applicants for a specific project
  getProjectApplicants: async (projectId) => {
    const response = await api.get(`/api/v4/project/applicants/${projectId}`);
    return response.data;
  },

  // Create new project
  createProject: async (projectData) => {
    const response = await api.post("/api/v4/project/create", projectData);
    return response.data;
  },

  // Update project
  updateProject: async (projectId, projectData) => {
    const response = await api.put(
      `/api/v4/project/update/${projectId}`,
      projectData
    );
    return response.data;
  },

  // Delete project
  deleteProject: async (projectId) => {
    const response = await api.delete(`/api/v4/project/delete/${projectId}`);
    return response.data;
  },

  // Update application status
  updateApplicationStatus: async (projectId, studentId, status) => {
    const response = await api.put(
      `/api/v4/project/applicants/${projectId}/${studentId}`,
      { status }
    );
    return response.data;
  },

  // Update startup profile
  updateProfile: async (profileData) => {
    const response = await api.put(
      "/api/v3/startup/profile/update",
      profileData
    );
    return response.data;
  },
};

// Common project APIs
export const projectAPI = {
  getAllProjects: async () => {
    const response = await api.get("/api/v4/project/all-projects");
    return response.data;
  },
};
