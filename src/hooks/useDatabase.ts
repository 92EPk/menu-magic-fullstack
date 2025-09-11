import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Types for database entities
export interface Category {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
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
  sort_order: number;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  selected_options: Record<string, any>;
  total_price: number;
  created_at: string;
  menu_item?: MenuItem;
}

// Hook for categories
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      setCategories(data || []);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error loading categories';
      setError(message);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert(categoryData)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Category Added",
        description: "New category has been added successfully",
      });
      
      await fetchCategories();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error adding category';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Category Updated",
        description: "Category has been updated successfully",
      });
      
      await fetchCategories();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating category';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Category Deleted",
        description: "Category has been deleted successfully",
      });
      
      await fetchCategories();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error deleting category';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};

// Hook for menu items
export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('is_available', true)
        .order('sort_order');

      if (error) throw error;
      setMenuItems(data || []);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error loading menu items';
      setError(message);
      console.error('Error fetching menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  const addMenuItem = async (itemData: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert(itemData)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Menu Item Added",
        description: "New menu item has been added successfully",
      });
      
      await fetchMenuItems();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error adding menu item';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Menu Item Updated",
        description: "Menu item has been updated successfully",
      });
      
      await fetchMenuItems();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating menu item';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Menu Item Deleted",
        description: "Menu item has been deleted successfully",
      });
      
      await fetchMenuItems();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error deleting menu item';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return {
    menuItems,
    loading,
    error,
    fetchMenuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
  };
};

// Hook for orders
export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            menu_item:menu_items(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders((data || []) as Order[]);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error loading orders';
      setError(message);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: {
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    total_amount: number;
    order_items: {
      menu_item_id: string;
      quantity: number;
      unit_price: number;
      selected_options: Record<string, any>;
      total_price: number;
    }[];
  }) => {
    try {
      // Create order
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
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = orderData.order_items.map(item => ({
        ...item,
        order_id: order.id
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast({
        title: "Order Created",
        description: `Order #${order.id.slice(0, 8)} has been created successfully`,
      });

      await fetchOrders();
      return order;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error creating order';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Order Status Updated",
        description: `Order status has been updated to ${status}`,
      });
      
      await fetchOrders();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating order status';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    updateOrderStatus,
  };
};