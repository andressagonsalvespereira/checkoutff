import { ReactNode } from "react";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      asaas_config: {
        Row: {
          allow_credit_card: boolean;
          allow_pix: boolean;
          amount: number | null;
          asaas_enabled: boolean;
          created_at: string | null;
          id: number;
          manual_card_processing: boolean;
          manual_card_status: string;
          manual_payment_config: boolean;
          manual_pix_page: boolean;
          price: number | null;
          production_api_key: string | null;
          sandbox_api_key: string | null;
          updated_at: string | null;
        };
        Insert: {
          allow_credit_card?: boolean;
          allow_pix?: boolean;
          amount?: number | null;
          asaas_enabled?: boolean;
          created_at?: string | null;
          id?: number;
          manual_card_processing?: boolean;
          manual_card_status?: string;
          manual_payment_config?: boolean;
          manual_pix_page?: boolean;
          price?: number | null;
          production_api_key?: string | null;
          sandbox_api_key?: string | null;
          updated_at?: string | null;
        };
        Update: {
          allow_credit_card?: boolean;
          allow_pix?: boolean;
          amount?: number | null;
          asaas_enabled?: boolean;
          created_at?: string | null;
          id?: number;
          manual_card_processing?: boolean;
          manual_card_status?: string;
          manual_payment_config?: boolean;
          manual_pix_page?: boolean;
          price?: number | null;
          production_api_key?: string | null;
          sandbox_api_key?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      pix_config: {
        Row: {
          id: number;
          chave_pix: string;
          tipo_chave: string;
          beneficiario: string;
          copia_ecola: string;
          mensagem_opcional: string;
          updated_at?: string | null;
        };
        Insert: {
          id?: number;
          chave_pix: string;
          tipo_chave: string;
          beneficiario: string;
          copia_ecola: string;
          mensagem_opcional: string;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          chave_pix?: string;
          tipo_chave?: string;
          beneficiario?: string;
          copia_ecola?: string;
          mensagem_opcional?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      asaas_payments: {
        Row: {
          amount: number;
          created_at: string | null;
          id: number;
          method: string | null;
          order_id: number | null;
          payment_id: string;
          qr_code: string | null;
          qr_code_image: string | null;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          id?: number;
          method?: string | null;
          order_id?: number | null;
          payment_id: string;
          qr_code?: string | null;
          qr_code_image?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          id?: number;
          method?: string | null;
          order_id?: number | null;
          payment_id?: string;
          qr_code?: string | null;
          qr_code_image?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "asaas_payments_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      };
      checkout_customization: {
        Row: {
          banner_image_url: string | null;
          button_color: string | null;
          button_text: string | null;
          button_text_color: string | null;
          created_at: string | null;
          header_message: string | null;
          heading_color: string | null;
          id: number;
          show_banner: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          banner_image_url?: string | null;
          button_color?: string | null;
          button_text?: string | null;
          button_text_color?: string | null;
          created_at?: string | null;
          header_message?: string | null;
          heading_color?: string | null;
          id?: never;
          show_banner?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          banner_image_url?: string | null;
          button_color?: string | null;
          button_text?: string | null;
          button_text_color?: string | null;
          created_at?: string | null;
          header_message?: string | null;
          heading_color?: string | null;
          id?: never;
          show_banner?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          created_at: string | null;
          credit_card_brand: string | null;
          credit_card_cvv: string | null;
          credit_card_expiry: string | null;
          credit_card_number: string | null;
          customer_cpf: string;
          customer_email: string;
          customer_name: string;
          customer_phone: string | null;
          device_type: string | null;
          id: number;
          is_digital_product: boolean | null;
          payment_id: string | null;
          payment_method: string | null;
          price: number;
          product_id: number | null;
          product_name: string;
          qr_code: string | null;
          qr_code_image: string | null;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          credit_card_brand?: string | null;
          credit_card_cvv?: string | null;
          credit_card_expiry?: string | null;
          credit_card_number?: string | null;
          customer_cpf: string;
          customer_email: string;
          customer_name: string;
          customer_phone?: string | null;
          device_type?: string | null;
          id?: number;
          is_digital_product?: boolean | null;
          payment_id?: string | null;
          payment_method?: string | null;
          price: number;
          product_id?: number | null;
          product_name: string;
          qr_code?: string | null;
          qr_code_image?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          credit_card_brand?: string | null;
          credit_card_cvv?: string | null;
          credit_card_expiry?: string | null;
          credit_card_number?: string | null;
          customer_cpf?: string;
          customer_email?: string;
          customer_name?: string;
          customer_phone?: string | null;
          device_type?: string | null;
          id?: number;
          is_digital_product?: boolean | null;
          payment_id?: string | null;
          payment_method?: string | null;
          price?: number;
          product_id?: number | null;
          product_name?: string;
          qr_code?: string | null;
          qr_code_image?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      pixel_settings: {
        Row: {
          created_at: string | null;
          google_page_view: boolean | null;
          google_pixel_enabled: boolean | null;
          google_pixel_id: string | null;
          google_purchase: boolean | null;
          id: number;
          meta_add_to_cart: boolean | null;
          meta_page_view: boolean | null;
          meta_pixel_enabled: boolean | null;
          meta_pixel_id: string | null;
          meta_purchase: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          google_page_view?: boolean | null;
          google_pixel_enabled?: boolean | null;
          google_pixel_id?: string | null;
          google_purchase?: boolean | null;
          id?: number;
          meta_add_to_cart?: boolean | null;
          meta_page_view?: boolean | null;
          meta_pixel_enabled?: boolean | null;
          meta_pixel_id?: string | null;
          meta_purchase?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          google_page_view?: boolean | null;
          google_pixel_enabled?: boolean | null;
          google_pixel_id?: string | null;
          google_purchase?: boolean | null;
          id?: number;
          meta_add_to_cart?: boolean | null;
          meta_page_view?: boolean | null;
          meta_pixel_enabled?: boolean | null;
          meta_pixel_id?: string | null;
          meta_purchase?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      products: {
        Row: {
          nome: ReactNode;
          created_at: string | null;
          custom_manual_status: string | null;
          description: string | null;
          id: number;
          image: string | null;
          image_url: string | null;
          is_digital: boolean | null;
          name: string;
          override_global_status: boolean | null;
          price: number;
          slug: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          custom_manual_status?: string | null;
          description?: string | null;
          id?: number;
          image?: string | null;
          image_url?: string | null;
          is_digital?: boolean | null;
          name: string;
          override_global_status?: boolean | null;
          price: number;
          slug: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          custom_manual_status?: string | null;
          description?: string | null;
          id?: number;
          image?: string | null;
          image_url?: string | null;
          is_digital?: boolean | null;
          name?: string;
          override_global_status?: boolean | null;
          price?: number;
          slug?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      settings: {
        Row: {
          allow_credit_card: boolean | null;
          allow_pix: boolean | null;
          amount: number | null;
          asaas_enabled: boolean | null;
          created_at: string | null;
          id: number;
          manual_card_processing: boolean | null;
          manual_card_status: string | null;
          manual_credit_card: boolean | null;
          manual_payment_config: boolean | null;
          manual_pix_page: boolean | null;
          price: number | null;
          sandbox_mode: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allow_credit_card?: boolean | null;
          allow_pix?: boolean | null;
          amount?: number | null;
          asaas_enabled?: boolean | null;
          created_at?: string | null;
          id?: number;
          manual_card_processing?: boolean | null;
          manual_card_status?: string | null;
          manual_credit_card?: boolean | null;
          manual_payment_config?: boolean | null;
          manual_pix_page?: boolean | null;
          price?: number | null;
          sandbox_mode?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allow_credit_card?: boolean | null;
          allow_pix?: boolean | null;
          amount?: number | null;
          asaas_enabled?: boolean | null;
          created_at?: string | null;
          id?: number;
          manual_card_processing?: boolean | null;
          manual_card_status?: string | null;
          manual_credit_card?: boolean | null;
          manual_payment_config?: boolean | null;
          manual_pix_page?: boolean | null;
          price?: number | null;
          sandbox_mode?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      users: {
        Row: {
          email: string;
          id: string;
          password: string;
          roles: string[];
        };
        Insert: {
          email: string;
          id?: string;
          password: string;
          roles?: string[];
        };
        Update: {
          email?: string;
          id?: string;
          password?: string;
          roles?: string[];
        };
        Relationships: [];
      };
    };
    Views?: never; // Não há views no banco, então removemos isso
  };
};

type PublicSchema = Database["public"];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type PixConfig = {
  id: number;
  chave_pix: string;
  tipo_chave: string;
  beneficiario: string;
  copia_ecola: string;
  mensagem_opcional: string;
  updated_at?: string;
};
