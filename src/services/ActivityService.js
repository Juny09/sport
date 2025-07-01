import { supabase } from '../config/supabase.js';

export class ActivityService {
    static async getAll() {
        const { data, error } = await supabase
            .from('activities')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }

    static async getById(id) {
        const { data, error } = await supabase
            .from('activities')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }

    static async create(activity) {
        const { data, error } = await supabase
            .from('activities')
            .insert([{
                name: activity.name,
                description: activity.description,
                meeting_type: activity.meetingType,
                team_size: activity.teamSize,
                location: activity.location,
                time_required: activity.timeRequired,
                facilitation_tips: activity.facilitationTips || []
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async update(id, activity) {
        const { data, error } = await supabase
            .from('activities')
            .update({
                name: activity.name,
                description: activity.description,
                meeting_type: activity.meetingType,
                team_size: activity.teamSize,
                location: activity.location,
                time_required: activity.timeRequired,
                facilitation_tips: activity.facilitationTips || [],
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async delete(id) {
        const { error } = await supabase
            .from('activities')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }

    static async search(query) {
        const { data, error } = await supabase
            .from('activities')
            .select('*')
            .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }
}
