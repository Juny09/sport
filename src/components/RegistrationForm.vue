<template>
  <div class="card animate-in">
    <div class="flex items-center mb-3">
      <div class="form-icon">
        <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
        </svg>
        <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
      </div>
      <div class="ml-3">
        <h3 class="text-xl font-semibold text-color mb-1">{{ isEdit ? 'Edit Registration' : 'New Registration' }}</h3>
        <p class="text-secondary text-sm">{{ isEdit ? 'Update registration details' : 'Register a participant for an activity' }}</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Activity Selection -->
      <div class="form-group">
        <label class="form-label required">
          Activity
        </label>
        <div class="select-wrapper">
          <select
            v-model="form.activityId"
            class="form-select"
            :class="{ 'error': errors.activityId }"
            :disabled="selectedActivityId && !isEdit"
          >
            <option value="">Select an activity</option>
            <option
              v-for="activity in activityOptions"
              :key="activity.value"
              :value="activity.value"
              :disabled="activity.disabled"
            >
              {{ activity.label }}
            </option>
          </select>
        </div>
        <div v-if="errors.activityId" class="form-error">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          {{ errors.activityId }}
        </div>
        <div v-if="selectedActivityId && !isEdit" class="activity-locked-notice">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Registering for the selected activity
        </div>
      </div>

      <!-- User Name -->
      <div class="form-group">
        <label class="form-label required">
          User Name
        </label>
        <input
          v-model="form.userName"
          type="text"
          class="form-input"
          :class="{ 'error': errors.userName }"
          placeholder="Enter participant's full name"
        />
        <div v-if="errors.userName" class="form-error">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          {{ errors.userName }}
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Email -->
        <div class="form-group">
          <label class="form-label">
            Email Address
          </label>
          <input
            v-model="form.email"
            type="email"
            class="form-input"
            :class="{ 'error': errors.email }"
            placeholder="participant@example.com"
          />
          <div v-if="errors.email" class="form-error">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            {{ errors.email }}
          </div>
        </div>

        <!-- Phone -->
        <div class="form-group">
          <label class="form-label">
            Phone Number
          </label>
          <input
            v-model="form.phone"
            type="tel"
            class="form-input"
            :class="{ 'error': errors.phone }"
            placeholder="+1 (555) 123-4567"
          />
          <div v-if="errors.phone" class="form-error">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            {{ errors.phone }}
          </div>
        </div>
      </div>

      <!-- Registration Date/Time -->
      <div class="form-group">
        <label class="form-label">
          Registration Date & Time
        </label>
        <input
          v-model="form.registeredAt"
          type="datetime-local"
          class="form-input"
        />
        <div class="field-help">
          When did this participant register for the activity?
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end gap-3 pt-6 border-t border-card-border mt-6">
        <button
          type="button"
          @click="handleCancel"
          class="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="isSubmitting"
        >
          <svg v-if="isSubmitting" class="w-4 h-4 loading-spinner" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isEdit ? 'Update Registration' : 'Register Participant' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { validateEmail, validatePhone } from '../utils/helpers.js';

export default {
  name: 'RegistrationForm',
  props: {
    registration: {
      type: Object,
      default: null
    },
    activityOptions: {
      type: Array,
      default: () => []
    },
    selectedActivityId: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
  // Add this debug log
  console.log('RegistrationForm - activityOptions:', props.activityOptions);
  console.log('RegistrationForm - selectedActivityId:', props.selectedActivityId);

  const form = ref({
    activityId: props.selectedActivityId || '', // Initialize with selectedActivityId if available
    userName: '',
    email: '',
    phone: '',
    registeredAt: ''
  });

    const errors = ref({});
    const isSubmitting = ref(false);

    // Watch for registration prop changes
    watch(() => props.registration, (newRegistration) => {
      if (newRegistration) {
        form.value = {
          activityId: newRegistration.activity_id || '',
          userName: newRegistration.user_name || '',
          email: newRegistration.email || '',
          phone: newRegistration.phone || '',
          registeredAt: newRegistration.registered_at ?
            new Date(newRegistration.registered_at).toISOString().slice(0, 16) : ''
        };
      }
    }, { immediate: true });

    // Watch for selectedActivityId changes
    watch(() => props.selectedActivityId, (newActivityId) => {
      if (newActivityId && !props.isEdit) {
        form.value.activityId = newActivityId;
      }
    }, { immediate: true });

    const validateForm = () => {
      errors.value = {};

      if (!form.value.activityId) {
        errors.value.activityId = 'Please select an activity';
      }

      if (!form.value.userName.trim()) {
        errors.value.userName = 'User name is required';
      }

      if (form.value.email && !validateEmail(form.value.email)) {
        errors.value.email = 'Please enter a valid email address';
      }

      if (form.value.phone && !validatePhone(form.value.phone)) {
        errors.value.phone = 'Please enter a valid phone number';
      }

      return Object.keys(errors.value).length === 0;
    };

    const handleSubmit = async () => {
      if (validateForm()) {
        isSubmitting.value = true;
        try {
          const submissionData = { ...form.value };
          if (submissionData.registeredAt) {
            submissionData.registeredAt = new Date(submissionData.registeredAt).toISOString();
          } else {
            submissionData.registeredAt = new Date().toISOString();
          }
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
          emit('submit', submissionData);
        } finally {
          isSubmitting.value = false;
        }
      }
    };

    const handleCancel = () => {
      emit('cancel');
    };

    // Set default date/time to now if not editing
    if (!props.isEdit) {
      form.value.registeredAt = new Date().toISOString().slice(0, 16);
    }

    return {
      form,
      errors,
      isSubmitting,
      validateForm,
      handleSubmit,
      handleCancel
    };
  }
};
</script>

<style scoped>
select.form-select {
  appearance: auto;
  -webkit-appearance: menulist;
}

/* Ensure options are visible */
select.form-select option {
  color: #1a1a1a;
  background: white;
  padding: 8px;
}

/* Debug styles */
.debug-info {
  margin-top: 10px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
}
/* ============================================
   SIMPLE LIGHT DESIGN - NO THEME SWITCHING
============================================ */

/* CSS Variables for Light Design */
:root {
  /* Light Colors */
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --bg-hover: #f1f5f9;
  --bg-accent: #eff6ff;

  /* Borders */
  --border-light: #e2e8f0;
  --border-medium: #cbd5e1;
  --border-dark: #94a3b8;

  /* Text Colors */
  --text-primary: #1e293b;
  --text-secondary: #475569;
  --text-muted: #64748b;
  --text-light: #94a3b8;

  /* Primary Brand Colors */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;

  /* Athletic Orange Accent */
  --accent-50: #fff7ed;
  --accent-100: #ffedd5;
  --accent-200: #fed7aa;
  --accent-300: #fdba74;
  --accent-400: #fb923c;
  --accent-500: #f97316;
  --accent-600: #ea580c;
  --accent-700: #c2410c;

  /* Status Colors */
  --success-50: #f0fdf4;
  --success-100: #dcfce7;
  --success-500: #22c55e;
  --success-600: #16a34a;

  --warning-50: #fffbeb;
  --warning-100: #fef3c7;
  --warning-500: #f59e0b;

  --error-50: #fef2f2;
  --error-100: #fee2e2;
  --error-500: #ef4444;
  --error-600: #dc2626;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

  /* Transitions */
  --transition-fast: 0.15s ease-out;
  --transition-normal: 0.25s ease-out;
  --transition-slow: 0.35s ease-out;
}

/* Global Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Force Light Background */
html {
  background: var(--bg-primary) !important;
}

/* Body - Force Light Theme */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
  line-height: 1.6;
  /* background: var(--bg-primary) !important;
  color: var(--text-primary) !important; */
  background: white !important;
  color: white  !important;
  min-height: 100vh;
}

/* Override any dark backgrounds */
#app,
.min-h-screen,
.main-content {
  background: var(--bg-primary) !important;
  color: var(--text-primary) !important;
}

/* Remove any dark gradients or hero backgrounds */
.hero-background {
  display: none !important;
}

/* Card Base */
.card {
  background: white;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-normal);
}

.card:hover {
  border-color: var(--border-medium);
  box-shadow: var(--shadow-xl);
  transform: translateY(-1px);
}

/* Form Header */
.form-icon {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-500));
  color: white;
  padding: var(--space-4);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
}

/* Form Groups */
.form-group {
  margin-bottom: var(--space-6);
}

/* Form Labels */
.form-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
  font-size: 0.875rem;
}

.form-label.required::after {
  content: '*';
  color: var(--error-500);
  margin-left: var(--space-1);
}

.form-label svg {
  margin-right: var(--space-2);
  color: var(--primary-500);
}

/* Form Inputs */
.form-input,
.form-select {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: white ;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary-500);
  background: var(--bg-secondary);
  box-shadow:
    0 0 0 3px rgba(59, 130, 246, 0.1),
    var(--shadow-md);
  transform: translateY(-1px);
}

.form-input.error,
.form-select.error {
  border-color: var(--error-500);
  background: var(--error-50);
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.form-input::placeholder {
  color: var(--text-muted);
}

/* Select Wrapper */
.select-wrapper {
  position: relative;
}

.select-wrapper::after {
  content: '';
  position: absolute;
  right: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid var(--text-muted);
  pointer-events: none;
}

/* Form Errors */
.form-error {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--error-500);
  font-size: 0.75rem;
  margin-top: var(--space-1);
}

/* Activity Locked Notice */
.activity-locked-notice {
  display: flex;
  align-items: center;
  padding: var(--space-3);
  background: var(--primary-50);
  border: 1px solid var(--primary-200);
  border-radius: var(--radius-lg);
  color: var(--primary-700);
  font-size: 0.875rem;
  margin-top: var(--space-2);
}

/* Field Help */
.field-help {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: var(--space-1);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) var(--space-6);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  font-size: 0.875rem;
  gap: var(--space-2);
  box-shadow: var(--shadow-sm);
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn svg {
  transition: transform var(--transition-fast);
}

.btn:hover:not(:disabled) svg {
  transform: scale(1.05);
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-500));
  color: white;
  box-shadow: var(--shadow-md);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--primary-700), var(--primary-600));
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-light);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--bg-hover);
  border-color: var(--primary-500);
}

/* Loading Spinner */
.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Utility Classes */
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-end {
  justify-content: flex-end;
}

.gap-3 {
  gap: var(--space-3);
}

.gap-6 {
  gap: var(--space-6);
}

.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.space-y-6 > * + * {
  margin-top: var(--space-6);
}

.pt-6 {
  padding-top: var(--space-6);
}

.mt-6 {
  margin-top: var(--space-6);
}

.mb-1 {
  margin-bottom: var(--space-1);
}

.mb-3 {
  margin-bottom: var(--space-3);
}

.ml-3 {
  margin-left: var(--space-3);
}

.mr-2 {
  margin-right: var(--space-2);
}

.border-t {
  border-top: 1px solid var(--border-light);
}

.border-card-border {
  border-color: var(--border-light);
}

.text-xl {
  font-size: 1.25rem;
}

.text-sm {
  font-size: 0.875rem;
}

.font-semibold {
  font-weight: 600;
}

.text-color {
  color: var(--text-primary);
}

.text-secondary {
  color: var(--text-secondary);
}

.text-primary {
  color: var(--primary-500);
}

.w-4 {
  width: 1rem;
}

.w-5 {
  width: 1.25rem;
}

.w-8 {
  width: 2rem;
}

.h-4 {
  height: 1rem;
}

.h-5 {
  height: 1.25rem;
}

.h-8 {
  height: 2rem;
}

/* Animate In */
.animate-in {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .card {
    padding: var(--space-4);
  }

  .flex.gap-3 {
    flex-direction: column;
    gap: var(--space-2);
  }
}

@media (max-width: 480px) {
  .form-group {
    margin-bottom: var(--space-4);
  }

  .btn {
    padding: var(--space-3) var(--space-4);
    font-size: 0.8rem;
  }
}
</style>
