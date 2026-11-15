// Database types for supabase/migrations/0001_init.sql.
// Same shape as `supabase gen types typescript`. Regenerate with `npm run db:types`
// after linking the project (`npx supabase login && npx supabase link --project-ref <ref>`).

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string;
          actor: string | null;
          created_at: string;
          entity: string | null;
          entity_id: string | null;
          id: number;
          meta: Json | null;
        };
        Insert: {
          action: string;
          actor?: string | null;
          created_at?: string;
          entity?: string | null;
          entity_id?: string | null;
          id?: never;
          meta?: Json | null;
        };
        Update: {
          action?: string;
          actor?: string | null;
          created_at?: string;
          entity?: string | null;
          entity_id?: string | null;
          id?: never;
          meta?: Json | null;
        };
        Relationships: [];
      };
      admins: {
        Row: {
          created_at: string;
          email: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      applications: {
        Row: {
          consent_at: string;
          created_at: string;
          cv_path: string;
          email: string;
          expected_ctc: string | null;
          experience_years: number | null;
          id: string;
          job_id: string | null;
          links: Json | null;
          location: string | null;
          name: string;
          notice_period: string | null;
          phone: string;
          skills: string[] | null;
          status: Database["public"]["Enums"]["app_status"];
          updated_at: string;
        };
        Insert: {
          consent_at: string;
          created_at?: string;
          cv_path: string;
          email: string;
          expected_ctc?: string | null;
          experience_years?: number | null;
          id?: string;
          job_id?: string | null;
          links?: Json | null;
          location?: string | null;
          name: string;
          notice_period?: string | null;
          phone: string;
          skills?: string[] | null;
          status?: Database["public"]["Enums"]["app_status"];
          updated_at?: string;
        };
        Update: {
          consent_at?: string;
          created_at?: string;
          cv_path?: string;
          email?: string;
          expected_ctc?: string | null;
          experience_years?: number | null;
          id?: string;
          job_id?: string | null;
          links?: Json | null;
          location?: string | null;
          name?: string;
          notice_period?: string | null;
          phone?: string;
          skills?: string[] | null;
          status?: Database["public"]["Enums"]["app_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "jobs";
            referencedColumns: ["id"];
          },
        ];
      };
      case_studies: {
        Row: {
          anonymised: boolean;
          challenge: string | null;
          client_name: string | null;
          created_at: string;
          id: string;
          images: string[] | null;
          industry: string | null;
          line: Database["public"]["Enums"]["business_line"];
          outcome: string | null;
          published: boolean;
          seo_description: string | null;
          seo_title: string | null;
          slug: string;
          solution: string | null;
          stack: string[] | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          anonymised?: boolean;
          challenge?: string | null;
          client_name?: string | null;
          created_at?: string;
          id?: string;
          images?: string[] | null;
          industry?: string | null;
          line: Database["public"]["Enums"]["business_line"];
          outcome?: string | null;
          published?: boolean;
          seo_description?: string | null;
          seo_title?: string | null;
          slug: string;
          solution?: string | null;
          stack?: string[] | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          anonymised?: boolean;
          challenge?: string | null;
          client_name?: string | null;
          created_at?: string;
          id?: string;
          images?: string[] | null;
          industry?: string | null;
          line?: Database["public"]["Enums"]["business_line"];
          outcome?: string | null;
          published?: boolean;
          seo_description?: string | null;
          seo_title?: string | null;
          slug?: string;
          solution?: string | null;
          stack?: string[] | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      jobs: {
        Row: {
          created_at: string;
          description_mdx: string;
          experience: string | null;
          id: string;
          is_open: boolean;
          location: string | null;
          posted_at: string;
          skills: string[] | null;
          slug: string;
          title: string;
          type: Database["public"]["Enums"]["job_type"];
          updated_at: string;
          valid_through: string | null;
          work_mode: string | null;
        };
        Insert: {
          created_at?: string;
          description_mdx?: string;
          experience?: string | null;
          id?: string;
          is_open?: boolean;
          location?: string | null;
          posted_at?: string;
          skills?: string[] | null;
          slug: string;
          title: string;
          type: Database["public"]["Enums"]["job_type"];
          updated_at?: string;
          valid_through?: string | null;
          work_mode?: string | null;
        };
        Update: {
          created_at?: string;
          description_mdx?: string;
          experience?: string | null;
          id?: string;
          is_open?: boolean;
          location?: string | null;
          posted_at?: string;
          skills?: string[] | null;
          slug?: string;
          title?: string;
          type?: Database["public"]["Enums"]["job_type"];
          updated_at?: string;
          valid_through?: string | null;
          work_mode?: string | null;
        };
        Relationships: [];
      };
      lead_notes: {
        Row: {
          created_at: string;
          created_by: string | null;
          id: string;
          lead_id: string;
          note: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          lead_id: string;
          note: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          lead_id?: string;
          note?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lead_notes_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      leads: {
        Row: {
          attachment_path: string | null;
          company: string | null;
          consent_at: string;
          created_at: string;
          email: string;
          form_type: Database["public"]["Enums"]["lead_form_type"];
          id: string;
          name: string | null;
          payload: Json;
          phone: string | null;
          source_page: string | null;
          status: Database["public"]["Enums"]["lead_status"];
          updated_at: string;
          utm: Json | null;
        };
        Insert: {
          attachment_path?: string | null;
          company?: string | null;
          consent_at: string;
          created_at?: string;
          email: string;
          form_type: Database["public"]["Enums"]["lead_form_type"];
          id?: string;
          name?: string | null;
          payload?: Json;
          phone?: string | null;
          source_page?: string | null;
          status?: Database["public"]["Enums"]["lead_status"];
          updated_at?: string;
          utm?: Json | null;
        };
        Update: {
          attachment_path?: string | null;
          company?: string | null;
          consent_at?: string;
          created_at?: string;
          email?: string;
          form_type?: Database["public"]["Enums"]["lead_form_type"];
          id?: string;
          name?: string | null;
          payload?: Json;
          phone?: string | null;
          source_page?: string | null;
          status?: Database["public"]["Enums"]["lead_status"];
          updated_at?: string;
          utm?: Json | null;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          author: string | null;
          body_mdx: string;
          category: string | null;
          cover_image: string | null;
          created_at: string;
          excerpt: string | null;
          id: string;
          published_at: string | null;
          seo_description: string | null;
          seo_title: string | null;
          slug: string;
          tags: string[] | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          author?: string | null;
          body_mdx?: string;
          category?: string | null;
          cover_image?: string | null;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          published_at?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          slug: string;
          tags?: string[] | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          author?: string | null;
          body_mdx?: string;
          category?: string | null;
          cover_image?: string | null;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          published_at?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          slug?: string;
          tags?: string[] | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          created_at: string;
          deployment_options: string[] | null;
          domain: string | null;
          faqs: Json | null;
          id: string;
          modules: Json | null;
          name: string;
          published: boolean;
          screenshots: string[] | null;
          seo_description: string | null;
          seo_title: string | null;
          slug: string;
          sort_order: number | null;
          status: Database["public"]["Enums"]["product_status"];
          summary: string | null;
          tagline: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          deployment_options?: string[] | null;
          domain?: string | null;
          faqs?: Json | null;
          id?: string;
          modules?: Json | null;
          name: string;
          published?: boolean;
          screenshots?: string[] | null;
          seo_description?: string | null;
          seo_title?: string | null;
          slug: string;
          sort_order?: number | null;
          status?: Database["public"]["Enums"]["product_status"];
          summary?: string | null;
          tagline?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          deployment_options?: string[] | null;
          domain?: string | null;
          faqs?: Json | null;
          id?: string;
          modules?: Json | null;
          name?: string;
          published?: boolean;
          screenshots?: string[] | null;
          seo_description?: string | null;
          seo_title?: string | null;
          slug?: string;
          sort_order?: number | null;
          status?: Database["public"]["Enums"]["product_status"];
          summary?: string | null;
          tagline?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      rate_limits: {
        Row: {
          count: number;
          key: string;
          window_start: string;
        };
        Insert: {
          count?: number;
          key: string;
          window_start?: string;
        };
        Update: {
          count?: number;
          key?: string;
          window_start?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          announcement: string | null;
          cin: string | null;
          email: string | null;
          gstin: string | null;
          id: number;
          legal_name: string;
          phone: string | null;
          registered_office: string | null;
          socials: Json | null;
          updated_at: string;
          whatsapp: string | null;
        };
        Insert: {
          announcement?: string | null;
          cin?: string | null;
          email?: string | null;
          gstin?: string | null;
          id?: number;
          legal_name?: string;
          phone?: string | null;
          registered_office?: string | null;
          socials?: Json | null;
          updated_at?: string;
          whatsapp?: string | null;
        };
        Update: {
          announcement?: string | null;
          cin?: string | null;
          email?: string | null;
          gstin?: string | null;
          id?: number;
          legal_name?: string;
          phone?: string | null;
          registered_office?: string | null;
          socials?: Json | null;
          updated_at?: string;
          whatsapp?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: { Args: never; Returns: boolean };
    };
    Enums: {
      app_status: "new" | "screening" | "interview" | "offer" | "rejected" | "bench";
      business_line: "products" | "services" | "staffing";
      job_type: "full_time" | "contract" | "deployment";
      lead_form_type: "demo" | "project" | "staffing" | "contact" | "newsletter";
      lead_status: "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";
      product_status: "live" | "pilot" | "coming_soon";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_status: ["new", "screening", "interview", "offer", "rejected", "bench"],
      business_line: ["products", "services", "staffing"],
      job_type: ["full_time", "contract", "deployment"],
      lead_form_type: ["demo", "project", "staffing", "contact", "newsletter"],
      lead_status: ["new", "contacted", "qualified", "proposal", "won", "lost"],
      product_status: ["live", "pilot", "coming_soon"],
    },
  },
} as const;
