<template>
  <div class="registrations-container">
    <div class="header-section">
      <h3 class="title">User Registrations</h3>
      <div class="info">
        <span class="count">{{ registrations.length }} registration{{ registrations.length !== 1 ? 's' : '' }}</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <p>Loading registrations...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="registrations.length === 0" class="empty-state">
      <div class="empty-content">
        <div class="icon">
          <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
          </svg>
        </div>
        <h3>No Registrations Found</h3>
        <p>Start by registering the first participant</p>
      </div>
    </div>

    <!-- Card View -->
    <div v-else class="card-view">
      <div class="card-grid">
        <div
          v-for="registration in registrations"
          :key="registration.id"
          class="registration-card"
        >
          <div class="card-header">
            <div class="user-avatar">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="user-info">
              <h4 class="user-name">{{ registration.user_name }}</h4>
              <p class="user-email">{{ registration.email || 'No email' }}</p>
            </div>
            <div class="card-actions">
              <button @click.stop="handleEdit(registration)" class="action-btn edit" title="Edit">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button @click.stop="handleDelete(registration)" class="action-btn delete" title="Delete">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <div class="card-body">
            <div class="detail-row">
              <span class="label">Activity:</span>
              <span class="value">{{ registration.activities?.name || 'Unknown' }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Type:</span>
              <span class="value">{{ registration.activities?.meeting_type || 'General' }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Phone:</span>
              <span class="value">{{ registration.phone || 'Not provided' }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Registered:</span>
              <span class="value">{{ formatDateTime(registration.registered_at) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Status:</span>
              <span class="status-badge">{{ registration.status || 'pending' }}</span>
            </div>
          </div>

          <div class="card-footer">
            <span class="time-ago">{{ getRelativeTime(registration.registered_at) }}</span>
          </div>
        </div>
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
      const diff = Math.floor((now - date) / 1000);

      if (diff < 60) return 'Just now';
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
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
.registrations-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.count {
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  text-align: center;
}

.spinner {
  animation: spin 1s linear infinite;
  color: #3b82f6;
  margin-bottom: 1rem;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px dashed #e5e7eb;
}

.empty-state .icon {
  color: #9ca3af;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6b7280;
  margin: 0;
}

/* Card Grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
  padding: 0.5rem 0;
}

/* Registration Card */
.registration-card {
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;
}

.registration-card:hover {
  transform: translateY(-0.25rem);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.user-avatar {
  flex-shrink: 0;
  margin-right: 1rem;
}

.user-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.user-email {
  color: #6b7280;
  margin: 0;
}

.card-actions {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 0.5rem;
}

.action-btn:hover {
  background: #f3f4f6;
}

.edit {
  color: #2563eb;
}

.delete {
  color: #ef4444;
}

.card-body {
  padding: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.label {
  color: #6b7280;
  font-weight: 500;
}

.value {
  color: #111827;
  font-weight: 500;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  background: #3b82f6;
}

.card-footer {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.time-ago {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
