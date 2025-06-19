export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          new_values: Json | null
          old_values: Json | null
          record_id: string
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id: string
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      match_statistics: {
        Row: {
          aces: number | null
          break_points_total: number | null
          break_points_won: number | null
          created_at: string | null
          double_faults: number | null
          id: string
          match_id: string | null
          net_points_total: number | null
          net_points_won: number | null
          player_id: string | null
          unforced_errors: number | null
          winners: number | null
        }
        Insert: {
          aces?: number | null
          break_points_total?: number | null
          break_points_won?: number | null
          created_at?: string | null
          double_faults?: number | null
          id?: string
          match_id?: string | null
          net_points_total?: number | null
          net_points_won?: number | null
          player_id?: string | null
          unforced_errors?: number | null
          winners?: number | null
        }
        Update: {
          aces?: number | null
          break_points_total?: number | null
          break_points_won?: number | null
          created_at?: string | null
          double_faults?: number | null
          id?: string
          match_id?: string | null
          net_points_total?: number | null
          net_points_won?: number | null
          player_id?: string | null
          unforced_errors?: number | null
          winners?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_match_statistics_match"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_match_statistics_player"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_statistics_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_statistics_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          actual_end_time: string | null
          actual_start_time: string | null
          court_number: number | null
          created_at: string | null
          id: string
          match_group: string | null
          match_number: number
          notes: string | null
          player1_id: string | null
          player1_partner_id: string | null
          player2_id: string | null
          player2_partner_id: string | null
          round: number
          scheduled_time: string | null
          score: Json | null
          status: Database["public"]["Enums"]["match_status"] | null
          tournament_id: string | null
          updated_at: string | null
          winner_team: number | null
        }
        Insert: {
          actual_end_time?: string | null
          actual_start_time?: string | null
          court_number?: number | null
          created_at?: string | null
          id?: string
          match_group?: string | null
          match_number: number
          notes?: string | null
          player1_id?: string | null
          player1_partner_id?: string | null
          player2_id?: string | null
          player2_partner_id?: string | null
          round: number
          scheduled_time?: string | null
          score?: Json | null
          status?: Database["public"]["Enums"]["match_status"] | null
          tournament_id?: string | null
          updated_at?: string | null
          winner_team?: number | null
        }
        Update: {
          actual_end_time?: string | null
          actual_start_time?: string | null
          court_number?: number | null
          created_at?: string | null
          id?: string
          match_group?: string | null
          match_number?: number
          notes?: string | null
          player1_id?: string | null
          player1_partner_id?: string | null
          player2_id?: string | null
          player2_partner_id?: string | null
          round?: number
          scheduled_time?: string | null
          score?: Json | null
          status?: Database["public"]["Enums"]["match_status"] | null
          tournament_id?: string | null
          updated_at?: string | null
          winner_team?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_matches_player1"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_matches_player1_partner"
            columns: ["player1_partner_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_matches_player2"
            columns: ["player2_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_matches_player2_partner"
            columns: ["player2_partner_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_matches_tournament"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player1_id_fkey"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player1_partner_id_fkey"
            columns: ["player1_partner_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player2_id_fkey"
            columns: ["player2_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player2_partner_id_fkey"
            columns: ["player2_partner_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      player_round_stats: {
        Row: {
          created_at: string | null
          games_won: number
          id: string
          matches_played: number
          player_id: string
          round: number
          specials_earned: number
          tournament_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          games_won?: number
          id?: string
          matches_played?: number
          player_id: string
          round: number
          specials_earned?: number
          tournament_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          games_won?: number
          id?: string
          matches_played?: number
          player_id?: string
          round?: number
          specials_earned?: number
          tournament_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      players: {
        Row: {
          career_promotions: number | null
          career_relegations: number | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          player_group: string
          profile_id: string | null
          ranking_points: number | null
          skill_level: number | null
          status: Database["public"]["Enums"]["player_status"] | null
          total_games_lost: number | null
          total_games_won: number | null
          total_matches_played: number | null
          total_matches_won: number | null
          total_sets_lost: number | null
          total_sets_won: number | null
          updated_at: string | null
        }
        Insert: {
          career_promotions?: number | null
          career_relegations?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          player_group?: string
          profile_id?: string | null
          ranking_points?: number | null
          skill_level?: number | null
          status?: Database["public"]["Enums"]["player_status"] | null
          total_games_lost?: number | null
          total_games_won?: number | null
          total_matches_played?: number | null
          total_matches_won?: number | null
          total_sets_lost?: number | null
          total_sets_won?: number | null
          updated_at?: string | null
        }
        Update: {
          career_promotions?: number | null
          career_relegations?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          player_group?: string
          profile_id?: string | null
          ranking_points?: number | null
          skill_level?: number | null
          status?: Database["public"]["Enums"]["player_status"] | null
          total_games_lost?: number | null
          total_games_won?: number | null
          total_matches_played?: number | null
          total_matches_won?: number | null
          total_sets_lost?: number | null
          total_sets_won?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "players_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          is_active?: boolean | null
          last_name?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      rankings: {
        Row: {
          games_difference: number | null
          games_lost: number | null
          games_won: number | null
          id: string
          matches_played: number | null
          matches_won: number | null
          player_id: string | null
          points: number | null
          position: number | null
          sets_lost: number | null
          sets_won: number | null
          tournament_id: string | null
          updated_at: string | null
        }
        Insert: {
          games_difference?: number | null
          games_lost?: number | null
          games_won?: number | null
          id?: string
          matches_played?: number | null
          matches_won?: number | null
          player_id?: string | null
          points?: number | null
          position?: number | null
          sets_lost?: number | null
          sets_won?: number | null
          tournament_id?: string | null
          updated_at?: string | null
        }
        Update: {
          games_difference?: number | null
          games_lost?: number | null
          games_won?: number | null
          id?: string
          matches_played?: number | null
          matches_won?: number | null
          player_id?: string | null
          points?: number | null
          position?: number | null
          sets_lost?: number | null
          sets_won?: number | null
          tournament_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_rankings_player"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_rankings_tournament"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rankings_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rankings_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      sets: {
        Row: {
          created_at: string | null
          id: string
          is_completed: boolean | null
          is_tie_break: boolean | null
          match_id: string | null
          set_number: number
          team1_games: number | null
          team1_tie_break_points: number | null
          team2_games: number | null
          team2_tie_break_points: number | null
          winner_team: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          is_tie_break?: boolean | null
          match_id?: string | null
          set_number: number
          team1_games?: number | null
          team1_tie_break_points?: number | null
          team2_games?: number | null
          team2_tie_break_points?: number | null
          winner_team?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          is_tie_break?: boolean | null
          match_id?: string | null
          set_number?: number
          team1_games?: number | null
          team1_tie_break_points?: number | null
          team2_games?: number | null
          team2_tie_break_points?: number | null
          winner_team?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_sets_match"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sets_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      specials: {
        Row: {
          configuration: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          type: Database["public"]["Enums"]["special_type"]
          updated_at: string | null
        }
        Insert: {
          configuration?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          type: Database["public"]["Enums"]["special_type"]
          updated_at?: string | null
        }
        Update: {
          configuration?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: Database["public"]["Enums"]["special_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "specials_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_court_settings: {
        Row: {
          court_color: string | null
          court_name: string
          court_number: number
          created_at: string | null
          id: string
          tournament_id: string
          updated_at: string | null
        }
        Insert: {
          court_color?: string | null
          court_name: string
          court_number: number
          created_at?: string | null
          id?: string
          tournament_id: string
          updated_at?: string | null
        }
        Update: {
          court_color?: string | null
          court_name?: string
          court_number?: number
          created_at?: string | null
          id?: string
          tournament_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_court_settings_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_players: {
        Row: {
          id: string
          player_id: string | null
          registration_date: string | null
          seed: number | null
          tournament_id: string | null
        }
        Insert: {
          id?: string
          player_id?: string | null
          registration_date?: string | null
          seed?: number | null
          tournament_id?: string | null
        }
        Update: {
          id?: string
          player_id?: string | null
          registration_date?: string | null
          seed?: number | null
          tournament_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_tournament_players_player"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_tournament_players_tournament"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_players_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_specials: {
        Row: {
          applied_from_round: number | null
          id: string
          is_active: boolean | null
          special_id: string | null
          tournament_id: string | null
        }
        Insert: {
          applied_from_round?: number | null
          id?: string
          is_active?: boolean | null
          special_id?: string | null
          tournament_id?: string | null
        }
        Update: {
          applied_from_round?: number | null
          id?: string
          is_active?: boolean | null
          special_id?: string | null
          tournament_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_tournament_specials_special"
            columns: ["special_id"]
            isOneToOne: false
            referencedRelation: "specials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_tournament_specials_tournament"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_specials_special_id_fkey"
            columns: ["special_id"]
            isOneToOne: false
            referencedRelation: "specials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_specials_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          created_at: string | null
          created_by: string | null
          current_round: number | null
          description: string | null
          end_date: string | null
          id: string
          max_players: number | null
          name: string
          scoring_system: Json | null
          special_rules: Json | null
          start_date: string | null
          status: Database["public"]["Enums"]["tournament_status"] | null
          total_rounds: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          current_round?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          max_players?: number | null
          name: string
          scoring_system?: Json | null
          special_rules?: Json | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["tournament_status"] | null
          total_rounds?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          current_round?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          max_players?: number | null
          name?: string
          scoring_system?: Json | null
          special_rules?: Json | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["tournament_status"] | null
          total_rounds?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role: string
          user_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      match_status: "pending" | "in_progress" | "completed" | "cancelled"
      player_status: "active" | "inactive" | "suspended"
      special_type:
        | "golden_point"
        | "super_tie_break"
        | "no_advantage"
        | "short_sets"
      tournament_status: "draft" | "active" | "completed" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      match_status: ["pending", "in_progress", "completed", "cancelled"],
      player_status: ["active", "inactive", "suspended"],
      special_type: [
        "golden_point",
        "super_tie_break",
        "no_advantage",
        "short_sets",
      ],
      tournament_status: ["draft", "active", "completed", "cancelled"],
    },
  },
} as const
