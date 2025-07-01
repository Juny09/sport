<template>
  <div class="activity-container">
    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <h3 class="title">Activity Collection</h3>
        <button @click="$emit('new-activity')" class="new-activity-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>New Activity</span>
        </button>
      </div>
      <p class="subtitle">{{ activities.length }} activities available</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading activities...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!activities.length" class="empty">
      <p>No activities found</p>
    </div>

    <!-- Activities List -->
    <div v-else class="activities">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="activity-card"
      >
        <div class="activity-content" @click="$emit('select', activity)">
          <h4 class="activity-title">{{ activity.name }}</h4>
          <div v-if="activity.created_at" class="activity-date">
            {{ formatDate(activity.created_at) }}
          </div>
        </div>
        <div class="activity-actions">
          <button class="action-btn edit" @click.stop="$emit('edit', activity)" title="Edit">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="action-btn delete" @click.stop="$emit('delete', activity)" title="Delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns';

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
  emits: ['select', 'edit', 'delete', 'new-activity'],
  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      try {
        return format(new Date(dateString), 'MMM d, yyyy');
      } catch {
        return '';
      }
    }
  }
};
</script>

<style scoped>
.activity-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

/* Header */
.header {
  margin-bottom: 1.5rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.new-activity-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #3182ce;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.new-activity-btn:hover {
  background: #2c5282;
  transform: translateY(-1px);
}

.new-activity-btn svg {
  width: 1rem;
  height: 1rem;
  stroke-width: 3;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 0.25rem;
}

.subtitle {
  color: #4a5568;
  font-size: 0.875rem;
  margin: 0;
}

/* Loading State */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #4a5568;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e2e8f0;
  border-top-color: #3182ce;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Empty State */
.empty {
  text-align: center;
  padding: 2rem;
  color: #718096;
  font-size: 0.95rem;
}

/* Activities List */
.activities {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

/* Activity Card */
.activity-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #e2e8f0;
}

.activity-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.activity-content {
  padding: 1.25rem;
  flex-grow: 1;
  cursor: pointer;
}

.activity-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem;
  line-height: 1.4;
}

.activity-date {
  font-size: 0.8rem;
  color: #718096;
}

/* Action Buttons */
.activity-actions {
  display: flex;
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
  padding: 0.5rem;
  justify-content: flex-end;
  gap: 0.5rem;
}

.action-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  background: transparent;
}

.action-btn:hover {
  transform: translateY(-1px);
}

.action-btn svg {
  width: 1rem;
  height: 1rem;
}

.edit {
  color: #3182ce;
}

.edit:hover {
  background-color: #ebf8ff;
}

.delete {
  color: #e53e3e;
}

.delete:hover {
  background-color: #fff5f5;
}

/* Responsive Design */
@media (max-width: 640px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .new-activity-btn {
    width: 100%;
    justify-content: center;
  }

  .activities {
    grid-template-columns: 1fr;
  }

  .activity-card {
    margin: 0 0.5rem;
  }
}
</style>

