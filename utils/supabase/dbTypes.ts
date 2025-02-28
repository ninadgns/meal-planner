export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      categories: {
        Row: {
          category_id: string
          category_name: string
          description: string | null
        }
        Insert: {
          category_id: string
          category_name: string
          description?: string | null
        }
        Update: {
          category_id?: string
          category_name?: string
          description?: string | null
        }
        Relationships: []
      }
      diets: {
        Row: {
          description: string | null
          diet_id: string
          diet_name: string
          diet_type: number
        }
        Insert: {
          description?: string | null
          diet_id: string
          diet_name: string
          diet_type: number
        }
        Update: {
          description?: string | null
          diet_id?: string
          diet_name?: string
          diet_type?: number
        }
        Relationships: []
      }
      diets_type_1: {
        Row: {
          diet_id: string
          per_meal_calorie_max: number | null
          per_meal_calorie_min: number | null
          per_meal_carbs_max: number | null
          per_meal_carbs_min: number | null
          per_meal_fat_max: number | null
          per_meal_fat_min: number | null
          per_meal_protein_max: number | null
          per_meal_protein_min: number | null
        }
        Insert: {
          diet_id: string
          per_meal_calorie_max?: number | null
          per_meal_calorie_min?: number | null
          per_meal_carbs_max?: number | null
          per_meal_carbs_min?: number | null
          per_meal_fat_max?: number | null
          per_meal_fat_min?: number | null
          per_meal_protein_max?: number | null
          per_meal_protein_min?: number | null
        }
        Update: {
          diet_id?: string
          per_meal_calorie_max?: number | null
          per_meal_calorie_min?: number | null
          per_meal_carbs_max?: number | null
          per_meal_carbs_min?: number | null
          per_meal_fat_max?: number | null
          per_meal_fat_min?: number | null
          per_meal_protein_max?: number | null
          per_meal_protein_min?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "diets_type_1_diet_id_fkey"
            columns: ["diet_id"]
            isOneToOne: true
            referencedRelation: "diet_recipe_applicability_type1"
            referencedColumns: ["diet_id"]
          },
          {
            foreignKeyName: "diets_type_1_diet_id_fkey"
            columns: ["diet_id"]
            isOneToOne: true
            referencedRelation: "diet_recipe_applicability_type2"
            referencedColumns: ["diet_id"]
          },
          {
            foreignKeyName: "diets_type_1_diet_id_fkey"
            columns: ["diet_id"]
            isOneToOne: true
            referencedRelation: "diets"
            referencedColumns: ["diet_id"]
          },
        ]
      }
      diets_type_2: {
        Row: {
          category_id: string
          diet_id: string
        }
        Insert: {
          category_id: string
          diet_id: string
        }
        Update: {
          category_id?: string
          diet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diets_type_2_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "diets_type_2_diet_id_fkey"
            columns: ["diet_id"]
            isOneToOne: false
            referencedRelation: "diet_recipe_applicability_type1"
            referencedColumns: ["diet_id"]
          },
          {
            foreignKeyName: "diets_type_2_diet_id_fkey"
            columns: ["diet_id"]
            isOneToOne: false
            referencedRelation: "diet_recipe_applicability_type2"
            referencedColumns: ["diet_id"]
          },
          {
            foreignKeyName: "diets_type_2_diet_id_fkey"
            columns: ["diet_id"]
            isOneToOne: false
            referencedRelation: "diets"
            referencedColumns: ["diet_id"]
          },
        ]
      }
      ingredients: {
        Row: {
          category_id: string | null
          ingredient_id: string
          name: string
        }
        Insert: {
          category_id?: string | null
          ingredient_id: string
          name: string
        }
        Update: {
          category_id?: string | null
          ingredient_id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "ingredients_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
        ]
      }
      meal_plan_recipes: {
        Row: {
          meal_plan_id: string
          recipe_id: string
          servings: number | null
        }
        Insert: {
          meal_plan_id: string
          recipe_id: string
          servings?: number | null
        }
        Update: {
          meal_plan_id?: string
          recipe_id?: string
          servings?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_plan_recipes_meal_plan_id_fkey"
            columns: ["meal_plan_id"]
            isOneToOne: false
            referencedRelation: "meal_plans"
            referencedColumns: ["meal_plan_id"]
          },
          {
            foreignKeyName: "meal_plan_recipes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "diet_recipe_applicability_type1"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "meal_plan_recipes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "diet_recipe_applicability_type2"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "meal_plan_recipes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["recipe_id"]
          },
        ]
      }
      meal_plans: {
        Row: {
          meal_plan_id: string
          user_id: string
        }
        Insert: {
          meal_plan_id: string
          user_id: string
        }
        Update: {
          meal_plan_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      recipe_ingredients: {
        Row: {
          ingredient_id: string
          quantity_per_serving: number
          recipe_id: string
          unit: string
        }
        Insert: {
          ingredient_id: string
          quantity_per_serving: number
          recipe_id: string
          unit: string
        }
        Update: {
          ingredient_id?: string
          quantity_per_serving?: number
          recipe_id?: string
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["ingredient_id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "diet_recipe_applicability_type1"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "diet_recipe_applicability_type2"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["recipe_id"]
          },
        ]
      }
      recipes: {
        Row: {
          calories_per_serving: number
          carbs_per_serving: number
          cooking_time: number 
          description: string | null
          fat_per_serving: number
          protein_per_serving: number
          recipe_id: string
          serving_size: string
          title: string
        }
        Insert: {
          calories_per_serving: number
          carbs_per_serving: number
          cooking_time?: number 
          description?: string | null
          fat_per_serving: number
          protein_per_serving: number
          recipe_id: string
          serving_size: string
          title: string
        }
        Update: {
          calories_per_serving?: number
          carbs_per_serving?: number
          cooking_time?: number
          description?: string | null
          fat_per_serving?: number
          protein_per_serving?: number
          recipe_id?: string
          serving_size?: string
          title?: string
        }
        Relationships: []
      }
      user_allergies: {
        Row: {
          ingredient_id: string
          severity: string | null
          user_id: string
        }
        Insert: {
          ingredient_id: string
          severity?: string | null
          user_id: string
        }
        Update: {
          ingredient_id?: string
          severity?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_allergies_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["ingredient_id"]
          },
          {
            foreignKeyName: "user_allergies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_diets: {
        Row: {
          diet_id: string
          user_id: string
        }
        Insert: {
          diet_id: string
          user_id: string
        }
        Update: {
          diet_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_diets_diet_id_fkey"
            columns: ["diet_id"]
            isOneToOne: false
            referencedRelation: "diet_recipe_applicability_type1"
            referencedColumns: ["diet_id"]
          },
          {
            foreignKeyName: "user_diets_diet_id_fkey"
            columns: ["diet_id"]
            isOneToOne: false
            referencedRelation: "diet_recipe_applicability_type2"
            referencedColumns: ["diet_id"]
          },
          {
            foreignKeyName: "user_diets_diet_id_fkey"
            columns: ["diet_id"]
            isOneToOne: false
            referencedRelation: "diets"
            referencedColumns: ["diet_id"]
          },
          {
            foreignKeyName: "user_diets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      diet_recipe_applicability_type1: {
        Row: {
          diet_id: string | null
          diet_name: string | null
          recipe_id: string | null
          title: string | null
        }
        Relationships: []
      }
      diet_recipe_applicability_type2: {
        Row: {
          diet_id: string | null
          diet_name: string | null
          recipe_id: string | null
          title: string | null
        }
        Relationships: []
      }
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
