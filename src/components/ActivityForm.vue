<template>
  <div class="activity-form-container">
    <!-- Form Header -->
    <div class="form-header">
      <div class="form-header-content">
        <div class="form-icon">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
        </div>
        <div class="form-title-section">
          <h3 class="form-title">{{ isEdit ? 'Edit Activity' : 'Create New Activity' }}</h3>
          <p class="form-subtitle">{{ isEdit ? 'Update activity details and settings' : 'Build an engaging team activity from scratch' }}</p>
        </div>
      </div>
      <div class="form-progress">
        <div class="progress-indicator">
          <div class="progress-step" :class="{ active: currentStep >= 1 }">1</div>
          <div class="progress-line" :class="{ active: currentStep >= 2 }"></div>
          <div class="progress-step" :class="{ active: currentStep >= 2 }">2</div>
          <div class="progress-line" :class="{ active: currentStep >= 3 }"></div>
          <div class="progress-step" :class="{ active: currentStep >= 3 }">3</div>
        </div>
        <div class="progress-labels">
          <span class="progress-label" :class="{ active: currentStep >= 1 }">Basic Info</span>
          <span class="progress-label" :class="{ active: currentStep >= 2 }">Configuration</span>
          <span class="progress-label" :class="{ active: currentStep >= 3 }">Tips & Review</span>
        </div>
      </div>
    </div>

    <!-- Form Content -->
    <form @submit.prevent="handleSubmit" class="form-content">
      <!-- Step 1: Basic Information -->
      <div v-show="currentStep === 1" class="form-step" data-step="1">
        <div class="step-header">
          <h4 class="step-title">Basic Information</h4>
          <p class="step-description">Define the core details of your activity</p>
        </div>

        <div class="form-grid">
          <!-- Activity Name -->
          <div class="form-group full-width">
            <label class="form-label required">

              Activity Name
            </label>
            <input
              v-model="form.name"
              type="text"
              class="form-input"
              :class="{ 'error': errors.name }"
              placeholder="Enter a descriptive activity name..."
              maxlength="100"
            />
            <div class="input-helper">
              <span class="character-count">{{ form.name.length }}/100</span>
            </div>
            <div v-if="errors.name" class="form-error">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"/>
              </svg>
              {{ errors.name }}
            </div>
          </div>

          <!-- Description -->
          <div class="form-group full-width">
            <label class="form-label required">
              Description
            </label>
            <textarea
              v-model="form.description"
              class="form-input"
              :class="{ 'error': errors.description }"
              rows="4"
              placeholder="Describe what this activity involves, its purpose, and expected outcomes..."
              maxlength="500"
            ></textarea>
            <div class="input-helper">
              <span class="character-count">{{ form.description.length }}/500</span>
            </div>
            <div v-if="errors.description" class="form-error">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"/>
              </svg>
              {{ errors.description }}
            </div>
          </div>

          <!-- Sport Type -->
          <div class="form-group">
            <label class="form-label required">
              Sport Type
            </label>
            <div class="select-wrapper">
              <select
                v-model="form.sportType"
                class="form-input"
                :class="{ 'error': errors.sportType }"
              >
                <option value="">Select Sport type</option>
                <option v-for="type in sportTypes" :key="type.value" :value="type.value">
                  {{ type.label }}
                </option>
              </select>
            </div>
            <div v-if="errors.sportType" class="form-error">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"/>
              </svg>
              {{ errors.sportType }}
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Configuration -->
      <div v-show="currentStep === 2" class="form-step" data-step="2">
        <div class="step-header">
          <h4 class="step-title">Activity Configuration</h4>
          <p class="step-description">Set up the logistics and requirements</p>
        </div>

        <div class="form-grid">
          <!-- Team Size -->
          <div class="form-group">
            <label class="form-label">

              Team Size
            </label>
            <div class="select-wrapper">
              <select v-model="form.teamSize" class="form-input">
                <option value="">Select team size</option>
                <option v-for="size in teamSizes" :key="size.value" :value="size.value">
                  {{ size.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Location -->
          <div class="form-group">
            <label class="form-label">
              Location
            </label>
            <div class="select-wrapper">
              <select v-model="form.location" class="form-input">
                <option value="">Select location</option>
                <option v-for="location in locations" :key="location.value" :value="location.value">
                  {{ location.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Time Required -->
          <div class="form-group">
            <label class="form-label">
              Time Required
            </label>
            <div class="select-wrapper">
              <select v-model="form.timeRequired" class="form-input">
                <option value="">Select duration</option>
                <option v-for="time in timeOptions" :key="time.value" :value="time.value">
                  {{ time.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Difficulty Level -->
          <div class="form-group">
            <label class="form-label">
              Difficulty Level
            </label>
            <div class="difficulty-selector">
              <div
                v-for="level in difficultyLevels"
                :key="level.value"
                class="difficulty-option"
                :class="{ active: form.difficulty === level.value }"
                @click="form.difficulty = level.value"
              >
                <div class="difficulty-icon" :class="level.class">
                  <component :is="level.icon" class="w-4 h-4" />
                </div>
                <span class="difficulty-label">{{ level.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Tips & Review -->
      <div v-show="currentStep === 3" class="form-step" data-step="3">
        <div class="step-header">
          <h4 class="step-title">Facilitation Tips & Review</h4>
          <p class="step-description">Add helpful tips and review your activity</p>
        </div>

        <!-- Facilitation Tips -->
        <div class="form-group full-width">
          <label class="form-label">
            Facilitation Tips
          </label>
          <div class="tips-input-section">
            <div class="tip-input-group">
              <input
                v-model="tipInput"
                type="text"
                class="form-input tip-input"
                placeholder="Add a helpful facilitation tip or best practice..."
                maxlength="200"
                @keyup.enter="addTip"
              />
              <button
                type="button"
                @click="addTip"
                class="add-tip-btn"
                :disabled="!tipInput.trim()"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                Add Tip
              </button>
            </div>
            <div class="input-helper">
              <span class="character-count">{{ tipInput.length }}/200</span>
            </div>
          </div>

          <!-- Tips List -->
          <div v-if="form.facilitationTips.length > 0" class="tips-list">
            <h5 class="tips-title">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/>
              </svg>
              Facilitation Tips ({{ form.facilitationTips.length }})
            </h5>
            <transition-group name="tip" tag="div" class="tips-container">
              <div
                v-for="(tip, index) in form.facilitationTips"
                :key="`tip-${index}`"
                class="tip-item"
              >
                <div class="tip-content">
                  <div class="tip-number">{{ index + 1 }}</div>
                  <span class="tip-text">{{ tip }}</span>
                </div>
                <button
                  type="button"
                  @click="removeTip(index)"
                  class="remove-tip-btn"
                  title="Remove tip"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </transition-group>
          </div>
        </div>

        <!-- Activity Summary -->
        <div class="activity-summary">
          <h5 class="summary-title">Activity Summary</h5>
          <div class="summary-content">
            <div class="summary-item">
              <span class="summary-label">Name:</span>
              <span class="summary-value">{{ form.name || 'Not specified' }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Type:</span>
              <span class="summary-value">{{ form.sportType || 'Not specified' }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Team Size:</span>
              <span class="summary-value">{{ form.teamSize || 'Any size' }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Duration:</span>
              <span class="summary-value">{{ form.timeRequired || 'Flexible' }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Location:</span>
              <span class="summary-value">{{ form.location || 'Any location' }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Tips:</span>
              <span class="summary-value">{{ form.facilitationTips.length }} tip{{ form.facilitationTips.length !== 1 ? 's' : '' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Navigation -->
      <div class="form-navigation">
        <div class="nav-buttons">
          <button
            v-if="currentStep > 1"
            type="button"
            @click="previousStep"
            class="nav-btn secondary"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7"/>
            </svg>
            Previous
          </button>

          <button
            type="button"
            @click="handleCancel"
            class="nav-btn cancel"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            Cancel
          </button>

          <button
            v-if="currentStep < 3"
            type="button"
            @click="nextStep"
            class="nav-btn primary"
            :disabled="!canProceed"
          >
            Next
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          <button
            v-if="currentStep === 3"
            type="submit"
            class="nav-btn primary submit"
            :disabled="isSubmitting || !isFormValid"
          >
            <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7"/>
            </svg>
            {{ isEdit ? 'Update Activity' : 'Create Activity' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
  name: 'ActivityForm',
  props: {
    activity: {
      type: Object,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    // Reactive state
    const currentStep = ref(1);
    const form = ref({
      name: '',
      description: '',
      sportType: '',
      teamSize: '',
      location: '',
      timeRequired: '',
      difficulty: '',
      facilitationTips: []
    });

    const tipInput = ref('');
    const errors = ref({});
    const isSubmitting = ref(false);

    // Form options
    const sportTypes = [
      { value: 'Badminton', label: 'Badminton' },
      { value: 'Basketball', label: 'Basketball' },
      { value: 'Golf', label: 'Golf' },
      { value: 'Tennis', label: 'Tennis' },
      { value: 'Table Tennis', label: 'Table Tennis' },
      { value: 'Volleyball', label: 'Volleyball' },
      { value: 'Pickle Ball', label: 'Pickle Ball' },
      { value: 'Other', label: 'Other' }

    ];

    const teamSizes = [
      { value: '2-5', label: '2-5 people (Small team)' },
      { value: '6-10', label: '6-10 people (Medium team)' },
      { value: '11-20', label: '11-20 people (Large team)' },
      { value: '20+', label: '20+ people (Enterprise)' }
    ];

    const locations = [
      { value: 'KL', label: 'Kuala Lumpur' },
      { value: 'KSL', label: 'KSL' },
      { value: 'Serdang', label: 'Serdang' },
      { value: 'Subang', label: 'Subang' },
      { value: 'Cyberjaya', label: 'Cyberjaya' },
      { value: 'Other', label: 'Other' }
    ];

    const timeOptions = [
      { value: '1', label: 'One hour' },
      { value: '1.5', label: 'One and a half hours' },
      { value: '2', label: 'Two hours' },
      { value: '2.5', label: 'Two and a half hours' },
      { value: '3', label: 'Three hours' }
    ];

    const difficultyLevels = [
      {
        value: 'easy',
        label: 'Easy',
        class: 'easy',
        icon: 'CheckCircleIcon'
      },
      {
        value: 'medium',
        label: 'Medium',
        class: 'medium',
        icon: 'ExclamationCircleIcon'
      },
      {
        value: 'hard',
        label: 'Hard',
        class: 'hard',
        icon: 'FireIcon'
      }
    ];

    // Computed properties
    const canProceed = computed(() => {
      if (currentStep.value === 1) {
        return form.value.name.trim() && form.value.description.trim() && form.value.sportType;
      }
      return true;
    });

    const isFormValid = computed(() => {
      return form.value.name.trim() &&
             form.value.description.trim() &&
             form.value.sportType &&
             Object.keys(errors.value).length === 0;
    });

    // Watch for activity prop changes
    watch(() => props.activity, (newActivity) => {
      if (newActivity) {
        form.value = {
          name: newActivity.name || '',
          description: newActivity.description || '',
          sportType: newActivity.sport_type || '',
          teamSize: newActivity.team_size || '',
          location: newActivity.location || '',
          timeRequired: newActivity.time_required || '',
          difficulty: newActivity.difficulty || '',
          facilitationTips: newActivity.facilitation_tips || []
        };
      }
    }, { immediate: true });

    // Methods
    const nextStep = () => {
      if (validateCurrentStep() && currentStep.value < 3) {
        currentStep.value++;
      }
    };

    const previousStep = () => {
      if (currentStep.value > 1) {
        currentStep.value--;
      }
    };

    const validateCurrentStep = () => {
      errors.value = {};

      if (currentStep.value === 1) {
        if (!form.value.name.trim()) {
          errors.value.name = 'Activity name is required';
        } else if (form.value.name.length > 100) {
          errors.value.name = 'Activity name must be 100 characters or less';
        }

        if (!form.value.description.trim()) {
          errors.value.description = 'Description is required';
        } else if (form.value.description.length > 500) {
          errors.value.description = 'Description must be 500 characters or less';
        }

        if (!form.value.sportType) {
          errors.value.sportType = 'Sport type is required';
        }
      }

      return Object.keys(errors.value).length === 0;
    };

    const addTip = () => {
      const tip = tipInput.value.trim();
      if (tip && tip.length <= 200) {
        form.value.facilitationTips.push(tip);
        tipInput.value = '';
      }
    };

    const removeTip = (index) => {
      form.value.facilitationTips.splice(index, 1);
    };

    const handleSubmit = async () => {
      if (!validateCurrentStep() || !isFormValid.value) {
        return;
      }

      isSubmitting.value = true;
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        emit('submit', { ...form.value });
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const handleCancel = () => {
      emit('cancel');
    };

    return {
      // State
      currentStep,
      form,
      tipInput,
      errors,
      isSubmitting,

      // Options
      sportTypes,
      teamSizes,
      locations,
      timeOptions,
      difficultyLevels,

      // Computed
      canProceed,
      isFormValid,

      // Methods
      nextStep,
      previousStep,
      addTip,
      removeTip,
      handleSubmit,
      handleCancel
    };
  }
};
</script>

<style scoped>

.activity-form-container {
  max-width: 800px;
  margin: 0 auto;
}

/* Form Header */
.form-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.form-header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-6);
}

.form-icon {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-500));
  color: white;
  padding: var(--space-4);
  border-radius: var(--radius-xl);
  margin-right: var(--space-4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-title-section {
  text-align: left;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #000;
  margin-bottom: var(--space-1);
}

.form-subtitle {
  color: #333;
  font-size: 0.875rem;
}

/* Progress Indicator */
.form-progress {
  margin-bottom: var(--space-6);
}

.progress-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-3);
}

.progress-step {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #333;
  transition: all var(--transition-normal);
}

.progress-step.active {
  background: var(--primary-600);
  border-color: #000;
  color: #000;
}

.progress-line {
  width: 60px;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  transition: all var(--transition-normal);
}

.progress-line.active {
  background: var(--primary-500);
}

.progress-labels {
  display: flex;
  justify-content: center;
  gap: 60px;
}

.progress-label {
  font-size: 0.75rem;
  color: #000;
  transition: color var(--transition-normal);
}

.progress-label.active {
  color: #000;
  font-weight: 600;
}

/* Form Content */
.form-content {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  backdrop-filter: blur(20px);
  box-shadow:
    0 8px 32px 0 rgba(31, 38, 135, 0.37),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
}

.form-step {
  display: block;
}

.step-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.step-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #000;
  margin-bottom: var(--space-2);
}

.step-description {
  color: #000;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-6);
}

/* Form Groups */
.form-group {
  margin-bottom: var(--space-6);
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #000;
  margin-bottom: var(--space-2);
  font-size: 0.875rem;
}

.form-label.required::after {
  content: '*';
  color: #000;
  margin-left: var(--space-1);
}

.form-label svg {
  margin-right: var(--space-2);
  transition: transform var(--transition-fast);
}

/* Form Inputs */
.form-input,
.form-select {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(43, 34, 34, 0.2);
  border-radius: var(--radius-lg);
  color: #000;
  font-size: 0.875rem;
  transition: all var(--transition-normal);
  backdrop-filter: blur(10px);
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary-400);
  background: rgba(255, 255, 255, 0.15);
  box-shadow:
    0 0 0 3px rgba(14, 165, 233, 0.1),
    0 8px 20px rgba(14, 165, 233, 0.2);
  transform: translateY(-1px);
}

.form-input.error,
.form-select.error {
  border-color: var(--error-400);
  background: rgba(239, 68, 68, 0.1);
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.form-input::placeholder {
  color: #000;
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
  border-top: 4px solid #000;
  pointer-events: none;
}

/* Form Helpers */
.form-error {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: #000;
  font-size: 0.75rem;
  margin-top: var(--space-1);
}

.input-helper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-1);
}

.character-count {
  font-size: 0.75rem;
  color: #000;
}

/* Difficulty Selector */
.difficulty-selector {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.difficulty-option {
  flex: 1;
  min-width: 100px;
  padding: var(--space-1);
  background: rgba(253, 253, 253, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: var(--radius-lg);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  color: #000;
}

.difficulty-option.active {
  background: var(--primary-600);
  border-color: #000;
  color: #000;
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.difficulty-option:hover:not(.active) {
  background: rgba(255, 255, 255, 0.15);
  border-color: var(--primary-400);
}

.difficulty-icon {
  margin-bottom: var(--space-2);
}

.difficulty-icon.easy { color: #000; }
.difficulty-icon.medium { color: #000; }
.difficulty-icon.hard { color: #000; }

.difficulty-label {
  font-weight: 600;
  font-size: 0.875rem;
}

/* Tips Section */
.tips-input-section {
  margin-bottom: var(--space-4);
}

.tip-input-group {
  display: flex;
  gap: var(--space-3);
}

.tip-input {
  flex: 1;
}

.add-tip-btn {
  background: var(--accent-600);
  color: white;
  border: none;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  transition: all var(--transition-normal);
}

.add-tip-btn:hover:not(:disabled) {
  background: var(--accent-700);
}

.add-tip-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tips-list {
  margin-top: var(--space-4);
}

.tips-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: 600;
  color: #000;
  margin-bottom: var(--space-3);
}

.tips-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.tip-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-lg);
}

.tip-content {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex: 1;
}

.tip-number {
  background: var(--primary-600);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.tip-text {
  color: #000;
  font-size: 0.875rem;
}

.remove-tip-btn {
  background: var(--error-600);
  color: white;
  border: none;
  padding: var(--space-1);
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.remove-tip-btn:hover {
  background: var(--error-700);
}

/* Tip transitions */
.tip-enter-active,
.tip-leave-active {
  transition: all var(--transition-normal);
}

.tip-enter-from,
.tip-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.tip-move {
  transition: transform var(--transition-normal);
}

/* Activity Summary */
.activity-summary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  margin-top: var(--space-6);
}

.summary-title {
  font-weight: 700;
  color: #000;
  margin-bottom: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.summary-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-3);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: var(--space-2) 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-label {
  font-weight: 600;
  color: #333;
}

.summary-value {
  color: #000;
  font-weight: 500;
}

/* Form Navigation */
.form-navigation {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: var(--space-6);
  margin-top: var(--space-8);
}

.nav-buttons {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.nav-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #000;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-btn.cancel {
  background: var(--error-600);
  color: white;
}

.nav-btn.primary {
  background: var(--primary-600);
  color: white;
}

.nav-btn.submit {
  background: linear-gradient(135deg, var(--success-600), var(--success-500));
  color: white;
}

.nav-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Enhanced button gradients with shine effect */
.nav-btn.primary,
.nav-btn.submit {
  position: relative;
  overflow: hidden;
}

.nav-btn.primary::before,
.nav-btn.submit::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent);
  transition: left 0.5s ease;
}

.nav-btn.primary:hover::before,
.nav-btn.submit:hover::before {
  left: 100%;
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .nav-buttons {
    flex-direction: column;
  }

  .difficulty-selector {
    flex-direction: column;
  }

  .difficulty-option {
    min-width: auto;
  }

  .summary-content {
    grid-template-columns: 1fr;
  }

  .form-content {
    padding: var(--space-4);
  }
}

@media (max-width: 480px) {
  .tip-input-group {
    flex-direction: column;
  }
}
</style>
