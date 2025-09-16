-- Fix security issues from the previous migration

-- Drop the problematic view and recreate it properly
DROP VIEW IF EXISTS public.simple_menu_view;

-- Create a simple view without security definer issues
CREATE VIEW public.simple_menu_view AS
SELECT 
  mi.id,
  mi.name_ar,
  mi.name_en,
  mi.description_ar,
  mi.description_en,
  mi.price,
  mi.discount_price,
  mi.image_url,
  mi.rating,
  mi.prep_time,
  mi.is_spicy,
  mi.is_offer,
  mi.is_available,
  mi.is_featured,
  mi.sort_order,
  mi.customization_options,
  mi.category_info,
  mi.created_at,
  mi.updated_at,
  c.name_ar as category_name_ar,
  c.name_en as category_name_en,
  c.id as category_id
FROM public.menu_items mi
LEFT JOIN public.categories c ON mi.category_id = c.id
ORDER BY c.sort_order, mi.sort_order;

-- Update the function to fix search path security warning
CREATE OR REPLACE FUNCTION public.update_menu_item_simple(
  item_id UUID,
  item_data JSONB,
  customization_data JSONB DEFAULT '[]'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.menu_items 
  SET 
    name_ar = COALESCE(item_data->>'name_ar', name_ar),
    name_en = COALESCE(item_data->>'name_en', name_en),
    description_ar = item_data->>'description_ar',
    description_en = item_data->>'description_en',
    price = COALESCE((item_data->>'price')::numeric, price),
    discount_price = (item_data->>'discount_price')::numeric,
    image_url = item_data->>'image_url',
    prep_time = COALESCE(item_data->>'prep_time', prep_time),
    is_spicy = COALESCE((item_data->>'is_spicy')::boolean, is_spicy),
    is_offer = COALESCE((item_data->>'is_offer')::boolean, is_offer),
    is_available = COALESCE((item_data->>'is_available')::boolean, is_available),
    is_featured = COALESCE((item_data->>'is_featured')::boolean, is_featured),
    customization_options = customization_data,
    updated_at = now()
  WHERE id = item_id;
END;
$$;