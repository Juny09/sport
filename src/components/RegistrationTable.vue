<template>
  <div class="table-container">
    <div class="table-header-section">
      <h3 class="table-title">User Registrations</h3>
      <div class="table-info">
        <span class="registration-count">{{ registrations.length }} registration{{ registrations.length !== 1 ? 's' : '' }}</span>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-content">
        <div class="loading-spinner-large">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p class="loading-text">Loading registrations...</p>
        <div class="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>

    <div v-else-if="registrations.length === 0" class="empty-state">
      <div class="empty-content">
        <div class="empty-icon">
          <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
          </svg>
        </div>
        <h3 class="empty-title">No Registrations Found</h3>
        <p class="empty-description">Start by registering the first participant for this activity</p>
      </div>
    </div>

    <div v-else class="table-view">
      <div class="table-responsive">
        <table class="registrations-table">
          <thead class="table-header">
            <tr>
              <th class="table-th">
                <div class="th-content">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  User
                </div>
              </th>
              <th v-if="showActivityColumn" class="table-th">
                <div class="th-content">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                  Activity
                </div>
              </th>
              <th class="table-th">
                <div class="th-content">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  Contact
                </div>
              </th>
              <th class="table-th">
                <div class="th-content">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Registered
                </div>
              </th>
              <th class="table-th">
                <div class="th-content">
                  Actions
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="table-body">
            <tr
              v-for="registration in registrations"
              :key="registration.id"
              class="table-row"
            >
              <td class="table-td">
                <div class="user-info">
                  <div class="user-avatar">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <div class="user-details">
                    <div class="user-name">{{ registration.user_name }}</div>
                    <div class="user-badge">Registered</div>
                  </div>
                </div>
              </td>
              <td v-if="showActivityColumn" class="table-td">
                <div class="activity-info">
                  <div class="activity-name">{{ registration.activities?.name || 'Unknown Activity' }}</div>
                  <div class="activity-type">{{ registration.activities?.meeting_type || 'General' }}</div>
                </div>
              </td>
              <td class="table-td">
                <div class="contact-info">
                  <div class="contact-email">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    {{ registration.email || 'No email' }}
                  </div>
                  <div class="contact-phone">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    {{ registration.phone || 'No phone' }}
                  </div>
                </div>
              </td>
              <td class="table-td">
                <div class="registration-time">
                  <div class="time-primary">{{ formatDateTime(registration.registered_at) }}</div>
                  <div class="time-relative">{{ getRelativeTime(registration.registered_at) }}</div>
                </div>
              </td>
              <td class="table-td">
                <div class="table-actions-cell">
                  <button @click="handleEdit(registration)" class="action-btn edit-btn">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button @click="handleDelete(registration)" class="action-btn delete-btn">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
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
import { formatDateTime } from '../utils/helpers.js';

export default {
  name: 'RegistrationTable',
  props: {
    registrations: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    showActivityColumn: {
      type: Boolean,
      default: true
    }
  },
  emits: ['edit', 'delete'],
  setup(props, { emit }) {
    const handleEdit = (registration) => {
      emit('edit', registration);
    };

    const handleDelete = (registration) => {
      if (confirm(`Are you sure you want to delete registration for "${registration.user_name}"?`)) {
        emit('delete', registration.id);
      }
    };

    const getRelativeTime = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const diff  = Math.floor((now - date) / 1000);
      if (diff < 60) {
        return `${diff} seconds ago`;
      }
      if (diff < 3600) {
        return `${Math.floor(diff / 60)} minutes ago`;
      }
      if (diff < 86400) {
        return `${Math.floor(diff / 3600)} hours ago`;
      }
      return `${Math.floor(diff / 86400)} days ago`;
    };

    return {
      handleEdit,
      handleDelete,
      formatDateTime,
      getRelativeTime
    };
  }
};
</script>

<style scoped>
/* ============================================
   REGISTRATIONTABLE.VUE - REGISTRATION TABLE STYLES
============================================ */

/* Table Container */
.table-container {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  backdrop-filter: blur(20px);
  box-shadow:
    0 8px 32px 0 rgba(31, 38, 135, 0.37),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
}

/* Table Header Section */
.table-header-section {
  padding: var(--space-6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
}

.table-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--dark-text);
  margin-bottom: var(--space-1);
}

.table-info {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.registration-count {
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
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16);
  text-align: center;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-spinner-large {
  margin-bottom: var(--space-4);
  color: var(--primary-500);
  filter: drop-shadow(0 0 6px var(--primary-500));
}

.loading-text {
  color: var(--dark-text);
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: var(--space-2);
}

.loading-dots {
  display: flex;
  gap: var(--space-1);
}

.loading-dots span {
  width: 6px;
  height: 6px;
  background: var(--primary-500);
  border-radius: 50%;
  animation: loadingDots 1.4s ease-in-out infinite both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes loadingDots {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
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

.empty-content {
  max-width: 400px;
}

.empty-icon {
  color: var(--dark-text-muted);
  margin-bottom: var(--space-6);
  opacity: 0.7;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--dark-text);
  margin-bottom: var(--space-3);
}

.empty-description {
  color: var(--dark-text-muted);
  font-size: 1rem;
  line-height: 1.6;
}

/* Table View */
.table-view {
  overflow: hidden;
}

.table-responsive {
  overflow-x: auto;
}

/* Registrations Table */
.registrations-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

/* Table Header */
.table-header {
  background: rgba(255, 255, 255, 0.1);
}

.table-th {
  padding: var(--space-4) var(--space-6);
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-weight: 600;
  color: rgb(48, 47, 47);
  white-space: nowrap;
}

.th-content {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* Table Body */
.table-body {
  background: transparent;
}

.table-row {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all var(--transition-normal);
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(25px);
  border-color: rgba(255, 255, 255, 0.3);
}

.table-td {
  padding: var(--space-4) var(--space-6);
  vertical-align: top;
  color: var(--dark-text);
}

/* User Info */
.user-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.user-avatar {
  background: var(--primary-600);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
}

.user-name {
  font-weight: 600;
  color: rgb(48, 47, 47);
  margin-bottom: var(--space-1);
}

.user-badge {
  background: var(--success-600);
  color: white;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
}

/* Activity Info */
.activity-info .activity-name {
  font-weight: 600;
  color: rgb(48, 47, 47);
  margin-bottom: var(--space-1);
}

.activity-type {
  color: var(--dark-text-muted);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

/* Contact Info */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.contact-email,
.contact-phone {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: rgb(48, 47, 47);
  font-size: 0.875rem;
}

.contact-email svg,
.contact-phone svg {
  color: var(--primary-400);
  flex-shrink: 0;
}

/* Registration Time */
.registration-time {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.time-primary {
  color: rgb(48, 47, 47);
  font-size: 0.875rem;
  font-weight: 500;
}

.time-relative {
  color: var(--dark-text-muted);
  font-size: 0.75rem;
}

/* Actions Cell */
.table-actions-cell {
  text-align: center;
}

.action-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  padding: var(--space-2);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 var(--space-1);
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
  color: var(--primary-400);
  border-color: var(--primary-400);
}

.edit-btn:hover {
  background: var(--primary-600);
  color: white;
}

.delete-btn {
  color: var(--error-400);
  border-color: var(--error-400);
}

.delete-btn:hover {
  background: var(--error-600);
  color: white;
}

/* Icon Sizing */
.w-4 { width: 1rem; }
.w-6 { width: 1.5rem; }
.w-8 { width: 2rem; }
.w-16 { width: 4rem; }

.h-4 { height: 1rem; }
.h-6 { height: 1.5rem; }
.h-8 { height: 2rem; }
.h-16 { height: 4rem; }

/* Responsive Design */
@media (max-width: 768px) {
  .table-responsive {
    overflow-x: auto;
  }

  .table-th,
  .table-td {
    padding: var(--space-3) var(--space-4);
  }

  .user-info {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
  }

  .contact-info {
    gap: var(--space-1);
  }

  .contact-email,
  .contact-phone {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .table-header-section {
    padding: var(--space-4);
  }

  .table-th,
  .table-td {
    padding: var(--space-2) var(--space-3);
  }

  .user-avatar {
    width: 32px;
    height: 32px;
  }

  .action-btn {
    padding: var(--space-1);
    margin: 0 2px;
  }

  .registration-time {
    gap: 2px;
  }

  .time-primary,
  .time-relative {
    font-size: 0.75rem;
  }
}
</style>
