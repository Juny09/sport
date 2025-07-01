import { supabase } from '../config/supabase.js';

export class RegistrationService {
    static async getAll() {
        const { data, error } = await supabase
            .from('user_registrations')
            .select(`
                *,
                activities (
                    id,
                    name,
                    description
                )
            `)
            .order('registered_at', { ascending: false });

        if (error) throw error;
        return data;
    }

    static async getByActivityId(activityId) {
        const { data, error } = await supabase
            .from('user_registrations')
            .select('*')
            .eq('activity_id', activityId)
            .order('registered_at', { ascending: false });

        if (error) throw error;
        return data;
    }

    static async create(registration) {
        const { data, error } = await supabase
            .from('user_registrations')
            .insert([{
                activity_id: registration.activityId,
                user_name: registration.userName,
                email: registration.email,
                phone: registration.phone,
                registered_at: registration.registeredAt || new Date().toISOString()
            }])
            .select(`
                *,
                activities (
                    id,
                    name,
                    description
                )
            `)
            .single();

        if (error) throw error;
        return data;
    }

    static async update(id, registration) {
        const { data, error } = await supabase
            .from('user_registrations')
            .update({
                user_name: registration.userName,
                email: registration.email,
                phone: registration.phone,
                registered_at: registration.registeredAt
            })
            .eq('id', id)
            .select(`
                *,
                activities (
                    id,
                    name,
                    description
                )
            `)
            .single();

        if (error) throw error;
        return data;
    }

    static async delete(id) {
        const { error } = await supabase
            .from('user_registrations')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
}
