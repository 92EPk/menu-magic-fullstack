-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create menu_items table
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  price DECIMAL(10,2) NOT NULL,
  discount_price DECIMAL(10,2),
  image_url TEXT,
  rating DECIMAL(3,2) DEFAULT 4.5,
  prep_time TEXT DEFAULT '15-20',
  is_spicy BOOLEAN DEFAULT false,
  is_offer BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  selected_options JSONB DEFAULT '{}',
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policies (public read access for menu data, restricted write)
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT 
USING (true);

CREATE POLICY "Menu items are viewable by everyone" 
ON public.menu_items FOR SELECT 
USING (true);

CREATE POLICY "Orders are insertable by everyone" 
ON public.orders FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Order items are insertable by everyone" 
ON public.order_items FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample categories
INSERT INTO public.categories (name_ar, name_en, description_ar, description_en, sort_order) VALUES
('الأطباق الرئيسية', 'Main Dishes', 'أطباق رئيسية شهية ومميزة', 'Delicious and special main dishes', 1),
('المقبلات', 'Appetizers', 'مأكولات خفيفة لبداية الوجبة', 'Light foods to start your meal', 2),
('المشروبات', 'Beverages', 'مشروبات منعشة ومتنوعة', 'Refreshing and varied drinks', 3),
('الحلويات', 'Desserts', 'حلويات لذيذة لإنهاء الوجبة', 'Delicious desserts to finish your meal', 4),
('العروض الخاصة', 'Special Offers', 'عروض محدودة المدة', 'Limited time offers', 5);

-- Insert sample menu items
INSERT INTO public.menu_items (category_id, name_ar, name_en, description_ar, description_en, price, discount_price, image_url, rating, prep_time, is_spicy, is_offer, sort_order) 
VALUES
-- Main Dishes
((SELECT id FROM public.categories WHERE name_en = 'Main Dishes'), 'برجر مخصوص', 'Special Burger', 'برجر لحم طازج مع الخضروات والصوص الخاص', 'Fresh beef burger with vegetables and special sauce', 85.00, NULL, '/src/assets/burger-special.jpg', 4.8, '15-20', false, false, 1),
((SELECT id FROM public.categories WHERE name_en = 'Main Dishes'), 'بيتزا مارجريتا', 'Pizza Margherita', 'بيتزا كلاسيكية بالطماطم والجبن والريحان', 'Classic pizza with tomato, cheese and basil', 120.00, 90.00, '/src/assets/pizza-margherita.jpg', 4.7, '20-25', false, true, 2),
((SELECT id FROM public.categories WHERE name_en = 'Main Dishes'), 'دجاج حار مقلي', 'Spicy Fried Chicken', 'قطع دجاج مقلية بالتوابل الحارة', 'Fried chicken pieces with spicy seasoning', 95.00, NULL, '/src/assets/spicy-chicken.jpg', 4.6, '18-22', true, false, 3),

-- Appetizers
((SELECT id FROM public.categories WHERE name_en = 'Appetizers'), 'سلطة قيصر', 'Caesar Salad', 'سلطة خضراء مع صوص القيصر والجبن', 'Green salad with Caesar dressing and cheese', 65.00, NULL, '/src/assets/caesar-salad.jpg', 4.5, '10-15', false, false, 1),

-- Beverages
((SELECT id FROM public.categories WHERE name_en = 'Beverages'), 'عصير برتقال طازج', 'Fresh Orange Juice', 'عصير برتقال طبيعي 100%', '100% natural orange juice', 25.00, NULL, '/src/assets/orange-juice.jpg', 4.4, '5-8', false, false, 1),

-- Desserts
((SELECT id FROM public.categories WHERE name_en = 'Desserts'), 'كيك الشوكولاتة', 'Chocolate Cake', 'كيك شوكولاتة غني ولذيذ', 'Rich and delicious chocolate cake', 45.00, NULL, '/src/assets/chocolate-cake.jpg', 4.9, '10-12', false, false, 1),

-- Special Offers
((SELECT id FROM public.categories WHERE name_en = 'Special Offers'), 'وجبة عائلية مميزة', 'Special Family Meal', '4 برجر + بطاطس كبيرة + 4 مشروبات', '4 Burgers + Large Fries + 4 Drinks', 340.00, 280.00, '/src/assets/offer-family-meal.jpg', 4.8, '20-25', false, true, 1),
((SELECT id FROM public.categories WHERE name_en = 'Special Offers'), 'وجبة الطالب', 'Student Meal', 'برجر + بطاطس + مشروب', 'Burger + Fries + Drink', 85.00, 65.00, '/src/assets/offer-student-meal.jpg', 4.5, '10-15', false, true, 2);