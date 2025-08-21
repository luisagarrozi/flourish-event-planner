export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      budget_items: {
        Row: {
          actual_cost: number | null
          category: string
          created_at: string
          estimated_cost: number | null
          id: string
          item_name: string
          notes: string | null
          paid: boolean | null
          updated_at: string
          vendor: string | null
          wedding_id: string
        }
        Insert: {
          actual_cost?: number | null
          category: string
          created_at?: string
          estimated_cost?: number | null
          id?: string
          item_name: string
          notes?: string | null
          paid?: boolean | null
          updated_at?: string
          vendor?: string | null
          wedding_id: string
        }
        Update: {
          actual_cost?: number | null
          category?: string
          created_at?: string
          estimated_cost?: number | null
          id?: string
          item_name?: string
          notes?: string | null
          paid?: boolean | null
          updated_at?: string
          vendor?: string | null
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_items_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_lists: {
        Row: {
          claimed: boolean | null
          claimed_by: string | null
          created_at: string
          gift_description: string | null
          gift_name: string
          gift_price: number | null
          gift_url: string | null
          id: string
          site_id: string
          updated_at: string
        }
        Insert: {
          claimed?: boolean | null
          claimed_by?: string | null
          created_at?: string
          gift_description?: string | null
          gift_name: string
          gift_price?: number | null
          gift_url?: string | null
          id?: string
          site_id: string
          updated_at?: string
        }
        Update: {
          claimed?: boolean | null
          claimed_by?: string | null
          created_at?: string
          gift_description?: string | null
          gift_name?: string
          gift_price?: number | null
          gift_url?: string | null
          id?: string
          site_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      global_vendors: {
        Row: {
          address: string | null
          category: string
          contact_person: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          category: string
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          category?: string
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      guests: {
        Row: {
          address: string | null
          created_at: string
          dietary_restrictions: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          plus_one: boolean | null
          rsvp_status: string | null
          updated_at: string
          wedding_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          dietary_restrictions?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          plus_one?: boolean | null
          rsvp_status?: string | null
          updated_at?: string
          wedding_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          dietary_restrictions?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          plus_one?: boolean | null
          rsvp_status?: string | null
          updated_at?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guests_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_sections: {
        Row: {
          background_image_url: string | null
          content: string | null
          created_at: string
          id: string
          section_order: number
          section_type: string | null
          site_id: string
          title: string
          updated_at: string
        }
        Insert: {
          background_image_url?: string | null
          content?: string | null
          created_at?: string
          id?: string
          section_order?: number
          section_type?: string | null
          site_id: string
          title: string
          updated_at?: string
        }
        Update: {
          background_image_url?: string | null
          content?: string | null
          created_at?: string
          id?: string
          section_order?: number
          section_type?: string | null
          site_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      task_vendor_assignments: {
        Row: {
          assigned_at: string | null
          id: string
          notes: string | null
          task_id: string
          vendor_id: string
        }
        Insert: {
          assigned_at?: string | null
          id?: string
          notes?: string | null
          task_id: string
          vendor_id: string
        }
        Update: {
          assigned_at?: string | null
          id?: string
          notes?: string | null
          task_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_vendor_assignments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_vendor_assignments_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "global_vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          category: string | null
          completed: boolean | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          title: string
          updated_at: string
          wedding_id: string
        }
        Insert: {
          category?: string | null
          completed?: boolean | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          title: string
          updated_at?: string
          wedding_id: string
        }
        Update: {
          category?: string | null
          completed?: boolean | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          title?: string
          updated_at?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          category: string
          contact_person: string | null
          cost: number | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          status: string | null
          updated_at: string
          website: string | null
          wedding_id: string
        }
        Insert: {
          category: string
          contact_person?: string | null
          cost?: number | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string
          website?: string | null
          wedding_id: string
        }
        Update: {
          category?: string
          contact_person?: string | null
          cost?: number | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string
          website?: string | null
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendors_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      wedding_sites: {
        Row: {
          created_at: string
          id: string
          published: boolean | null
          site_title: string | null
          site_url: string | null
          theme_color: string | null
          updated_at: string
          wedding_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          published?: boolean | null
          site_title?: string | null
          site_url?: string | null
          theme_color?: string | null
          updated_at?: string
          wedding_id: string
        }
        Update: {
          created_at?: string
          id?: string
          published?: boolean | null
          site_title?: string | null
          site_url?: string | null
          theme_color?: string | null
          updated_at?: string
          wedding_id?: string
        }
        Relationships: []
      }
      weddings: {
        Row: {
          bride_name: string | null
          budget: number | null
          created_at: string
          groom_name: string | null
          guest_count: number | null
          id: string
          status: string | null
          updated_at: string
          user_id: string
          venue: string | null
          wedding_date: string | null
        }
        Insert: {
          bride_name?: string | null
          budget?: number | null
          created_at?: string
          groom_name?: string | null
          guest_count?: number | null
          id?: string
          status?: string | null
          updated_at?: string
          user_id: string
          venue?: string | null
          wedding_date?: string | null
        }
        Update: {
          bride_name?: string | null
          budget?: number | null
          created_at?: string
          groom_name?: string | null
          guest_count?: number | null
          id?: string
          status?: string | null
          updated_at?: string
          user_id?: string
          venue?: string | null
          wedding_date?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
