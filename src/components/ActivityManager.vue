<template>
  <div class="activity-manager">
    <!-- Enhanced Header Section -->
    <section class="manager-header">
      <div class="header-container">
        <div class="header-main">
          <div class="title-section">
            <h2 class="manager-title">Activity Command Center</h2>
            <p class="manager-subtitle">Create, organize, and manage your team activities</p>
          </div>
          <div class="header-actions">
            <button @click="openCreateForm" class="create-activity-btn">
              <svg class="w-4 h-4" fill="none" stroke="#000" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              <span>New Activity</span>
            </button>
          </div>
        </div>

        <!-- Stats Overview -->
        <div class="stats-overview">
          <div class="stat-card">
            <div class="stat-icon">
              <svg class="w-5 h-5" fill="#000" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ activities.length }}</div>
              <div class="stat-label">Total Activities</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon success">
              <svg class="w-5 h-5" fill="#000" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ activeActivities }}</div>
              <div class="stat-label">Active</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon warning">
              <svg class="w-5 h-5" fill="#000" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ filteredActivities }}</div>
              <div class="stat-label">Filtered</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Enhanced Search Section -->
    <section class="search-section">
      <div class="search-container">
        <div class="search-wrapper">
          <div class="search-input-group">
            <svg class="search-icon w-5 h-5" fill="none" stroke="#000" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              :value="searchQuery"
              @input="handleSearch($event.target.value)"
              type="text"
              placeholder="Search activities by name, type, or description..."
              class="search-input"
            />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="clear-search-btn"
              title="Clear search"
            >
              <svg class="w-4 h-4" fill="none" stroke="#000" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Search Results Info -->
        <div v-if="searchQuery" class="search-results">
          <div class="results-info">
            <div class="results-text">
              <svg class="w-3.5 h-3.5" fill="#000" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"/>
              </svg>
              <span class="results-count">{{ activities.length }}</span>
              <span class="results-label">result{{ activities.length !== 1 ? 's' : '' }} found</span>
            </div>
            <div class="search-term">
              Searching for: <strong>"{{ searchQuery }}"</strong>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Error Handling -->
    <div v-if="error" class="error-section">
      <div class="error-container">
        <div class="error-icon">
          <svg class="w-5 h-5" fill="#000" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z"/>
          </svg>
        </div>
        <div class="error-content">
          <h4 class="error-title">Something went wrong</h4>
          <p class="error-message">{{ error }}</p>
        </div>
        <button @click="handleRetry" class="retry-btn">
          <svg class="w-3.5 h-3.5" fill="none" stroke="#000" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Retry
        </button>
      </div>
    </div>

    <!-- Activities Grid -->
    <section class="activities-section">
      <ActivityTable
        :activities="activities"
        :loading="loading"
        @edit="openEditForm"
        @delete="handleDelete"
        @select="handleActivitySelect"
      />
    </section>

    <!-- Enhanced Modal -->
    <teleport to="body">
      <transition name="modal" appear>
        <div v-if="showForm" class="modal-overlay" @click="closeForm">
          <div class="modal-container" @click.stop>
            <div class="modal-header">
              <h3 class="modal-title">
                {{ isEdit ? 'Edit Activity' : 'Create New Activity' }}
              </h3>
              <button @click="closeForm" class="modal-close-btn">
                <svg class="w-5 h-5" fill="none" stroke="#000" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="modal-content">
              <ActivityForm
                :activity="editingActivity"
                :is-edit="isEdit"
                @submit="handleFormSubmit"
                @cancel="closeForm"
              />
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useActivities } from '../composables/useActivities.js';
import ActivityTable from './ActivityTable.vue';
import ActivityForm from './ActivityForm.vue';
import { debounce } from '../utils/helpers.js';

export default {
  name: 'ActivityManager',
  components: {
    ActivityTable,
    ActivityForm
  },
  emits: ['activity-selected'],
  setup(props, { emit }) {
    // Composables
    const {
      activities,
      loading,
      error,
      loadActivities,
      createActivity,
      updateActivity,
      deleteActivity,
      searchActivities
    } = useActivities();

    // Reactive state
    const showForm = ref(false);
    const editingActivity = ref(null);
    const searchQuery = ref('');
    const isEdit = ref(false);

    // Computed properties
    const activeActivities = computed(() => {
      return activities.value.filter(activity => activity.status !== 'archived').length;
    });

    const filteredActivities = computed(() => {
      return searchQuery.value ? activities.value.length : 0;
    });

    // Debounced search function
    const debouncedSearch = debounce(async (query) => {
      try {
        if (query.trim()) {
          await searchActivities(query);
        } else {
          await loadActivities();
        }
      } catch (err) {
        console.error('Search failed:', err);
      }
    }, 300);

    // Event handlers
    const handleSearch = (query) => {
      searchQuery.value = query;
      debouncedSearch(query);
    };

    const clearSearch = async () => {
      searchQuery.value = '';
      try {
        await loadActivities();
      } catch (err) {
        console.error('Failed to reload activities:', err);
      }
    };

    const openCreateForm = () => {
      editingActivity.value = null;
      isEdit.value = false;
      showForm.value = true;
    };

    const openEditForm = (activity) => {
      editingActivity.value = { ...activity }; // Create a copy to avoid mutations
      isEdit.value = true;
      showForm.value = true;
    };

    const closeForm = () => {
      showForm.value = false;
      editingActivity.value = null;
      isEdit.value = false;
    };

    const handleFormSubmit = async (formData) => {
      try {
        if (isEdit.value && editingActivity.value) {
          await updateActivity(editingActivity.value.id, formData);
        } else {
          await createActivity(formData);
        }
        closeForm();

        // Refresh the current view
        if (searchQuery.value) {
          await searchActivities(searchQuery.value);
        } else {
          await loadActivities();
        }
      } catch (err) {
        console.error('Failed to save activity:', err);
        // You could add a notification system here
      }
    };

    const handleDelete = async (id) => {
      try {
        await deleteActivity(id);

        // Refresh the current view
        if (searchQuery.value) {
          await searchActivities(searchQuery.value);
        } else {
          await loadActivities();
        }
      } catch (err) {
        console.error('Failed to delete activity:', err);
        // You could add a notification system here
      }
    };

    const handleActivitySelect = (activity) => {
      emit('activity-selected', activity);
    };

    const handleRetry = async () => {
      try {
        if (searchQuery.value) {
          await searchActivities(searchQuery.value);
        } else {
          await loadActivities();
        }
      } catch (err) {
        console.error('Retry failed:', err);
      }
    };

    // Lifecycle
    onMounted(async () => {
      try {
        await loadActivities();
      } catch (err) {
        console.error('Failed to load activities on mount:', err);
      }
    });

    return {
      // State
      activities,
      loading,
      error,
      showForm,
      editingActivity,
      searchQuery,
      isEdit,

      // Computed
      activeActivities,
      filteredActivities,

      // Methods
      openCreateForm,
      openEditForm,
      closeForm,
      handleFormSubmit,
      handleDelete,
      handleActivitySelect,
      handleSearch,
      clearSearch,
      handleRetry
    };
  }
};
</script>

<style scoped>
/* ============================================
   ACTIVITYMANAGER.VUE - MODERN DESIGN SYSTEM
============================================ */

/* Main Container */
.activity-manager {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  padding: 2rem 1rem;
  color: #000;
}

/* ============================================
   HEADER SECTION
============================================ */
.manager-header {
  margin-bottom: 2rem;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.title-section {
  flex: 1;
}

.manager-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, var(--primary-600), var(--primary-400));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.manager-subtitle {
  font-size: 1.125rem;
  margin: 0;
  font-weight: 400;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.create-activity-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, var(--primary-600), var(--primary-500));
  color: #000;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.create-activity-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
  background: linear-gradient(135deg, var(--primary-700), var(--primary-600));
}

.create-activity-btn:active {
  transform: translateY(0);
}

/* Stats Overview */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-400));
  color: #000;
  flex-shrink: 0;
}

.stat-icon.success {
  background: linear-gradient(135deg, var(--success-500), var(--success-400));
}

.stat-icon.warning {
  background: linear-gradient(135deg, var(--warning-500), var(--warning-400));
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #303030;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #333;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ============================================
   SEARCH SECTION
============================================ */
.search-section {
  margin-bottom: 2rem;
}

.search-container {
  max-width: 1200px;
  margin: 0 auto;
}

.search-wrapper {
  margin-bottom: 1rem;
}

.search-input-group {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #666;
  z-index: 2;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  font-size: 1rem;
  color: #000;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1);
  background: white;
}

.search-input::placeholder {
  color: #666;
}

.clear-search-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 2rem;
  height: 2rem;
  border: none;
  background: var(--error-500);
  color: #000;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.clear-search-btn:hover {
  background: var(--error-600);
  transform: translateY(-50%) scale(1.1);
}

/* Search Results */
.search-results {
  max-width: 600px;
  margin: 0 auto;
}

.results-info {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.results-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #000;
  font-weight: 500;
}

.results-count {
  color: #0000ff;
  font-weight: 700;
}

.results-label {
  color: #333;
}

.search-term {
  color: #333;
  font-size: 0.875rem;
}

.search-term strong {
  color: #000;
  font-weight: 600;
}

/* ============================================
   ERROR SECTION
============================================ */
.error-section {
  margin: 2rem 0;
}

.error-container {
  max-width: 600px;
  margin: 0 auto;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  backdrop-filter: blur(10px);
}

.error-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background: var(--error-500);
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.error-content {
  flex: 1;
}

.error-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #b91c1c;
  margin: 0 0 0.5rem 0;
}

.error-message {
  color: #dc2626;
  margin: 0;
  line-height: 1.5;
}

.retry-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--error-500);
  color: #000;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.retry-btn:hover {
  background: var(--error-600);
  transform: translateY(-1px);
}

/* ============================================
   ACTIVITIES SECTION
============================================ */
.activities-section {
  max-width: 1200px;
  margin: 0 auto;
}

/* ============================================
   MODAL STYLES
============================================ */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid var(--border-light);
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #000;
  margin: 0;
}

.modal-close-btn {
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.2s ease;
}

.modal-close-btn:hover {
  background: rgba(0, 0, 0, 0.15);
  color: #000;
  transform: scale(1.1);
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

/* ============================================
   MODAL TRANSITIONS
============================================ */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: scale(1);
}

/* ============================================
   UTILITY CLASSES
============================================ */
.w-4 { width: 1rem; }
.w-5 { width: 1.25rem; }
.w-6 { width: 1.5rem; }

.h-4 { height: 1rem; }
.h-5 { height: 1.25rem; }
.h-6 { height: 1.5rem; }

/* ============================================
   RESPONSIVE DESIGN
============================================ */
@media (max-width: 768px) {
  .activity-manager {
    padding: 1rem 0.5rem;
  }

  .manager-title {
    font-size: 2rem;
  }

  .header-main {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .stats-overview {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .search-input {
    padding: 0.875rem 0.875rem 0.875rem 2.5rem;
  }

  .results-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .error-container {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }

  .modal-container {
    margin: 0.5rem;
    max-height: 95vh;
  }

  .modal-header {
    padding: 1.5rem 1.5rem 1rem 1.5rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .manager-title {
    font-size: 1.75rem;
  }

  .manager-subtitle {
    font-size: 1rem;
  }

  .create-activity-btn {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .search-input {
    font-size: 0.875rem;
  }
}
</style>

