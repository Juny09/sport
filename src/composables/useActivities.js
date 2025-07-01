import { ref, computed } from 'vue';
import { ActivityService } from '../services/ActivityService.js';

export function useActivities() {
    const activities = ref([]);
    const loading = ref(false);
    const error = ref('');

    const activityOptions = computed(() =>
        activities.value.map(activity => ({
            value: activity.id,
            label: activity.name
        }))
    );

    const loadActivities = async () => {
        loading.value = true;
        error.value = '';
        try {
            activities.value = await ActivityService.getAll();
        } catch (err) {
            error.value = 'Failed to load activities';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    const createActivity = async (activityData) => {
        loading.value = true;
        error.value = '';
        try {
            const newActivity = await ActivityService.create(activityData);
            activities.value.unshift(newActivity);
            return newActivity;
        } catch (err) {
            error.value = 'Failed to create activity';
            console.error(err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const updateActivity = async (id, activityData) => {
        loading.value = true;
        error.value = '';
        try {
            const updatedActivity = await ActivityService.update(id, activityData);
            const index = activities.value.findIndex(a => a.id === id);
            if (index !== -1) {
                activities.value[index] = updatedActivity;
            }
            return updatedActivity;
        } catch (err) {
            error.value = 'Failed to update activity';
            console.error(err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const deleteActivity = async (id) => {
        loading.value = true;
        error.value = '';
        try {
            await ActivityService.delete(id);
            activities.value = activities.value.filter(a => a.id !== id);
        } catch (err) {
            error.value = 'Failed to delete activity';
            console.error(err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const searchActivities = async (query) => {
        loading.value = true;
        error.value = '';
        try {
            activities.value = await ActivityService.search(query);
        } catch (err) {
            error.value = 'Failed to search activities';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    return {
        activities,
        loading,
        error,
        activityOptions,
        loadActivities,
        createActivity,
        updateActivity,
        deleteActivity,
        searchActivities
    };
}
