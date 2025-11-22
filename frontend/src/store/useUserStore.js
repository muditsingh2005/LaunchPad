import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      // User state
      user: null,
      isAuthenticated: false,
      loading: false,

      // Dashboard data
      dashboardData: {
        projects: [],
        applications: [],
        stats: null,
        loading: false,
        error: null,
      },

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
          dashboardData: {
            projects: [],
            applications: [],
            stats: null,
            loading: false,
            error: null,
          },
        }),

      setLoading: (loading) => set({ loading }),

      // Dashboard actions
      setDashboardLoading: (loading) =>
        set((state) => ({
          dashboardData: { ...state.dashboardData, loading },
        })),

      setDashboardError: (error) =>
        set((state) => ({
          dashboardData: { ...state.dashboardData, error, loading: false },
        })),

      setProjects: (projects) =>
        set((state) => ({
          dashboardData: { ...state.dashboardData, projects },
        })),

      setApplications: (applications) =>
        set((state) => ({
          dashboardData: { ...state.dashboardData, applications },
        })),

      setStats: (stats) =>
        set((state) => ({
          dashboardData: { ...state.dashboardData, stats },
        })),

      clearDashboardData: () =>
        set({
          dashboardData: {
            projects: [],
            applications: [],
            stats: null,
            loading: false,
            error: null,
          },
        }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useUserStore;
