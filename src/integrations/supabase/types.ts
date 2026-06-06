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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event: string
          id: string
          path: string | null
          properties: Json
          referrer: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          event: string
          id?: string
          path?: string | null
          properties?: Json
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          event?: string
          id?: string
          path?: string | null
          properties?: Json
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      booking_audit_log: {
        Row: {
          action: string
          actor_label: string | null
          actor_user_id: string | null
          booking_id: string
          booking_table: string
          created_at: string
          field: string | null
          id: string
          new_value: string | null
          note: string | null
          old_value: string | null
        }
        Insert: {
          action: string
          actor_label?: string | null
          actor_user_id?: string | null
          booking_id: string
          booking_table: string
          created_at?: string
          field?: string | null
          id?: string
          new_value?: string | null
          note?: string | null
          old_value?: string | null
        }
        Update: {
          action?: string
          actor_label?: string | null
          actor_user_id?: string | null
          booking_id?: string
          booking_table?: string
          created_at?: string
          field?: string | null
          id?: string
          new_value?: string | null
          note?: string | null
          old_value?: string | null
        }
        Relationships: []
      }
      keynote_bookings: {
        Row: {
          audience_size: string | null
          booking_type: Database["public"]["Enums"]["booking_type"]
          budget_range: string | null
          created_at: string
          email: string
          event_city: string | null
          event_date: string | null
          event_name: string | null
          full_name: string
          id: string
          message: string | null
          organization: string | null
          phone: string | null
          reminded_at: string | null
          role: string | null
          status: string
          topic_interest: string | null
        }
        Insert: {
          audience_size?: string | null
          booking_type: Database["public"]["Enums"]["booking_type"]
          budget_range?: string | null
          created_at?: string
          email: string
          event_city?: string | null
          event_date?: string | null
          event_name?: string | null
          full_name: string
          id?: string
          message?: string | null
          organization?: string | null
          phone?: string | null
          reminded_at?: string | null
          role?: string | null
          status?: string
          topic_interest?: string | null
        }
        Update: {
          audience_size?: string | null
          booking_type?: Database["public"]["Enums"]["booking_type"]
          budget_range?: string | null
          created_at?: string
          email?: string
          event_city?: string | null
          event_date?: string | null
          event_name?: string | null
          full_name?: string
          id?: string
          message?: string | null
          organization?: string | null
          phone?: string | null
          reminded_at?: string | null
          role?: string | null
          status?: string
          topic_interest?: string | null
        }
        Relationships: []
      }
      meeting_bookings: {
        Row: {
          created_at: string
          duration_minutes: number
          email: string
          end_time: string
          full_name: string
          google_event_id: string | null
          id: string
          meet_link: string | null
          message: string | null
          reminded_1h_at: string | null
          reminded_at: string | null
          start_time: string
          status: string
          topic: string | null
        }
        Insert: {
          created_at?: string
          duration_minutes?: number
          email: string
          end_time: string
          full_name: string
          google_event_id?: string | null
          id?: string
          meet_link?: string | null
          message?: string | null
          reminded_1h_at?: string | null
          reminded_at?: string | null
          start_time: string
          status?: string
          topic?: string | null
        }
        Update: {
          created_at?: string
          duration_minutes?: number
          email?: string
          end_time?: string
          full_name?: string
          google_event_id?: string | null
          id?: string
          meet_link?: string | null
          message?: string | null
          reminded_1h_at?: string | null
          reminded_at?: string | null
          start_time?: string
          status?: string
          topic?: string | null
        }
        Relationships: []
      }
      newsletter_leads: {
        Row: {
          confirmation_sent_at: string | null
          confirmation_token: string
          confirmed_at: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          ip_hash: string | null
          language: string | null
          source_path: string | null
          unsubscribed_at: string | null
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          confirmation_sent_at?: string | null
          confirmation_token: string
          confirmed_at?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          ip_hash?: string | null
          language?: string | null
          source_path?: string | null
          unsubscribed_at?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          confirmation_sent_at?: string | null
          confirmation_token?: string
          confirmed_at?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          ip_hash?: string | null
          language?: string | null
          source_path?: string | null
          unsubscribed_at?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      request_log: {
        Row: {
          created_at: string
          fingerprint: string | null
          function_name: string
          id: string
          ip: string
        }
        Insert: {
          created_at?: string
          fingerprint?: string | null
          function_name: string
          id?: string
          ip: string
        }
        Update: {
          created_at?: string
          fingerprint?: string | null
          function_name?: string
          id?: string
          ip?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      booking_type: "bureau" | "organizer" | "enterprise"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
      booking_type: ["bureau", "organizer", "enterprise"],
    },
  },
} as const
