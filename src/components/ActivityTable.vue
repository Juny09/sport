<template>
  <div class="athletic-table-container">
    <!-- Table Header -->
    <div class="table-header-section">
      <div class="header-content">
        <div class="header-info">
          <h3 class="table-title">Activity Collection</h3>
          <p class="table-subtitle">{{ activities.length }} activities available</p>
        </div>
        <div class="header-stats">
          <div class="stat-badge">

            Total : {{ activities.length }}
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="athletic-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring delay-1"></div>
        <div class="spinner-ring delay-2"></div>
      </div>
      <p class="loading-text">Loading activities...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="activities.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
      </div>
      <h4 class="empty-title">No Activities Found</h4>
      <p class="empty-description">Start building your activity collection by creating your first activity.</p>
    </div>

    <!-- Activities Table -->
    <div v-else class="table-wrapper">
      <div class="table-scroll">
        <table class="athletic-table">
          <!-- Table Head -->
          <thead class="table-head">
            <tr>
              <th class="table-header-cell">
                <div class="header-cell-content">

                  Activity Details
                </div>
              </th>
              <th class="table-header-cell">
                <div class="header-cell-content">
                  Configuration
                </div>
              </th>
              <th class="table-header-cell">
                <div class="header-cell-content">
                  Timeline
                </div>
              </th>
              <th class="table-header-cell actions-column">
                <div class="header-cell-content">
                  Actions
                </div>
              </th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody class="table-body">
            <tr
              v-for="activity in activities"
              :key="activity.id"
              class="table-row"
              @click="handleSelect(activity)"
            >
              <!-- Activity Details -->
              <td class="table-cell">
                <div class="activity-info">
                  <div class="activity-main">
                    <h4 class="activity-name">{{ activity.name }}</h4>
                    <p class="activity-description">
                      {{ truncateText(activity.description, 80) }}
                    </p>
                  </div>
                  <div class="activity-meta">
                    <span class="activity-type-badge">
                      {{ activity.meeting_type || 'General' }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Configuration -->
              <td class="table-cell">
                <div class="config-info">
                  <div class="config-item">
                    <svg class="w-3 h-3 config-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
                    </svg>
                    <span class="config-value">{{ activity.team_size || 'Any size' }}</span>
                  </div>
                  <div class="config-item">
                    <svg class="w-3 h-3 config-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span class="config-value">{{ activity.time_required || 'Flexible' }}</span>
                  </div>
                  <div class="config-item">
                    <svg class="w-3 h-3 config-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    </svg>
                    <span class="config-value">{{ activity.location || 'Any location' }}</span>
                  </div>
                </div>
              </td>

              <!-- Timeline -->
              <td class="table-cell">
                <div class="timeline-info">
                  <div class="created-date">
                    <span class="date-label">Created</span>
                    <time class="date-value">{{ formatDateTime(activity.created_at) }}</time>
                  </div>
                  <div class="tips-count" v-if="activity.facilitation_tips?.length">

                    {{ activity.facilitation_tips.length }} tip{{ activity.facilitation_tips.length !== 1 ? 's' : '' }}
                  </div>
                </div>
              </td>

              <!-- Actions -->
              <td class="table-cell actions-cell" @click.stop>
                <div class="action-buttons">
                  <button
                    @click="handleEdit(activity)"
                    class="action-btn edit-btn"
                    title="Edit Activity"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    @click="handleDelete(activity)"
                    class="action-btn delete-btn"
                    title="Delete Activity"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDateTime, truncateText } from '../utils/helpers.js';

export default {
  name: 'ActivityTable',
  props: {
    activities: {
      type: Array,
      default: () => [],
      validator: (activities) => Array.isArray(activities)
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['edit', 'delete', 'select'],
  setup(props, { emit }) {
    // Event Handlers
    const handleEdit = (activity) => {
      emit('edit', activity);
    };

    const handleDelete = (activity) => {
      const confirmed = confirm(
        `Are you sure you want to delete "${activity.name}"?\n\nThis action cannot be undone.`
      );

      if (confirmed) {
        emit('delete', activity.id);
      }
    };

    const handleSelect = (activity) => {
      emit('select', activity);
    };

    return {
      // Event handlers
      handleEdit,
      handleDelete,
      handleSelect,

      // Utility functions
      formatDateTime,
      truncateText
    };
  }
};
</script>

<style scoped>
/* ============================================
   ACTIVITYTABLE.VUE - TABLE COMPONENT STYLES
   Modern, responsive table with glassmorphic design
============================================ */

/* Base Table Container */
.athletic-table-container {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  transition: all var(--transition-normal);
}

/* Table Header Section */
.table-header-section {
  padding: 1rem;
  background: linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1));
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 640px) {
  .header-content {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.header-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #000;
}

/* Table Styles */
.athletic-table {
  width: 100%;
  border-collapse: collapse;
}

.table-head {
  background-color: rgba(59, 130, 246, 0.05);
}

.table-header-cell {
  padding: 1rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border-color);
}

.table-body {
  background: transparent;
  background-color: rgba(255, 255, 255, 0.02);
}

.table-row {
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

.table-cell {
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  color: #000;
  vertical-align: middle;
}

/* Activity Info */
.activity-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .activity-info {
    flex-direction: row;
    justify-content: space-between;
  }
}

.activity-main {
  flex: 1;
}

.activity-name {
  font-size: 1rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 0.25rem;
}

.activity-description {
  font-size: 0.875rem;
  color: #333;
  line-height: 1.5;
}

/* Configuration Info */
.config-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.config-icon {
  color: #000;
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
}

.config-value {
  color: #000;
}

/* Timeline Info */
.timeline-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.date-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.date-value {
  font-size: 0.875rem;
  color: #000;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.action-btn {
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid transparent;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-btn svg {
  width: 1rem;
  height: 1rem;
  transition: transform 0.2s ease;
}

.action-btn:hover svg {
  transform: scale(1.1);
}

.edit-btn {
  color: #000;
  background: rgba(59, 130, 246, 0.1);
}

.edit-btn:hover {
  background: var(--primary-500);
  color: white;
}

.delete-btn {
  color: #000;
  background: rgba(239, 68, 68, 0.1);
}

.delete-btn:hover {
  background: var(--error-500);
  color: white;
}

/* Badges */
.activity-type-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--accent-500);
  color: white;
  white-space: nowrap;
}

/* Responsive Design */
@media (max-width: 768px) {
  .table-header-cell,
  .table-cell {
    padding: 0.75rem 1rem;
  }
}

@media (max-width: 640px) {
  .activity-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .action-buttons {
    flex-direction: column;
  }

  .table-header-section {
    padding: 0.75rem;
  }
}

/* Loading and Empty States */
.empty-state {
  padding: 3rem 1rem;
  text-align: center;
  color: #333;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 0.25rem solid var(--primary-500);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
/* Table Container */
.athletic-table-container {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  overflow: hidden;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

/* Table Header Section */
.table-header-section {
  padding: var(--space-6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.header-info {
  flex: 1;
}

.table-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #000;
  margin-bottom: var(--space-1);
}

.table-subtitle {
  color: #333;
  font-size: 0.875rem;
}

.header-stats {
  display: flex;
  gap: var(--space-3);
}

.stat-badge {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--primary-600);
  color: white;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-lg);
  font-size: 0.875rem;
  font-weight: 600;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16);
  text-align: center;
}

.athletic-spinner {
  position: relative;
  width: 60px;
  height: 60px;
  margin-bottom: var(--space-4);
  filter: drop-shadow(0 0 6px var(--primary-500));
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top: 3px solid var(--primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-ring.delay-1 {
  animation-delay: 0.1s;
  border-top-color: #000;
}

.spinner-ring.delay-2 {
  animation-delay: 0.2s;
  border-top-color: var(--success-500);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-text {
  color: #000;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: var(--space-2);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16);
  text-align: center;
  background: radial-gradient(
    ellipse at center,
    rgba(14, 165, 233, 0.05) 0%,
    transparent 70%
  );
}

.empty-icon {
  color: #333;
  margin-bottom: var(--space-6);
  opacity: 0.7;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #000;
  margin-bottom: var(--space-3);
}

.empty-description {
  color: #333;
  font-size: 1rem;
  line-height: 1.6;
}

/* Table Wrapper */
.table-wrapper {
  overflow-x: auto;
}

.table-scroll {
  overflow-x: auto;
}

/* Athletic Table */
.athletic-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

/* Table Head */
.table-head {
  background: rgba(255, 255, 255, 0.1);
}

.table-header-cell {
  padding: var(--space-4) var(--space-6);
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-weight: 600;
  color: #000;
  white-space: nowrap;
}

.header-cell-content {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.actions-column {
  text-align: center;
}

/* Table Body */
.table-body {
  background: transparent;
}

.table-row {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all var(--transition-normal);
  cursor: pointer;
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(25px);
  border-color: rgba(255, 255, 255, 0.3);
}

.table-cell {
  padding: var(--space-4) var(--space-6);
  vertical-align: top;
  color: #000;
}

/* Activity Info */
.activity-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-3);
}

.activity-main {
  flex: 1;
}

.activity-name {
  font-weight: 600;
  color: #000;
  margin-bottom: var(--space-1);
  font-size: 1rem;
}

.activity-description {
  color: #333;
  font-size: 0.875rem;
  line-height: 1.4;
}

.activity-meta {
  flex-shrink: 0;
}

.activity-type-badge {
  background: var(--accent-600);
  color: white;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-md);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

/* Configuration Info */
.config-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.config-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.config-icon {
  color: #000;
  flex-shrink: 0;
}

.config-value {
  color: #000;
  font-size: 0.875rem;
}

/* Timeline Info */
.timeline-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.created-date {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.date-label {
  font-size: 0.75rem;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.date-value {
  color: #000;
  font-size: 0.875rem;
}

.tips-count {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  color: #000;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Action Buttons */
.actions-cell {
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: var(--space-2);
  justify-content: center;
}

.action-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  padding: var(--space-2);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.action-btn svg {
  transition: transform var(--transition-fast);
}

.action-btn:hover svg {
  transform: scale(1.1);
}

.edit-btn {
  color: #000;
  border-color: var(--primary-400);
}

.edit-btn:hover {
  background: var(--primary-600);
  color: white;
}

.delete-btn {
  color: #000;
  border-color: var(--error-400);
}

.delete-btn:hover {
  background: var(--error-600);
  color: white;
}

/* Responsive Design */
@media (max-width: 768px) {
  .table-responsive {
    overflow-x: auto;
  }

  .action-buttons {
    flex-direction: column;
    gap: var(--space-1);
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .table-header-section {
    padding: var(--space-4);
  }

  .table-cell,
  .table-header-cell {
    padding: var(--space-3) var(--space-4);
  }

  .activity-info {
    flex-direction: column;
    gap: var(--space-2);
  }

  .activity-meta {
    align-self: flex-start;
  }
}

/* Enhanced Modern Styles */
.athletic-table-container {
  box-shadow:
    0 8px 32px 0 rgba(31, 38, 135, 0.37),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
}

.table-head {
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.table-header-cell {
  padding: var(--space-4) var(--space-6);
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-weight: 600;
  color: #000;
  white-space: nowrap;
}

.actions-column {
  text-align: center;
}

/* Responsive Design adjustments */
@media (max-width: 480px) {
  .activity-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .table-header-section {
    padding: 0.75rem;
  }

  .table-cell,
  .table-header-cell {
    padding: 0.75rem 1rem;
  }
}
</style>
