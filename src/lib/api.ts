import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/services/auth";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

// Rate limiting helper
const rateLimit = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  const userLimit = rateLimit.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimit.set(userId, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userLimit.count >= limit) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

// Validation helpers
function validateWeddingAccess(weddingId: string, userId: string): Promise<boolean> {
  return supabase
    .from('weddings')
    .select('id')
    .eq('id', weddingId)
    .eq('user_id', userId)
    .single()
    .then(({ data }) => !!data);
}

// API wrapper functions
export const api = {
  // Events
  async listEvents() {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    
    if (!checkRateLimit(user.id)) {
      throw new Error('Rate limit exceeded');
    }
    
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getEvent(id: string) {
    console.log("🔍 API: getEvent called with id =", id);
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    
    if (!checkRateLimit(user.id)) {
      throw new Error('Rate limit exceeded');
    }
    
    console.log("🔍 API: Making Supabase query for event");
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    console.log("🔍 API: Supabase response - data =", data, "error =", error);
    if (error) throw error;
    return data;
  },

  async createEvent(event: Omit<TablesInsert<'weddings'>, 'user_id'>) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    
    if (!checkRateLimit(user.id)) {
      throw new Error('Rate limit exceeded');
    }
    
    // Additional validation
    if (!event.bride_name?.trim() && !event.groom_name?.trim()) {
      throw new Error('At least one name is required');
    }
    
    const { data, error } = await supabase
      .from('weddings')
      .insert({ ...event, user_id: user.id })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Tasks
  async listTasks(weddingId: string) {
    console.log("🔍 API: listTasks called with weddingId =", weddingId);
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    
    if (!checkRateLimit(user.id)) {
      throw new Error('Rate limit exceeded');
    }
    
    // Verify wedding ownership
    console.log("🔍 API: Validating wedding access");
    const hasAccess = await validateWeddingAccess(weddingId, user.id);
    if (!hasAccess) throw new Error('Access denied');
    
    console.log("🔍 API: Making Supabase query for tasks");
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('created_at', { ascending: false });
    
    console.log("🔍 API: Supabase response - data =", data, "error =", error);
    if (error) throw error;
    return data;
  },

  async createTask(weddingId: string, task: Omit<TablesInsert<'tasks'>, 'wedding_id'>) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    
    if (!checkRateLimit(user.id)) {
      throw new Error('Rate limit exceeded');
    }
    
    // Verify wedding ownership
    const hasAccess = await validateWeddingAccess(weddingId, user.id);
    if (!hasAccess) throw new Error('Access denied');
    
    // Validation
    if (!task.title?.trim()) {
      throw new Error('Task title is required');
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...task, wedding_id: weddingId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async createTasksBatch(weddingId: string, tasks: Omit<TablesInsert<'tasks'>, 'wedding_id'>[]) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    
    if (!checkRateLimit(user.id)) {
      throw new Error('Rate limit exceeded');
    }
    
    // Verify wedding ownership
    const hasAccess = await validateWeddingAccess(weddingId, user.id);
    if (!hasAccess) throw new Error('Access denied');
    
    // Validation
    if (!tasks.length) {
      throw new Error('No tasks provided');
    }
    
    for (const task of tasks) {
      if (!task.title?.trim()) {
        throw new Error('All tasks must have a title');
      }
    }
    
    const tasksWithWeddingId = tasks.map(task => ({ ...task, wedding_id: weddingId }));
    
    const { data, error } = await supabase
      .from('tasks')
      .insert(tasksWithWeddingId)
      .select();
    
    if (error) throw error;
    return data;
  },

  async updateTask(taskId: string, updates: TablesUpdate<'tasks'>) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    
    if (!checkRateLimit(user.id)) {
      throw new Error('Rate limit exceeded');
    }
    
    // Verify task ownership through wedding
    const { data: task } = await supabase
      .from('tasks')
      .select('wedding_id')
      .eq('id', taskId)
      .single();
    
    if (!task) throw new Error('Task not found');
    
    const hasAccess = await validateWeddingAccess(task.wedding_id, user.id);
    if (!hasAccess) throw new Error('Access denied');
    
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId);
    
    if (error) throw error;
    return true;
  },

  async deleteTask(taskId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    
    if (!checkRateLimit(user.id)) {
      throw new Error('Rate limit exceeded');
    }
    
    // Verify task ownership through wedding
    const { data: task } = await supabase
      .from('tasks')
      .select('wedding_id')
      .eq('id', taskId)
      .single();
    
    if (!task) throw new Error('Task not found');
    
    const hasAccess = await validateWeddingAccess(task.wedding_id, user.id);
    if (!hasAccess) throw new Error('Access denied');
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
    
    if (error) throw error;
    return true;
  },

  // Similar patterns for guests and vendors...
  async listGuests(weddingId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    
    if (!checkRateLimit(user.id)) {
      throw new Error('Rate limit exceeded');
    }
    
    const hasAccess = await validateWeddingAccess(weddingId, user.id);
    if (!hasAccess) throw new Error('Access denied');
    
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createGuest(weddingId: string, guest: Omit<TablesInsert<'guests'>, 'wedding_id'>) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    
    if (!checkRateLimit(user.id)) {
      throw new Error('Rate limit exceeded');
    }
    
    const hasAccess = await validateWeddingAccess(weddingId, user.id);
    if (!hasAccess) throw new Error('Access denied');
    
    if (!guest.first_name?.trim() || !guest.last_name?.trim()) {
      throw new Error('First and last name are required');
    }
    
    const { data, error } = await supabase
      .from('guests')
      .insert({ ...guest, wedding_id: weddingId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteGuest(guestId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    
    if (!checkRateLimit(user.id)) {
      throw new Error('Rate limit exceeded');
    }
    
    const { data: guest } = await supabase
      .from('guests')
      .select('wedding_id')
      .eq('id', guestId)
      .single();
    
    if (!guest) throw new Error('Guest not found');
    
    const hasAccess = await validateWeddingAccess(guest.wedding_id, user.id);
    if (!hasAccess) throw new Error('Access denied');
    
    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('id', guestId);
    
    if (error) throw error;
    return true;
  },

  async listVendors(weddingId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    
    if (!checkRateLimit(user.id)) {
      throw new Error('Rate limit exceeded');
    }
    
    const hasAccess = await validateWeddingAccess(weddingId, user.id);
    if (!hasAccess) throw new Error('Access denied');
    
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createVendor(weddingId: string, vendor: Omit<TablesInsert<'vendors'>, 'wedding_id'>) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    
    if (!checkRateLimit(user.id)) {
      throw new Error('Rate limit exceeded');
    }
    
    const hasAccess = await validateWeddingAccess(weddingId, user.id);
    if (!hasAccess) throw new Error('Access denied');
    
    if (!vendor.name?.trim() || !vendor.category?.trim()) {
      throw new Error('Name and category are required');
    }
    
    const { data, error } = await supabase
      .from('vendors')
      .insert({ ...vendor, wedding_id: weddingId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteVendor(vendorId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    
    if (!checkRateLimit(user.id)) {
      throw new Error('Rate limit exceeded');
    }
    
    const { data: vendor } = await supabase
      .from('vendors')
      .select('wedding_id')
      .eq('id', vendorId)
      .single();
    
    if (!vendor) throw new Error('Vendor not found');
    
    const hasAccess = await validateWeddingAccess(vendor.wedding_id, user.id);
    if (!hasAccess) throw new Error('Access denied');
    
    const { error } = await supabase
      .from('vendors')
      .delete()
      .eq('id', vendorId);
    
    if (error) throw error;
    return true;
  },


};
