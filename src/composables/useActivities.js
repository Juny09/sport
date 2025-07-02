import { ref } from 'vue';
import { supabase } from '../config/supabase.js';

export function useActivities() {
    const activities = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const tableName = 'activities'; // Your Supabase table name

    const loadActivities = async () => {
        loading.value = true;
        error.value = null;
        try {
            const { data, error: fetchError } = await supabase
                .from(tableName)
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            activities.value = data || [];
            return activities.value;
        } catch (err) {
            console.error('Error loading activities:', err);
            error.value = err.message || 'Failed to load activities';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const createActivity = async (activityData) => {
        loading.value = true;
        error.value = null;
        try {
            const { data, error: createError } = await supabase
                .from(tableName)
                .insert([{
                    ...activityData,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (createError) throw createError;
            
            // Add the new activity to the beginning of the list
            activities.value.unshift(data);
            return data;
        } catch (err) {
            console.error('Error creating activity:', err);
            error.value = err.message || 'Failed to create activity';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const updateActivity = async (id, activityData) => {
        loading.value = true;
        error.value = null;
        try {
            const { data, error: updateError } = await supabase
                .from(tableName)
                .update({
                    ...activityData,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (updateError) throw updateError;
            
            // Update the activity in the list
            const index = activities.value.findIndex(a => a.id === id);
            if (index !== -1) {
                activities.value[index] = data;
            }
            return data;
        } catch (err) {
            console.error('Error updating activity:', err);
            error.value = err.message || 'Failed to update activity';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const deleteActivity = async (id) => {
        loading.value = true;
        error.value = null;
        try {
            const { error: deleteError } = await supabase
                .from(tableName)
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;
            
            // Remove the activity from the list
            activities.value = activities.value.filter(activity => activity.id !== id);
            return true;
        } catch (err) {
            console.error('Error deleting activity:', err);
            error.value = err.message || 'Failed to delete activity';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const searchActivities = async (query) => {
        loading.value = true;
        error.value = null;
        try {
            if (!query || query.trim() === '') {
                return await loadActivities();
            }

            const { data, error: searchError } = await supabase
                .from(tableName)
                .select('*')
                .or(`name.ilike.%${query}%,description.ilike.%${query}%,type.ilike.%${query}%`)
                .order('created_at', { ascending: false });

            if (searchError) throw searchError;
            
            activities.value = data || [];
            return activities.value;
        } catch (err) {
            console.error('Error searching activities:', err);
            error.value = err.message || 'Failed to search activities';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return {
        // State
        activities,
        loading,
        error,
        
        // Methods
        loadActivities,
        createActivity,
        updateActivity,
        deleteActivity,
        searchActivities
    };
}
