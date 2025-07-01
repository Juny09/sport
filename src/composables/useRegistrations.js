import { ref, computed } from 'vue';
import { RegistrationService } from '../services/RegistrationService.js';

export function useRegistrations() {
    const registrations = ref([]);
    const loading = ref(false);
    const error = ref('');

    const registrationsByActivity = computed(() => {
        const grouped = {};
        registrations.value.forEach(reg => {
            const activityId = reg.activity_id;
            if (!grouped[activityId]) {
                grouped[activityId] = [];
            }
            grouped[activityId].push(reg);
        });
        return grouped;
    });

    const loadRegistrations = async () => {
        loading.value = true;
        error.value = '';
        try {
            registrations.value = await RegistrationService.getAll();
        } catch (err) {
            error.value = 'Failed to load registrations';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    const loadRegistrationsByActivity = async (activityId) => {
        loading.value = true;
        error.value = '';
        try {
            const data = await RegistrationService.getByActivityId(activityId);
            return data;
        } catch (err) {
            error.value = 'Failed to load registrations';
            console.error(err);
            return [];
        } finally {
            loading.value = false;
        }
    };

    const createRegistration = async (registrationData) => {
        loading.value = true;
        error.value = '';
        try {
            const newRegistration = await RegistrationService.create(registrationData);
            registrations.value.unshift(newRegistration);
            return newRegistration;
        } catch (err) {
            error.value = 'Failed to create registration';
            console.error(err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const updateRegistration = async (id, registrationData) => {
        loading.value = true;
        error.value = '';
        try {
            const updatedRegistration = await RegistrationService.update(id, registrationData);
            const index = registrations.value.findIndex(r => r.id === id);
            if (index !== -1) {
                registrations.value[index] = updatedRegistration;
            }
            return updatedRegistration;
        } catch (err) {
            error.value = 'Failed to update registration';
            console.error(err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const deleteRegistration = async (id) => {
        loading.value = true;
        error.value = '';
        try {
            await RegistrationService.delete(id);
            registrations.value = registrations.value.filter(r => r.id !== id);
        } catch (err) {
            error.value = 'Failed to delete registration';
            console.error(err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return {
        registrations,
        loading,
        error,
        registrationsByActivity,
        loadRegistrations,
        loadRegistrationsByActivity,
        createRegistration,
        updateRegistration,
        deleteRegistration
    };
}
