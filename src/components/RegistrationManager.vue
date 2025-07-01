<template>
  <div class="registration-manager">
    <!-- Back Button - Moved to better position -->
    <div class="navigation-section">
      <button @click="goToHome" class="back-button">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Home</span>
      </button>
    </div>

    <!-- Header Section -->
    <div class="section-header">
      <div class="header-content">
        <div class="header-info">
          <h2 class="section-title">Sport Registration Management</h2>
          <div v-if="selectedActivity" class="selected-activity-info">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Selected Sport: <span class="activity-name">{{ selectedActivity.name }}</span>
          </div>
          <p class="section-subtitle">Track and manage sport registrations and team formations</p>
        </div>
        <div class="header-actions">
          <div v-if="selectedActivity" class="view-toggle">
            <button
              @click="switchToAllView"
              :class="['toggle-btn', { active: viewMode === 'all' }]">All Registrations</button>
            <button
              @click="switchToActivityView"
              :class="['toggle-btn', { active: viewMode === 'activity' }]">This Sport Only</button>
          </div>
          <button @click="openCreateForm" class="btn-primary">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Athlete
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div v-if="selectedActivity && viewMode === 'activity'" class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon registered">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ filteredRegistrations.length }}</div>
            <div class="stat-label">Athletes Registered</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon recent">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ recentRegistrations }}</div>
            <div class="stat-label">New Signups (7 Days)</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon team-size">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ selectedActivity.team_size || 'Any' }}</div>
            <div class="stat-label">Team Target Size</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-banner">
      <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd" />
      </svg>
      {{ error }}
    </div>

    <!-- Registration Table -->
    <div class="registrations-grid">
      <RegistrationTable
        :registrations="filteredRegistrations"
        :loading="loading"
        :show-activity-column="viewMode === 'all'"
        @edit="openEditForm"
        @delete="handleDelete" />
    </div>

    <!-- Modal Form -->
    <teleport to="body">
      <div v-if="showForm" class="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="modal-backdrop absolute inset-0" @click="closeForm"></div>
        <div class="modal-content relative w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <RegistrationForm
            :registration="editingRegistration"
            :activity-options="activityOptions"
            :selected-activity-id="selectedActivityId"
            :is-edit="isEdit"
            @submit="handleFormSubmit"
            @cancel="closeForm" />
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRegistrations } from '../composables/useRegistrations.js';
import { useActivities } from '../composables/useActivities.js';
import RegistrationTable from './RegistrationTable.vue';
import RegistrationForm from './RegistrationForm.vue';
import { useRouter } from 'vue-router';

export default {
  name: 'RegistrationManager',
  components: {
    RegistrationTable,
    RegistrationForm
  },
  props: {
    selectedActivity: {
      type: Object,
      default: null
    }
  },
  setup(props) {
    const {
      registrations,
      loading,
      error,
      loadRegistrations,
      loadRegistrationsByActivity,
      createRegistration,
      updateRegistration,
      deleteRegistration
    } = useRegistrations();

    const { activityOptions, loadActivities } = useActivities();
    const router = useRouter();

    const showForm = ref(false);
    const editingRegistration = ref(null);
    const isEdit = ref(false);
    const viewMode = ref('all');

    const filteredRegistrations = computed(() => {
      if (viewMode.value === 'activity' && props.selectedActivity) {
        return registrations.value.filter(reg => reg.activity_id === props.selectedActivity.id);
      }
      return registrations.value;
    });

    const selectedActivityId = computed(() => props.selectedActivity?.id || '');

    const recentRegistrations = computed(() => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return filteredRegistrations.value.filter(reg => {
        const regDate = new Date(reg.registered_at);
        return regDate >= sevenDaysAgo;
      }).length;
    });

    // Fixed navigation function
    const goToHome = () => {
      console.log('Navigating to home...'); // Debug log
      try {
        // Try multiple navigation methods
        if (router) {
          // Method 1: Push to root route
          router.push('/').catch(err => {
            console.error('Router push failed:', err);
            // Method 2: Replace current route
            router.replace('/').catch(err2 => {
              console.error('Router replace failed:', err2);
              // Method 3: Use window.location as fallback
              window.location.href = '/';
            });
          });
        } else {
          console.error('Router not available, using window.location');
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Navigation error:', error);
        // Ultimate fallback
        window.location.href = '/';
      }
    };

    const openCreateForm = () => {
      editingRegistration.value = null;
      isEdit.value = false;
      showForm.value = true;
    };

    const openEditForm = (registration) => {
      editingRegistration.value = registration;
      isEdit.value = true;
      showForm.value = true;
    };

    const closeForm = () => {
      showForm.value = false;
      editingRegistration.value = null;
      isEdit.value = false;
    };

    const handleFormSubmit = async (formData) => {
      try {
        if (isEdit.value && editingRegistration.value) {
          await updateRegistration(editingRegistration.value.id, formData);
        } else {
          await createRegistration(formData);
        }
        closeForm();
        viewMode.value === 'activity' && props.selectedActivity
          ? registrations.value = await loadRegistrationsByActivity(props.selectedActivity.id)
          : await loadRegistrations();
      } catch (err) {
        console.error('Failed to save registration:', err);
      }
    };

    const handleDelete = async (id) => {
      try {
        await deleteRegistration(id);
        viewMode.value === 'activity' && props.selectedActivity
          ? registrations.value = await loadRegistrationsByActivity(props.selectedActivity.id)
          : await loadRegistrations();
      } catch (err) {
        console.error('Failed to delete registration:', err);
      }
    };

    const switchToActivityView = async () => {
      if (props.selectedActivity) {
        viewMode.value = 'activity';
        registrations.value = await loadRegistrationsByActivity(props.selectedActivity.id);
      }
    };

    const switchToAllView = async () => {
      viewMode.value = 'all';
      await loadRegistrations();
    };

    onMounted(async () => {
      console.log('RegistrationManager mounted'); // Debug log
      console.log('Router available:', !!router); // Debug log

      await loadActivities();
      props.selectedActivity
        ? await switchToActivityView()
        : await loadRegistrations();
    });

    return {
      filteredRegistrations,
      loading,
      error,
      showForm,
      editingRegistration,
      isEdit,
      viewMode,
      selectedActivityId,
      activityOptions,
      recentRegistrations,
      openCreateForm,
      openEditForm,
      closeForm,
      handleFormSubmit,
      handleDelete,
      switchToActivityView,
      switchToAllView,
      goToHome
    };
  }
};
</script>

<style scoped>
/* Light theme styles */
.registration-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  background: #f8fafc;
  min-height: 100vh;
}

/* Navigation Section - New container for back button */
.navigation-section {
  margin-bottom: 1.5rem;
}

/* Back Button - Improved styling */
.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: #ffffff;
  color: #1e293b;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

.back-button:hover {
  background: #f1f5f9;
  border-color: #3b82f6;
  color: #3b82f6;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.back-button:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.back-button svg {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.2s ease;
}

.back-button:hover svg {
  transform: translateX(-2px);
}

/* Section Header */
.section-header {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-info {
  flex: 1;
}

.section-title {
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #3b82f6, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  color: #64748b;
  font-size: 1rem;
}

.selected-activity-info {
  display: flex;
  align-items: center;
  margin: 0.75rem 0;
  color: #64748b;
  font-size: 0.875rem;
}

.activity-name {
  color: #3b82f6;
  font-weight: 600;
}

/* Header Actions */
.header-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

/* View Toggle */
.view-toggle {
  display: flex;
  background: #f1f5f9;
  border-radius: 0.75rem;
  padding: 0.25rem;
  border: 1px solid #e2e8f0;
}

.toggle-btn {
  background: transparent;
  border: none;
  color: #64748b;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 0.875rem;
}

.toggle-btn.active {
  background: #3b82f6;
  color: white;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.toggle-btn:hover:not(.active) {
  background: #e2e8f0;
  color: #1e293b;
}

/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #c2410c, #9a3412);
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

/* Stats Section */
.stats-section {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

.stat-card:hover {
  background: #f8fafc;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.stat-icon {
  background: #3b82f6;
  color: white;
  padding: 0.75rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.registered {
  background: #3b82f6;
}

.stat-icon.recent {
  background: #f97316;
}

.stat-icon.team-size {
  background: #22c55e;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.25rem;
}

/* Error Banner */
.error-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #dc2626, #ef4444);
  border: 1px solid #f87171;
  border-radius: 0.5rem;
  color: white;
  margin-bottom: 1.5rem;
}

/* Registrations Grid */
.registrations-grid {
  margin-top: 1.5rem;
}

/* Modal Styles */
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
}

.modal-content {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}

/* Utility Classes */
.fixed { position: fixed; }
.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.z-50 { z-index: 50; }
.flex { display: flex; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.p-4 { padding: 1rem; }
.w-full { width: 100%; }
.max-w-lg { max-width: 32rem; }
.overflow-y-auto { overflow-y: auto; }
.relative { position: relative; }
.absolute { position: absolute; }

.w-5 { width: 1.25rem; }
.w-6 { width: 1.5rem; }
.h-5 { height: 1.25rem; }
.h-6 { height: 1.5rem; }
.mr-2 { margin-right: 0.5rem; }

/* Responsive Design */
@media (max-width: 768px) {
  .registration-manager {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    flex-direction: column;
    width: 100%;
  }

  .view-toggle {
    order: 1;
    width: 100%;
  }

  .btn-primary {
    order: 2;
    width: 100%;
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    max-width: 95vw;
    margin: 1rem;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.5rem;
  }

  .section-header {
    padding: 1.5rem;
  }

  .toggle-btn {
    flex: 1;
    text-align: center;
  }

  .back-button {
    padding: 0.625rem 1rem;
    font-size: 0.8rem;
  }
}
</style>
