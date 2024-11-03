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
      games: {
        Row: {
          coverUrl: string
          createdAt: string
          description: string
          id: number
          name: string
          platforms: string[]
          psnId: string[] | null
          rating: number
          steamId: string[] | null
          updatedAt: string
        }
        Insert: {
          coverUrl: string
          createdAt?: string
          description: string
          id?: number
          name: string
          platforms: string[]
          psnId?: string[] | null
          rating?: number
          steamId?: string[] | null
          updatedAt?: string
        }
        Update: {
          coverUrl?: string
          createdAt?: string
          description?: string
          id?: number
          name?: string
          platforms?: string[]
          psnId?: string[] | null
          rating?: number
          steamId?: string[] | null
          updatedAt?: string
        }
        Relationships: []
      }
      playlists: {
        Row: {
          createdAt: string
          id: number
          name: string
          userId: string | null
        }
        Insert: {
          createdAt?: string
          id?: number
          name: string
          userId?: string | null
        }
        Update: {
          createdAt?: string
          id?: number
          name?: string
          userId?: string | null
        }
        Relationships: []
      }
      profiles_steam: {
        Row: {
          avatar: string
          createdAt: string
          id: string
          personastate: number
          profilestate: number
          profileUrl: string
          realname: string | null
          syncedAt: string
          userId: string
          username: string
        }
        Insert: {
          avatar: string
          createdAt?: string
          id: string
          personastate: number
          profilestate: number
          profileUrl: string
          realname?: string | null
          syncedAt?: string
          userId?: string
          username: string
        }
        Update: {
          avatar?: string
          createdAt?: string
          id?: string
          personastate?: number
          profilestate?: number
          profileUrl?: string
          realname?: string | null
          syncedAt?: string
          userId?: string
          username?: string
        }
        Relationships: []
      }
      psn_profiles: {
        Row: {
          aboutMe: string | null
          accountId: string | null
          avatarUrl: string | null
          isOfficiallyVerified: boolean | null
          isPlus: boolean | null
          userId: string
          username: string
        }
        Insert: {
          aboutMe?: string | null
          accountId?: string | null
          avatarUrl?: string | null
          isOfficiallyVerified?: boolean | null
          isPlus?: boolean | null
          userId?: string
          username: string
        }
        Update: {
          aboutMe?: string | null
          accountId?: string | null
          avatarUrl?: string | null
          isOfficiallyVerified?: boolean | null
          isPlus?: boolean | null
          userId?: string
          username?: string
        }
        Relationships: []
      }
      user_games: {
        Row: {
          createdAt: string
          externalId: string
          gameId: number
          lastPlayed: string | null
          platform: string
          playTime: number | null
          status: string
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          externalId: string
          gameId?: number
          lastPlayed?: string | null
          platform: string
          playTime?: number | null
          status: string
          updatedAt?: string
          userId?: string
        }
        Update: {
          createdAt?: string
          externalId?: string
          gameId?: number
          lastPlayed?: string | null
          platform?: string
          playTime?: number | null
          status?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_games_gameId_fkey"
            columns: ["gameId"]
            isOneToOne: false
            referencedRelation: "games"
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
