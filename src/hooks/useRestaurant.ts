import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { 
  SimpleCategory, 
  SimpleMenuItem, 
  SimpleOffer, 
  SimpleOrder,
  CustomizationOption
} from '@/types/restaurant';

// Single simplified hook for all restaurant data management
export const useRestaurant = () => {
  const [categories, setCategories] = useState<SimpleCategory[]>([]);
  const [menuItems, setMenuItems] = useState<SimpleMenuItem[]>([]);
  const [offers, setOffers] = useState<SimpleOffer[]>([]);
  const [orders, setOrders] = useState<SimpleOrder[]>([]);
  const [loading, setLoading] = useState(false);

  // ===== CATEGORIES =====
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast.error('Error loading categories: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (categoryData: Partial<SimpleCategory>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert(categoryData as any)
        .select()
        .single();

      if (error) throw error;
      setCategories(prev => [...prev, data as SimpleCategory]);
      toast.success('Category added successfully');
      return { data, error: null };
    } catch (error: any) {
      toast.error('Error adding category: ' + error.message);
      return { data: null, error };
    }
  };

  const updateCategory = async (id: string, updates: Partial<SimpleCategory>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, ...data } : cat));
      toast.success('Category updated successfully');
      return { data, error: null };
    } catch (error: any) {
      toast.error('Error updating category: ' + error.message);
      return { data: null, error };
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCategories(prev => prev.filter(cat => cat.id !== id));
      toast.success('Category deleted successfully');
      return { error: null };
    } catch (error: any) {
      toast.error('Error deleting category: ' + error.message);
      return { error };
    }
  };

  // ===== MENU ITEMS =====
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          categories(name_ar, name_en, description_ar, description_en)
        `)
        .order('sort_order');

      if (error) throw error;
      
      // Transform data to match our simplified structure
      const transformedData: SimpleMenuItem[] = (data || []).map(item => ({
        ...item,
        customization_options: Array.isArray(item.customization_options) 
          ? item.customization_options as unknown as CustomizationOption[]
          : [],
        category_info: (item.category_info && typeof item.category_info === 'object') 
          ? item.category_info as any
          : {
              name_ar: item.categories?.name_ar || '',
              name_en: item.categories?.name_en || '',
              description_ar: item.categories?.description_ar,
              description_en: item.categories?.description_en,
            }
      }));

      setMenuItems(transformedData);
    } catch (error: any) {
      toast.error('Error loading menu items: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addMenuItem = async (itemData: Partial<SimpleMenuItem>) => {
    try {
      // Update category_info from the current category
      const category = categories.find(c => c.id === itemData.category_id);
      const finalData = {
        ...itemData,
        category_info: category ? {
          name_ar: category.name_ar,
          name_en: category.name_en,
          description_ar: category.description_ar,
          description_en: category.description_en,
        } : {},
        customization_options: itemData.customization_options || []
      };

      const { data, error } = await supabase
        .from('menu_items')
        .insert(finalData as any)
        .select()
        .single();

      if (error) throw error;
      
      const transformedData: SimpleMenuItem = {
        ...data,
        customization_options: Array.isArray(data.customization_options) 
          ? data.customization_options as unknown as CustomizationOption[]
          : [],
        category_info: (data.category_info && typeof data.category_info === 'object') 
          ? data.category_info as any
          : {}
      };
      
      setMenuItems(prev => [...prev, transformedData]);
      toast.success('Menu item added successfully');
      return { data: transformedData, error: null };
    } catch (error: any) {
      toast.error('Error adding menu item: ' + error.message);
      return { data: null, error };
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<SimpleMenuItem>) => {
    try {
      const { data, error } = await supabase.rpc('update_menu_item_simple', {
        item_id: id,
        item_data: JSON.parse(JSON.stringify(updates)),
        customization_data: JSON.parse(JSON.stringify(updates.customization_options || []))
      });

      if (error) throw error;
      
      // Refetch the updated item
      const { data: updatedItem, error: fetchError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', id)
        .single();
        
      if (fetchError) throw fetchError;
      
      setMenuItems(prev => prev.map(item => 
        item.id === id ? {
          ...updatedItem,
          customization_options: Array.isArray(updatedItem.customization_options) 
            ? updatedItem.customization_options as unknown as CustomizationOption[]
            : [],
          category_info: (updatedItem.category_info && typeof updatedItem.category_info === 'object') 
            ? updatedItem.category_info as any
            : {}
        } : item
      ));
      
      toast.success('Menu item updated successfully');
      return { data: updatedItem, error: null };
    } catch (error: any) {
      toast.error('Error updating menu item: ' + error.message);
      return { data: null, error };
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMenuItems(prev => prev.filter(item => item.id !== id));
      toast.success('Menu item deleted successfully');
      return { error: null };
    } catch (error: any) {
      toast.error('Error deleting menu item: ' + error.message);
      return { error };
    }
  };

  // ===== OFFERS =====
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('special_offers')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      setOffers(data || []);
    } catch (error: any) {
      toast.error('Error loading offers: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addOffer = async (offerData: Partial<SimpleOffer>) => {
    try {
      const { data, error } = await supabase
        .from('special_offers')
        .insert(offerData as any)
        .select()
        .single();

      if (error) throw error;
      setOffers(prev => [...prev, data as SimpleOffer]);
      toast.success('Offer added successfully');
      return { data, error: null };
    } catch (error: any) {
      toast.error('Error adding offer: ' + error.message);
      return { data: null, error };
    }
  };

  const updateOffer = async (id: string, updates: Partial<SimpleOffer>) => {
    try {
      const { data, error } = await supabase
        .from('special_offers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setOffers(prev => prev.map(offer => offer.id === id ? { ...offer, ...data } : offer));
      toast.success('Offer updated successfully');
      return { data, error: null };
    } catch (error: any) {
      toast.error('Error updating offer: ' + error.message);
      return { data: null, error };
    }
  };

  const deleteOffer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('special_offers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setOffers(prev => prev.filter(offer => offer.id !== id));
      toast.success('Offer deleted successfully');
      return { error: null };
    } catch (error: any) {
      toast.error('Error deleting offer: ' + error.message);
      return { error };
    }
  };

  // ===== ORDERS =====
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            menu_items(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data as SimpleOrder[] || []);
    } catch (error: any) {
      toast.error('Error loading orders: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: SimpleOrder['status']) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setOrders(prev => prev.map(order => order.id === id ? { ...order, status } : order));
      toast.success('Order status updated successfully');
      return { data, error: null };
    } catch (error: any) {
      toast.error('Error updating order status: ' + error.message);
      return { data: null, error };
    }
  };

  // ===== INITIALIZATION =====
  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
    fetchOffers();
    fetchOrders();
  }, []);

  return {
    // Data
    categories,
    menuItems,
    offers,
    orders,
    loading,

    // Category methods
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,

    // Menu item methods
    fetchMenuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,

    // Offer methods
    fetchOffers,
    addOffer,
    updateOffer,
    deleteOffer,

    // Order methods
    fetchOrders,
    updateOrderStatus,
  };
};