-- Simplify the menu system by consolidating customization options into menu items
-- Add customization_options JSON field to menu_items
ALTER TABLE public.menu_items 
ADD COLUMN customization_options JSONB DEFAULT '[]'::jsonb;

-- Add category_info JSON field to store category data directly with items (for simpler queries)
ALTER TABLE public.menu_items 
ADD COLUMN category_info JSONB DEFAULT '{}'::jsonb;

-- Update menu_items to include category info for existing items
UPDATE public.menu_items 
SET category_info = jsonb_build_object(
  'name_ar', c.name_ar,
  'name_en', c.name_en,
  'description_ar', c.description_ar,
  'description_en', c.description_en
)
FROM public.categories c 
WHERE menu_items.category_id = c.id;

-- Create a simplified view for menu management
CREATE OR REPLACE VIEW public.simple_menu_view AS
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
WHERE mi.is_available = true
ORDER BY c.sort_order, mi.sort_order;

-- Create a simple function to update menu item with customization
CREATE OR REPLACE FUNCTION public.update_menu_item_simple(
  item_id UUID,
  item_data JSONB,
  customization_data JSONB DEFAULT '[]'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Grant permissions on the view and function
GRANT SELECT ON public.simple_menu_view TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.update_menu_item_simple TO authenticated;