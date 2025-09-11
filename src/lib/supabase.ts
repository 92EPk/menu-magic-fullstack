import { supabase } from '@/integrations/supabase/client'

// Database types
export interface MenuItem {
  id: number
  name_ar: string
  name_en: string
  description_ar: string
  description_en: string
  price: number
  discount_price?: number
  image_url: string
  category_id: string
  rating: number
  prep_time: string
  is_spicy: boolean
  is_offer: boolean
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: number
  customer_name: string
  customer_phone: string
  customer_address: string
  total_amount: number
  order_items: OrderItem[]
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  menu_item_id: number
  quantity: number
  unit_price: number
  selected_options: Record<string, string>
  total_price: number
}

// Database functions
export const menuService = {
  // Get all menu items
  async getMenuItems() {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_available', true)
      .order('id')
    
    if (error) throw error
    return data
  },

  // Get menu items by category
  async getMenuItemsByCategory(categoryId: string) {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_available', true)
      .order('id')
    
    if (error) throw error
    return data
  }
}

export const orderService = {
  // Create a new order
  async createOrder(orderData: {
    customer_name: string
    customer_phone: string
    customer_address: string
    total_amount: number
    order_items: {
      menu_item_id: number
      quantity: number
      unit_price: number
      selected_options: Record<string, string>
      total_price: number
    }[]
  }) {
    // Start transaction
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        customer_address: orderData.customer_address,
        total_amount: orderData.total_amount,
        status: 'pending'
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Insert order items
    const orderItems = orderData.order_items.map(item => ({
      ...item,
      menu_item_id: String(item.menu_item_id),
      order_id: order.id
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    return order
  },

  // Get all orders
  async getOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_items (*)
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: Order['status']) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}