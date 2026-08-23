import { supabase } from '../../lib/supabase.js';

export const complaintService = {
  async create(complaint) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error('You must be logged in to submit a complaint.');

    const { data, error } = await supabase
      .from('citizen_complaints')
      .insert({
        citizen_id: user.id,
        citizen_name:
          user.user_metadata?.full_name ||
          user.email?.split('@')[0] ||
          'Citizen',
        citizen_email: user.email,

        subject: complaint.subject,
        description: complaint.description,
        category: complaint.category || 'General',

        district: complaint.district || null,
        state: complaint.state || null,
        latitude: complaint.latitude || null,
        longitude: complaint.longitude || null,

        status: 'Pending',
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async getForAgency() {
    const { data, error } = await supabase
      .from('citizen_complaints')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  },

  async updateStatus(id, status, agencyNotes = null) {
    const { data, error } = await supabase
      .from('citizen_complaints')
      .update({
        status,
        agency_notes: agencyNotes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },
};