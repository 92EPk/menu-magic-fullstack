// Simplified restaurant types - much cleaner than before!

export interface SimpleCategory {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
}

export interface CustomizationOption {
  id: string;
  name_ar: string;
  name_en: string;
  price: number;
  type: 'size' | 'addon' | 'sauce' | 'drink';
}

export interface SimpleMenuItem {
  id: string;
  category_id: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  price: number;
  discount_price?: number;
  image_url?: string;
  rating: number;
  prep_time: string;
  is_spicy: boolean;
  is_offer: boolean;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
  customization_options: CustomizationOption[];
  category_info: {
    name_ar: string;
    name_en: string;
    description_ar?: string;
    description_en?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface SimpleOffer {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar?: string;
  description_en?: string;
  image_url?: string;
  discount_percentage?: number;
  discount_amount?: number;
  valid_from: string;
  valid_until?: string;
  is_active: boolean;
  sort_order: number;
}

export interface SimpleOrder {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  notes?: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
  order_items?: SimpleOrderItem[];
}

export interface SimpleOrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  selected_options: Record<string, any>;
  total_price: number;
  created_at: string;
  menu_item?: SimpleMenuItem;
}

export interface CartItem {
  id: string;
  name: string;
  name_ar: string;
  price: number;
  quantity: number;
  image_url?: string;
  selectedOptions: Record<string, any>;
  customizationOptions: CustomizationOption[];
}