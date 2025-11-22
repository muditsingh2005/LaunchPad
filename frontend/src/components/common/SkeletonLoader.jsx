import React from "react";
import "./SkeletonLoader.css";

export const CardSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton-header">
      <div className="skeleton-title"></div>
      <div className="skeleton-badge"></div>
    </div>
    <div className="skeleton-content">
      <div className="skeleton-line"></div>
      <div className="skeleton-line short"></div>
    </div>
    <div className="skeleton-footer">
      <div className="skeleton-chip"></div>
      <div className="skeleton-chip"></div>
      <div className="skeleton-chip"></div>
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="skeleton-stat-card">
    <div className="skeleton-icon-circle"></div>
    <div className="skeleton-stat-content">
      <div className="skeleton-number"></div>
      <div className="skeleton-label"></div>
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <div className="skeleton-table-row">
    <div className="skeleton-cell"></div>
    <div className="skeleton-cell"></div>
    <div className="skeleton-cell short"></div>
    <div className="skeleton-cell short"></div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="skeleton-profile">
    <div className="skeleton-avatar-large"></div>
    <div className="skeleton-profile-info">
      <div className="skeleton-line"></div>
      <div className="skeleton-line short"></div>
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="dashboard-skeleton">
    <div className="skeleton-stats-grid">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>
    <div className="skeleton-content-grid">
      <div className="skeleton-section">
        <div className="skeleton-section-title"></div>
        <div className="skeleton-cards-grid">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  </div>
);
