import { ref, computed } from 'vue';
import { supabase } from '../config/supabase.js';

export function useActivities() {
    const activities = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const tableName = 'activities';

    // Computed properties
    const activityCount = computed(() => activities.value.length);

    const filteredActivities = computed(() => {
        return activities.value.filter(activity => activity && activity.id);
    });

    // Map form data to database schema
    const mapFormToDb = (formData) => {
        return {
            name: formData.name,
            description: formData.description,
            sport_type: formData.sportType,
            team_size: formData.teamSize || null,
            location: formData.location || null,
            time_required: formData.timeRequired || null,
            difficulty: formData.difficulty || null,
            facilitation_tips: formData.facilitationTips || []
        };
    };

    // Map database data to form schema
    const mapDbToForm = (dbData) => {
        return {
            name: dbData.name || '',
            description: dbData.description || '',
            sportType: dbData.sport_type || '',
            teamSize: dbData.team_size || '',
            location: dbData.location || '',
            timeRequired: dbData.time_required || '',
            difficulty: dbData.difficulty || '',
            facilitationTips: dbData.facilitation_tips || []
        };
    };

    // Load all activities
    const loadActivities = async () => {
        loading.value = true;
        error.value = null;

        console.log('🔄 Loading activities...');

        try {
            const { data, error: fetchError } = await supabase
                .from(tableName)
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) {
                console.error('❌ Supabase fetch error:', fetchError);
                throw fetchError;
            }

            console.log('✅ Activities loaded successfully:', data);
            activities.value = data || [];
            return { success: true, data: activities.value };

        } catch (err) {
            console.error('❌ Error loading activities:', err);
            error.value = err.message || 'Failed to load activities';
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    };

    // Create new activity
    const createActivity = async (activityData) => {
        loading.value = true;
        error.value = null;

        console.log('🔄 Creating activity:', activityData);

        try {
            // Map form data to database schema
            const dbData = mapFormToDb(activityData);

            console.log('📝 Mapped data for database:', dbData);

            const { data, error: createError } = await supabase
                .from(tableName)
                .insert([dbData])
                .select()
                .single();

            if (createError) {
                console.error('❌ Supabase create error:', createError);
                throw createError;
            }

            console.log('✅ Activity created successfully:', data);

            // Add the new activity to the beginning of the list
            activities.value.unshift(data);
            return { success: true, data };

        } catch (err) {
            console.error('❌ Error creating activity:', err);
            error.value = err.message || 'Failed to create activity';
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    };

    // Update existing activity
    const updateActivity = async (id, activityData) => {
        loading.value = true;
        error.value = null;

        console.log('🔄 Updating activity:', { id, activityData });

        try {
            // Map form data to database schema
            const dbData = mapFormToDb(activityData);

            console.log('📝 Mapped data for update:', dbData);

            const { data, error: updateError } = await supabase
                .from(tableName)
                .update(dbData)
                .eq('id', id)
                .select()
                .single();

            if (updateError) {
                console.error('❌ Supabase update error:', updateError);
                throw updateError;
            }

            console.log('✅ Activity updated successfully:', data);

            // Update the activity in the list
            const index = activities.value.findIndex(a => a.id === id);
            if (index !== -1) {
                activities.value[index] = data;
            }
            return { success: true, data };

        } catch (err) {
            console.error('❌ Error updating activity:', err);
            error.value = err.message || 'Failed to update activity';
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    };

    // Delete activity
    const deleteActivity = async (id) => {
        loading.value = true;
        error.value = null;

        console.log('🔄 Deleting activity:', id);

        try {
            const { error: deleteError } = await supabase
                .from(tableName)
                .delete()
                .eq('id', id);

            if (deleteError) {
                console.error('❌ Supabase delete error:', deleteError);
                throw deleteError;
            }

            console.log('✅ Activity deleted successfully');

            // Remove the activity from the list
            activities.value = activities.value.filter(activity => activity.id !== id);
            return { success: true };

        } catch (err) {
            console.error('❌ Error deleting activity:', err);
            error.value = err.message || 'Failed to delete activity';
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    };

    // Search activities
    const searchActivities = async (query) => {
        loading.value = true;
        error.value = null;

        console.log('🔍 Searching activities:', query);

        try {
            if (!query || query.trim() === '') {
                return await loadActivities();
            }

            const searchTerm = query.trim();
            const { data, error: searchError } = await supabase
                .from(tableName)
                .select('*')
                .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,sport_type.ilike.%${searchTerm}%`)
                .order('created_at', { ascending: false });

            if (searchError) {
                console.error('❌ Supabase search error:', searchError);
                throw searchError;
            }

            console.log('✅ Search completed:', data);
            activities.value = data || [];
            return { success: true, data: activities.value };

        } catch (err) {
            console.error('❌ Error searching activities:', err);
            error.value = err.message || 'Failed to search activities';
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    };

    // Get activity by ID
    const getActivityById = (id) => {
        const activity = activities.value.find(a => a.id === id);
        return activity ? mapDbToForm(activity) : null;
    };

    // Filter activities by sport type
    const filterBySportType = (sportType) => {
        if (!sportType) return activities.value;
        return activities.value.filter(activity =>
            activity.sport_type === sportType
        );
    };

    // Filter activities by difficulty
    const filterByDifficulty = (difficulty) => {
        if (!difficulty) return activities.value;
        return activities.value.filter(activity =>
            activity.difficulty === difficulty
        );
    };

    // Test database connection
    const testConnection = async () => {
        try {
            console.log('🔄 Testing Supabase connection...');

            const { data, error } = await supabase
                .from(tableName)
                .select('count(*)')
                .single();

            if (error) {
                console.error('❌ Connection test failed:', error);
                return { success: false, error: error.message };
            }

            console.log('✅ Connection test successful:', data);
            return { success: true, data };

        } catch (err) {
            console.error('❌ Connection test error:', err);
            return { success: false, error: err.message };
        }
    };

    // Clear error
    const clearError = () => {
        error.value = null;
    };

    // Reset state
    const reset = () => {
        activities.value = [];
        loading.value = false;
        error.value = null;
    };

    return {
        // State
        activities: filteredActivities, // Return filtered activities
        loading,
        error,

        // Computed
        activityCount,

        // Core methods
        loadActivities,
        createActivity,
        updateActivity,
        deleteActivity,
        searchActivities,

        // Utility methods
        getActivityById,
        filterBySportType,
        filterByDifficulty,
        testConnection,
        clearError,
        reset,

        // Data mapping helpers (exposed for testing)
        mapFormToDb,
        mapDbToForm
    };
}
